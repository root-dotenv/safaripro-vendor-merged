// "use client";
// import { useState } from "react";
// import { useHotel } from "../../providers/hotel-provider";
// import {
//   useQueries,
//   useQuery,
//   useMutation,
//   useQueryClient,
// } from "@tanstack/react-query";
// import hotelClient from "../../api/hotel-client";
// import { toast } from "sonner";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
//   CardFooter,
// } from "@/components/ui/card";
// import { EmptyState } from "./empty-state";
// import {
//   Plus,
//   MoreHorizontal,
//   Trash2,
//   Loader,
//   DollarSign,
//   CalendarCheck,
// } from "lucide-react";
// import { SelectionDialog } from "./selection-dialog";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import ErrorPage from "@/components/custom/error-page";
// import type { Facility } from "./features";

// export default function HotelFacilities() {
//   const queryClient = useQueryClient();
//   const {
//     hotel,
//     isLoading: isHotelLoading,
//     isError: isHotelError,
//     error: hotelError,
//     refetch: refetchHotel,
//   } = useHotel();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
//   const hotelId = import.meta.env.VITE_HOTEL_ID;

//   const facilityQueries = useQueries({
//     queries: (hotel?.facilities || []).map((id) => ({
//       queryKey: ["facilityDetail", id],
//       queryFn: async () =>
//         (await hotelClient.get(`facilities/${id}`)).data as Facility,
//       enabled: !!hotel,
//     })),
//   });

//   const facilities = facilityQueries
//     .filter((q) => q.isSuccess)
//     .map((q) => q.data as Facility);
//   const facilityQueriesError = facilityQueries.find((q) => q.isError);

//   const { data: allFacilities } = useQuery<Facility[]>({
//     queryKey: ["allFacilities"],
//     queryFn: async () => (await hotelClient.get("facilities/")).data.results,
//     enabled: isModalOpen,
//   });

//   const updateHotelMutation = useMutation({
//     mutationFn: (newFacilityIds: string[]) =>
//       hotelClient.patch(`hotels/${hotelId}/`, { facilities: newFacilityIds }),
//     onSuccess: () => {
//       toast.success("Hotel facilities updated successfully!");
//       queryClient.invalidateQueries({ queryKey: ["hotel", hotelId] });
//       setIsModalOpen(false);
//     },
//     onError: (error) =>
//       toast.error(`Failed to update facilities: ${error.message}`),
//   });

//   const handleOpenModal = () => {
//     setSelectedIds(new Set(hotel?.facilities || []));
//     setIsModalOpen(true);
//   };

//   const handleSelectionChange = (id: string, isSelected: boolean) => {
//     const newIds = new Set(selectedIds);
//     isSelected ? newIds.add(id) : newIds.delete(id);
//     setSelectedIds(newIds);
//   };

//   const handleSave = () => {
//     if (Array.from(selectedIds).length === 0) {
//       toast.warning("Your hotel must have at least one facility.");
//       return;
//     }
//     updateHotelMutation.mutate(Array.from(selectedIds));
//   };

//   // MODIFICATION: Improved error handling in handleRemove
//   const handleRemove = (facilityId: string) => {
//     const currentIds = new Set(hotel?.facilities || []);
//     // Client-side check to prevent removing the last item
//     if (currentIds.size <= 1) {
//       // Use a warning toast for business rule violations
//       toast.warning("Your hotel must have at least one facility.");
//       return; // Prevent the API call
//     }
//     currentIds.delete(facilityId);
//     updateHotelMutation.mutate(Array.from(currentIds));
//   };

//   const areFacilitiesLoading = facilityQueries.some((q) => q.isLoading);

//   if (isHotelLoading || areFacilitiesLoading) {
//     return (
//       <div className="w-full flex items-center justify-center py-10">
//         <Loader className="animate-spin" />
//       </div>
//     );
//   }

//   if (isHotelError)
//     return <ErrorPage error={hotelError as Error} onRetry={refetchHotel} />;
//   if (facilityQueriesError)
//     return (
//       <ErrorPage
//         error={facilityQueriesError.error as Error}
//         onRetry={() =>
//           queryClient.invalidateQueries({ queryKey: ["facilityDetail"] })
//         }
//       />
//     );

//   return (
//     <>
//       <Card className="border-none shadow-none">
//         <CardHeader className="flex flex-row items-center justify-between">
//           <div>
//             <CardTitle>Hotel Facilities</CardTitle>
//             <CardDescription>
//               Manage your hotel's general facilities.
//             </CardDescription>
//           </div>
//           <Button
//             variant="outline"
//             className="bg-[#FFF] font-semibold text-[#0081FB] border-[#DADCE0] border-[1.25px] shadow cursor-pointer hover:bg-[#0081FB] hover:text-white hover:border-[0081FB] transition-all"
//             onClick={handleOpenModal}
//           >
//             <Plus className="mr-1.5 h-4 w-4" />
//             Add / Remove
//           </Button>
//         </CardHeader>
//         <CardContent>
//           {facilities.length > 0 ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {facilities.map((facility) => (
//                 <Card
//                   key={facility.id}
//                   className="flex flex-col justify-between"
//                 >
//                   <CardHeader>
//                     <div className="flex items-center justify-between">
//                       <CardTitle className="text-lg">{facility.name}</CardTitle>
//                       <Badge
//                         variant={facility.is_active ? "default" : "destructive"}
//                         className={
//                           facility.is_active
//                             ? "bg-green-100 text-green-700"
//                             : "bg-red-100 text-red-700"
//                         }
//                       >
//                         {facility.is_active ? "Active" : "Inactive"}
//                       </Badge>
//                     </div>
//                     <CardDescription>{facility.description}</CardDescription>
//                   </CardHeader>
//                   <CardContent className="space-y-2">
//                     <div className="flex items-center text-sm">
//                       <span className="font-mono bg-gray-100 px-2 py-1 rounded-md text-xs">
//                         {facility.code}
//                       </span>
//                     </div>
//                     <div className="flex flex-wrap gap-2 pt-2">
//                       {facility.fee_applies && (
//                         <Badge variant="secondary">
//                           <DollarSign className="mr-1.5 h-3 w-3" />
//                           Fee Applies
//                         </Badge>
//                       )}
//                       {facility.reservation_required && (
//                         <Badge variant="secondary">
//                           <CalendarCheck className="mr-1.5 h-3 w-3" />
//                           Reservation Required
//                         </Badge>
//                       )}
//                     </div>
//                   </CardContent>
//                   <CardFooter className="flex justify-end">
//                     <DropdownMenu>
//                       <DropdownMenuTrigger asChild>
//                         <Button variant="ghost" className="h-8 w-8 p-0">
//                           <MoreHorizontal className="h-4 w-4" />
//                         </Button>
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent align="end">
//                         <DropdownMenuItem
//                           onClick={() => handleRemove(facility.id)}
//                           className="text-red-600"
//                         >
//                           <Trash2 className="mr-2 h-4 w-4" /> Remove
//                         </DropdownMenuItem>
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </CardFooter>
//                 </Card>
//               ))}
//             </div>
//           ) : (
//             <EmptyState
//               title="No Facilities Found"
//               description="This hotel has not listed any facilities yet."
//             />
//           )}
//         </CardContent>
//       </Card>

//       <SelectionDialog
//         isOpen={isModalOpen}
//         onOpenChange={setIsModalOpen}
//         title="Select Available Facilities"
//         items={allFacilities || []}
//         selectedIds={selectedIds}
//         onSelectionChange={handleSelectionChange}
//         onSave={handleSave}
//         isSaving={updateHotelMutation.isPending}
//       />
//     </>
//   );
// }

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
import {
  Plus,
  MoreHorizontal,
  Trash2,
  Loader,
  DollarSign,
  CalendarCheck,
} from "lucide-react";
import { SelectionDialog } from "./selection-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ErrorPage from "@/components/custom/error-page";
import { Badge } from "@/components/ui/badge";
import type { Facility } from "./features";
import { useAuthStore } from "@/store/auth.store"; // ✨ Step 2: Import the Auth Store

export default function HotelFacilities() {
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
  const { hotelId } = useAuthStore(); // ✨ Step 3: Access the Dynamic ID

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
    .map((q) => q.data as Facility);
  const facilityQueriesError = facilityQueries.find((q) => q.isError);

  const { data: allFacilities } = useQuery<Facility[]>({
    queryKey: ["allFacilities"],
    queryFn: async () => (await hotelClient.get("facilities/")).data.results,
    enabled: isModalOpen,
  });

  const updateHotelMutation = useMutation({
    mutationFn: (newFacilityIds: string[]) =>
      hotelClient.patch(`hotels/${hotelId}/`, { facilities: newFacilityIds }), // ✨ Step 5: Update API parameter
    onSuccess: () => {
      toast.success("Hotel facilities updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["hotel", hotelId] }); // ✨ Step 6: Update query invalidation
      setIsModalOpen(false);
    },
    onError: (error) =>
      toast.error(`Failed to update facilities: ${error.message}`),
  });

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
    if (Array.from(selectedIds).length === 0) {
      toast.warning("Your hotel must have at least one facility.");
      return;
    }
    updateHotelMutation.mutate(Array.from(selectedIds));
  };

  // MODIFICATION: Improved error handling in handleRemove
  const handleRemove = (facilityId: string) => {
    const currentIds = new Set(hotel?.facilities || []);
    // Client-side check to prevent removing the last item
    if (currentIds.size <= 1) {
      // Use a warning toast for business rule violations
      toast.warning("Your hotel must have at least one facility.");
      return; // Prevent the API call
    }
    currentIds.delete(facilityId);
    updateHotelMutation.mutate(Array.from(currentIds));
  };

  const areFacilitiesLoading = facilityQueries.some((q) => q.isLoading);

  if (isHotelLoading || areFacilitiesLoading) {
    return (
      <div className="w-full flex items-center justify-center py-10">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (isHotelError)
    return <ErrorPage error={hotelError as Error} onRetry={refetchHotel} />;
  if (facilityQueriesError)
    return (
      <ErrorPage
        error={facilityQueriesError.error as Error}
        onRetry={() =>
          queryClient.invalidateQueries({ queryKey: ["facilityDetail"] })
        }
      />
    );

  return (
    <>
      <Card className="border-none shadow-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Hotel Facilities</CardTitle>
            <CardDescription>
              Manage your hotel's general facilities.
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
          {facilities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {facilities.map((facility) => (
                <Card
                  key={facility.id}
                  className="flex flex-col justify-between"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{facility.name}</CardTitle>
                      <Badge
                        variant={facility.is_active ? "default" : "destructive"}
                        className={
                          facility.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }
                      >
                        {facility.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <CardDescription>{facility.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center text-sm">
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded-md text-xs">
                        {facility.code}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {facility.fee_applies && (
                        <Badge variant="secondary">
                          <DollarSign className="mr-1.5 h-3 w-3" />
                          Fee Applies
                        </Badge>
                      )}
                      {facility.reservation_required && (
                        <Badge variant="secondary">
                          <CalendarCheck className="mr-1.5 h-3 w-3" />
                          Reservation Required
                        </Badge>
                      )}
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
                          onClick={() => handleRemove(facility.id)}
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
