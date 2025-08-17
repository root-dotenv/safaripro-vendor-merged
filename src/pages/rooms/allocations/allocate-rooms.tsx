"use client";
import { useState, useEffect, useId } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { format } from "date-fns";
import { toast } from "sonner";
import localHotelClient from "@/api/local-hotel-client";

// --- UI Components ---
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

// --- Icons ---
import {
  Bed,
  BedDouble,
  Calendar,
  Hotel,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  Wrench,
} from "lucide-react";

// --- Constants ---
const HOTEL_ID = import.meta.env.VITE_HOTEL_ID;

// --- Type Definitions ---
interface RoomStats {
  available: number;
  booked: number;
  maintenance: number;
}

interface RoomType {
  id: string;
  name: string;
  room_availability: number;
}

interface Allocation {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  status: "Pending" | "Confirmed" | "Cancelled" | "Expired";
  total_rooms: number;
  notes: string;
  room_type: {
    id: string;
    name: string;
    image: string;
    base_price: string;
  };
}

interface PaginatedResponse<T> {
  count: number;
  results: T[];
}

type AllocationFormData = {
  name: string;
  start_date: string;
  end_date: string;
  status: "Pending" | "Confirmed" | "Cancelled" | "Expired";
  total_rooms: number;
  notes: string;
  room_type: string;
};

// --- Validation Schema ---
const allocationSchema = yup.object({
  name: yup.string().required("Allocation name is required."),
  room_type: yup.string().required("You must select a room type."),
  total_rooms: yup
    .number()
    .typeError("Total rooms must be a number.")
    .required("Number of rooms is required.")
    .min(1, "You must allocate at least one room."),
  start_date: yup.date().required("Start date is required."),
  end_date: yup
    .date()
    .required("End date is required.")
    .min(yup.ref("start_date"), "End date cannot be before the start date."),
  status: yup
    .string()
    .oneOf(["Pending", "Confirmed", "Cancelled", "Expired"])
    .required("Status is required."),
  notes: yup.string().optional(),
});

// --- API Functions ---

/**
 * Fetches live statistics for room statuses (Available, Booked, Maintenance).
 * It makes parallel API calls to efficiently get the count for each status.
 */
const fetchRoomStats = async (): Promise<RoomStats> => {
  // Helper function to fetch count for a specific status
  const fetchCountForStatus = async (status: string) => {
    try {
      const response = await localHotelClient.get<PaginatedResponse<any>>(
        `/rooms/`,
        {
          params: {
            hotel_id: HOTEL_ID,
            availability_status: status,
            page_size: 1,
          },
        }
      );
      return response.data.count || 0;
    } catch (error) {
      console.error(`Failed to fetch count for ${status} rooms:`, error);
      return 0; // Return 0 if there's an error
    }
  };

  // Run all fetch requests in parallel for better performance
  const [available, booked, maintenance] = await Promise.all([
    fetchCountForStatus("Available"),
    fetchCountForStatus("Booked"),
    fetchCountForStatus("Maintenance"),
  ]);

  return { available, booked, maintenance };
};

const fetchRoomTypes = async (): Promise<RoomType[]> => {
  const { data } = await localHotelClient.get<PaginatedResponse<RoomType>>(
    `/room-types/?hotel_id=${HOTEL_ID}`
  );
  return data.results;
};

const fetchAllocations = async (
  statusFilter: string
): Promise<Allocation[]> => {
  let url = `/allocations/?hotel=${HOTEL_ID}`;
  if (statusFilter) {
    url += `&status=${statusFilter}`;
  }
  const { data } = await localHotelClient.get<PaginatedResponse<Allocation>>(
    url
  );
  return data.results;
};

const createAllocation = (data: AllocationFormData & { hotel: string }) => {
  return localHotelClient.post("/allocations/", data);
};

const updateAllocation = ({
  id,
  payload,
}: {
  id: string;
  payload: Partial<AllocationFormData>;
}) => {
  return localHotelClient.patch(`/allocations/${id}/`, payload);
};

const deleteAllocation = (id: string) => {
  return localHotelClient.delete(`/allocations/${id}/`);
};

// --- Reusable Components ---
const StatCard = ({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}) => (
  <Card className="shadow-sm">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className={color}>{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

const AllocationCard = ({
  allocation,
  onEdit,
  onDelete,
}: {
  allocation: Allocation;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800 border-green-300";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      case "Expired":
        return "bg-gray-100 text-gray-800 border-gray-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="overflow-hidden bg-[#FFF] border-[#DADCE0] hover:shadow-sm transition-shadow duration-300 flex flex-col pt-6">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{allocation.name}</CardTitle>
            <CardDescription>{allocation.room_type.name}</CardDescription>
          </div>
          <Badge className={getStatusBadgeColor(allocation.status)}>
            {allocation.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 flex-grow">
        <div className="flex items-center text-sm text-gray-600">
          <BedDouble className="h-4 w-4 mr-2 text-blue-500" />
          <span>{allocation.total_rooms} Rooms Allocated</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2 text-blue-500" />
          <span>
            {format(new Date(allocation.start_date), "MMM dd, yyyy")} -{" "}
            {format(new Date(allocation.end_date), "MMM dd, yyyy")}
          </span>
        </div>
        <p className="text-sm text-gray-500 pt-2 border-t mt-2">
          {allocation.notes || "No additional notes."}
        </p>
      </CardContent>
      <CardFooter className="bg-none p-3 flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Pencil className="h-4 w-4 mr-2" /> Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={onDelete}>
          <Trash2 className="h-4 w-4 mr-2" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

// --- Main Page Component ---
export default function AllocateRooms() {
  const queryClient = useQueryClient();
  const [isCreateFormOpen, setCreateFormOpen] = useState(false);
  const [editingAllocation, setEditingAllocation] = useState<Allocation | null>(
    null
  );
  const [deletingAllocationId, setDeletingAllocationId] = useState<
    string | null
  >(null);
  const [statusFilter, setStatusFilter] = useState("");

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["roomStats"],
    queryFn: fetchRoomStats,
  });

  const { data: roomTypes, isLoading: isLoadingRoomTypes } = useQuery({
    queryKey: ["roomTypesForAllocation"],
    queryFn: fetchRoomTypes,
  });

  const {
    data: allocations,
    isLoading: isLoadingAllocations,
    refetch,
  } = useQuery({
    queryKey: ["allocations", statusFilter],
    queryFn: () => fetchAllocations(statusFilter),
  });

  const createMutation = useMutation({
    mutationFn: createAllocation,
    onSuccess: () => {
      toast.success("Allocation created successfully!");
      queryClient.invalidateQueries({ queryKey: ["allocations"] });
      setCreateFormOpen(false);
    },
    onError: (error: any) => {
      toast.error("Failed to create allocation", {
        description: error.response?.data?.detail || error.message,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateAllocation,
    onSuccess: () => {
      toast.success("Allocation updated successfully!");
      queryClient.invalidateQueries({
        queryKey: ["allocations", statusFilter],
      });
      setEditingAllocation(null);
    },
    onError: (error: any) => {
      toast.error("Failed to update allocation", {
        description: error.response?.data?.detail || error.message,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAllocation,
    onSuccess: () => {
      toast.success("Allocation deleted successfully!");
      queryClient.invalidateQueries({
        queryKey: ["allocations", statusFilter],
      });
      setDeletingAllocationId(null);
    },
    onError: (error: any) => {
      toast.error("Failed to delete allocation", {
        description: error.response?.data?.detail || error.message,
      });
    },
  });

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Room Allocations
          </h1>
          <p className="text-muted-foreground">
            Allocate rooms for third-party partners like SafariPro.
          </p>
        </div>
        <Button
          size="lg"
          className="rounded-md bg-blue-600 hover:bg-blue-700 cursor-pointer"
          onClick={() => setCreateFormOpen(true)}
        >
          <Plus className="mr-1 h-5 w-5" />
          New Allocation
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Allocations"
          value={
            isLoadingAllocations ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              allocations?.length ?? 0
            )
          }
          icon={<Hotel />}
          color="text-blue-500"
        />
        <StatCard
          title="Available Rooms"
          value={
            isLoadingStats ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              stats?.available ?? 0
            )
          }
          icon={<BedDouble />}
          color="text-green-500"
        />
        <StatCard
          title="Booked Rooms"
          value={
            isLoadingStats ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              stats?.booked ?? 0
            )
          }
          icon={<Bed />}
          color="text-yellow-500"
        />
        <StatCard
          title="Maintenance"
          value={
            isLoadingStats ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              stats?.maintenance ?? 0
            )
          }
          icon={<Wrench />}
          color="text-gray-500"
        />
      </div>

      {/* Filters and Allocations Grid */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Current Allocations</CardTitle>
              <CardDescription>
                View and manage all room allocations.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter(value === "all" ? "" : value)
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Confirmed">Confirmed</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={() => refetch()}
                disabled={isLoadingAllocations}
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    isLoadingAllocations ? "animate-spin" : ""
                  }`}
                />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingAllocations ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : allocations && allocations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allocations.map((alloc) => (
                <AllocationCard
                  key={alloc.id}
                  allocation={alloc}
                  onEdit={() => setEditingAllocation(alloc)}
                  onDelete={() => setDeletingAllocationId(alloc.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">
                No allocations found for the selected filter.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Allocation Dialog */}
      <AllocationForm
        isOpen={isCreateFormOpen}
        onOpenChange={setCreateFormOpen}
        roomTypes={roomTypes}
        isLoadingRoomTypes={isLoadingRoomTypes}
        mutation={createMutation}
        formTitle="Create New Allocation"
        formDescription="Set aside a number of rooms of a specific type for a partner."
        submitButtonText="Create Allocation"
      />

      {/* Edit Allocation Dialog */}
      {editingAllocation && (
        <AllocationForm
          isOpen={!!editingAllocation}
          onOpenChange={(isOpen) => !isOpen && setEditingAllocation(null)}
          roomTypes={roomTypes}
          isLoadingRoomTypes={isLoadingRoomTypes}
          mutation={updateMutation}
          formTitle={`Edit Allocation: ${editingAllocation?.name}`}
          formDescription="Update the details for this allocation."
          submitButtonText="Save Changes"
          existingAllocation={editingAllocation}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingAllocationId}
        onOpenChange={() => setDeletingAllocationId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              allocation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate(deletingAllocationId!)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// --- Reusable Allocation Form Component ---
interface AllocationFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  roomTypes: RoomType[] | undefined;
  isLoadingRoomTypes?: boolean;
  mutation: any;
  formTitle: string;
  formDescription: string;
  submitButtonText: string;
  existingAllocation?: Allocation | null;
}

function AllocationForm({
  isOpen,
  onOpenChange,
  roomTypes,
  isLoadingRoomTypes,
  mutation,
  formTitle,
  formDescription,
  submitButtonText,
  existingAllocation,
}: AllocationFormProps) {
  const formId = useId();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields, isDirty },
  } = useForm<AllocationFormData>({
    resolver: yupResolver(allocationSchema),
  });

  useEffect(() => {
    if (isOpen && existingAllocation) {
      reset({
        name: existingAllocation.name,
        room_type: existingAllocation.room_type.id,
        total_rooms: existingAllocation.total_rooms,
        start_date: format(
          new Date(existingAllocation.start_date),
          "yyyy-MM-dd"
        ),
        end_date: format(new Date(existingAllocation.end_date), "yyyy-MM-dd"),
        status: existingAllocation.status,
        notes: existingAllocation.notes,
      });
    } else if (isOpen) {
      reset({
        name: "SafariPro Allocation",
        status: "Confirmed",
        notes: "",
        room_type: "",
        start_date: "",
        end_date: "",
        total_rooms: 1,
      });
    }
  }, [isOpen, existingAllocation, reset]);

  const onSubmit = (data: AllocationFormData) => {
    // Format dates correctly before submitting
    const formattedData = {
      ...data,
      start_date: format(new Date(data.start_date), "yyyy-MM-dd"),
      end_date: format(new Date(data.end_date), "yyyy-MM-dd"),
    };

    if (existingAllocation) {
      const payload: Partial<AllocationFormData> = {};
      (Object.keys(dirtyFields) as Array<keyof AllocationFormData>).forEach(
        (key) => {
          // @ts-ignore
          payload[key] = formattedData[key];
        }
      );

      if (Object.keys(payload).length > 0) {
        mutation.mutate({ id: existingAllocation.id, payload });
      } else {
        toast.info("No changes were made.");
        onOpenChange(false);
      }
    } else {
      const payload = { ...formattedData, hotel: HOTEL_ID };
      mutation.mutate(payload);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{formTitle}</DialogTitle>
          <DialogDescription>{formDescription}</DialogDescription>
        </DialogHeader>

        <form
          id={formId}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 py-4"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Allocation Name</Label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => <Input id="name" {...field} />}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="room_type">Room Type</Label>
            <Controller
              name="room_type"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isLoadingRoomTypes}
                >
                  <SelectTrigger id="room_type">
                    <SelectValue
                      placeholder={
                        isLoadingRoomTypes
                          ? "Loading types..."
                          : "Select a room type"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {roomTypes?.map((rt) => (
                      <SelectItem key={rt.id} value={rt.id}>
                        {rt.name} ({rt.room_availability} available)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.room_type && (
              <p className="text-sm text-red-500">{errors.room_type.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="total_rooms">Number of Rooms to Allocate</Label>
            <Controller
              name="total_rooms"
              control={control}
              render={({ field }) => (
                <Input id="total_rooms" type="number" {...field} />
              )}
            />
            {errors.total_rooms && (
              <p className="text-sm text-red-500">
                {errors.total_rooms.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Controller
                name="start_date"
                control={control}
                render={({ field }) => (
                  <Input id="start_date" type="date" {...field} />
                )}
              />
              {errors.start_date && (
                <p className="text-sm text-red-500">
                  {errors.start_date.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">End Date</Label>
              <Controller
                name="end_date"
                control={control}
                render={({ field }) => (
                  <Input id="end_date" type="date" {...field} />
                )}
              />
              {errors.end_date && (
                <p className="text-sm text-red-500">
                  {errors.end_date.message}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                    <SelectItem value="Expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => <Textarea id="notes" {...field} />}
            />
          </div>
        </form>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 transition-all"
            type="submit"
            form={formId}
            disabled={mutation.isPending || (existingAllocation && !isDirty)}
          >
            {mutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {submitButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
