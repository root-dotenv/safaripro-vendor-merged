import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FaUsers } from "react-icons/fa";
import { FiMoreVertical } from "react-icons/fi";
import { TbEdit, TbFileTypeCsv } from "react-icons/tb";
import { CSVLink } from "react-csv";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TbListDetails } from "react-icons/tb";
import { RiCheckboxCircleLine } from "react-icons/ri";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import EditRoomDialog from "./edit-room-dialog";
import hotelClient from "../../api/hotel-client";
import { cn } from "@/lib/utils";
import ErrorPage from "@/components/custom/error-page";
import { GiKeyCard } from "react-icons/gi";
import { BookCheck, CheckCircle, Wrench } from "lucide-react";

// --- UPDATED TYPE DEFINITIONS ---
interface Amenity {
  id: string;
  name: string;
}
interface GalleryImage {
  id: string;
  url: string;
}
interface RoomDetails {
  id: string;
  code: string;
  description: string;
  image: string;
  images: GalleryImage[];
  max_occupancy: number;
  price_per_night: number;
  availability_status: "Available" | "Booked" | "Maintenance";
  room_type_id: string;
  room_type_name: string;
  amenities: Amenity[];
  room_amenities: string[];
}

export default function RoomDetailsPage() {
  const { room_id } = useParams<{ room_id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const {
    data: room,
    isLoading,
    isError,
    refetch,
    error,
  } = useQuery<RoomDetails>({
    queryKey: ["roomDetails", room_id],
    queryFn: async () => (await hotelClient.get(`rooms/${room_id}`)).data,
    enabled: !!room_id,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ status }: { status: string }) =>
      hotelClient.patch(`/rooms/${room_id}/`, { availability_status: status }),
    onSuccess: () => {
      toast.success("Room status updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["roomDetails", room_id] });
      queryClient.invalidateQueries({ queryKey: ["available-rooms"] });
      queryClient.invalidateQueries({ queryKey: ["booked-rooms"] });
      queryClient.invalidateQueries({ queryKey: ["maintenance-rooms"] });
    },
    onError: (error: any) => {
      toast.error(
        `Failed to update status: ${
          error.response?.data?.detail || error.message
        }`
      );
    },
  });

  const galleryImages = useMemo(() => {
    if (!room) return [];
    const primaryImage = room.image;
    const additionalImages = room.images?.map((img) => img.url) || [];
    return [...new Set([primaryImage, ...additionalImages])].filter(Boolean);
  }, [room]);

  const prepareCSVData = () => {
    if (!room) return [];
    return [
      {
        "Room Code": room.code,
        "Room Type": room.room_type_name,
        "Price/Night": `$${room.price_per_night.toFixed(2)}`,
        "Max Occupancy": room.max_occupancy,
        Status: room.availability_status,
        Amenities: room.amenities.map((a) => a.name).join(", "),
      },
    ];
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-none p-8 text-center text-gray-600">
        <div className="animate-pulse space-y-4 w-full max-w-7xl">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 space-y-4">
              <div className="h-96 bg-gray-200 rounded-md"></div>
              <div className="grid grid-cols-4 gap-4">
                <div className="h-24 bg-gray-200 rounded-md"></div>
                <div className="h-24 bg-gray-200 rounded-md"></div>
                <div className="h-24 bg-gray-200 rounded-md"></div>
                <div className="h-24 bg-gray-200 rounded-md"></div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-md shadow-sm space-y-4">
                <div className="h-10 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-20 bg-gray-200 rounded"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
                <div className="h-12 bg-gray-200 rounded w-1/3 ml-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return <ErrorPage error={error as Error} onRetry={refetch} />;
  }

  if (!room) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8 text-center text-gray-600">
        Room not found.
      </div>
    );
  }

  const statusColorClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case "available":
        return "bg-green-50 text-green-700";
      case "booked":
        return "bg-yellow-50 text-yellow-700";
      case "maintenance":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  const renderStatusActions = () => {
    switch (room.availability_status) {
      case "Available":
        return (
          <>
            <DropdownMenuItem
              onClick={() => updateStatusMutation.mutate({ status: "Booked" })}
            >
              <BookCheck className="mr-2 h-4 w-4" />
              <span>Mark as Booked</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                updateStatusMutation.mutate({ status: "Maintenance" })
              }
            >
              <Wrench className="mr-2 h-4 w-4" />
              <span>Mark as Maintenance</span>
            </DropdownMenuItem>
          </>
        );
      case "Booked":
        return (
          <>
            <DropdownMenuItem
              onClick={() =>
                updateStatusMutation.mutate({ status: "Available" })
              }
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              <span>Mark as Available</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                updateStatusMutation.mutate({ status: "Maintenance" })
              }
            >
              <Wrench className="mr-2 h-4 w-4" />
              <span>Mark as Maintenance</span>
            </DropdownMenuItem>
          </>
        );
      case "Maintenance":
        return (
          <>
            <DropdownMenuItem
              onClick={() =>
                updateStatusMutation.mutate({ status: "Available" })
              }
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              <span>Mark as Available</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => updateStatusMutation.mutate({ status: "Booked" })}
            >
              <BookCheck className="mr-2 h-4 w-4" />
              <span>Mark as Booked</span>
            </DropdownMenuItem>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog>
      <div className="bg-none min-h-screen">
        <div className="p-8 md:p-10 lg:p-12 w-full mx-auto space-y-8 max-w-8xl">
          <header className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Back to List
            </Button>
            <div className="flex items-center gap-3">
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center cursor-pointer gap-2">
                  <TbEdit className="h-4 w-4" /> Edit Room
                </Button>
              </DialogTrigger>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-600 hover:bg-gray-100"
                  >
                    <FiMoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white shadow-md">
                  <DropdownMenuGroup>{renderStatusActions()}</DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex items-center gap-2 text-gray-700 hover:bg-gray-50">
                    <CSVLink
                      data={prepareCSVData()}
                      filename={`room_${room.code}_details.csv`}
                      className="flex items-center gap-2 w-full"
                    >
                      <TbFileTypeCsv className="h-4 w-4" /> Export CSV
                    </CSVLink>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <div className="space-y-6 sticky top-8">
                <h2 className="text-xl font-semibold text-blue-600 flex items-center gap-2">
                  <TbListDetails className="h-5 w-5" /> Room Details
                </h2>
                {galleryImages.length > 0 && (
                  <>
                    <img
                      src={galleryImages[activeImageIndex]}
                      alt={`${room.room_type_name} - view ${
                        activeImageIndex + 1
                      }`}
                      className="rounded-md object-cover w-full aspect-[4/3] shadow-sm border border-gray-200"
                    />
                    <div className="grid grid-cols-4 gap-3">
                      {galleryImages.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveImageIndex(index)}
                          className="focus:outline-none"
                        >
                          <img
                            src={img}
                            alt={`thumbnail ${index + 1}`}
                            className={cn(
                              "rounded-md object-cover w-full aspect-square border border-gray-200 transition-all duration-200",
                              activeImageIndex === index
                                ? "ring-2 ring-blue-500 ring-offset-2"
                                : "hover:opacity-90 opacity-70"
                            )}
                          />
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="lg:col-span-2 mt-[3rem]">
              <Card className="border-[1.5px] border-[#DADCE0] shadow bg-[#FFF]">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-2xl font-semibold text-gray-800">
                      {room.room_type_name}
                    </CardTitle>
                    <Badge
                      className={cn(
                        "text-xs font-medium px-3 py-1 rounded-full",
                        statusColorClass(room.availability_status)
                      )}
                    >
                      {room.availability_status}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm text-gray-500 mt-1">
                    Room Code: {room.code}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-0">
                  <Separator className="bg-gray-100" />
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">
                      Description
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {room.description || "No description available."}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50/50 border-[1.5px] border-[#DADCE0] shadow p-4 rounded-md text-center">
                      <p className="text-xs text-gray-500 mb-1">Occupancy</p>
                      <p className="font-semibold text-lg text-gray-800 flex items-center justify-center gap-2">
                        <FaUsers className="h-5 w-5 text-gray-600" />{" "}
                        {room.max_occupancy}
                      </p>
                    </div>
                    <div className="bg-gray-50/50 border-[1.5px] border-[#DADCE0] shadow p-4 rounded-md text-center">
                      <p className="text-xs text-gray-500 mb-1">Room Code</p>
                      <p className="font-semibold text-lg text-gray-800 flex items-center justify-center gap-2">
                        <GiKeyCard className="h-5 w-5 text-gray-600" />{" "}
                        {room.code}
                      </p>
                    </div>
                  </div>
                  <Separator className="bg-gray-100" />
                  <div>
                    <h3 className="font-semibold text-base text-gray-800 flex items-center gap-2 mb-3">
                      Room Amenities
                    </h3>
                    <div className="grid grid-cols-1 gap-y-2">
                      {room.amenities.map((amenity) => (
                        <div
                          key={amenity.id}
                          className="flex items-center gap-2 text-sm"
                        >
                          <RiCheckboxCircleLine className="h-4 w-4 text-blue-500" />
                          <span className="text-gray-700">{amenity.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-6 bg-none rounded-b-md">
                  <div className="w-full text-right">
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      Price per Night
                    </p>
                    <p className="text-3xl font-bold text-gray-800">
                      ${Number(room.price_per_night).toFixed(2)}
                    </p>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </main>
        </div>
      </div>

      <DialogContent className="max-w-4xl bg-white">
        {/* Pass the fully loaded room object to the dialog */}
        {room && <EditRoomDialog room={room} />}
      </DialogContent>
    </Dialog>
  );
}

// - - - - -
// import { useState, useMemo } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { toast } from "sonner";
// import { FaUsers } from "react-icons/fa";
// import { FiMoreVertical } from "react-icons/fi";
// import { TbEdit, TbFileTypeCsv } from "react-icons/tb";
// import { CSVLink } from "react-csv";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { TbListDetails } from "react-icons/tb";
// import { RiCheckboxCircleLine } from "react-icons/ri";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
//   CardFooter,
// } from "@/components/ui/card";
// import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
//   DropdownMenuGroup,
//   DropdownMenuSeparator,
// } from "@/components/ui/dropdown-menu";
// import { Separator } from "@/components/ui/separator";
// import EditRoomDialog from "./edit-room-dialog";
// import hotelClient from "../../api/hotel-client";
// import { cn } from "@/lib/utils";
// import ErrorPage from "@/components/custom/error-page";
// import { GiKeyCard } from "react-icons/gi";
// import { BookCheck, CheckCircle, Wrench } from "lucide-react";

// // --- UPDATED TYPE DEFINITIONS ---
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
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();
//   const [activeImageIndex, setActiveImageIndex] = useState(0);

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

//   const galleryImages = useMemo(() => {
//     if (!room) return [];
//     const primaryImage = room.image;
//     const additionalImages = room.images?.map((img) => img.url) || [];
//     return [...new Set([primaryImage, ...additionalImages])].filter(Boolean);
//   }, [room]);

//   const prepareCSVData = () => {
//     if (!room) return [];
//     return [
//       {
//         "Room Code": room.code,
//         "Room Type": room.room_type_name,
//         "Price/Night": `$${room.price_per_night.toFixed(2)}`,
//         "Max Occupancy": room.max_occupancy,
//         Status: room.availability_status,
//         Amenities: room.amenities.map((a) => a.name).join(", "),
//       },
//     ];
//   };

//   if (isLoading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-none p-8 text-center text-gray-600">
//         <div className="animate-pulse space-y-4 w-full max-w-7xl">
//           <div className="h-8 bg-gray-200 rounded w-1/4"></div>
//           <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
//             <div className="lg:col-span-3 space-y-4">
//               <div className="h-96 bg-gray-200 rounded-md"></div>
//               <div className="grid grid-cols-4 gap-4">
//                 <div className="h-24 bg-gray-200 rounded-md"></div>
//                 <div className="h-24 bg-gray-200 rounded-md"></div>
//                 <div className="h-24 bg-gray-200 rounded-md"></div>
//                 <div className="h-24 bg-gray-200 rounded-md"></div>
//               </div>
//             </div>
//             <div className="lg:col-span-2">
//               <div className="bg-white p-6 rounded-md shadow-sm space-y-4">
//                 <div className="h-10 bg-gray-200 rounded w-3/4"></div>
//                 <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//                 <div className="h-20 bg-gray-200 rounded"></div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="h-20 bg-gray-200 rounded"></div>
//                   <div className="h-20 bg-gray-200 rounded"></div>
//                 </div>
//                 <div className="space-y-2">
//                   <div className="h-4 bg-gray-200 rounded"></div>
//                   <div className="h-4 bg-gray-200 rounded"></div>
//                   <div className="h-4 bg-gray-200 rounded"></div>
//                 </div>
//                 <div className="h-12 bg-gray-200 rounded w-1/3 ml-auto"></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (isError) {
//     return <ErrorPage error={error as Error} onRetry={refetch} />;
//   }

//   if (!room) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8 text-center text-gray-600">
//         Room not found.
//       </div>
//     );
//   }

//   const statusColorClass = (status: string) => {
//     switch (status?.toLowerCase()) {
//       case "available":
//         return "bg-green-50 text-green-700";
//       case "booked":
//         return "bg-yellow-50 text-yellow-700";
//       case "maintenance":
//         return "bg-red-50 text-red-700";
//       default:
//         return "bg-gray-50 text-gray-700";
//     }
//   };

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
//       <div className="bg-none min-h-screen">
//         <div className="p-8 md:p-10 lg:p-12 w-full mx-auto space-y-8 max-w-8xl">
//           <header className="flex justify-between items-center">
//             <Button
//               variant="outline"
//               onClick={() => navigate(-1)}
//               className="border-gray-300 text-gray-700 hover:bg-gray-100"
//             >
//               Back to List
//             </Button>
//             <div className="flex items-center gap-3">
//               <DialogTrigger asChild>
//                 <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center cursor-pointer gap-2">
//                   <TbEdit className="h-4 w-4" /> Edit Room
//                 </Button>
//               </DialogTrigger>
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="text-gray-600 hover:bg-gray-100"
//                   >
//                     <FiMoreVertical className="h-5 w-5" />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end" className="bg-white shadow-md">
//                   <DropdownMenuGroup>{renderStatusActions()}</DropdownMenuGroup>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem className="flex items-center gap-2 text-gray-700 hover:bg-gray-50">
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

//           <main className="grid grid-cols-1 lg:grid-cols-5 gap-8">
//             <div className="lg:col-span-3">
//               <div className="space-y-6 sticky top-8">
//                 <h2 className="text-xl font-semibold text-blue-600 flex items-center gap-2">
//                   <TbListDetails className="h-5 w-5" /> Room Details
//                 </h2>
//                 {galleryImages.length > 0 && (
//                   <>
//                     <img
//                       src={galleryImages[activeImageIndex]}
//                       alt={`${room.room_type_name} - view ${
//                         activeImageIndex + 1
//                       }`}
//                       className="rounded-md object-cover w-full aspect-[4/3] shadow-sm border border-gray-200"
//                     />
//                     <div className="grid grid-cols-4 gap-3">
//                       {galleryImages.map((img, index) => (
//                         <button
//                           key={index}
//                           onClick={() => setActiveImageIndex(index)}
//                           className="focus:outline-none"
//                         >
//                           <img
//                             src={img}
//                             alt={`thumbnail ${index + 1}`}
//                             className={cn(
//                               "rounded-md object-cover w-full aspect-square border border-gray-200 transition-all duration-200",
//                               activeImageIndex === index
//                                 ? "ring-2 ring-blue-500 ring-offset-2"
//                                 : "hover:opacity-90 opacity-70"
//                             )}
//                           />
//                         </button>
//                       ))}
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>

//             <div className="lg:col-span-2 mt-[3rem]">
//               <Card className="border-[1.5px] border-[#DADCE0] shadow bg-[#FFF]">
//                 <CardHeader className="pb-4">
//                   <div className="flex justify-between items-start">
//                     <CardTitle className="text-2xl font-semibold text-gray-800">
//                       {room.room_type_name}
//                     </CardTitle>
//                     <Badge
//                       className={cn(
//                         "text-xs font-medium px-3 py-1 rounded-full",
//                         statusColorClass(room.availability_status)
//                       )}
//                     >
//                       {room.availability_status}
//                     </Badge>
//                   </div>
//                   <CardDescription className="text-sm text-gray-500 mt-1">
//                     Room Code: {room.code}
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-6 pt-0">
//                   <Separator className="bg-gray-100" />
//                   <div className="space-y-2">
//                     <p className="text-sm font-medium text-gray-600">
//                       Description
//                     </p>
//                     <p className="text-sm text-gray-700 leading-relaxed">
//                       {room.description || "No description available."}
//                     </p>
//                   </div>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="bg-gray-50/50 border-[1.5px] border-[#DADCE0] shadow p-4 rounded-md text-center">
//                       <p className="text-xs text-gray-500 mb-1">Occupancy</p>
//                       <p className="font-semibold text-lg text-gray-800 flex items-center justify-center gap-2">
//                         <FaUsers className="h-5 w-5 text-gray-600" />{" "}
//                         {room.max_occupancy}
//                       </p>
//                     </div>
//                     <div className="bg-gray-50/50 border-[1.5px] border-[#DADCE0] shadow p-4 rounded-md text-center">
//                       <p className="text-xs text-gray-500 mb-1">Room Code</p>
//                       <p className="font-semibold text-lg text-gray-800 flex items-center justify-center gap-2">
//                         <GiKeyCard className="h-5 w-5 text-gray-600" />{" "}
//                         {room.code}
//                       </p>
//                     </div>
//                   </div>
//                   <Separator className="bg-gray-100" />
//                   <div>
//                     <h3 className="font-semibold text-base text-gray-800 flex items-center gap-2 mb-3">
//                       Room Amenities
//                     </h3>
//                     <div className="grid grid-cols-1 gap-y-2">
//                       {room.amenities.map((amenity) => (
//                         <div
//                           key={amenity.id}
//                           className="flex items-center gap-2 text-sm"
//                         >
//                           <RiCheckboxCircleLine className="h-4 w-4 text-blue-500" />
//                           <span className="text-gray-700">{amenity.name}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </CardContent>
//                 <CardFooter className="p-6 bg-none rounded-b-md">
//                   <div className="w-full text-right">
//                     <p className="text-xs font-medium text-gray-500 mb-1">
//                       Price per Night TESTS
//                     </p>
//                     <p className="text-3xl font-bold text-gray-800">
//                       ${Number(room.price_per_night).toFixed(2)}
//                     </p>
//                   </div>
//                 </CardFooter>
//               </Card>
//             </div>
//           </main>
//         </div>
//       </div>

//       <DialogContent className="max-w-4xl bg-white">
//         {/* Pass the fully loaded room object to the dialog */}
//         {room && <EditRoomDialog room={room} />}
//       </DialogContent>
//     </Dialog>
//   );
// }
