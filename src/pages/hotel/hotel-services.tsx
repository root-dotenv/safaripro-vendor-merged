// // --- src/components/hotel-features/hotel-services.tsx ---
// "use client";
// import React, { useState, useEffect } from "react";
// import { useHotel } from "../../providers/hotel-provider";
// import { useQueries } from "@tanstack/react-query";
// import hotelClient from "../../api/hotel-client";
// import type { Service } from "../../types/hotel-types";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { EmptyState } from "./empty-state";
// import { ChevronDown, ChevronRight, FileText, Hash } from "lucide-react";
// import { FaRegCheckCircle } from "react-icons/fa";

// // Helper to get a specific icon based on the service name string
// const getServiceIcon = (serviceName: string, sizeClass = "w-5 h-5") => {
//   const name = serviceName.toLowerCase();
//   if (name.includes("transport") || name.includes("shuttle"))
//     return <FaRegCheckCircle className={`${sizeClass} text-slate-600`} />;
//   if (name.includes("concierge") || name.includes("desk"))
//     return <FaRegCheckCircle className={`${sizeClass} text-slate-600`} />;
//   if (name.includes("parking") || name.includes("valet"))
//     return <FaRegCheckCircle className={`${sizeClass} text-slate-600`} />;
//   return <FaRegCheckCircle className={`${sizeClass} text-slate-600`} />;
// };

// export default function HotelServices() {
//   const { hotel, isLoading: isHotelLoading } = useHotel();
//   const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

//   // Fetch details for all services associated with the hotel
//   const serviceQueries = useQueries({
//     queries: (hotel?.services || []).map((id) => ({
//       queryKey: ["serviceDetail", id],
//       queryFn: async () =>
//         (await hotelClient.get(`services/${id}/`)).data as Service,
//       enabled: !!hotel,
//     })),
//   });

//   const services = serviceQueries.filter((q) => q.isSuccess).map((q) => q.data);

//   // Set first two rows to be expanded by default
//   useEffect(() => {
//     if (services.length > 0) {
//       setExpandedRows(new Set(services.slice(0, 2).map((s) => s.id)));
//     }
//   }, [serviceQueries.map((q) => q.data).join(",")]);

//   const toggleRow = (id: string) => {
//     const newExpandedRows = new Set(expandedRows);
//     newExpandedRows.has(id)
//       ? newExpandedRows.delete(id)
//       : newExpandedRows.add(id);
//     setExpandedRows(newExpandedRows);
//   };

//   if (isHotelLoading)
//     return <p className="text-center p-6">Loading hotel data...</p>;
//   if (!hotel)
//     return <p className="text-center p-6">Could not load hotel information.</p>;

//   const areServicesLoading = serviceQueries.some((q) => q.isLoading);
//   if (areServicesLoading)
//     return <p className="text-center p-6">Loading service details...</p>;

//   return (
//     <Card className="border-none shadow-none">
//       <CardHeader>
//         <CardTitle>Hotel Services</CardTitle>
//       </CardHeader>
//       <CardContent>
//         {services.length > 0 ? (
//           <div className="rounded-md border">
//             <Table>
//               <TableHeader>
//                 <TableRow className="bg-muted/50 hover:bg-muted">
//                   <TableHead className="w-12"></TableHead>
//                   <TableHead>Service</TableHead>
//                   <TableHead>Type</TableHead>
//                   <TableHead>Status</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {services.map((service) => (
//                   <React.Fragment key={service.id}>
//                     <TableRow
//                       className="cursor-pointer"
//                       onClick={() => toggleRow(service.id)}
//                     >
//                       <TableCell>
//                         {expandedRows.has(service.id) ? (
//                           <ChevronDown className="h-4 w-4" />
//                         ) : (
//                           <ChevronRight className="h-4 w-4" />
//                         )}
//                       </TableCell>
//                       <TableCell className="font-medium flex items-center gap-3">
//                         <span className="bg-slate-100 p-2 rounded">
//                           {getServiceIcon(service.name)}
//                         </span>
//                         {service.name}
//                       </TableCell>
//                       <TableCell className="text-sm">
//                         {service.service_type_name}
//                       </TableCell>
//                       <TableCell>
//                         <Badge
//                           className={`${
//                             service.is_active
//                               ? "bg-green-400 text-white"
//                               : "bg-red-400"
//                           } text-xs `}
//                           variant={
//                             service.is_active ? "secondary" : "destructive"
//                           }
//                         >
//                           {service.is_active ? "Active" : "Inactive"}
//                         </Badge>
//                       </TableCell>
//                     </TableRow>
//                     {expandedRows.has(service.id) && (
//                       <TableRow className="bg-muted/20 hover:bg-muted/20">
//                         <TableCell colSpan={4} className="p-4">
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div className="space-y-2">
//                               <h4 className="font-semibold text-sm">
//                                 Full Description
//                               </h4>
//                               <div className="flex items-start">
//                                 <FileText className="h-4 w-4 mr-2 mt-1 text-muted-foreground flex-shrink-0" />
//                                 <p className="text-sm text-muted-foreground">
//                                   {service.description}
//                                 </p>
//                               </div>
//                             </div>
//                             <div className="space-y-2">
//                               <h4 className="font-semibold text-sm">Details</h4>
//                               <div className="flex items-center">
//                                 <Hash className="h-4 w-4 mr-2 text-muted-foreground" />
//                                 <span className="text-sm font-medium mr-1.5">
//                                   Scope:
//                                 </span>
//                                 <span className="text-sm font-semibold text-blue-600">
//                                   {service.service_scope_name}
//                                 </span>
//                               </div>
//                               {service.amendment && (
//                                 <div className="flex items-start">
//                                   <FileText className="h-4 w-4 mr-2 mt-1 text-muted-foreground flex-shrink-0" />
//                                   <p className="mt-1 text-xs text-gray-500 bg-slate-100 p-2 rounded-md">
//                                     <strong>Note:</strong> {service.amendment}
//                                   </p>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     )}
//                   </React.Fragment>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         ) : (
//           <EmptyState
//             title="No Services Found"
//             description="This hotel has not listed any special services yet."
//           />
//         )}
//       </CardContent>
//     </Card>
//   );
// }

// --- src/components/hotel-features/hotel-services.tsx ---
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
import type { Service } from "../../types/hotel-types";
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
import { FaRegCheckCircle } from "react-icons/fa";
import { toast } from "sonner";
import { SelectionDialog } from "./selection-dialog";

// Helper to get a specific icon based on the service name string
const getServiceIcon = (serviceName: string, sizeClass = "w-5 h-5") => {
  const name = serviceName.toLowerCase();
  if (name.includes("transport") || name.includes("shuttle"))
    return <FaRegCheckCircle className={`${sizeClass} text-slate-600`} />;
  if (name.includes("concierge") || name.includes("desk"))
    return <FaRegCheckCircle className={`${sizeClass} text-slate-600`} />;
  if (name.includes("parking") || name.includes("valet"))
    return <FaRegCheckCircle className={`${sizeClass} text-slate-600`} />;
  return <FaRegCheckCircle className={`${sizeClass} text-slate-600`} />;
};

export default function HotelServices() {
  const queryClient = useQueryClient();
  const { hotel, isLoading: isHotelLoading } = useHotel();
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // NEW: State for the selection dialog
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const hotelId = import.meta.env.VITE_HOTEL_ID;

  // Fetch details for all services associated with the hotel
  const serviceQueries = useQueries({
    queries: (hotel?.services || []).map((id) => ({
      queryKey: ["serviceDetail", id],
      queryFn: async () =>
        (await hotelClient.get(`services/${id}/`)).data as Service,
      enabled: !!hotel,
    })),
  });

  const services = serviceQueries.filter((q) => q.isSuccess).map((q) => q.data);

  // NEW: Fetch all available services
  const { data: allServices } = useQuery<Service[]>({
    queryKey: ["allServices"],
    queryFn: async () => (await hotelClient.get("services/")).data.results,
    enabled: isModalOpen,
  });

  // NEW: Mutation to update the hotel's services
  const updateHotelMutation = useMutation({
    mutationFn: (newServiceIds: string[]) =>
      hotelClient.patch(`hotels/${hotelId}/`, { services: newServiceIds }),
    onSuccess: () => {
      toast.success("Hotel services updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["hotel", hotelId] });
      setIsModalOpen(false);
    },
    onError: (error) => {
      toast.error(`Failed to update services: ${error.message}`);
    },
  });

  useEffect(() => {
    if (services.length > 0) {
      setExpandedRows(new Set(services.slice(0, 2).map((s) => s.id)));
    }
  }, [JSON.stringify(services)]);

  const toggleRow = (id: string) => {
    const newExpandedRows = new Set(expandedRows);
    newExpandedRows.has(id)
      ? newExpandedRows.delete(id)
      : newExpandedRows.add(id);
    setExpandedRows(newExpandedRows);
  };

  // NEW: Handlers for the dialog
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

  const areServicesLoading = serviceQueries.some((q) => q.isLoading);
  if (areServicesLoading)
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
          <CardTitle>Hotel Services</CardTitle>
          <Button variant="outline" onClick={handleOpenModal}>
            <Plus className="mr-2 h-4 w-4" />
            Available Services
          </Button>
        </CardHeader>
        <CardContent>
          {services.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted">
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <React.Fragment key={service.id}>
                      <TableRow
                        className="cursor-pointer"
                        onClick={() => toggleRow(service.id)}
                      >
                        <TableCell>
                          {expandedRows.has(service.id) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </TableCell>
                        <TableCell className="font-medium flex items-center gap-3">
                          <span className="bg-slate-100 p-2 rounded">
                            {getServiceIcon(service.name)}
                          </span>
                          {service.name}
                        </TableCell>
                        <TableCell className="text-sm">
                          {service.service_type_name}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${
                              service.is_active
                                ? "bg-green-400 text-white"
                                : "bg-red-400"
                            } text-xs `}
                            variant={
                              service.is_active ? "secondary" : "destructive"
                            }
                          >
                            {service.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                      {expandedRows.has(service.id) && (
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
                                    {service.description}
                                  </p>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <h4 className="font-semibold text-sm">
                                  Details
                                </h4>
                                <div className="flex items-center">
                                  <Hash className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span className="text-sm font-medium mr-1.5">
                                    Scope:
                                  </span>
                                  <span className="text-sm font-semibold text-blue-600">
                                    {service.service_scope_name}
                                  </span>
                                </div>
                                {service.amendment && (
                                  <div className="flex items-start">
                                    <FileText className="h-4 w-4 mr-2 mt-1 text-muted-foreground flex-shrink-0" />
                                    <p className="mt-1 text-xs text-gray-500 bg-slate-100 p-2 rounded-md">
                                      <strong>Note:</strong> {service.amendment}
                                    </p>
                                  </div>
                                )}
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
