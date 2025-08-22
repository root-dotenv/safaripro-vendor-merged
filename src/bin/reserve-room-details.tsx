// "use client";
// import { useState, useMemo } from "react";
// import { useParams } from "react-router-dom";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { toast } from "sonner";
// import { CSVLink } from "react-csv";

// // --- HOOKS & API ---
// import { useHotel } from "../../providers/hotel-provider";
// import hotelClient from "../../api/hotel-client";

// // --- UI COMPONENTS ---
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
//   DropdownMenuGroup,
//   DropdownMenuSeparator,
// } from "@/components/ui/dropdown-menu";
// import EditRoomDialog from "./edit-room-dialog";
// import ErrorPage from "@/components/custom/error-page";
// import { cn } from "@/lib/utils";

// // --- ICONS ---
// import {
//   BookCheck,
//   CheckCircle,
//   Wrench,
//   Star,
//   MapPin,
//   Loader,
// } from "lucide-react";
// import { FiEdit, FiMoreVertical } from "react-icons/fi";
// import { TbFileTypeCsv } from "react-icons/tb";
// import { RiCheckboxCircleLine } from "react-icons/ri";

// // --- TYPE DEFINITIONS ---
// interface Amenity {
//   id: string;
//   name: string;
// }
// interface GalleryImage {
//   id: string;
//   url: string;
// }
// interface RoomDetails {
//   id: string;
//   code: string;
//   description: string;
//   image: string;
//   images: GalleryImage[];
//   max_occupancy: number;
//   price_per_night: number;
//   availability_status: "Available" | "Booked" | "Maintenance";
//   room_type_id: string;
//   room_type_name: string;
//   amenities: Amenity[];
//   room_amenities: string[];
// }

// export default function RoomDetailsPage() {
//   const { room_id } = useParams<{ room_id: string }>();
//   const queryClient = useQueryClient();
//   const [activeImageIndex, setActiveImageIndex] = useState(0);

//   // --- DATA FETCHING ---
//   const { hotel } = useHotel();
//   const {
//     data: room,
//     isLoading,
//     isError,
//     refetch,
//     error,
//   } = useQuery<RoomDetails>({
//     queryKey: ["roomDetails", room_id],
//     queryFn: async () => (await hotelClient.get(`rooms/${room_id}`)).data,
//     enabled: !!room_id,
//   });

//   // --- IMAGE STATE & LOGIC ---
//   const galleryImages = useMemo(() => {
//     if (!room) return [];
//     const primaryImage = room.image;
//     const additionalImages = room.images?.map((img) => img.url) || [];
//     const allImages = [...new Set([primaryImage, ...additionalImages])].filter(
//       Boolean
//     );
//     return allImages.length > 0 ? allImages : ["https://placehold.co/600x400"];
//   }, [room]);

//   // --- MUTATIONS & HANDLERS ---
//   const updateStatusMutation = useMutation({
//     mutationFn: ({ status }: { status: string }) =>
//       hotelClient.patch(`/rooms/${room_id}/`, { availability_status: status }),
//     onSuccess: () => {
//       toast.success("Room status updated successfully!");
//       queryClient.invalidateQueries({ queryKey: ["roomDetails", room_id] });
//       queryClient.invalidateQueries({ queryKey: ["available-rooms"] });
//       queryClient.invalidateQueries({ queryKey: ["booked-rooms"] });
//       queryClient.invalidateQueries({ queryKey: ["maintenance-rooms"] });
//     },
//     onError: (error: any) => {
//       toast.error(
//         `Failed to update status: ${
//           error.response?.data?.detail || error.message
//         }`
//       );
//     },
//   });

//   const prepareCSVData = () => {
//     if (!room || !hotel) return [];
//     return [
//       {
//         Hotel: hotel.name,
//         "Room Type": room.room_type_name,
//         "Room Code": room.code,
//         "Price/Night": `$${room.price_per_night.toFixed(2)}`,
//         Status: room.availability_status,
//       },
//     ];
//   };

//   const statusColorClass = (status: string) => {
//     switch (status?.toLowerCase()) {
//       case "available":
//         return "bg-green-100 text-green-800";
//       case "booked":
//         return "bg-amber-100 text-amber-800";
//       case "maintenance":
//         return "bg-red-100 text-red-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   // --- RENDER LOGIC ---
//   if (isLoading || !hotel) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <Loader className="h-8 w-8 animate-spin" />
//       </div>
//     );
//   }
//   if (isError) {
//     return <ErrorPage error={error as Error} onRetry={refetch} />;
//   }
//   if (!room) {
//     return <div className="p-8">Room data not found.</div>;
//   }

//   const renderStatusActions = () => {
//     switch (room.availability_status) {
//       case "Available":
//         return (
//           <>
//             <DropdownMenuItem
//               onClick={() => updateStatusMutation.mutate({ status: "Booked" })}
//             >
//               <BookCheck className="mr-2 h-4 w-4" />
//               <span>Mark as Booked</span>
//             </DropdownMenuItem>
//             <DropdownMenuItem
//               onClick={() =>
//                 updateStatusMutation.mutate({ status: "Maintenance" })
//               }
//             >
//               <Wrench className="mr-2 h-4 w-4" />
//               <span>Mark as Maintenance</span>
//             </DropdownMenuItem>
//           </>
//         );
//       case "Booked":
//         return (
//           <>
//             <DropdownMenuItem
//               onClick={() =>
//                 updateStatusMutation.mutate({ status: "Available" })
//               }
//             >
//               <CheckCircle className="mr-2 h-4 w-4" />
//               <span>Mark as Available</span>
//             </DropdownMenuItem>
//             <DropdownMenuItem
//               onClick={() =>
//                 updateStatusMutation.mutate({ status: "Maintenance" })
//               }
//             >
//               <Wrench className="mr-2 h-4 w-4" />
//               <span>Mark as Maintenance</span>
//             </DropdownMenuItem>
//           </>
//         );
//       case "Maintenance":
//         return (
//           <>
//             <DropdownMenuItem
//               onClick={() =>
//                 updateStatusMutation.mutate({ status: "Available" })
//               }
//             >
//               <CheckCircle className="mr-2 h-4 w-4" />
//               <span>Mark as Available</span>
//             </DropdownMenuItem>
//             <DropdownMenuItem
//               onClick={() => updateStatusMutation.mutate({ status: "Booked" })}
//             >
//               <BookCheck className="mr-2 h-4 w-4" />
//               <span>Mark as Booked</span>
//             </DropdownMenuItem>
//           </>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <Dialog>
//       <div className="min-h-screen bg-[#FFF] p-4 sm:p-4 lg:p-5">
//         <div className="max-w-7xl mx-auto border-gray-200 p-6 space-y-8">
//           {/* --- HEADER SECTION --- */}
//           <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
//             <div className="space-y-2">
//               <h1 className="text-2xl font-bold text-gray-900">
//                 {hotel.name} - {room.code}
//               </h1>
//               <div className="flex items-center gap-1">
//                 {Array.from({ length: 5 }).map((_, i) => (
//                   <Star
//                     key={i}
//                     className={`h-4 w-4 ${
//                       i < hotel.star_rating
//                         ? "text-yellow-400 fill-yellow-400"
//                         : "text-gray-300"
//                     }`}
//                   />
//                 ))}
//               </div>
//               <div className="flex items-center text-sm text-gray-500 gap-3">
//                 <div className="flex items-center gap-1">
//                   <MapPin className="h-4 w-4" />
//                   <span>{hotel.address}</span>
//                 </div>
//                 <Badge
//                   variant="secondary"
//                   className="bg-green-100 text-green-800"
//                 >
//                   {parseFloat(hotel.average_rating).toFixed(1)}
//                 </Badge>
//                 <span>{hotel.review_count} Reviews</span>
//               </div>
//             </div>
//             <div className="flex-shrink-0 w-full md:w-auto flex items-center gap-3">
//               <div className="text-right flex-grow mr-2">
//                 <p className="text-2xl font-bold text-gray-900">
//                   ${room.price_per_night.toFixed(2)}
//                 </p>
//                 <p className="text-sm text-gray-500">per night</p>
//               </div>
//               <DialogTrigger asChild>
//                 <Button className="bg-[#0081FB] hover:bg-blue-600 text-white font-semibold">
//                   <FiEdit className="mr-2 h-4 w-4" /> Edit Room
//                 </Button>
//               </DialogTrigger>
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="ghost" size="icon">
//                     <FiMoreVertical className="h-5 w-5" />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end">
//                   <DropdownMenuGroup>{renderStatusActions()}</DropdownMenuGroup>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem>
//                     <CSVLink
//                       data={prepareCSVData()}
//                       filename={`room_${room.code}_details.csv`}
//                       className="flex items-center gap-2 w-full"
//                     >
//                       <TbFileTypeCsv className="h-4 w-4" /> Export CSV
//                     </CSVLink>
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>
//           </header>

//           {/* --- ROOM DETAILS SECTION (MOVED) --- */}
//           <div>
//             <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
//               <div>
//                 <h2 className="text-xl font-bold text-gray-800">
//                   {room.room_type_name}
//                 </h2>
//                 <p className="text-sm text-gray-500">Room Code: {room.code}</p>
//               </div>
//               <Badge
//                 className={cn(
//                   "px-3 py-1 text-sm",
//                   statusColorClass(room.availability_status)
//                 )}
//               >
//                 {room.availability_status}
//               </Badge>
//             </div>
//             <Separator className="my-4" />
//             <p className="text-gray-600 leading-relaxed">{room.description}</p>
//           </div>

//           {/* --- IMAGE GALLERY --- */}
//           <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
//             {/* Main Image */}
//             <div className="lg:col-span-3">
//               <img
//                 src={galleryImages[activeImageIndex]}
//                 alt={`Room view ${activeImageIndex + 1}`}
//                 className="rounded-lg object-cover w-full aspect-[4/3] border border-gray-200"
//               />
//             </div>

//             {/* Thumbnails */}
//             <div className="lg:col-span-2 grid grid-cols-4 lg:grid-cols-2 gap-4">
//               {galleryImages.slice(0, 4).map((img, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setActiveImageIndex(index)}
//                   className="focus:outline-none rounded-lg"
//                 >
//                   <img
//                     src={img}
//                     alt={`thumbnail ${index + 1}`}
//                     className={cn(
//                       "rounded-lg object-cover w-full aspect-square transition-all duration-200",
//                       activeImageIndex === index
//                         ? "ring-2 ring-blue-500 ring-offset-2"
//                         : "opacity-75 hover:opacity-100"
//                     )}
//                   />
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* --- AMENITIES SECTION --- */}
//           <div className="pt-4">
//             <h3 className="text-lg font-semibold mb-4">Room Amenities</h3>
//             {/* --- UPDATED AMENITIES LAYOUT --- */}
//             <div className="flex flex-col gap-y-3 text-sm text-gray-700">
//               {room.amenities.map((amenity) => (
//                 <div key={amenity.id} className="flex items-center gap-3">
//                   <RiCheckboxCircleLine className="h-5 w-5 text-blue-500" />
//                   <span>{amenity.name}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//       <DialogContent className="max-w-4xl bg-white">
//         {room && <EditRoomDialog room={room} />}
//       </DialogContent>
//     </Dialog>
//   );
// }
