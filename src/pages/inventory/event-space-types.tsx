// "use client";

// import { useState, useEffect } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import axios from "axios";
// import { format } from "date-fns";
// import { toast } from "sonner";
// import {
//   Plus,
//   Edit,
//   Trash2,
//   Loader2,
//   MoreHorizontal,
//   Loader,
// } from "lucide-react";

// // Shadcn UI Components
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
//   DialogClose,
// } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import ErrorPage from "@/components/custom/error-page";

// // Type Definitions
// interface EventSpaceType {
//   id: string;
//   name: string;
//   description: string;
//   is_active: boolean;
//   created_at: string;
//   hotel: string;
// }

// interface PaginatedEventSpaceTypesResponse {
//   count: number;
//   results: EventSpaceType[];
// }

// type EventSpaceTypeFormValues = Omit<
//   EventSpaceType,
//   "id" | "created_at" | "hotel"
// >;

// const BASE_URL = import.meta.env.VITE_HOTEL_BASE_URL;

// // API Client and Constants
// const apiClient = axios.create({
//   baseURL: BASE_URL,
// });
// const HOTEL_ID = import.meta.env.VITE_HOTEL_ID;

// // Main Component
// export default function EventSpaceTypes() {
//   const queryClient = useQueryClient();

//   // State Management
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
//   const [selectedEventSpaceType, setSelectedEventSpaceType] =
//     useState<EventSpaceType | null>(null);
//   const [deleteConfirmationInput, setDeleteConfirmationInput] = useState("");

//   // Data Fetching
//   const {
//     data: eventSpaceTypesResponse,
//     isLoading,
//     refetch,
//     isError,
//     error,
//   } = useQuery<PaginatedEventSpaceTypesResponse>({
//     queryKey: ["eventSpaceTypes", HOTEL_ID],
//     queryFn: async () => {
//       const params = new URLSearchParams({ hotel: HOTEL_ID });
//       const response = await apiClient.get(`event-space-types?${params}`);
//       return response.data;
//     },
//     enabled: !!HOTEL_ID,
//   });

//   // Data Mutations
//   const createEventSpaceTypeMutation = useMutation({
//     mutationFn: (
//       newEventSpaceType: Omit<EventSpaceTypeFormValues, "is_active"> & {
//         is_active?: boolean;
//       }
//     ) => {
//       const payload = {
//         ...newEventSpaceType,
//         hotel: HOTEL_ID,
//         is_active: true,
//       };
//       return apiClient.post("event-space-types/", payload);
//     },
//     onSuccess: () => {
//       toast.success("Event space type created successfully!");
//       queryClient.invalidateQueries({ queryKey: ["eventSpaceTypes"] });
//       setIsFormOpen(false);
//     },
//     onError: (err: any) => {
//       toast.error(
//         `Failed to create event space type: ${
//           err.response?.data?.name?.[0] || err.message
//         }`
//       );
//     },
//   });

//   const updateEventSpaceTypeMutation = useMutation({
//     mutationFn: ({
//       id,
//       updatedData,
//     }: {
//       id: string;
//       updatedData: Partial<EventSpaceTypeFormValues>;
//     }) => {
//       return apiClient.patch(`event-space-types/${id}/`, updatedData);
//     },
//     onSuccess: () => {
//       toast.success("Event space type updated successfully!");
//       queryClient.invalidateQueries({ queryKey: ["eventSpaceTypes"] });
//       setIsFormOpen(false);
//       setSelectedEventSpaceType(null);
//     },
//     onError: (err: any) => {
//       toast.error(`Failed to update event space type: ${err.message}`);
//     },
//   });

//   const deleteEventSpaceTypeMutation = useMutation({
//     mutationFn: (id: string) => {
//       return apiClient.delete(`event-space-types/${id}/`);
//     },
//     onSuccess: () => {
//       toast.success("Event space type deleted successfully!");
//       queryClient.invalidateQueries({ queryKey: ["eventSpaceTypes"] });
//       setIsDeleteConfirmOpen(false);
//       setSelectedEventSpaceType(null);
//     },
//     onError: (err: any) => {
//       toast.error(`Failed to delete event space type: ${err.message}`);
//     },
//   });

//   // Event Handlers
//   const handleOpenForm = (eventSpaceType: EventSpaceType | null = null) => {
//     setSelectedEventSpaceType(eventSpaceType);
//     setIsFormOpen(true);
//   };

//   const handleOpenDeleteConfirm = (eventSpaceType: EventSpaceType) => {
//     setSelectedEventSpaceType(eventSpaceType);
//     setDeleteConfirmationInput("");
//     setIsDeleteConfirmOpen(true);
//   };

//   const handleDelete = () => {
//     if (selectedEventSpaceType) {
//       deleteEventSpaceTypeMutation.mutate(selectedEventSpaceType.id);
//     }
//   };

//   const isDeleteButtonDisabled =
//     deleteConfirmationInput !== selectedEventSpaceType?.name;

//   return (
//     <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
//       <div className="flex items-center justify-between space-y-2">
//         <h2
//           className="text-3xl font-bold tracking-tight"
//           style={{ color: "#0A0A0A" }}
//         >
//           Event Space Types
//         </h2>
//         <Button
//           onClick={() => handleOpenForm()}
//           style={{ backgroundColor: "#155DFC" }}
//         >
//           <Plus className="mr-2 h-4 w-4" /> Add Event Space Type
//         </Button>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Manage Event Space Types</CardTitle>
//           <CardDescription>
//             Create, edit, and delete event space types for your hotel.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           {isLoading ? (
//             <div className="text-center py-4 flex items-center justify-center">
//               <Loader />
//             </div>
//           ) : isError ? (
//             <ErrorPage error={error as Error} onRetry={refetch} />
//           ) : eventSpaceTypesResponse?.results?.length ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {eventSpaceTypesResponse.results.map((eventSpaceType) => (
//                 <Card key={eventSpaceType.id} className="relative">
//                   <CardHeader>
//                     <CardTitle className="text-lg">
//                       {eventSpaceType.name}
//                     </CardTitle>
//                     <CardDescription>
//                       {eventSpaceType.description}
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-2">
//                       <div>
//                         <Badge
//                           style={{
//                             backgroundColor: eventSpaceType.is_active
//                               ? "#DCFCE6"
//                               : "#FFF085",
//                             color: eventSpaceType.is_active
//                               ? "#00A63D"
//                               : "#0A0A0A",
//                             borderColor: eventSpaceType.is_active
//                               ? "#00A63D"
//                               : "#0A0A0A",
//                           }}
//                           variant="outline"
//                         >
//                           {eventSpaceType.is_active ? "Active" : "Inactive"}
//                         </Badge>
//                       </div>
//                       <div className="text-sm text-gray-600">
//                         Created:{" "}
//                         {format(new Date(eventSpaceType.created_at), "PP")}
//                       </div>
//                     </div>
//                     <div className="absolute top-4 right-4">
//                       <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                           <Button variant="ghost" className="h-8 w-8 p-0">
//                             <span className="sr-only">Open menu</span>
//                             <MoreHorizontal className="h-4 w-4" />
//                           </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end">
//                           <DropdownMenuItem
//                             onClick={() => handleOpenForm(eventSpaceType)}
//                           >
//                             <Edit className="mr-2 h-4 w-4" /> Edit
//                           </DropdownMenuItem>
//                           <DropdownMenuItem
//                             onClick={() =>
//                               handleOpenDeleteConfirm(eventSpaceType)
//                             }
//                             className="text-red-600"
//                           >
//                             <Trash2 className="mr-2 h-4 w-4" /> Delete
//                           </DropdownMenuItem>
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-4">No event space types found.</div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Create/Edit Event Space Type Dialog */}
//       <EventSpaceTypeFormDialog
//         isOpen={isFormOpen}
//         onOpenChange={setIsFormOpen}
//         eventSpaceType={selectedEventSpaceType}
//         onSubmit={
//           selectedEventSpaceType
//             ? (data) =>
//                 updateEventSpaceTypeMutation.mutate({
//                   id: selectedEventSpaceType.id,
//                   updatedData: data,
//                 })
//             : createEventSpaceTypeMutation.mutate
//         }
//         isLoading={
//           createEventSpaceTypeMutation.isPending ||
//           updateEventSpaceTypeMutation.isPending
//         }
//       />

//       {/* Delete Confirmation Dialog */}
//       <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Are you absolutely sure?</DialogTitle>
//             <DialogDescription>
//               This action cannot be undone. This will permanently delete the
//               event space type{" "}
//               <strong style={{ color: "#0A0A0A" }}>
//                 "{selectedEventSpaceType?.name}"
//               </strong>
//               .
//             </DialogDescription>
//           </DialogHeader>
//           <div className="py-4">
//             <Label htmlFor="delete-confirm" className="text-sm font-medium">
//               Please type the event space type name to confirm:
//             </Label>
//             <Input
//               id="delete-confirm"
//               value={deleteConfirmationInput}
//               onChange={(e) => setDeleteConfirmationInput(e.target.value)}
//               className="mt-2"
//               placeholder={selectedEventSpaceType?.name}
//               autoComplete="off"
//             />
//           </div>
//           <DialogFooter>
//             <DialogClose asChild>
//               <Button variant="outline">Cancel</Button>
//             </DialogClose>
//             <Button
//               onClick={handleDelete}
//               disabled={
//                 isDeleteButtonDisabled || deleteEventSpaceTypeMutation.isPending
//               }
//               style={{ backgroundColor: "#F06367" }}
//             >
//               {deleteEventSpaceTypeMutation.isPending && (
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//               )}
//               Delete Event Space Type
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

// // Sub-component for the Create/Edit Form Dialog
// interface EventSpaceTypeFormDialogProps {
//   isOpen: boolean;
//   onOpenChange: (isOpen: boolean) => void;
//   eventSpaceType: EventSpaceType | null;
//   onSubmit: (data: EventSpaceTypeFormValues) => void;
//   isLoading: boolean;
// }

// function EventSpaceTypeFormDialog({
//   isOpen,
//   onOpenChange,
//   eventSpaceType,
//   onSubmit,
//   isLoading,
// }: EventSpaceTypeFormDialogProps) {
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");

//   useEffect(() => {
//     if (eventSpaceType) {
//       setName(eventSpaceType.name);
//       setDescription(eventSpaceType.description);
//     } else {
//       setName("");
//       setDescription("");
//     }
//   }, [eventSpaceType, isOpen]);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSubmit({
//       name,
//       description,
//       is_active: eventSpaceType?.is_active ?? true,
//     });
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onOpenChange}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>
//             {eventSpaceType
//               ? "Edit Event Space Type"
//               : "Create New Event Space Type"}
//           </DialogTitle>
//           <DialogDescription>
//             {eventSpaceType
//               ? "Update the details for this event space type."
//               : "Fill in the details for the new event space type."}
//           </DialogDescription>
//         </DialogHeader>
//         <form onSubmit={handleSubmit} className="space-y-4 py-4">
//           <div>
//             <Label htmlFor="name">Event Space Type Name</Label>
//             <Input
//               id="name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               placeholder="e.g., Banquet Hall"
//               required
//             />
//           </div>
//           <div>
//             <Label htmlFor="description">Description</Label>
//             <Textarea
//               id="description"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               placeholder="A short description of the event space type"
//             />
//           </div>
//           <DialogFooter>
//             <DialogClose asChild>
//               <Button type="button" variant="outline">
//                 Cancel
//               </Button>
//             </DialogClose>
//             <Button
//               type="submit"
//               disabled={isLoading}
//               style={{ backgroundColor: "#155DFC" }}
//             >
//               {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//               {eventSpaceType ? "Save Changes" : "Create Event Space Type"}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  MoreHorizontal,
  Loader,
} from "lucide-react";

// Shadcn UI Components
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ErrorPage from "@/components/custom/error-page";
import { useAuthStore } from "@/store/auth.store"; // ✨ Step 2: Import the Auth Store

// Type Definitions
interface EventSpaceType {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  hotel: string;
}

interface PaginatedEventSpaceTypesResponse {
  count: number;
  results: EventSpaceType[];
}

type EventSpaceTypeFormValues = Omit<
  EventSpaceType,
  "id" | "created_at" | "hotel"
>;

const BASE_URL = import.meta.env.VITE_HOTEL_BASE_URL;

// API Client and Constants
const apiClient = axios.create({
  baseURL: BASE_URL,
});
// ✨ Step 4: Remove Static ID Import (line was here)

// Main Component
export default function EventSpaceTypes() {
  const queryClient = useQueryClient();
  const { hotelId } = useAuthStore(); // ✨ Step 3: Access the Dynamic ID

  // State Management
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedEventSpaceType, setSelectedEventSpaceType] =
    useState<EventSpaceType | null>(null);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState("");

  // Data Fetching
  const {
    data: eventSpaceTypesResponse,
    isLoading,
    refetch,
    isError,
    error,
  } = useQuery<PaginatedEventSpaceTypesResponse>({
    queryKey: ["eventSpaceTypes", hotelId], // ✨ Step 6: Update queryKey
    queryFn: async () => {
      const params = new URLSearchParams({ hotel: hotelId! }); // ✨ Step 5: Update API parameter
      const response = await apiClient.get(`event-space-types?${params}`);
      return response.data;
    },
    enabled: !!hotelId, // ✨ Step 6: Update enabled check
  });

  // Data Mutations
  const createEventSpaceTypeMutation = useMutation({
    mutationFn: (
      newEventSpaceType: Omit<EventSpaceTypeFormValues, "is_active"> & {
        is_active?: boolean;
      }
    ) => {
      const payload = {
        ...newEventSpaceType,
        hotel: hotelId!, // ✨ Step 5: Update API parameter
        is_active: true,
      };
      return apiClient.post("event-space-types/", payload);
    },
    onSuccess: () => {
      toast.success("Event space type created successfully!");
      queryClient.invalidateQueries({ queryKey: ["eventSpaceTypes"] });
      setIsFormOpen(false);
    },
    onError: (err: any) => {
      toast.error(
        `Failed to create event space type: ${
          err.response?.data?.name?.[0] || err.message
        }`
      );
    },
  });

  const updateEventSpaceTypeMutation = useMutation({
    mutationFn: ({
      id,
      updatedData,
    }: {
      id: string;
      updatedData: Partial<EventSpaceTypeFormValues>;
    }) => {
      return apiClient.patch(`event-space-types/${id}/`, updatedData);
    },
    onSuccess: () => {
      toast.success("Event space type updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["eventSpaceTypes"] });
      setIsFormOpen(false);
      setSelectedEventSpaceType(null);
    },
    onError: (err: any) => {
      toast.error(`Failed to update event space type: ${err.message}`);
    },
  });

  const deleteEventSpaceTypeMutation = useMutation({
    mutationFn: (id: string) => {
      return apiClient.delete(`event-space-types/${id}/`);
    },
    onSuccess: () => {
      toast.success("Event space type deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["eventSpaceTypes"] });
      setIsDeleteConfirmOpen(false);
      setSelectedEventSpaceType(null);
    },
    onError: (err: any) => {
      toast.error(`Failed to delete event space type: ${err.message}`);
    },
  });

  // Event Handlers
  const handleOpenForm = (eventSpaceType: EventSpaceType | null = null) => {
    setSelectedEventSpaceType(eventSpaceType);
    setIsFormOpen(true);
  };

  const handleOpenDeleteConfirm = (eventSpaceType: EventSpaceType) => {
    setSelectedEventSpaceType(eventSpaceType);
    setDeleteConfirmationInput("");
    setIsDeleteConfirmOpen(true);
  };

  const handleDelete = () => {
    if (selectedEventSpaceType) {
      deleteEventSpaceTypeMutation.mutate(selectedEventSpaceType.id);
    }
  };

  const isDeleteButtonDisabled =
    deleteConfirmationInput !== selectedEventSpaceType?.name;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2
          className="text-3xl font-bold tracking-tight"
          style={{ color: "#0A0A0A" }}
        >
          Event Space Types
        </h2>
        <Button
          onClick={() => handleOpenForm()}
          style={{ backgroundColor: "#155DFC" }}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Event Space Type
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Event Space Types</CardTitle>
          <CardDescription>
            Create, edit, and delete event space types for your hotel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4 flex items-center justify-center">
              <Loader />
            </div>
          ) : isError ? (
            <ErrorPage error={error as Error} onRetry={refetch} />
          ) : eventSpaceTypesResponse?.results?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {eventSpaceTypesResponse.results.map((eventSpaceType) => (
                <Card key={eventSpaceType.id} className="relative">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {eventSpaceType.name}
                    </CardTitle>
                    <CardDescription>
                      {eventSpaceType.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <Badge
                          style={{
                            backgroundColor: eventSpaceType.is_active
                              ? "#DCFCE6"
                              : "#FFF085",
                            color: eventSpaceType.is_active
                              ? "#00A63D"
                              : "#0A0A0A",
                            borderColor: eventSpaceType.is_active
                              ? "#00A63D"
                              : "#0A0A0A",
                          }}
                          variant="outline"
                        >
                          {eventSpaceType.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        Created:{" "}
                        {format(new Date(eventSpaceType.created_at), "PP")}
                      </div>
                    </div>
                    <div className="absolute top-4 right-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleOpenForm(eventSpaceType)}
                          >
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleOpenDeleteConfirm(eventSpaceType)
                            }
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">No event space types found.</div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Event Space Type Dialog */}
      <EventSpaceTypeFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        eventSpaceType={selectedEventSpaceType}
        onSubmit={
          selectedEventSpaceType
            ? (data) =>
                updateEventSpaceTypeMutation.mutate({
                  id: selectedEventSpaceType.id,
                  updatedData: data,
                })
            : createEventSpaceTypeMutation.mutate
        }
        isLoading={
          createEventSpaceTypeMutation.isPending ||
          updateEventSpaceTypeMutation.isPending
        }
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              event space type{" "}
              <strong style={{ color: "#0A0A0A" }}>
                "{selectedEventSpaceType?.name}"
              </strong>
              .
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="delete-confirm" className="text-sm font-medium">
              Please type the event space type name to confirm:
            </Label>
            <Input
              id="delete-confirm"
              value={deleteConfirmationInput}
              onChange={(e) => setDeleteConfirmationInput(e.target.value)}
              className="mt-2"
              placeholder={selectedEventSpaceType?.name}
              autoComplete="off"
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={handleDelete}
              disabled={
                isDeleteButtonDisabled || deleteEventSpaceTypeMutation.isPending
              }
              style={{ backgroundColor: "#F06367" }}
            >
              {deleteEventSpaceTypeMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete Event Space Type
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Sub-component for the Create/Edit Form Dialog
interface EventSpaceTypeFormDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  eventSpaceType: EventSpaceType | null;
  onSubmit: (data: EventSpaceTypeFormValues) => void;
  isLoading: boolean;
}

function EventSpaceTypeFormDialog({
  isOpen,
  onOpenChange,
  eventSpaceType,
  onSubmit,
  isLoading,
}: EventSpaceTypeFormDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (eventSpaceType) {
      setName(eventSpaceType.name);
      setDescription(eventSpaceType.description);
    } else {
      setName("");
      setDescription("");
    }
  }, [eventSpaceType, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      description,
      is_active: eventSpaceType?.is_active ?? true,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {eventSpaceType
              ? "Edit Event Space Type"
              : "Create New Event Space Type"}
          </DialogTitle>
          <DialogDescription>
            {eventSpaceType
              ? "Update the details for this event space type."
              : "Fill in the details for the new event space type."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div>
            <Label htmlFor="name">Event Space Type Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Banquet Hall"
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A short description of the event space type"
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isLoading}
              style={{ backgroundColor: "#155DFC" }}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {eventSpaceType ? "Save Changes" : "Create Event Space Type"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
