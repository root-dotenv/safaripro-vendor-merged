// --- src/components/hotel-features/hotel-amenities.tsx ---
"use client";
import React, { useState, useEffect } from "react";
import { useHotel } from "../../providers/hotel-provider";
import {
  useQueries,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import hotelClient from "../../api/hotel-client";
import type { Amenity } from "../../types/amenities";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "./empty-state";
import { ChevronDown, ChevronRight, FileText, Hash, Plus } from "lucide-react";
import { FaRegCircleCheck } from "react-icons/fa6";
import { toast } from "sonner";
import { SelectionDialog } from "./selection-dialog";

// Helper to get a specific icon based on the amenity's icon name string
const getAmenityIcon = (iconName: string, sizeClass = "w-5 h-5") => {
  const icon = iconName?.toLowerCase() || "";
  if (icon.includes("wifi"))
    return <FaRegCircleCheck className={`${sizeClass} text-slate-700`} />;
  if (icon.includes("coffee"))
    return <FaRegCircleCheck className={`${sizeClass} text-slate-700`} />;
  if (icon.includes("snowflake"))
    return <FaRegCircleCheck className={`${sizeClass} text-slate-700`} />;
  if (icon.includes("tv"))
    return <FaRegCircleCheck className={`${sizeClass} text-slate-700`} />;
  return <FaRegCircleCheck className={`${sizeClass} text-slate-700`} />;
};

export default function HotelAmenities() {
  const queryClient = useQueryClient();
  const { hotel, isLoading: isHotelLoading } = useHotel();
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // NEW: State for the selection dialog
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const hotelId = import.meta.env.VITE_HOTEL_ID;

  // Fetch details for all amenities associated with the hotel
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
    .map((q) => q.data);

  // NEW: Fetch all available amenities for the selection dialog
  const { data: allAmenities } = useQuery<Amenity[]>({
    queryKey: ["allAmenities"],
    queryFn: async () => (await hotelClient.get("amenities/")).data.results,
    enabled: isModalOpen, // Only fetch when the modal is opened
  });

  // NEW: Mutation to update the hotel's amenities
  const updateHotelMutation = useMutation({
    mutationFn: (newAmenityIds: string[]) =>
      hotelClient.patch(`hotels/${hotelId}/`, { amenities: newAmenityIds }),
    onSuccess: () => {
      toast.success("Hotel amenities updated successfully!");
      // Refetch hotel data to get the new list of IDs
      queryClient.invalidateQueries({ queryKey: ["hotel", hotelId] });
      setIsModalOpen(false);
    },
    onError: (error) => {
      toast.error(`Failed to update amenities: ${error.message}`);
    },
  });

  // Set first two rows to be expanded by default
  useEffect(() => {
    if (amenities.length > 0) {
      setExpandedRows(new Set(amenities.slice(0, 2).map((a) => a.id)));
    }
  }, [JSON.stringify(amenities)]);

  const toggleRow = (id: string) => {
    const newExpandedRows = new Set(expandedRows);
    newExpandedRows.has(id)
      ? newExpandedRows.delete(id)
      : newExpandedRows.add(id);
    setExpandedRows(newExpandedRows);
  };

  // NEW: Handlers for the dialog
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
    updateHotelMutation.mutate(Array.from(selectedIds));
  };

  if (isHotelLoading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-700 dark:bg-gray-900 dark:text-gray-300">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p></p>
      </div>
    );

  if (!hotel)
    return <p className="text-center p-6">Could not load hotel information.</p>;

  const areAmenitiesLoading = amenityQueries.some((q) => q.isLoading);
  if (areAmenitiesLoading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-700 dark:bg-gray-900 dark:text-gray-300">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p></p>
      </div>
    );

  return (
    <>
      <Card className="border-none shadow-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>In-Room Amenities</CardTitle>
          <Button variant="outline" onClick={handleOpenModal}>
            <Plus className="mr-2 h-4 w-4" />
            Available Amenities
          </Button>
        </CardHeader>
        <CardContent>
          {amenities.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted">
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Amenity</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {amenities.map((amenity) => (
                    <React.Fragment key={amenity.id}>
                      <TableRow
                        className="cursor-pointer"
                        onClick={() => toggleRow(amenity.id)}
                      >
                        <TableCell>
                          {expandedRows.has(amenity.id) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </TableCell>
                        <TableCell className="font-medium flex items-center gap-3">
                          <span className="bg-slate-100 p-2 rounded">
                            {getAmenityIcon(amenity.icon)}
                          </span>
                          {amenity.name}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {amenity.code}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${
                              amenity.is_active
                                ? "bg-green-400 text-white"
                                : "bg-red-400"
                            } text-xs `}
                            variant={
                              amenity.is_active ? "secondary" : "destructive"
                            }
                          >
                            {amenity.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                      {expandedRows.has(amenity.id) && (
                        <TableRow className="bg-muted/20 hover:bg-muted/20">
                          <TableCell colSpan={4} className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <h4 className="font-semibold text-sm">
                                  Full Description
                                </h4>
                                <div className="flex items-start">
                                  <FileText className="h-4 w-4 mr-2 mt-1 text-muted-foreground flex-shrink-0" />
                                  <p className="text-sm text-muted-foreground">
                                    {amenity.description}
                                  </p>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <h4 className="font-semibold text-sm">
                                  Details
                                </h4>
                                <div className="flex items-center">
                                  <Hash className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span className="text-sm font-medium w-28">
                                    Icon Name:
                                  </span>
                                  <span className="text-sm font-mono text-muted-foreground">
                                    {amenity.icon}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <EmptyState
              title="No Amenities Found"
              description="This hotel has not listed any in-room amenities yet."
            />
          )}
        </CardContent>
      </Card>

      {/* NEW: Render the dialog */}
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
