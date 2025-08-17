"use client";
import { useState } from "react";
import { useHotel } from "../../providers/hotel-provider";
import {
  useQueries,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import hotelClient from "../../api/hotel-client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { EmptyState } from "./empty-state";
import { Plus, MoreHorizontal, Trash2, Loader } from "lucide-react";
import { IoIosCheckboxOutline } from "react-icons/io";
import { SelectionDialog } from "./selection-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ErrorPage from "@/components/custom/error-page";
import type { Amenity } from "./features";

export default function HotelAmenities() {
  const queryClient = useQueryClient();
  const {
    hotel,
    isLoading: isHotelLoading,
    isError: isHotelError,
    error: hotelError,
    refetch: refetchHotel,
  } = useHotel();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const hotelId = import.meta.env.VITE_HOTEL_ID;

  const amenityQueries = useQueries({
    queries: (hotel?.amenities || []).map((amenityId) => ({
      queryKey: ["amenityDetail", amenityId],
      queryFn: async () =>
        (await hotelClient.get(`amenities/${amenityId}/`)).data as Amenity,
      enabled: !!hotel,
    })),
  });

  const amenities = amenityQueries
    .filter((q) => q.isSuccess)
    .map((q) => q.data as Amenity);
  const amenityQueriesError = amenityQueries.find((q) => q.isError);

  const { data: allAmenities } = useQuery<Amenity[]>({
    queryKey: ["allAmenities"],
    queryFn: async () => (await hotelClient.get("amenities/")).data.results,
    enabled: isModalOpen,
  });

  const updateHotelMutation = useMutation({
    mutationFn: (newAmenityIds: string[]) =>
      hotelClient.patch(`hotels/${hotelId}/`, { amenities: newAmenityIds }),
    onSuccess: () => {
      toast.success("Hotel amenities updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["hotel", hotelId] });
      setIsModalOpen(false);
    },
    onError: (error) =>
      toast.error(`Failed to update amenities: ${error.message}`),
  });

  const handleOpenModal = () => {
    setSelectedIds(new Set(hotel?.amenities || []));
    setIsModalOpen(true);
  };

  const handleSelectionChange = (id: string, isSelected: boolean) => {
    const newIds = new Set(selectedIds);
    isSelected ? newIds.add(id) : newIds.delete(id);
    setSelectedIds(newIds);
  };

  const handleSave = () => {
    if (Array.from(selectedIds).length === 0) {
      toast.error("A hotel must have at least one amenity.");
      return;
    }
    updateHotelMutation.mutate(Array.from(selectedIds));
  };

  const handleRemove = (amenityId: string) => {
    const currentIds = new Set(hotel?.amenities || []);
    if (currentIds.size <= 1) {
      toast.error("A hotel must have at least one amenity.");
      return;
    }
    currentIds.delete(amenityId);
    updateHotelMutation.mutate(Array.from(currentIds));
  };

  const areAmenitiesLoading = amenityQueries.some((q) => q.isLoading);

  if (isHotelLoading || areAmenitiesLoading) {
    return (
      <div className="w-full flex items-center justify-center py-10">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (isHotelError)
    return <ErrorPage error={hotelError as Error} onRetry={refetchHotel} />;
  if (amenityQueriesError)
    return (
      <ErrorPage
        error={amenityQueriesError.error as Error}
        onRetry={() =>
          queryClient.invalidateQueries({ queryKey: ["amenityDetail"] })
        }
      />
    );

  return (
    <>
      <Card className="border-none shadow-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>In-Room Amenities</CardTitle>
            <CardDescription>
              Manage the amenities available in your hotel rooms.
            </CardDescription>
          </div>
          <Button variant="outline" onClick={handleOpenModal}>
            <Plus className="mr-2 h-4 w-4" />
            Add / Remove
          </Button>
        </CardHeader>
        <CardContent>
          {amenities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {amenities.map((amenity) => (
                <Card
                  key={amenity.id}
                  className="relative group flex flex-col justify-between"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{amenity.name}</CardTitle>
                      <Badge
                        variant={amenity.is_active ? "default" : "destructive"}
                        className={
                          amenity.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }
                      >
                        {amenity.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <CardDescription>{amenity.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded-md text-xs">
                        {amenity.code}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="absolute top-4 right-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleRemove(amenity.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <IoIosCheckboxOutline className="w-6 h-6 text-gray-300" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Amenities Found"
              description="This hotel has not listed any in-room amenities yet."
            />
          )}
        </CardContent>
      </Card>

      <SelectionDialog
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Select Available Amenities"
        items={allAmenities || []}
        selectedIds={selectedIds}
        onSelectionChange={handleSelectionChange}
        onSave={handleSave}
        isSaving={updateHotelMutation.isPending}
      />
    </>
  );
}
