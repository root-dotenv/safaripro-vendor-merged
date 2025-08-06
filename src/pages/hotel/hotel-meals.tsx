// --- src/components/hotel-features/hotel-meals.tsx ---
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
import { GiMeal } from "react-icons/gi";
import { FaStar } from "react-icons/fa";
import type { MealType } from "../../types/hotel-types";
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
import { toast } from "sonner";
import { SelectionDialog } from "./selection-dialog";

// Helper to get a specific icon for meal types
const getMealIcon = (mealName: string, sizeClass = "w-5 h-5") => {
  return <GiMeal className={`${sizeClass} text-slate-600`} />;
};

export default function HotelMealTypes() {
  const queryClient = useQueryClient();
  const { hotel, isLoading: isHotelLoading } = useHotel();
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // NEW: State for the selection dialog
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const hotelId = import.meta.env.VITE_HOTEL_ID;

  // Fetch details for all meal types associated with the hotel
  const mealTypeQueries = useQueries({
    queries: (hotel?.meal_types || []).map((id) => ({
      queryKey: ["mealTypeDetail", id],
      queryFn: async () =>
        (await hotelClient.get(`meal-types/${id}/`)).data as MealType,
      enabled: !!hotel,
    })),
  });

  const mealTypes = mealTypeQueries
    .filter((q) => q.isSuccess)
    .map((q) => q.data);

  // NEW: Fetch all available meal types
  const { data: allMealTypes } = useQuery<MealType[]>({
    queryKey: ["allMealTypes"],
    queryFn: async () => (await hotelClient.get("meal-types/")).data.results,
    enabled: isModalOpen,
  });

  // NEW: Mutation to update the hotel's meal types
  const updateHotelMutation = useMutation({
    mutationFn: (newMealTypeIds: string[]) =>
      hotelClient.patch(`hotels/${hotelId}/`, { meal_types: newMealTypeIds }),
    onSuccess: () => {
      toast.success("Hotel meal plans updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["hotel", hotelId] });
      setIsModalOpen(false);
    },
    onError: (error) => {
      toast.error(`Failed to update meal plans: ${error.message}`);
    },
  });

  useEffect(() => {
    if (mealTypes.length > 0) {
      setExpandedRows(new Set(mealTypes.slice(0, 2).map((m) => m.id)));
    }
  }, [JSON.stringify(mealTypes)]);

  const toggleRow = (id: string) => {
    const newExpandedRows = new Set(expandedRows);
    newExpandedRows.has(id)
      ? newExpandedRows.delete(id)
      : newExpandedRows.add(id);
    setExpandedRows(newExpandedRows);
  };

  // NEW: Handlers for the dialog
  const handleOpenModal = () => {
    setSelectedIds(new Set(hotel?.meal_types || []));
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

  const areMealTypesLoading = mealTypeQueries.some((q) => q.isLoading);
  if (areMealTypesLoading)
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
          <CardTitle>Hotel Meal Plans</CardTitle>
          <Button variant="outline" onClick={handleOpenModal}>
            <Plus className="mr-2 h-4 w-4" />
            Available Meal Plans
          </Button>
        </CardHeader>
        <CardContent>
          {mealTypes.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted">
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Meal Plan</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mealTypes.map((mealType) => (
                    <React.Fragment key={mealType.id}>
                      <TableRow
                        className="cursor-pointer"
                        onClick={() => toggleRow(mealType.id)}
                      >
                        <TableCell>
                          {expandedRows.has(mealType.id) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </TableCell>
                        <TableCell className="font-medium flex items-center gap-3">
                          <span className="bg-slate-100 p-2 rounded">
                            {getMealIcon(mealType.name)}
                          </span>
                          {mealType.name}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {mealType.code}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${
                              mealType.is_active
                                ? "bg-green-400 text-white"
                                : "bg-red-400"
                            } text-xs `}
                            variant={
                              mealType.is_active ? "secondary" : "destructive"
                            }
                          >
                            {mealType.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                      {expandedRows.has(mealType.id) && (
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
                                    {mealType.description}
                                  </p>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <h4 className="font-semibold text-sm">
                                  Details
                                </h4>
                                <div className="flex items-center">
                                  <FaStar className="h-4 w-4 mr-2 text-yellow-500" />
                                  <span className="text-sm font-medium w-28">
                                    Score:
                                  </span>
                                  <span className="text-sm font-bold text-primary">
                                    {mealType.score}
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
              title="No Meal Plans Found"
              description="This hotel has not listed any meal plans yet."
            />
          )}
        </CardContent>
      </Card>

      <SelectionDialog
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Select Available Meal Plans"
        items={allMealTypes || []}
        selectedIds={selectedIds}
        onSelectionChange={handleSelectionChange}
        onSave={handleSave}
        isSaving={updateHotelMutation.isPending}
      />
    </>
  );
}
