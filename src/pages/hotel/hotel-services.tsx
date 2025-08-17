"use client";
import React, { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import type { Service } from "./features";

export default function HotelServices() {
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

  const serviceQueries = useQueries({
    queries: (hotel?.services || []).map((id) => ({
      queryKey: ["serviceDetail", id],
      queryFn: async () =>
        (await hotelClient.get(`services/${id}/`)).data as Service,
      enabled: !!hotel,
    })),
  });

  const services = serviceQueries
    .filter((q) => q.isSuccess)
    .map((q) => q.data as Service);
  const serviceQueriesError = serviceQueries.find((q) => q.isError);

  const { data: allServices } = useQuery<Service[]>({
    queryKey: ["allServices"],
    queryFn: async () => (await hotelClient.get("services/")).data.results,
    enabled: isModalOpen,
  });

  const updateHotelMutation = useMutation({
    mutationFn: (newServiceIds: string[]) =>
      hotelClient.patch(`hotels/${hotelId}/`, { services: newServiceIds }),
    onSuccess: () => {
      toast.success("Hotel services updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["hotel", hotelId] });
      setIsModalOpen(false);
    },
    onError: (error) =>
      toast.error(`Failed to update services: ${error.message}`),
  });

  const handleOpenModal = () => {
    setSelectedIds(new Set(hotel?.services || []));
    setIsModalOpen(true);
  };

  const handleSelectionChange = (id: string, isSelected: boolean) => {
    const newIds = new Set(selectedIds);
    isSelected ? newIds.add(id) : newIds.delete(id);
    setSelectedIds(newIds);
  };

  const handleSave = () => {
    if (Array.from(selectedIds).length === 0) {
      toast.error("A hotel must have at least one service.");
      return;
    }
    updateHotelMutation.mutate(Array.from(selectedIds));
  };

  const handleRemove = (serviceId: string) => {
    const currentIds = new Set(hotel?.services || []);
    if (currentIds.size <= 1) {
      toast.error("A hotel must have at least one service.");
      return;
    }
    currentIds.delete(serviceId);
    updateHotelMutation.mutate(Array.from(currentIds));
  };

  const areServicesLoading = serviceQueries.some((q) => q.isLoading);

  if (isHotelLoading || areServicesLoading) {
    return (
      <div className="w-full flex items-center justify-center py-10">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (isHotelError)
    return <ErrorPage error={hotelError as Error} onRetry={refetchHotel} />;
  if (serviceQueriesError)
    return (
      <ErrorPage
        error={serviceQueriesError.error as Error}
        onRetry={() =>
          queryClient.invalidateQueries({ queryKey: ["serviceDetail"] })
        }
      />
    );

  return (
    <>
      <Card className="border-none shadow-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Hotel Services</CardTitle>
            <CardDescription>
              Manage additional services offered at your hotel.
            </CardDescription>
          </div>
          <Button variant="outline" onClick={handleOpenModal}>
            <Plus className="mr-2 h-4 w-4" />
            Add / Remove
          </Button>
        </CardHeader>
        <CardContent>
          {services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service) => (
                <Card
                  key={service.id}
                  className="relative group flex flex-col justify-between"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      <Badge
                        variant={service.is_active ? "default" : "destructive"}
                        className={
                          service.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }
                      >
                        {service.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm space-y-2">
                      <p>
                        <span className="font-semibold">Type:</span>{" "}
                        {service.service_type_name || "N/A"}
                      </p>
                      <p>
                        <span className="font-semibold">Scope:</span>{" "}
                        {service.service_scope_name || "N/A"}
                      </p>
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
                            onClick={() => handleRemove(service.id)}
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
              title="No Services Found"
              description="This hotel has not listed any special services yet."
            />
          )}
        </CardContent>
      </Card>

      <SelectionDialog
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Select Available Services"
        items={allServices || []}
        selectedIds={selectedIds}
        onSelectionChange={handleSelectionChange}
        onSave={handleSave}
        isSaving={updateHotelMutation.isPending}
      />
    </>
  );
}
