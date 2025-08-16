"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getFacetedUniqueValues,
  getPaginationRowModel,
  useReactTable,
  type SortingState,
  type Row,
  type PaginationState,
} from "@tanstack/react-table";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CircleXIcon,
  Columns3Icon,
  EllipsisIcon,
  Eye,
  Trash2,
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Search,
  Loader2,
  Loader,
  Plus,
  Edit,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { IoRefreshOutline } from "react-icons/io5";
import axios from "axios";
import ErrorPage from "@/components/custom/error-page";

// --- API Client ---
const hotelClient = axios.create({
  baseURL: "https://hotel.safaripro.net/api/v1",
});

// --- Type Definitions ---
interface AllocationDetail {
  id: string;
  created_by: string | null;
  updated_by: string | null;
  deleted_by: string | null;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  date: string;
  status: "Draft" | "Pending" | "Confirmed" | "Cancelled" | "Expired";
  is_price_per_night: boolean;
  special_conditions: string;
  allocation: string;
  hotel: string;
  room: string;
  room_type: string;
}

interface Allocation {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  status: string;
  total_rooms: number;
  notes: string;
  approval_date: string | null;
  hotel: string;
  room_type: string;
}

interface Room {
  id: string;
  code: string;
  description: string;
  price_per_night: number;
  availability_status: string;
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// --- Debounce Hook ---
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

// --- Status Color Helper ---
const getStatusColor = (status: string) => {
  switch (status) {
    case "Draft":
      return "bg-gray-100 text-gray-800 border-gray-200";
    case "Pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Confirmed":
      return "bg-green-100 text-green-800 border-green-200";
    case "Cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    case "Expired":
      return "bg-orange-100 text-orange-800 border-orange-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

// --- Form Component ---
const AllocationDetailForm = ({
  isOpen,
  onClose,
  editingDetail,
  onSubmit,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  editingDetail?: AllocationDetail | null;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}) => {
  const hotel_id = import.meta.env.VITE_HOTEL_ID;

  const [formData, setFormData] = useState({
    date: "",
    allocation: "",
    room: "",
    room_type: "",
    is_price_per_night: true,
    status: "Pending" as AllocationDetail["status"],
    special_conditions: "",
  });

  // Fetch allocations
  const { data: allocationsResponse } = useQuery<PaginatedResponse<Allocation>>(
    {
      queryKey: ["allocations", hotel_id],
      queryFn: async () => {
        const response = await hotelClient.get(
          `/allocations/?hotel=${hotel_id}`
        );
        return response.data;
      },
      enabled: isOpen,
    }
  );

  // Fetch available rooms
  const { data: roomsResponse } = useQuery<PaginatedResponse<Room>>({
    queryKey: ["available-rooms", hotel_id],
    queryFn: async () => {
      const response = await hotelClient.get(
        `/rooms/?hotel_id=${hotel_id}&availability_status=Available`
      );
      return response.data;
    },
    enabled: isOpen,
  });

  // Fetch room types (assuming similar structure to HotelRoomTypes.tsx)
  const { data: hotelData } = useQuery({
    queryKey: ["hotel", hotel_id],
    queryFn: async () => {
      const response = await hotelClient.get(`/hotels/${hotel_id}`);
      return response.data;
    },
    enabled: isOpen,
  });

  useEffect(() => {
    if (editingDetail) {
      setFormData({
        date: editingDetail.date,
        allocation: editingDetail.allocation,
        room: editingDetail.room,
        room_type: editingDetail.room_type,
        is_price_per_night: editingDetail.is_price_per_night,
        status: editingDetail.status,
        special_conditions: editingDetail.special_conditions,
      });
    } else {
      setFormData({
        date: "",
        allocation: "",
        room: "",
        room_type: "",
        is_price_per_night: true,
        status: "Pending",
        special_conditions: "",
      });
    }
  }, [editingDetail, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      hotel: hotel_id,
    };
    onSubmit(submitData);
  };

  const allocations = allocationsResponse?.results || [];
  const rooms = roomsResponse?.results || [];
  const roomTypes = hotelData?.room_type || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingDetail
              ? "Edit Allocation Detail"
              : "Create Allocation Detail"}
          </DialogTitle>
          <DialogDescription>
            {editingDetail
              ? "Update the allocation detail information."
              : "Create a new allocation detail."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, date: e.target.value }))
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="allocation">Allocation</Label>
            <Select
              value={formData.allocation}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, allocation: value }))
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select allocation" />
              </SelectTrigger>
              <SelectContent>
                {allocations.map((allocation) => (
                  <SelectItem key={allocation.id} value={allocation.id}>
                    {allocation.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="room_type">Room Type</Label>
            <Select
              value={formData.room_type}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, room_type: value }))
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select room type" />
              </SelectTrigger>
              <SelectContent>
                {roomTypes.map((roomType: any) => (
                  <SelectItem key={roomType.id} value={roomType.id}>
                    {roomType.name} ({roomType.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="room">Room</Label>
            <Select
              value={formData.room}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, room: value }))
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select room" />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.code} - {room.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  status: value as AllocationDetail["status"],
                }))
              }
              required
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Confirmed">Confirmed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
                <SelectItem value="Expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              className="border-[#DADCE0] border-[1.5px] data-[state=checked]:bg-[#DADCE0] data-[state=checked]:text-[#9a9a9a]"
              id="is_price_per_night"
              checked={formData.is_price_per_night}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  is_price_per_night: !!checked,
                }))
              }
            />
            <Label htmlFor="is_price_per_night">Price per night</Label>
          </div>

          <div>
            <Label htmlFor="special_conditions">Special Conditions</Label>
            <Textarea
              id="special_conditions"
              value={formData.special_conditions}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  special_conditions: e.target.value,
                }))
              }
              placeholder="Enter any special conditions..."
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
              type="submit"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingDetail ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// --- Main Component ---
export default function Allocations() {
  const queryClient = useQueryClient();
  const hotel_id = import.meta.env.VITE_HOTEL_ID;

  // --- State ---
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 15,
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDetail, setEditingDetail] = useState<AllocationDetail | null>(
    null
  );

  const debouncedGlobalFilter = useDebounce(globalFilter, 500);
  const inputRef = useRef<HTMLInputElement>(null);

  // --- Data Queries ---
  const {
    data: paginatedResponse,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery<PaginatedResponse<AllocationDetail>>({
    queryKey: [
      "allocation-details",
      hotel_id,
      pagination.pageIndex,
      debouncedGlobalFilter,
      sorting,
      columnFilters,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        hotel: hotel_id,
        page: String(pagination.pageIndex + 1),
        page_size: String(pagination.pageSize),
      });

      if (debouncedGlobalFilter) params.append("search", debouncedGlobalFilter);
      if (sorting.length > 0) {
        const sortKey = sorting[0].id;
        const sortDir = sorting[0].desc ? "-" : "";
        params.append("ordering", `${sortDir}${sortKey}`);
      }

      const response = await hotelClient.get(`/allocation-details/`, {
        params,
      });
      return response.data;
    },
    keepPreviousData: true,
    enabled: !!hotel_id,
  });

  // --- Mutations ---
  const createMutation = useMutation({
    mutationFn: (data: any) =>
      hotelClient.post(`/allocation-details/?hotel=${hotel_id}`, data),
    onSuccess: () => {
      toast.success("Allocation detail created successfully!");
      queryClient.invalidateQueries({ queryKey: ["allocation-details"] });
      setIsFormOpen(false);
    },
    onError: (error: any) => {
      toast.error(
        `Failed to create allocation detail: ${
          error.response?.data?.detail || error.message
        }`
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      hotelClient.patch(`/allocation-details/${id}/`, data),
    onSuccess: () => {
      toast.success("Allocation detail updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["allocation-details"] });
      setIsFormOpen(false);
      setEditingDetail(null);
    },
    onError: (error: any) => {
      toast.error(
        `Failed to update allocation detail: ${
          error.response?.data?.detail || error.message
        }`
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      hotelClient.delete(`/allocation-details/${id}/`),
    onSuccess: () => {
      toast.success("Allocation detail deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["allocation-details"] });
    },
    onError: (error: any) => {
      toast.error(
        `Failed to delete allocation detail: ${
          error.response?.data?.detail || error.message
        }`
      );
    },
  });

  // --- Handlers ---
  const handleCreate = () => {
    setEditingDetail(null);
    setIsFormOpen(true);
  };

  const handleEdit = (detail: AllocationDetail) => {
    setEditingDetail(detail);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (data: any) => {
    if (editingDetail) {
      updateMutation.mutate({ id: editingDetail.id, data });
    } else {
      console.log(`New Allocation Details Data`);
      console.log(data);
      createMutation.mutate(data);
    }
  };

  const allocationDetails = paginatedResponse?.results ?? [];
  const totalCount = paginatedResponse?.count ?? 0;
  const totalPages = Math.ceil(totalCount / pagination.pageSize);
  const hasNextPage = paginatedResponse?.next !== null;
  const hasPreviousPage = paginatedResponse?.previous !== null;

  // --- Table Column Definitions ---
  const columns = useMemo<ColumnDef<AllocationDetail>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
            className="border-[#DADCE0] border-[1.5px] data-[state=checked]:bg-[#DADCE0] data-[state=checked]:text-[#9a9a9a]"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="border-[#DADCE0] border-[1.5px] data-[state=checked]:bg-[#DADCE0] data-[state=checked]:text-[#9a9a9a]"
          />
        ),
        size: 40,
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "date",
        header: ({ column }) => (
          <SortableHeader column={column}>
            <Calendar className="mr-2 h-4 w-4" />
            Date
          </SortableHeader>
        ),
        cell: ({ row }) => (
          <div className="font-medium">
            {new Date(row.original.date).toLocaleDateString()}
          </div>
        ),
        size: 120,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge className={cn(getStatusColor(row.getValue("status")))}>
            {row.getValue("status")}
          </Badge>
        ),
        size: 120,
      },
      {
        accessorKey: "is_price_per_night",
        header: "Price Type",
        cell: ({ row }) => (
          <span className="text-sm">
            {row.getValue("is_price_per_night") ? "Per Night" : "Fixed"}
          </span>
        ),
        size: 100,
      },
      {
        accessorKey: "is_active",
        header: "Active",
        cell: ({ row }) => (
          <Badge
            className="bg-green-600"
            variant={row.getValue("is_active") ? "default" : "secondary"}
          >
            {row.getValue("is_active") ? "Yes" : "No"}
          </Badge>
        ),
        size: 80,
      },
      {
        accessorKey: "special_conditions",
        header: "Special Conditions",
        cell: ({ row }) => {
          const conditions = row.getValue("special_conditions") as string;
          return (
            <div className="max-w-xs truncate" title={conditions}>
              {conditions || "None"}
            </div>
          );
        },
        size: 200,
      },
      {
        accessorKey: "created_at",
        header: ({ column }) => (
          <SortableHeader column={column}>Created</SortableHeader>
        ),
        cell: ({ row }) => (
          <div className="text-sm text-muted-foreground">
            {new Date(row.original.created_at).toLocaleDateString()}
          </div>
        ),
        size: 120,
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <RowActions
            row={row}
            onEdit={handleEdit}
            deleteMutation={deleteMutation}
          />
        ),
        size: 60,
        enableHiding: false,
      },
    ],
    [deleteMutation]
  );

  const table = useReactTable({
    data: allocationDetails,
    columns,
    state: { sorting, columnFilters, pagination },
    pageCount: totalPages,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleDeleteSelected = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    selectedRows.forEach((row) => deleteMutation.mutate(row.original.id));
    table.resetRowSelection();
  };

  if (isError) {
    return <ErrorPage error={error as Error} onRetry={refetch} />;
  }

  return (
    <div className="flex-1 space-y-4 md:p-4 pt-4">
      <div className="flex items-center justify-between px-4">
        <h2 className="text-3xl font-bold tracking-tight">
          Allocation Details
        </h2>
        <Button
          onClick={handleCreate}
          className="gap-2 bg-blue-600 hover:bg-blue-700 cursor-pointer rounded-md"
        >
          <Plus className="h-4 w-4" />
          Create Allocation Detail
        </Button>
      </div>

      <Card className="bg-none p-0 border-none shadow-none">
        <CardHeader>
          <CardDescription>
            <Badge
              className="px-4 py-1 block mb-3 rounded-full bg-[#FFF] border-[#DADCE0] dark:text-[#0A0A0A]"
              variant="outline"
            >
              Total Details:{" "}
              <span className="font-bold text-gray-700 ml-1">{totalCount}</span>
            </Badge>
            Manage allocation details for your hotel rooms.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  ref={inputRef}
                  placeholder="Search allocation details..."
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pl-8 sm:w-[300px]"
                />
                {globalFilter && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setGlobalFilter("")}
                  >
                    <CircleXIcon size={16} />
                  </Button>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {table.getSelectedRowModel().rows.length > 0 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="gap-1">
                      <Trash2 size={14} /> Delete (
                      {table.getSelectedRowModel().rows.length})
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete{" "}
                        {table.getSelectedRowModel().rows.length} selected
                        allocation detail(s). This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteSelected}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-1 cursor-pointer">
                    <Columns3Icon size={14} /> View
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                  {table
                    .getAllColumns()
                    .filter((c) => c.getCanHide())
                    .map((c) => (
                      <DropdownMenuCheckboxItem
                        key={c.id}
                        checked={c.getIsVisible()}
                        onCheckedChange={c.toggleVisibility}
                        className="capitalize"
                      >
                        {c.id.replace(/_/g, " ")}
                      </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="outline"
                onClick={() => refetch()}
                disabled={isRefetching || isLoading}
                className="gap-1 cursor-pointer"
              >
                <IoRefreshOutline
                  className={cn("h-4 w-4", isRefetching && "animate-spin")}
                />
                Refresh
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        style={{
                          width:
                            header.getSize() !== 150
                              ? header.getSize()
                              : undefined,
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      <div className="w-full flex items-center justify-center">
                        <Loader />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No allocation details found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between gap-4 mt-4 w-full">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center justify-center text-sm font-medium">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.firstPage()}
                  disabled={!hasPreviousPage}
                >
                  <ChevronFirstIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.previousPage()}
                  disabled={!hasPreviousPage}
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.nextPage()}
                  disabled={!hasNextPage}
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.lastPage()}
                  disabled={!hasNextPage}
                >
                  <ChevronLastIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AllocationDetailForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingDetail(null);
        }}
        editingDetail={editingDetail}
        onSubmit={handleFormSubmit}
        isLoading={createMutation.isLoading || updateMutation.isLoading}
      />
    </div>
  );
}

// Reusable component for sortable headers
const SortableHeader = ({
  column,
  children,
  className,
}: {
  column: any;
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "flex items-center gap-2 cursor-pointer select-none",
      className
    )}
    onClick={column.getToggleSortingHandler()}
  >
    {children}
    {{
      asc: <ChevronUpIcon size={16} className="text-muted-foreground/70" />,
      desc: <ChevronDownIcon size={16} className="text-muted-foreground/70" />,
    }[column.getIsSorted() as string] ?? null}
  </div>
);

function RowActions({
  row,
  onEdit,
  deleteMutation,
}: {
  row: Row<AllocationDetail>;
  onEdit: (detail: AllocationDetail) => void;
  deleteMutation: any;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex justify-end">
          <Button
            size="icon"
            variant="ghost"
            className="shadow-none"
            aria-label="Allocation detail actions"
          >
            <EllipsisIcon size={16} aria-hidden="true" />
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(row.original)}>
          <Edit className="mr-2 h-4 w-4" /> Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-[#FFF] rounded-md">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete this allocation detail. This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-500 border-none"
                onClick={() => deleteMutation.mutate(row.original.id)}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// - - - - GEMINI Pro 2.5
// "use client";
// import { useState, useMemo, useEffect, useCallback } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { useNavigate } from "react-router-dom";
// import {
//   type ColumnDef,
//   type ColumnFiltersState,
//   flexRender,
//   getCoreRowModel,
//   getSortedRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   useReactTable,
//   type SortingState,
//   type Row,
// } from "@tanstack/react-table";
// import {
//   ChevronDownIcon,
//   ChevronUpIcon,
//   EllipsisIcon,
//   Eye,
//   Trash2,
//   Search,
//   Loader,
//   PlusCircle,
// } from "lucide-react";
// import { toast } from "sonner";
// import hotelClient from "../../api/hotel-client";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardDescription,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import { cn } from "@/lib/utils";
// import ErrorPage from "@/components/custom/error-page";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { useForm, Controller } from "react-hook-form";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Textarea } from "@/components/ui/textarea";

// // --- Type Definitions ---
// interface AllocationDetail {
//   id: string;
//   date: string;
//   status: "Draft" | "Pending" | "Confirmed" | "Cancelled" | "Expired";
//   is_price_per_night: boolean;
//   special_conditions: string;
//   allocation: string;
//   hotel: string;
//   room: string;
//   room_type: string;
// }

// interface Allocation {
//   id: string;
//   name: string;
// }

// interface RoomType {
//   id: string;
//   name: string;
// }

// interface Room {
//   id: string;
//   code: string;
// }

// interface PaginatedResponse<T> {
//   count: number;
//   next: string | null;
//   previous: string | null;
//   results: T[];
// }

// const statusOptions: AllocationDetail["status"][] = [
//   "Draft",
//   "Pending",
//   "Confirmed",
//   "Cancelled",
//   "Expired",
// ];

// // --- Main Component ---
// export default function Allocations() {
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();
//   const hotel_id = import.meta.env.VITE_HOTEL_ID;

//   // --- State ---
//   const [sorting, setSorting] = useState<SortingState>([]);
//   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
//   const [globalFilter, setGlobalFilter] = useState("");
//   const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [editingAllocation, setEditingAllocation] =
//     useState<AllocationDetail | null>(null);

//   // --- Data Queries ---
//   const {
//     data,
//     isLoading,
//     isError,
//     error,
//     refetch,
//   } = useQuery<PaginatedResponse<AllocationDetail>>({
//     queryKey: [
//       "allocation-details",
//       hotel_id,
//       pagination.pageIndex,
//       globalFilter,
//       sorting,
//     ],
//     queryFn: async () => {
//       const params = new URLSearchParams({
//         hotel: hotel_id!,
//         page: String(pagination.pageIndex + 1),
//         page_size: String(pagination.pageSize),
//       });
//       if (globalFilter) params.append("search", globalFilter);
//       if (sorting.length > 0) {
//         params.append("ordering", `${sorting[0].desc ? "-" : ""}${sorting[0].id}`);
//       }
//       const response = await hotelClient.get(`/allocation-details/`, { params });
//       return response.data;
//     },
//     enabled: !!hotel_id,
//   });

//   const deleteMutation = useMutation({
//     mutationFn: (id: string) => hotelClient.delete(`/allocation-details/${id}/`),
//     onSuccess: () => {
//       toast.success("Allocation detail deleted successfully!");
//       queryClient.invalidateQueries({ queryKey: ["allocation-details"] });
//     },
//     onError: (error: any) => {
//       toast.error(
//         `Failed to delete allocation detail: ${
//           error.response?.data?.detail || error.message
//         }`
//       );
//     },
//   });

//   const handleEdit = (allocation: AllocationDetail) => {
//     setEditingAllocation(allocation);
//     setIsFormOpen(true);
//   };

//   const handleAddNew = () => {
//     setEditingAllocation(null);
//     setIsFormOpen(true);
//   };

//   // --- Table Column Definitions ---
//   const columns = useMemo<ColumnDef<AllocationDetail>[]>(
//     () => [
//       {
//         accessorKey: "date",
//         header: ({ column }) => <SortableHeader column={column}>Date</SortableHeader>,
//       },
//       {
//         accessorKey: "status",
//         header: "Status",
//       },
//       {
//         accessorKey: "is_price_per_night",
//         header: "Price Per Night",
//         cell: ({ row }) => (row.original.is_price_per_night ? "Yes" : "No"),
//       },
//       {
//         id: "actions",
//         cell: ({ row }) => (
//           <RowActions
//             row={row}
//             onEdit={handleEdit}
//             deleteMutation={deleteMutation}
//           />
//         ),
//         size: 60,
//       },
//     ],
//     [deleteMutation]
//   );

//   const table = useReactTable({
//     data: data?.results ?? [],
//     columns,
//     state: { sorting, columnFilters, pagination },
//     pageCount: data?.count ? Math.ceil(data.count / pagination.pageSize) : 0,
//     manualPagination: true,
//     manualSorting: true,
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     onPaginationChange: setPagination,
//     getCoreRowModel: getCoreRowModel(),
//   });

//   if (isLoading) return <Loader className="animate-spin" />;
//   if (isError) return <ErrorPage error={error as Error} onRetry={refetch} />;

//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex justify-between items-center">
//         <h1 className="text-3xl font-bold">Allocation Details</h1>
//         <Button onClick={handleAddNew}>
//           <PlusCircle className="mr-2 h-4 w-4" /> Add New
//         </Button>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Manage Allocations</CardTitle>
//           <CardDescription>
//             A list of all allocation details in your hotel.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="mb-4">
//             <Input
//               placeholder="Search allocations..."
//               value={globalFilter}
//               onChange={(e) => setGlobalFilter(e.target.value)}
//               className="max-w-sm"
//             />
//           </div>
//           <div className="rounded-md border">
//             <Table>
//               <TableHeader>
//                 {table.getHeaderGroups().map((headerGroup) => (
//                   <TableRow key={headerGroup.id}>
//                     {headerGroup.headers.map((header) => (
//                       <TableHead key={header.id}>
//                         {flexRender(
//                           header.column.columnDef.header,
//                           header.getContext()
//                         )}
//                       </TableHead>
//                     ))}
//                   </TableRow>
//                 ))}
//               </TableHeader>
//               <TableBody>
//                 {table.getRowModel().rows?.length ? (
//                   table.getRowModel().rows.map((row) => (
//                     <TableRow key={row.id}>
//                       {row.getVisibleCells().map((cell) => (
//                         <TableCell key={cell.id}>
//                           {flexRender(
//                             cell.column.columnDef.cell,
//                             cell.getContext()
//                           )}
//                         </TableCell>
//                       ))}
//                     </TableRow>
//                   ))
//                 ) : (
//                   <TableRow>
//                     <TableCell colSpan={columns.length} className="h-24 text-center">
//                       No results.
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </div>
//           <div className="flex items-center justify-end space-x-2 py-4">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => table.previousPage()}
//               disabled={!table.getCanPreviousPage()}
//             >
//               Previous
//             </Button>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => table.nextPage()}
//               disabled={!table.getCanNextPage()}
//             >
//               Next
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//       <AllocationForm
//         isOpen={isFormOpen}
//         setIsOpen={setIsFormOpen}
//         hotel_id={hotel_id}
//         initialData={editingAllocation}
//       />
//     </div>
//   );
// }

// // --- Reusable Components ---
// const SortableHeader = ({ column, children }: { column: any; children: React.ReactNode; }) => (
//   <div className="flex items-center gap-2 cursor-pointer" onClick={column.getToggleSortingHandler()}>
//     {children}
//     {column.getIsSorted() === "asc" && <ChevronUpIcon size={16} />}
//     {column.getIsSorted() === "desc" && <ChevronDownIcon size={16} />}
//   </div>
// );

// function RowActions({ row, onEdit, deleteMutation }: { row: Row<AllocationDetail>; onEdit: (data: AllocationDetail) => void; deleteMutation: any; }) {
//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="ghost" className="h-8 w-8 p-0">
//           <EllipsisIcon className="h-4 w-4" />
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end">
//         <DropdownMenuItem onClick={() => onEdit(row.original)}>
//           <Eye className="mr-2 h-4 w-4" /> Edit
//         </DropdownMenuItem>
//         <DropdownMenuSeparator />
//         <AlertDialog>
//           <AlertDialogTrigger asChild>
//             <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
//               <Trash2 className="mr-2 h-4 w-4" /> Delete
//             </DropdownMenuItem>
//           </AlertDialogTrigger>
//           <AlertDialogContent>
//             <AlertDialogHeader>
//               <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//               <AlertDialogDescription>
//                 This action cannot be undone. This will permanently delete the allocation detail.
//               </AlertDialogDescription>
//             </AlertDialogHeader>
//             <AlertDialogFooter>
//               <AlertDialogCancel>Cancel</AlertDialogCancel>
//               <AlertDialogAction onClick={() => deleteMutation.mutate(row.original.id)}>
//                 Delete
//               </AlertDialogAction>
//             </AlertDialogFooter>
//           </AlertDialogContent>
//         </AlertDialog>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }

// // --- Allocation Form Component ---
// function AllocationForm({
//   isOpen,
//   setIsOpen,
//   hotel_id,
//   initialData,
// }: {
//   isOpen: boolean;
//   setIsOpen: (isOpen: boolean) => void;
//   hotel_id: string;
//   initialData: AllocationDetail | null;
// }) {
//   const queryClient = useQueryClient();
//   const {
//     handleSubmit,
//     control,
//     reset,
//     formState: { isSubmitting },
//   } = useForm<AllocationDetail>({ defaultValues: initialData || {} });

//   useEffect(() => {
//     if (initialData) {
//       reset(initialData);
//     } else {
//       reset({
//         date: "",
//         status: "Pending",
//         is_price_per_night: true,
//         special_conditions: "",
//         allocation: "",
//         room: "",
//         room_type: "",
//       });
//     }
//   }, [initialData, reset]);

//   const { data: allocations } = useQuery<PaginatedResponse<Allocation>>({
//     queryKey: ["allocations", hotel_id],
//     queryFn: () => hotelClient.get(`/allocations/?hotel=${hotel_id}`).then(res => res.data),
//     enabled: !!hotel_id,
//   });

//   const { data: roomTypes } = useQuery<PaginatedResponse<RoomType>>({
//     queryKey: ["hotel-room-types", hotel_id],
//     queryFn: () => hotelClient.get(`/room-types/?hotel=${hotel_id}`).then(res => res.data),
//     enabled: !!hotel_id,
//   });

//   const { data: rooms } = useQuery<PaginatedResponse<Room>>({
//     queryKey: ["available-rooms", hotel_id],
//     queryFn: () => hotelClient.get(`/rooms/?hotel_id=${hotel_id}&availability_status=Available`).then(res => res.data),
//     enabled: !!hotel_id,
//   });

//   const mutation = useMutation({
//     mutationFn: (data: AllocationDetail) => {
//       const payload = {
//         ...data,
//         hotel: hotel_id,
//       };
//       if (initialData) {
//         return hotelClient.patch(`/allocation-details/${initialData.id}/`, payload);
//       }
//       return hotelClient.post(`/allocation-details/?hotel=${hotel_id}`, payload);
//     },
//     onSuccess: () => {
//       toast.success(
//         `Allocation detail ${initialData ? "updated" : "created"} successfully!`
//       );
//       queryClient.invalidateQueries({ queryKey: ["allocation-details"] });
//       setIsOpen(false);
//     },
//     onError: (error: any) => {
//       toast.error(
//         `Failed to ${initialData ? "update" : "create"} allocation detail: ${
//           error.response?.data?.detail || error.message
//         }`
//       );
//     },
//   });

//   const onSubmit = (data: AllocationDetail) => {
//     mutation.mutate(data);
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>
//             {initialData ? "Edit Allocation Detail" : "Create Allocation Detail"}
//           </DialogTitle>
//           <DialogDescription>
//             Fill in the details below to{" "}
//             {initialData ? "update the" : "create a new"} allocation detail.
//           </DialogDescription>
//         </DialogHeader>
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//           <Controller
//             name="date"
//             control={control}
//             render={({ field }) => (
//               <div>
//                 <Label htmlFor="date">Date</Label>
//                 <Input id="date" type="date" {...field} />
//               </div>
//             )}
//           />

//           <Controller
//             name="allocation"
//             control={control}
//             render={({ field }) => (
//               <Select onValueChange={field.onChange} defaultValue={field.value}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select Allocation" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {allocations?.results.map((alloc) => (
//                     <SelectItem key={alloc.id} value={alloc.id}>
//                       {alloc.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             )}
//           />

//           <Controller
//             name="room_type"
//             control={control}
//             render={({ field }) => (
//               <Select onValueChange={field.onChange} defaultValue={field.value}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select Room Type" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {roomTypes?.results.map((rt) => (
//                     <SelectItem key={rt.id} value={rt.id}>
//                       {rt.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             )}
//           />

//           <Controller
//             name="room"
//             control={control}
//             render={({ field }) => (
//               <Select onValueChange={field.onChange} defaultValue={field.value}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select Room" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {rooms?.results.map((room) => (
//                     <SelectItem key={room.id} value={room.id}>
//                       {room.code}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             )}
//           />

//           <Controller
//             name="status"
//             control={control}
//             render={({ field }) => (
//               <Select onValueChange={field.onChange} defaultValue={field.value}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select Status" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {statusOptions.map((status) => (
//                     <SelectItem key={status} value={status}>
//                       {status}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             )}
//           />

//           <Controller
//             name="is_price_per_night"
//             control={control}
//             render={({ field }) => (
//               <div className="flex items-center space-x-2">
//                 <Checkbox
//                   id="is_price_per_night"
//                   checked={field.value}
//                   onCheckedChange={field.onChange}
//                 />
//                 <Label htmlFor="is_price_per_night">Is Price Per Night</Label>
//               </div>
//             )}
//           />

//           <Controller
//             name="special_conditions"
//             control={control}
//             render={({ field }) => (
//               <div>
//                 <Label htmlFor="special_conditions">Special Conditions</Label>
//                 <Textarea id="special_conditions" {...field} />
//               </div>
//             )}
//           />

//           <div className="flex justify-end gap-2">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => setIsOpen(false)}
//             >
//               Cancel
//             </Button>
//             <Button type="submit" disabled={isSubmitting}>
//               {isSubmitting ? "Saving..." : "Save"}
//             </Button>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }
