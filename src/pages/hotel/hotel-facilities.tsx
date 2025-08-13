// --- src/components/hotel-features/hotel-facilities.tsx ---
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
import type { Facility } from "../../types/facilities";
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
import { ChevronDown, ChevronRight, FileText, Plus } from "lucide-react";
import { FaDollarSign, FaRegCircleCheck } from "react-icons/fa6";
import { FaCalendarCheck } from "react-icons/fa";
import { toast } from "sonner";
import { SelectionDialog } from "./selection-dialog";

// Helper to get a specific icon based on the facility name string
const getFacilityIcon = (facilityName: string, sizeClass = "w-5 h-5") => {
  const name = facilityName.toLowerCase();
  if (name.includes("pool"))
    return <FaRegCircleCheck className={`${sizeClass} text-slate-500`} />;
  if (name.includes("fitness") || name.includes("gym"))
    return <FaRegCircleCheck className={`${sizeClass} text-slate-500`} />;
  if (name.includes("parking"))
    return <FaRegCircleCheck className={`${sizeClass} text-slate-500`} />;
  if (name.includes("restaurant"))
    return <FaRegCircleCheck className={`${sizeClass} text-slate-500`} />;
  return <FaRegCircleCheck className={`${sizeClass} text-slate-500`} />;
};

export default function HotelFacilities() {
  const queryClient = useQueryClient();
  const { hotel, isLoading: isHotelLoading } = useHotel();
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // NEW: State for the selection dialog
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const hotelId = import.meta.env.VITE_HOTEL_ID;

  // Fetch details for all facilities associated with the hotel
  const facilityQueries = useQueries({
    queries: (hotel?.facilities || []).map((id) => ({
      queryKey: ["facilityDetail", id],
      queryFn: async () =>
        (await hotelClient.get(`facilities/${id}`)).data as Facility,
      enabled: !!hotel,
    })),
  });

  const facilities = facilityQueries
    .filter((q) => q.isSuccess)
    .map((q) => q.data);

  // NEW: Fetch all available facilities
  const { data: allFacilities } = useQuery<Facility[]>({
    queryKey: ["allFacilities"],
    queryFn: async () => (await hotelClient.get("facilities/")).data.results,
    enabled: isModalOpen,
  });

  // NEW: Mutation to update the hotel's facilities
  const updateHotelMutation = useMutation({
    mutationFn: (newFacilityIds: string[]) =>
      hotelClient.patch(`hotels/${hotelId}/`, { facilities: newFacilityIds }),
    onSuccess: () => {
      toast.success("Hotel facilities updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["hotel", hotelId] });
      setIsModalOpen(false);
    },
    onError: (error) => {
      toast.error(`Failed to update facilities: ${error.message}`);
    },
  });

  useEffect(() => {
    if (facilities.length > 0) {
      setExpandedRows(new Set(facilities.slice(0, 2).map((f) => f.id)));
    }
  }, [JSON.stringify(facilities)]);

  const toggleRow = (id: string) => {
    const newExpandedRows = new Set(expandedRows);
    newExpandedRows.has(id)
      ? newExpandedRows.delete(id)
      : newExpandedRows.add(id);
    setExpandedRows(newExpandedRows);
  };

  // NEW: Handlers for the dialog
  const handleOpenModal = () => {
    setSelectedIds(new Set(hotel?.facilities || []));
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-none text-gray-700 dark:bg-gray-900 dark:text-gray-300">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p></p>
      </div>
    );

  if (!hotel)
    return <p className="text-center p-6">Could not load hotel information.</p>;

  const areFacilitiesLoading = facilityQueries.some((q) => q.isLoading);
  if (areFacilitiesLoading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-none text-gray-700 dark:bg-gray-900 dark:text-gray-300">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p></p>
      </div>
    );

  return (
    <>
      <Card className="border-none shadow-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Hotel Facilities</CardTitle>
          <Button variant="outline" onClick={handleOpenModal}>
            <Plus className="mr-2 h-4 w-4" />
            Available Facilities
          </Button>
        </CardHeader>
        <CardContent>
          {facilities.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted">
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Facility</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {facilities.map((facility) => (
                    <React.Fragment key={facility.id}>
                      <TableRow
                        className="cursor-pointer"
                        onClick={() => toggleRow(facility.id)}
                      >
                        <TableCell>
                          {expandedRows.has(facility.id) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </TableCell>
                        <TableCell className="font-medium flex items-center gap-3">
                          <span className="bg-slate-100 p-2 rounded">
                            {getFacilityIcon(facility.name)}
                          </span>
                          {facility.name}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {facility.code}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${
                              facility.is_active
                                ? "bg-green-400 text-white"
                                : "bg-red-400"
                            } text-xs `}
                            variant={
                              facility.is_active ? "secondary" : "destructive"
                            }
                          >
                            {facility.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                      {expandedRows.has(facility.id) && (
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
                                    {facility.description}
                                  </p>
                                </div>
                              </div>
                              <div className="space-y-3">
                                <div className="flex flex-wrap gap-2">
                                  {facility.fee_applies && (
                                    <Badge variant="secondary">
                                      <FaDollarSign className="mr-1.5" />
                                      Fee Applies
                                    </Badge>
                                  )}
                                  {facility.reservation_required && (
                                    <Badge variant="secondary">
                                      <FaCalendarCheck className="mr-1.5" />
                                      Reservation Required
                                    </Badge>
                                  )}
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
              title="No Facilities Found"
              description="This hotel has not listed any facilities yet."
            />
          )}
        </CardContent>
      </Card>

      <SelectionDialog
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Select Available Facilities"
        items={allFacilities || []}
        selectedIds={selectedIds}
        onSelectionChange={handleSelectionChange}
        onSave={handleSave}
        isSaving={updateHotelMutation.isPending}
      />
    </>
  );
}
