// --- src/pages/hotel/hotel-translations.tsx ---
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
import { Plus, MoreHorizontal, Trash2, Loader, Languages } from "lucide-react";
import { SelectionDialog } from "./selection-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ErrorPage from "@/components/custom/error-page";
import { Badge } from "@/components/ui/badge";
import type { Translation, Country, EnrichedTranslation } from "./features";

export default function HotelTranslations() {
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

  const translationQueries = useQueries({
    queries: (hotel?.translations || []).map((id) => ({
      queryKey: ["enrichedTranslationDetail", id],
      queryFn: async (): Promise<EnrichedTranslation> => {
        const [translationRes, countryRes] = await Promise.all([
          hotelClient.get(`translations/${id}/`),
          hotelClient
            .get(`translations/${id}/`)
            .then((res) =>
              hotelClient.get(`countries/${(res.data as Translation).country}/`)
            ),
        ]);
        const translationData = translationRes.data as Translation;
        const countryData = countryRes.data as Country;
        return { ...translationData, country_name: countryData.name };
      },
      enabled: !!hotel,
    })),
  });

  const translations = translationQueries
    .filter((q) => q.isSuccess)
    .map((q) => q.data as EnrichedTranslation);
  const translationQueriesError = translationQueries.find((q) => q.isError);

  const { data: allTranslations } = useQuery<EnrichedTranslation[]>({
    queryKey: ["allEnrichedTranslations"],
    queryFn: async () => {
      const transRes = await hotelClient.get("translations/");
      const transData = transRes.data.results as Translation[];
      const countryPromises = transData.map((t) =>
        hotelClient.get(`countries/${t.country}/`)
      );
      const countryResponses = await Promise.all(countryPromises);
      const countries = countryResponses.map((res) => res.data as Country);
      const countryMap = new Map(countries.map((c) => [c.id, c.name]));
      return transData.map((t) => ({
        ...t,
        country_name: countryMap.get(t.country) || "Unknown",
      }));
    },
    enabled: isModalOpen,
  });

  const dialogItems =
    allTranslations?.map((translation) => ({
      id: translation.id,
      name: `${translation.language} (${translation.country_name})`,
    })) || [];

  const updateHotelMutation = useMutation({
    mutationFn: (newTranslationIds: string[]) =>
      hotelClient.patch(`hotels/${hotelId}/`, {
        translations: newTranslationIds,
      }),
    onSuccess: () => {
      toast.success("Hotel translations updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["hotel", hotelId] });
      queryClient.invalidateQueries({
        queryKey: ["enrichedTranslationDetail"],
      });
      setIsModalOpen(false);
    },
    onError: (error) =>
      toast.error(`Failed to update translations: ${error.message}`),
  });

  const handleOpenModal = () => {
    setSelectedIds(new Set(hotel?.translations || []));
    setIsModalOpen(true);
  };

  const handleSelectionChange = (id: string, isSelected: boolean) => {
    const newIds = new Set(selectedIds);
    isSelected ? newIds.add(id) : newIds.delete(id);
    setSelectedIds(newIds);
  };

  const handleSave = () => {
    // MODIFICATION: Added check for saving zero items
    if (Array.from(selectedIds).length === 0) {
      toast.warning("Your hotel must have at least one translation.");
      return;
    }
    updateHotelMutation.mutate(Array.from(selectedIds));
  };

  // MODIFICATION: Improved error handling in handleRemove
  const handleRemove = (translationId: string) => {
    const currentIds = new Set(hotel?.translations || []);
    // Client-side check to prevent removing the last item
    if (currentIds.size <= 1) {
      // Use a warning toast for business rule violations
      toast.warning("Your hotel must have at least one translation.");
      return; // Prevent the API call
    }
    currentIds.delete(translationId);
    updateHotelMutation.mutate(Array.from(currentIds));
  };

  const areTranslationsLoading = translationQueries.some((q) => q.isLoading);

  if (isHotelLoading || areTranslationsLoading) {
    return (
      <div className="w-full flex items-center justify-center py-10">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (isHotelError)
    return <ErrorPage error={hotelError as Error} onRetry={refetchHotel} />;
  if (translationQueriesError)
    return (
      <ErrorPage
        error={translationQueriesError.error as Error}
        onRetry={() =>
          queryClient.invalidateQueries({
            queryKey: ["enrichedTranslationDetail"],
          })
        }
      />
    );

  return (
    <>
      <Card className="border-none shadow-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Hotel Translations</CardTitle>
            <CardDescription>
              Manage the languages your hotel information is translated into.
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
          {translations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {translations.map((translation) => (
                <Card
                  key={translation.id}
                  className="flex flex-col justify-between"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {translation.language} ({translation.country_name})
                      </CardTitle>
                      <Badge
                        variant={
                          translation.is_active ? "default" : "destructive"
                        }
                        className={
                          translation.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }
                      >
                        {translation.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Languages className="mr-2 h-4 w-4" />
                      <span>Language Option</span>
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
                          onClick={() => handleRemove(translation.id)}
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
              title="No Translations Found"
              description="This hotel has not listed any translations yet."
            />
          )}
        </CardContent>
      </Card>

      <SelectionDialog
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Select Available Translations"
        items={dialogItems}
        selectedIds={selectedIds}
        onSelectionChange={handleSelectionChange}
        onSave={handleSave}
        isSaving={updateHotelMutation.isPending}
      />
    </>
  );
}
