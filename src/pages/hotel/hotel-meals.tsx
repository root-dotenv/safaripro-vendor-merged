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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { EmptyState } from "./empty-state";
import { Plus, MoreHorizontal, Trash2, Star, Loader } from "lucide-react";
import { SelectionDialog } from "./selection-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ErrorPage from "@/components/custom/error-page";
import { Badge } from "@/components/ui/badge";
import type { MealType } from "./features";

export default function HotelMealTypes() {
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
    .map((q) => q.data as MealType);
  const mealTypeQueriesError = mealTypeQueries.find((q) => q.isError);

  const { data: allMealTypes } = useQuery<MealType[]>({
    queryKey: ["allMealTypes"],
    queryFn: async () => (await hotelClient.get("meal-types/")).data.results,
    enabled: isModalOpen,
  });

  const updateHotelMutation = useMutation({
    mutationFn: (newMealTypeIds: string[]) =>
      hotelClient.patch(`hotels/${hotelId}/`, { meal_types: newMealTypeIds }),
    onSuccess: () => {
      toast.success("Hotel meal plans updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["hotel", hotelId] });
      setIsModalOpen(false);
    },
    onError: (error) =>
      toast.error(`Failed to update meal plans: ${error.message}`),
  });

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
    if (Array.from(selectedIds).length === 0) {
      toast.warning("Your hotel must have at least one meal type.");
      return;
    }
    updateHotelMutation.mutate(Array.from(selectedIds));
  };

  // MODIFICATION: Improved error handling in handleRemove
  const handleRemove = (mealId: string) => {
    const currentIds = new Set(hotel?.meal_types || []);
    // Client-side check to prevent removing the last item
    if (currentIds.size <= 1) {
      // Use a warning toast for business rule violations
      toast.warning("Your hotel must have at least one meal type.");
      return; // Prevent the API call
    }
    currentIds.delete(mealId);
    updateHotelMutation.mutate(Array.from(currentIds));
  };

  const areMealTypesLoading = mealTypeQueries.some((q) => q.isLoading);

  if (isHotelLoading || areMealTypesLoading) {
    return (
      <div className="w-full flex items-center justify-center py-10">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (isHotelError)
    return <ErrorPage error={hotelError as Error} onRetry={refetchHotel} />;
  if (mealTypeQueriesError)
    return (
      <ErrorPage
        error={mealTypeQueriesError.error as Error}
        onRetry={() =>
          queryClient.invalidateQueries({ queryKey: ["mealTypeDetail"] })
        }
      />
    );

  return (
    <>
      <Card className="border-none shadow-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Hotel Meal Plans</CardTitle>
            <CardDescription>
              Manage the meal plans offered at your hotel.
            </CardDescription>
          </div>
          <Button
            variant="outline"
            className="bg-[#FFF] font-semibold text-[#0081FB] border-[#DADCE0] border-[1.25px] shadow cursor-pointer hover:bg-[#0081FB] hover:text-white hover:border-[0081FB] transition-all"
            onClick={handleOpenModal}
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Add / Remove
          </Button>
        </CardHeader>
        <CardContent>
          {mealTypes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mealTypes.map((mealType) => (
                <Card
                  key={mealType.id}
                  className="flex flex-col justify-between"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{mealType.name}</CardTitle>
                      <Badge
                        variant={mealType.is_active ? "default" : "destructive"}
                        className={
                          mealType.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }
                      >
                        {mealType.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <CardDescription>{mealType.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Star className="mr-2 h-4 w-4 text-yellow-500" />
                      <span className="font-semibold">Score:</span>
                      <span className="ml-1 font-bold text-primary">
                        {mealType.score}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleRemove(mealType.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardFooter>
                </Card>
              ))}
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
