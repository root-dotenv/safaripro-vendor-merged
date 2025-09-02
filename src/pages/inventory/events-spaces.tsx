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
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
// } from "@/components/ui/command";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { Check, ChevronsUpDown } from "lucide-react";
// import ErrorPage from "@/components/custom/error-page";

// // Type Definitions
// interface Amenity {
//   id: string;
//   name: string;
//   description: string;
// }

// interface EventSpaceType {
//   id: string;
//   name: string;
// }

// interface EventSpace {
//   id: string;
//   name: string;
//   code: string;
//   description: string;
//   capacity: number;
//   size_sqm: number | null;
//   floor: string | null;
//   hourly_rate: number | null;
//   event_space_type: string;
//   hotel: string;
//   amenities: string[];
//   created_at: string;
//   is_active: boolean;
// }

// interface PaginatedEventSpacesResponse {
//   count: number;
//   results: EventSpace[];
// }

// interface PaginatedAmenitiesResponse {
//   count: number;
//   results: Amenity[];
// }

// interface PaginatedEventSpaceTypesResponse {
//   count: number;
//   results: EventSpaceType[];
// }

// type EventSpaceFormValues = Omit<
//   EventSpace,
//   "id" | "created_at" | "hotel" | "is_active"
// > & { is_active?: boolean };

// const BASE_URL = import.meta.env.VITE_HOTEL_BASE_URL;

// // API Client and Constants
// const apiClient = axios.create({
//   baseURL: BASE_URL,
// });
// const HOTEL_ID = import.meta.env.VITE_HOTEL_ID;

// // Main Component
// export default function EventSpaces() {
//   const queryClient = useQueryClient();

//   // State Management
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
//   const [selectedEventSpace, setSelectedEventSpace] =
//     useState<EventSpace | null>(null);
//   const [deleteConfirmationInput, setDeleteConfirmationInput] = useState("");

//   // Data Fetching
//   const {
//     data: eventSpacesResponse,
//     isLoading,
//     refetch,
//     isError,
//     error,
//   } = useQuery<PaginatedEventSpacesResponse>({
//     queryKey: ["eventSpaces", HOTEL_ID],
//     queryFn: async () => {
//       const params = new URLSearchParams({ hotel: HOTEL_ID });
//       const response = await apiClient.get(`event-spaces?${params}`);
//       return response.data;
//     },
//     enabled: !!HOTEL_ID,
//   });

//   const { data: amenitiesResponse } = useQuery<PaginatedAmenitiesResponse>({
//     queryKey: ["amenities"],
//     queryFn: async () => {
//       const response = await apiClient.get("amenities/");
//       return response.data;
//     },
//   });

//   const { data: eventSpaceTypesResponse } =
//     useQuery<PaginatedEventSpaceTypesResponse>({
//       queryKey: ["eventSpaceTypes", HOTEL_ID],
//       queryFn: async () => {
//         const params = new URLSearchParams({ hotel: HOTEL_ID });
//         const response = await apiClient.get(`event-space-types?${params}`);
//         return response.data;
//       },
//       enabled: !!HOTEL_ID,
//     });

//   // Data Mutations
//   const createEventSpaceMutation = useMutation({
//     mutationFn: (newEventSpace: EventSpaceFormValues) => {
//       const payload = {
//         ...newEventSpace,
//         hotel: HOTEL_ID,
//         is_active: true,
//         size_sqm: newEventSpace.size_sqm
//           ? Number(newEventSpace.size_sqm)
//           : null,
//         hourly_rate: newEventSpace.hourly_rate
//           ? Number(newEventSpace.hourly_rate)
//           : null,
//       };
//       return apiClient.post("event-spaces/", payload);
//     },
//     onSuccess: () => {
//       toast.success("Event space created successfully!");
//       queryClient.invalidateQueries({ queryKey: ["eventSpaces"] });
//       setIsFormOpen(false);
//     },
//     onError: (err: any) => {
//       toast.error(
//         `Failed to create event space: ${
//           err.response?.data?.name?.[0] || err.message
//         }`
//       );
//     },
//   });

//   const updateEventSpaceMutation = useMutation({
//     mutationFn: ({
//       id,
//       updatedData,
//     }: {
//       id: string;
//       updatedData: Partial<EventSpaceFormValues>;
//     }) => {
//       const payload = {
//         ...updatedData,
//         size_sqm: updatedData.size_sqm ? Number(updatedData.size_sqm) : null,
//         hourly_rate: updatedData.hourly_rate
//           ? Number(updatedData.hourly_rate)
//           : null,
//       };
//       return apiClient.patch(`event-spaces/${id}/`, payload);
//     },
//     onSuccess: () => {
//       toast.success("Event space updated successfully!");
//       queryClient.invalidateQueries({ queryKey: ["eventSpaces"] });
//       setIsFormOpen(false);
//       setSelectedEventSpace(null);
//     },
//     onError: (err: any) => {
//       toast.error(`Failed to update event space: ${err.message}`);
//     },
//   });

//   const deleteEventSpaceMutation = useMutation({
//     mutationFn: (id: string) => {
//       return apiClient.delete(`event-spaces/${id}/`);
//     },
//     onSuccess: () => {
//       toast.success("Event space deleted successfully!");
//       queryClient.invalidateQueries({ queryKey: ["eventSpaces"] });
//       setIsDeleteConfirmOpen(false);
//       setSelectedEventSpace(null);
//     },
//     onError: (err: any) => {
//       toast.error(`Failed to delete event space: ${err.message}`);
//     },
//   });

//   // Event Handlers
//   const handleOpenForm = (eventSpace: EventSpace | null = null) => {
//     setSelectedEventSpace(eventSpace);
//     setIsFormOpen(true);
//   };

//   const handleOpenDeleteConfirm = (eventSpace: EventSpace) => {
//     setSelectedEventSpace(eventSpace);
//     setDeleteConfirmationInput("");
//     setIsDeleteConfirmOpen(true);
//   };

//   const handleDelete = () => {
//     if (selectedEventSpace) {
//       deleteEventSpaceMutation.mutate(selectedEventSpace.id);
//     }
//   };

//   const isDeleteButtonDisabled =
//     deleteConfirmationInput !== selectedEventSpace?.name;

//   return (
//     <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
//       <div className="flex items-center justify-between space-y-2">
//         <h2
//           className="text-3xl font-bold tracking-tight"
//           style={{ color: "#0A0A0A" }}
//         >
//           Event Spaces
//         </h2>
//         <Button
//           onClick={() => handleOpenForm()}
//           className="bg-[#FFFFFD] border-[1.25px] border-[#E7E5E4] text-[#19191A] shadow hover:bg-none hover:shadow-none hover:border-none"
//         >
//           <Plus className="mr-1 h-4 w-4" /> Add Event Space
//         </Button>
//       </div>

//       <Card className="bg-none shadow-none border-none">
//         <CardHeader>
//           <CardTitle>Manage Event Spaces</CardTitle>
//           <CardDescription>
//             Create, edit, and delete event spaces for your hotel.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           {isLoading ? (
//             <div className="text-center w-full flex items-center justify-center py-4">
//               <Loader />
//             </div>
//           ) : isError ? (
//             <ErrorPage error={error as Error} onRetry={refetch} />
//           ) : eventSpacesResponse?.results?.length ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {eventSpacesResponse.results.map((eventSpace) => (
//                 <Card key={eventSpace.id} className="relative">
//                   <CardHeader>
//                     <CardTitle className="text-lg">{eventSpace.name}</CardTitle>
//                     <CardDescription>{eventSpace.description}</CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-2">
//                       <div>
//                         <Badge
//                           style={{
//                             backgroundColor: eventSpace.is_active
//                               ? "#DCFCE6"
//                               : "#FFF085",
//                             color: eventSpace.is_active ? "#00A63D" : "#0A0A0A",
//                             borderColor: eventSpace.is_active
//                               ? "#00A63D"
//                               : "#0A0A0A",
//                           }}
//                           variant="outline"
//                         >
//                           {eventSpace.is_active ? "Active" : "Inactive"}
//                         </Badge>
//                       </div>
//                       <div className="text-sm text-gray-600">
//                         Code: {eventSpace.code}
//                       </div>
//                       <div className="text-sm text-gray-600">
//                         Capacity: {eventSpace.capacity}
//                       </div>
//                       {eventSpace.size_sqm && (
//                         <div className="text-sm text-gray-600">
//                           Size: {eventSpace.size_sqm} sqm
//                         </div>
//                       )}
//                       {eventSpace.floor && (
//                         <div className="text-sm text-gray-600">
//                           Floor: {eventSpace.floor}
//                         </div>
//                       )}
//                       {eventSpace.hourly_rate && (
//                         <div className="text-sm text-gray-600">
//                           Hourly Rate: ${eventSpace.hourly_rate}
//                         </div>
//                       )}
//                       <div className="text-sm text-gray-600">
//                         Event Space Type:{" "}
//                         {eventSpaceTypesResponse?.results.find(
//                           (type) => type.id === eventSpace.event_space_type
//                         )?.name || "N/A"}
//                       </div>
//                       {eventSpace.amenities.length > 0 && (
//                         <div className="text-sm text-gray-600">
//                           Amenities:{" "}
//                           {eventSpace.amenities
//                             .map(
//                               (id) =>
//                                 amenitiesResponse?.results.find(
//                                   (a) => a.id === id
//                                 )?.name
//                             )
//                             .filter(Boolean)
//                             .join(", ") || "None"}
//                         </div>
//                       )}
//                       <div className="text-sm text-gray-600">
//                         Created: {format(new Date(eventSpace.created_at), "PP")}
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
//                             onClick={() => handleOpenForm(eventSpace)}
//                           >
//                             <Edit className="mr-2 h-4 w-4" /> Edit
//                           </DropdownMenuItem>
//                           <DropdownMenuItem
//                             onClick={() => handleOpenDeleteConfirm(eventSpace)}
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
//             <div className="text-center py-4">No event spaces found.</div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Create/Edit Event Space Dialog */}
//       <EventSpaceFormDialog
//         isOpen={isFormOpen}
//         onOpenChange={setIsFormOpen}
//         eventSpace={selectedEventSpace}
//         onSubmit={
//           selectedEventSpace
//             ? (data) =>
//                 updateEventSpaceMutation.mutate({
//                   id: selectedEventSpace.id,
//                   updatedData: data,
//                 })
//             : createEventSpaceMutation.mutate
//         }
//         isLoading={
//           createEventSpaceMutation.isPending ||
//           updateEventSpaceMutation.isPending
//         }
//         amenities={amenitiesResponse?.results || []}
//         eventSpaceTypes={eventSpaceTypesResponse?.results || []}
//       />

//       {/* Delete Confirmation Dialog */}
//       <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Are you absolutely sure?</DialogTitle>
//             <DialogDescription>
//               This action cannot be undone. This will permanently delete the
//               event space{" "}
//               <strong style={{ color: "#0A0A0A" }}>
//                 "{selectedEventSpace?.name}"
//               </strong>
//               .
//             </DialogDescription>
//           </DialogHeader>
//           <div className="py-4">
//             <Label htmlFor="delete-confirm" className="text-sm font-medium">
//               Please type the event space name to confirm:
//             </Label>
//             <Input
//               id="delete-confirm"
//               value={deleteConfirmationInput}
//               onChange={(e) => setDeleteConfirmationInput(e.target.value)}
//               className="mt-2"
//               placeholder={selectedEventSpace?.name}
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
//                 isDeleteButtonDisabled || deleteEventSpaceMutation.isPending
//               }
//               style={{ backgroundColor: "#F06367" }}
//             >
//               {deleteEventSpaceMutation.isPending && (
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//               )}
//               Delete Event Space
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

// // Sub-component for the Create/Edit Form Dialog
// interface EventSpaceFormDialogProps {
//   isOpen: boolean;
//   onOpenChange: (isOpen: boolean) => void;
//   eventSpace: EventSpace | null;
//   onSubmit: (data: EventSpaceFormValues) => void;
//   isLoading: boolean;
//   amenities: Amenity[];
//   eventSpaceTypes: EventSpaceType[];
// }

// function EventSpaceFormDialog({
//   isOpen,
//   onOpenChange,
//   eventSpace,
//   onSubmit,
//   isLoading,
//   amenities,
//   eventSpaceTypes,
// }: EventSpaceFormDialogProps) {
//   const [name, setName] = useState("");
//   const [code, setCode] = useState("");
//   const [description, setDescription] = useState("");
//   const [capacity, setCapacity] = useState("");
//   const [sizeSqm, setSizeSqm] = useState("");
//   const [floor, setFloor] = useState("");
//   const [hourlyRate, setHourlyRate] = useState("");
//   const [eventSpaceType, setEventSpaceType] = useState("");
//   const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
//   const [openAmenities, setOpenAmenities] = useState(false);

//   useEffect(() => {
//     if (eventSpace) {
//       setName(eventSpace.name);
//       setCode(eventSpace.code);
//       setDescription(eventSpace.description);
//       setCapacity(eventSpace.capacity.toString());
//       setSizeSqm(eventSpace.size_sqm?.toString() || "");
//       setFloor(eventSpace.floor || "");
//       setHourlyRate(eventSpace.hourly_rate?.toString() || "");
//       setEventSpaceType(eventSpace.event_space_type);
//       setSelectedAmenities(eventSpace.amenities);
//     } else {
//       setName("");
//       setCode("");
//       setDescription("");
//       setCapacity("");
//       setSizeSqm("");
//       setFloor("");
//       setHourlyRate("");
//       setEventSpaceType("");
//       setSelectedAmenities([]);
//     }
//   }, [eventSpace, isOpen]);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSubmit({
//       name,
//       code,
//       description,
//       capacity: Number(capacity),
//       size_sqm: sizeSqm ? Number(sizeSqm) : null,
//       floor: floor || null,
//       hourly_rate: hourlyRate ? Number(hourlyRate) : null,
//       event_space_type: eventSpaceType,
//       amenities: selectedAmenities,
//       is_active: eventSpace?.is_active ?? true,
//     });
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onOpenChange}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>
//             {eventSpace ? "Edit Event Space" : "Create New Event Space"}
//           </DialogTitle>
//           <DialogDescription>
//             {eventSpace
//               ? "Update the details for this event space."
//               : "Fill in the details for the new event space."}
//           </DialogDescription>
//         </DialogHeader>
//         <form onSubmit={handleSubmit} className="space-y-4 py-4">
//           <div>
//             <Label htmlFor="name">Event Space Name</Label>
//             <Input
//               id="name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               placeholder="e.g., Grand Coral Ballroom"
//               required
//             />
//           </div>
//           <div>
//             <Label htmlFor="code">Code</Label>
//             <Input
//               id="code"
//               value={code}
//               onChange={(e) => setCode(e.target.value)}
//               placeholder="e.g., GCB-01"
//               required
//             />
//           </div>
//           <div>
//             <Label htmlFor="description">Description</Label>
//             <Textarea
//               id="description"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               placeholder="A short description of the event space"
//             />
//           </div>
//           <div>
//             <Label htmlFor="capacity">Capacity</Label>
//             <Input
//               id="capacity"
//               type="number"
//               value={capacity}
//               onChange={(e) => setCapacity(e.target.value)}
//               placeholder="e.g., 500"
//               required
//             />
//           </div>
//           <div>
//             <Label htmlFor="size_sqm">Size (sqm)</Label>
//             <Input
//               id="size_sqm"
//               type="number"
//               value={sizeSqm}
//               onChange={(e) => setSizeSqm(e.target.value)}
//               placeholder="e.g., 320"
//             />
//           </div>
//           <div>
//             <Label htmlFor="floor">Floor</Label>
//             <Input
//               id="floor"
//               value={floor}
//               onChange={(e) => setFloor(e.target.value)}
//               placeholder="e.g., 2"
//             />
//           </div>
//           <div>
//             <Label htmlFor="hourly_rate">Hourly Rate</Label>
//             <Input
//               id="hourly_rate"
//               type="number"
//               value={hourlyRate}
//               onChange={(e) => setHourlyRate(e.target.value)}
//               placeholder="e.g., 500"
//             />
//           </div>
//           <div>
//             <Label htmlFor="event_space_type">Event Space Type</Label>
//             <Select value={eventSpaceType} onValueChange={setEventSpaceType}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Select event space type" />
//               </SelectTrigger>
//               <SelectContent>
//                 {eventSpaceTypes.map((type) => (
//                   <SelectItem key={type.id} value={type.id}>
//                     {type.name}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//           <div>
//             <Label htmlFor="amenities">Amenities</Label>
//             <Popover open={openAmenities} onOpenChange={setOpenAmenities}>
//               <PopoverTrigger asChild>
//                 <Button
//                   variant="outline"
//                   role="combobox"
//                   aria-expanded={openAmenities}
//                   className="w-full justify-between"
//                 >
//                   {selectedAmenities.length > 0
//                     ? selectedAmenities
//                         .map((id) => amenities.find((a) => a.id === id)?.name)
//                         .filter(Boolean)
//                         .join(", ")
//                     : "Select amenities..."}
//                   <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                 </Button>
//               </PopoverTrigger>
//               <PopoverContent className="w-full p-0">
//                 <Command>
//                   <CommandInput placeholder="Search amenities..." />
//                   <CommandEmpty>No amenities found.</CommandEmpty>
//                   <CommandGroup>
//                     {amenities.map((amenity) => (
//                       <CommandItem
//                         key={amenity.id}
//                         value={amenity.name}
//                         onSelect={() => {
//                           setSelectedAmenities((prev) =>
//                             prev.includes(amenity.id)
//                               ? prev.filter((id) => id !== amenity.id)
//                               : [...prev, amenity.id]
//                           );
//                         }}
//                       >
//                         <Check
//                           className={`mr-2 h-4 w-4 ${
//                             selectedAmenities.includes(amenity.id)
//                               ? "opacity-100"
//                               : "opacity-0"
//                           }`}
//                         />
//                         {amenity.name}
//                       </CommandItem>
//                     ))}
//                   </CommandGroup>
//                 </Command>
//               </PopoverContent>
//             </Popover>
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
//               {eventSpace ? "Save Changes" : "Create Event Space"}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }

"use client";
import { useState, useMemo, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import ErrorPage from "@/components/custom/error-page";
import { useAuthStore } from "@/store/auth.store"; // ✨ Step 2: Import the Auth Store

// Type Definitions
interface Amenity {
  id: string;
  name: string;
  description: string;
}

interface EventSpaceType {
  id: string;
  name: string;
}

interface EventSpace {
  id: string;
  name: string;
  code: string;
  description: string;
  capacity: number;
  size_sqm: number | null;
  floor: string | null;
  hourly_rate: number | null;
  event_space_type: string;
  hotel: string;
  amenities: string[];
  created_at: string;
  is_active: boolean;
}

interface PaginatedEventSpacesResponse {
  count: number;
  results: EventSpace[];
}

interface PaginatedAmenitiesResponse {
  count: number;
  results: Amenity[];
}

interface PaginatedEventSpaceTypesResponse {
  count: number;
  results: EventSpaceType[];
}

type EventSpaceFormValues = Omit<
  EventSpace,
  "id" | "created_at" | "hotel" | "is_active"
> & { is_active?: boolean };

const BASE_URL = import.meta.env.VITE_HOTEL_BASE_URL;

// API Client and Constants
const apiClient = axios.create({
  baseURL: BASE_URL,
});
// ✨ Step 4: Remove Static ID Import (line was here)

// Main Component
export default function EventSpaces() {
  const queryClient = useQueryClient();
  const { hotelId } = useAuthStore(); // ✨ Step 3: Access the Dynamic ID

  // State Management
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedEventSpace, setSelectedEventSpace] =
    useState<EventSpace | null>(null);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState("");

  // Data Fetching
  const {
    data: eventSpacesResponse,
    isLoading,
    refetch,
    isError,
    error,
  } = useQuery<PaginatedEventSpacesResponse>({
    queryKey: ["eventSpaces", hotelId], // ✨ Step 6: Update queryKey
    queryFn: async () => {
      const params = new URLSearchParams({ hotel: hotelId! }); // ✨ Step 5: Update API parameter
      const response = await apiClient.get(`event-spaces?${params}`);
      return response.data;
    },
    enabled: !!hotelId, // ✨ Step 6: Update enabled check
  });

  const { data: amenitiesResponse } = useQuery<PaginatedAmenitiesResponse>({
    queryKey: ["amenities"],
    queryFn: async () => {
      const response = await apiClient.get("amenities/");
      return response.data;
    },
  });

  const { data: eventSpaceTypesResponse } =
    useQuery<PaginatedEventSpaceTypesResponse>({
      queryKey: ["eventSpaceTypes", hotelId], // ✨ Step 6: Update queryKey
      queryFn: async () => {
        const params = new URLSearchParams({ hotel: hotelId! }); // ✨ Step 5: Update API parameter
        const response = await apiClient.get(`event-space-types?${params}`);
        return response.data;
      },
      enabled: !!hotelId, // ✨ Step 6: Update enabled check
    });

  // Data Mutations
  const createEventSpaceMutation = useMutation({
    mutationFn: (newEventSpace: EventSpaceFormValues) => {
      const payload = {
        ...newEventSpace,
        hotel: hotelId!, // ✨ Step 5: Update API parameter
        is_active: true,
        size_sqm: newEventSpace.size_sqm
          ? Number(newEventSpace.size_sqm)
          : null,
        hourly_rate: newEventSpace.hourly_rate
          ? Number(newEventSpace.hourly_rate)
          : null,
      };
      return apiClient.post("event-spaces/", payload);
    },
    onSuccess: () => {
      toast.success("Event space created successfully!");
      queryClient.invalidateQueries({ queryKey: ["eventSpaces"] });
      setIsFormOpen(false);
    },
    onError: (err: any) => {
      toast.error(
        `Failed to create event space: ${
          err.response?.data?.name?.[0] || err.message
        }`
      );
    },
  });

  const updateEventSpaceMutation = useMutation({
    mutationFn: ({
      id,
      updatedData,
    }: {
      id: string;
      updatedData: Partial<EventSpaceFormValues>;
    }) => {
      const payload = {
        ...updatedData,
        size_sqm: updatedData.size_sqm ? Number(updatedData.size_sqm) : null,
        hourly_rate: updatedData.hourly_rate
          ? Number(updatedData.hourly_rate)
          : null,
      };
      return apiClient.patch(`event-spaces/${id}/`, payload);
    },
    onSuccess: () => {
      toast.success("Event space updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["eventSpaces"] });
      setIsFormOpen(false);
      setSelectedEventSpace(null);
    },
    onError: (err: any) => {
      toast.error(`Failed to update event space: ${err.message}`);
    },
  });

  const deleteEventSpaceMutation = useMutation({
    mutationFn: (id: string) => {
      return apiClient.delete(`event-spaces/${id}/`);
    },
    onSuccess: () => {
      toast.success("Event space deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["eventSpaces"] });
      setIsDeleteConfirmOpen(false);
      setSelectedEventSpace(null);
    },
    onError: (err: any) => {
      toast.error(`Failed to delete event space: ${err.message}`);
    },
  });

  // Event Handlers
  const handleOpenForm = (eventSpace: EventSpace | null = null) => {
    setSelectedEventSpace(eventSpace);
    setIsFormOpen(true);
  };

  const handleOpenDeleteConfirm = (eventSpace: EventSpace) => {
    setSelectedEventSpace(eventSpace);
    setDeleteConfirmationInput("");
    setIsDeleteConfirmOpen(true);
  };

  const handleDelete = () => {
    if (selectedEventSpace) {
      deleteEventSpaceMutation.mutate(selectedEventSpace.id);
    }
  };

  const isDeleteButtonDisabled =
    deleteConfirmationInput !== selectedEventSpace?.name;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2
          className="text-3xl font-bold tracking-tight"
          style={{ color: "#0A0A0A" }}
        >
          Event Spaces
        </h2>
        <Button
          onClick={() => handleOpenForm()}
          className="bg-[#FFFFFD] border-[1.25px] border-[#E7E5E4] text-[#19191A] shadow hover:bg-none hover:shadow-none hover:border-none"
        >
          <Plus className="mr-1 h-4 w-4" /> Add Event Space
        </Button>
      </div>

      <Card className="bg-none shadow-none border-none">
        <CardHeader>
          <CardTitle>Manage Event Spaces</CardTitle>
          <CardDescription>
            Create, edit, and delete event spaces for your hotel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center w-full flex items-center justify-center py-4">
              <Loader />
            </div>
          ) : isError ? (
            <ErrorPage error={error as Error} onRetry={refetch} />
          ) : eventSpacesResponse?.results?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {eventSpacesResponse.results.map((eventSpace) => (
                <Card key={eventSpace.id} className="relative">
                  <CardHeader>
                    <CardTitle className="text-lg">{eventSpace.name}</CardTitle>
                    <CardDescription>{eventSpace.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <Badge
                          style={{
                            backgroundColor: eventSpace.is_active
                              ? "#DCFCE6"
                              : "#FFF085",
                            color: eventSpace.is_active ? "#00A63D" : "#0A0A0A",
                            borderColor: eventSpace.is_active
                              ? "#00A63D"
                              : "#0A0A0A",
                          }}
                          variant="outline"
                        >
                          {eventSpace.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        Code: {eventSpace.code}
                      </div>
                      <div className="text-sm text-gray-600">
                        Capacity: {eventSpace.capacity}
                      </div>
                      {eventSpace.size_sqm && (
                        <div className="text-sm text-gray-600">
                          Size: {eventSpace.size_sqm} sqm
                        </div>
                      )}
                      {eventSpace.floor && (
                        <div className="text-sm text-gray-600">
                          Floor: {eventSpace.floor}
                        </div>
                      )}
                      {eventSpace.hourly_rate && (
                        <div className="text-sm text-gray-600">
                          Hourly Rate: ${eventSpace.hourly_rate}
                        </div>
                      )}
                      <div className="text-sm text-gray-600">
                        Event Space Type:{" "}
                        {eventSpaceTypesResponse?.results.find(
                          (type) => type.id === eventSpace.event_space_type
                        )?.name || "N/A"}
                      </div>
                      {eventSpace.amenities.length > 0 && (
                        <div className="text-sm text-gray-600">
                          Amenities:{" "}
                          {eventSpace.amenities
                            .map(
                              (id) =>
                                amenitiesResponse?.results.find(
                                  (a) => a.id === id
                                )?.name
                            )
                            .filter(Boolean)
                            .join(", ") || "None"}
                        </div>
                      )}
                      <div className="text-sm text-gray-600">
                        Created: {format(new Date(eventSpace.created_at), "PP")}
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
                            onClick={() => handleOpenForm(eventSpace)}
                          >
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleOpenDeleteConfirm(eventSpace)}
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
            <div className="text-center py-4">No event spaces found.</div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Event Space Dialog */}
      <EventSpaceFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        eventSpace={selectedEventSpace}
        onSubmit={
          selectedEventSpace
            ? (data) =>
                updateEventSpaceMutation.mutate({
                  id: selectedEventSpace.id,
                  updatedData: data,
                })
            : createEventSpaceMutation.mutate
        }
        isLoading={
          createEventSpaceMutation.isPending ||
          updateEventSpaceMutation.isPending
        }
        amenities={amenitiesResponse?.results || []}
        eventSpaceTypes={eventSpaceTypesResponse?.results || []}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              event space{" "}
              <strong style={{ color: "#0A0A0A" }}>
                "{selectedEventSpace?.name}"
              </strong>
              .
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="delete-confirm" className="text-sm font-medium">
              Please type the event space name to confirm:
            </Label>
            <Input
              id="delete-confirm"
              value={deleteConfirmationInput}
              onChange={(e) => setDeleteConfirmationInput(e.target.value)}
              className="mt-2"
              placeholder={selectedEventSpace?.name}
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
                isDeleteButtonDisabled || deleteEventSpaceMutation.isPending
              }
              style={{ backgroundColor: "#F06367" }}
            >
              {deleteEventSpaceMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete Event Space
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Sub-component for the Create/Edit Form Dialog
interface EventSpaceFormDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  eventSpace: EventSpace | null;
  onSubmit: (data: EventSpaceFormValues) => void;
  isLoading: boolean;
  amenities: Amenity[];
  eventSpaceTypes: EventSpaceType[];
}

function EventSpaceFormDialog({
  isOpen,
  onOpenChange,
  eventSpace,
  onSubmit,
  isLoading,
  amenities,
  eventSpaceTypes,
}: EventSpaceFormDialogProps) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState("");
  const [sizeSqm, setSizeSqm] = useState("");
  const [floor, setFloor] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [eventSpaceType, setEventSpaceType] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [openAmenities, setOpenAmenities] = useState(false);

  useEffect(() => {
    if (eventSpace) {
      setName(eventSpace.name);
      setCode(eventSpace.code);
      setDescription(eventSpace.description);
      setCapacity(eventSpace.capacity.toString());
      setSizeSqm(eventSpace.size_sqm?.toString() || "");
      setFloor(eventSpace.floor || "");
      setHourlyRate(eventSpace.hourly_rate?.toString() || "");
      setEventSpaceType(eventSpace.event_space_type);
      setSelectedAmenities(eventSpace.amenities);
    } else {
      setName("");
      setCode("");
      setDescription("");
      setCapacity("");
      setSizeSqm("");
      setFloor("");
      setHourlyRate("");
      setEventSpaceType("");
      setSelectedAmenities([]);
    }
  }, [eventSpace, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      code,
      description,
      capacity: Number(capacity),
      size_sqm: sizeSqm ? Number(sizeSqm) : null,
      floor: floor || null,
      hourly_rate: hourlyRate ? Number(hourlyRate) : null,
      event_space_type: eventSpaceType,
      amenities: selectedAmenities,
      is_active: eventSpace?.is_active ?? true,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {eventSpace ? "Edit Event Space" : "Create New Event Space"}
          </DialogTitle>
          <DialogDescription>
            {eventSpace
              ? "Update the details for this event space."
              : "Fill in the details for the new event space."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div>
            <Label htmlFor="name">Event Space Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Grand Coral Ballroom"
              required
            />
          </div>
          <div>
            <Label htmlFor="code">Code</Label>
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g., GCB-01"
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A short description of the event space"
            />
          </div>
          <div>
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="e.g., 500"
              required
            />
          </div>
          <div>
            <Label htmlFor="size_sqm">Size (sqm)</Label>
            <Input
              id="size_sqm"
              type="number"
              value={sizeSqm}
              onChange={(e) => setSizeSqm(e.target.value)}
              placeholder="e.g., 320"
            />
          </div>
          <div>
            <Label htmlFor="floor">Floor</Label>
            <Input
              id="floor"
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
              placeholder="e.g., 2"
            />
          </div>
          <div>
            <Label htmlFor="hourly_rate">Hourly Rate</Label>
            <Input
              id="hourly_rate"
              type="number"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
              placeholder="e.g., 500"
            />
          </div>
          <div>
            <Label htmlFor="event_space_type">Event Space Type</Label>
            <Select value={eventSpaceType} onValueChange={setEventSpaceType}>
              <SelectTrigger>
                <SelectValue placeholder="Select event space type" />
              </SelectTrigger>
              <SelectContent>
                {eventSpaceTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="amenities">Amenities</Label>
            <Popover open={openAmenities} onOpenChange={setOpenAmenities}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openAmenities}
                  className="w-full justify-between"
                >
                  {selectedAmenities.length > 0
                    ? selectedAmenities
                        .map((id) => amenities.find((a) => a.id === id)?.name)
                        .filter(Boolean)
                        .join(", ")
                    : "Select amenities..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search amenities..." />
                  <CommandEmpty>No amenities found.</CommandEmpty>
                  <CommandGroup>
                    {amenities.map((amenity) => (
                      <CommandItem
                        key={amenity.id}
                        value={amenity.name}
                        onSelect={() => {
                          setSelectedAmenities((prev) =>
                            prev.includes(amenity.id)
                              ? prev.filter((id) => id !== amenity.id)
                              : [...prev, amenity.id]
                          );
                        }}
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${
                            selectedAmenities.includes(amenity.id)
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        />
                        {amenity.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
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
              {eventSpace ? "Save Changes" : "Create Event Space"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
