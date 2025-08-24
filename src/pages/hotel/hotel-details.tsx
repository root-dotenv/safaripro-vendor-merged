// "use client";
// import React, { useState, useMemo, useEffect, useRef } from "react";
// import { useHotel } from "../../providers/hotel-provider";
// import {
//   useQueries,
//   useQuery,
//   useMutation,
//   useQueryClient,
// } from "@tanstack/react-query";
// import hotelClient from "../../api/hotel-client";
// import bookingClient from "../../api/booking-client";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "sonner";
// import { format, startOfMonth } from "date-fns";
// import {
//   FaUtensils,
//   FaRegBuilding,
//   FaStar,
//   FaMapMarkerAlt,
//   FaLeaf,
//   FaClock,
//   FaDirections,
// } from "react-icons/fa";
// import {
//   Pencil,
//   Trash2,
//   PlusCircle,
//   ChevronLeft,
//   ChevronRight,
//   Hotel,
//   DollarSign,
//   Percent,
//   Shapes,
//   ConciergeBell,
//   CheckCircle,
//   Clock as ClockIcon,
//   XCircle,
//   FileText,
//   Building,
//   ParkingCircle,
//   GlassWater,
//   Tally5,
//   Calendar,
//   Tag,
//   Info,
//   Image as ImageIcon,
//   Building2,
// } from "lucide-react";
// import {
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   XAxis,
//   YAxis,
//   CartesianGrid,
// } from "recharts";

// // --- UI Components ---
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Skeleton } from "@/components/ui/skeleton";
// import { AddEditImageModal } from "./customize-hotel/AddEditImageModal";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import ErrorPage from "@/components/custom/error-page";

// // --- Type Imports ---
// import type {
//   HotelType,
//   HotelImage,
//   Service,
//   Department,
// } from "../../types/hotel-types";
// import type { Amenity } from "@/types/amenities";
// import type { Facility } from "@/types/facilities";
// import type { Booking } from "@/types/booking-types";
// import type { MealType } from "./features";
// import type { RoomType } from "./customize-hotel/hotel";

// // --- Helper Components & Functions ---

// const StatCard = ({
//   title,
//   value,
//   icon,
//   stats,
//   onManageClick,
//   isLoading,
// }: {
//   title: string;
//   value: string | number;
//   icon: React.ReactNode;
//   stats?: {
//     label: string;
//     value: number | string;
//     color: string;
//     icon?: React.ReactNode;
//   }[];
//   onManageClick?: () => void;
//   isLoading?: boolean;
// }) => (
//   <Card className="bg-white border-gray-200 hover:shadow-lg transition-shadow">
//     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//       <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
//         {icon} {title}
//       </CardTitle>
//     </CardHeader>
//     <CardContent>
//       {isLoading ? (
//         <Skeleton className="h-8 w-1/2 mb-2" />
//       ) : (
//         <div className="text-3xl font-bold text-gray-900">{value}</div>
//       )}
//       {stats && (
//         <div className="flex gap-2 mt-2 flex-wrap">
//           {stats.map((s) => (
//             <Badge key={s.label} variant="outline" className={s.color}>
//               {s.icon} {s.value} {s.label}
//             </Badge>
//           ))}
//         </div>
//       )}
//       {onManageClick && (
//         <Button
//           variant="link"
//           className="p-0 mt-2 h-auto text-blue-600 hover:text-blue-800"
//           onClick={onManageClick}
//         >
//           Manage
//         </Button>
//       )}
//     </CardContent>
//   </Card>
// );

// const FeatureCard = ({
//   title,
//   icon,
//   items,
//   isLoading,
// }: {
//   title: string;
//   icon: React.ReactNode;
//   items: { id: string; name: string }[];
//   isLoading: boolean;
// }) => (
//   <Card className="bg-white border-gray-200">
//     <CardHeader>
//       <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
//         {icon} {title}
//       </CardTitle>
//     </CardHeader>
//     <CardContent className="space-y-3">
//       {isLoading ? (
//         [...Array(3)].map((_, i) => <Skeleton key={i} className="h-6 w-full" />)
//       ) : items.length > 0 ? (
//         items.map((item) => (
//           <div key={item.id} className="flex items-center gap-3 text-sm">
//             <div className="bg-blue-50 p-2 rounded-full">
//               <Shapes className="h-4 w-4 text-blue-500" />
//             </div>
//             <span className="font-medium text-gray-700">{item.name}</span>
//           </div>
//         ))
//       ) : (
//         <p className="text-sm text-center text-gray-500 py-4">
//           No {title.toLowerCase()} listed.
//         </p>
//       )}
//     </CardContent>
//   </Card>
// );

// const ImageSlider = ({
//   images,
//   hotelId,
// }: {
//   images: HotelImage[];
//   hotelId: string;
// }) => {
//   const sliderRef = useRef<HTMLDivElement>(null);
//   const [canScrollLeft, setCanScrollLeft] = useState(false);
//   const [canScrollRight, setCanScrollRight] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingImage, setEditingImage] = useState<HotelImage | null>(null);
//   const [imageToDelete, setImageToDelete] = useState<HotelImage | null>(null);
//   const queryClient = useQueryClient();

//   const deleteImageMutation = useMutation({
//     mutationFn: (imageId: string) =>
//       hotelClient.delete(`/hotel-images/${imageId}/`),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["hotelImages", hotelId] });
//       setImageToDelete(null);
//       toast.success("Image deleted successfully");
//     },
//     onError: () => toast.error("Failed to delete image. Please try again."),
//   });

//   const handleOpenAddModal = () => {
//     setEditingImage(null);
//     setIsModalOpen(true);
//   };

//   const handleOpenEditModal = (image: HotelImage) => {
//     setEditingImage(image);
//     setIsModalOpen(true);
//   };

//   useEffect(() => {
//     const checkScroll = () => {
//       if (sliderRef.current) {
//         const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
//         setCanScrollLeft(scrollLeft > 0);
//         setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
//       }
//     };
//     checkScroll();
//     const slider = sliderRef.current;
//     slider?.addEventListener("scroll", checkScroll);
//     window.addEventListener("resize", checkScroll);
//     return () => {
//       slider?.removeEventListener("scroll", checkScroll);
//       window.removeEventListener("resize", checkScroll);
//     };
//   }, [images]);

//   const scroll = (direction: "left" | "right") => {
//     if (sliderRef.current) {
//       sliderRef.current.scrollBy({
//         left: direction === "left" ? -300 : 300,
//         behavior: "smooth",
//       });
//     }
//   };

//   if (!images || images.length === 0) {
//     return (
//       <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-500 rounded-lg">
//         <div className="text-center">
//           <p className="font-medium">No images available</p>
//           <Button
//             variant="ghost"
//             onClick={handleOpenAddModal}
//             className="mt-2 text-blue-600 hover:bg-blue-50"
//           >
//             <PlusCircle className="h-5 w-5 mr-2" /> Add Images
//           </Button>
//           <AddEditImageModal
//             isOpen={isModalOpen}
//             onOpenChange={setIsModalOpen}
//             image={editingImage}
//             hotelId={hotelId}
//           />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="relative">
//       <div
//         ref={sliderRef}
//         className="max-w-[1200px] flex overflow-x-scroll gap-4 pb-4"
//       >
//         {images.map((image) => (
//           <div
//             key={image.id}
//             className="relative flex-shrink-0 w-64 h-64 snap-center group"
//           >
//             <img
//               src={image.original}
//               alt={image.tag || "Hotel image"}
//               className="w-full h-full object-cover rounded-lg shadow-md"
//             />
//             <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
//               <Button
//                 variant="outline"
//                 size="icon"
//                 className="border-white text-white hover:bg-white hover:text-black"
//                 onClick={() => handleOpenEditModal(image)}
//                 aria-label={`Edit image ${image.tag}`}
//               >
//                 <Pencil className="h-4 w-4" />
//               </Button>
//               <Button
//                 variant="outline"
//                 size="icon"
//                 className="text-red-400 border-red-400 hover:bg-red-500 hover:text-white"
//                 onClick={() => setImageToDelete(image)}
//                 aria-label={`Delete image ${image.tag}`}
//               >
//                 <Trash2 className="h-4 w-4" />
//               </Button>
//             </div>
//             <div className="absolute bottom-2 left-2 bg-black/50 text-white text-sm px-2 py-1 rounded">
//               {image.tag || "Hotel image"}
//             </div>
//           </div>
//         ))}
//       </div>
//       {canScrollLeft && (
//         <Button
//           onClick={() => scroll("left")}
//           size="icon"
//           className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full shadow-lg"
//           aria-label="Scroll left"
//         >
//           <ChevronLeft />
//         </Button>
//       )}
//       {canScrollRight && (
//         <Button
//           onClick={() => scroll("right")}
//           size="icon"
//           className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full shadow-lg"
//           aria-label="Scroll right"
//         >
//           <ChevronRight />
//         </Button>
//       )}
//       <AddEditImageModal
//         isOpen={isModalOpen}
//         onOpenChange={setIsModalOpen}
//         image={editingImage}
//         hotelId={hotelId}
//       />
//       <AlertDialog
//         open={!!imageToDelete}
//         onOpenChange={() => setImageToDelete(null)}
//       >
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//             <AlertDialogDescription>
//               This action will permanently delete the image.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction
//               onClick={() => deleteImageMutation.mutate(imageToDelete!.id)}
//               disabled={deleteImageMutation.isPending}
//               className="bg-red-600 hover:bg-red-700"
//             >
//               {deleteImageMutation.isPending ? "Deleting..." : "Delete"}
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// };

// const DetailItem = ({
//   icon,
//   label,
//   value,
// }: {
//   icon: React.ReactNode;
//   label: string;
//   value: string | number | null;
// }) => (
//   <div className="flex items-start gap-3">
//     <div className="text-blue-600 mt-1">{icon}</div>
//     <div>
//       <p className="text-sm text-gray-500">{label}</p>
//       <p className="font-semibold text-gray-800">{value || "N/A"}</p>
//     </div>
//   </div>
// );

// // --- Main Component ---
// export default function HotelDetails() {
//   const {
//     hotel,
//     isLoading: isHotelLoading,
//     isError,
//     error,
//     refetch,
//   } = useHotel();
//   const navigate = useNavigate();
//   const HOTEL_ID = import.meta.env.VITE_HOTEL_ID;
//   const [isAddImageModalOpen, setIsAddImageModalOpen] = useState(false);

//   const { data: hotelTypeDetails, isLoading: isLoadingHotelType } =
//     useQuery<HotelType>({
//       queryKey: ["hotelType", hotel?.hotel_type],
//       queryFn: () =>
//         hotelClient
//           .get(`/hotel-types/${hotel?.hotel_type}/`)
//           .then((res) => res.data),
//       enabled: !!hotel?.hotel_type,
//     });

//   const { data: hotelImagesData, isLoading: isLoadingImages } = useQuery({
//     queryKey: ["hotelImages", HOTEL_ID],
//     queryFn: async () => {
//       try {
//         const res = await hotelClient.get(
//           `/hotel-images/?hotel_id=${HOTEL_ID}`
//         );
//         if (res.data && Array.isArray(res.data.results)) {
//           return res.data.results as HotelImage[];
//         }
//         return [];
//       } catch (error) {
//         console.error("Failed to fetch hotel images:", error);
//         return [];
//       }
//     },
//     enabled: !!HOTEL_ID,
//   });

//   const { data: bookingsData, isLoading: isLoadingBookings } = useQuery<{
//     results: Booking[];
//     count: number;
//   }>({
//     queryKey: ["hotelBookings", HOTEL_ID],
//     queryFn: () =>
//       bookingClient
//         .get(`/bookings?microservice_item_id=${HOTEL_ID}&page_size=1000`)
//         .then((res) => res.data),
//     enabled: !!HOTEL_ID,
//   });

//   const amenityQueries = useQueries({
//     queries: (hotel?.amenities || []).map((id) => ({
//       queryKey: ["amenity", id],
//       queryFn: () =>
//         hotelClient.get(`/amenities/${id}/`).then((res) => res.data as Amenity),
//       enabled: !!hotel,
//     })),
//   });
//   const facilityQueries = useQueries({
//     queries: (hotel?.facilities || []).map((id) => ({
//       queryKey: ["facility", id],
//       queryFn: () =>
//         hotelClient
//           .get(`/facilities/${id}/`)
//           .then((res) => res.data as Facility),
//       enabled: !!hotel,
//     })),
//   });
//   const serviceQueries = useQueries({
//     queries: (hotel?.services || []).map((id) => ({
//       queryKey: ["service", id],
//       queryFn: () =>
//         hotelClient.get(`/services/${id}/`).then((res) => res.data as Service),
//       enabled: !!hotel,
//     })),
//   });
//   const mealTypeQueries = useQueries({
//     queries: (hotel?.meal_types || []).map((id) => ({
//       queryKey: ["mealType", id],
//       queryFn: () =>
//         hotelClient
//           .get(`/meal-types/${id}/`)
//           .then((res) => res.data as MealType),
//       enabled: !!hotel,
//     })),
//   });

//   const departmentQueries = useQueries({
//     queries: (hotel?.department_ids || []).map((id) => ({
//       queryKey: ["department", id],
//       queryFn: () =>
//         hotelClient
//           .get(`/departments/${id}/`)
//           .then((res) => res.data as Department),
//       enabled: !!hotel,
//     })),
//   });

//   const bookingStats = useMemo(() => {
//     if (!bookingsData)
//       return { total: 0, confirmed: 0, pending: 0, cancelled: 0 };
//     const bookings = bookingsData.results;
//     return {
//       total: bookingsData.count,
//       confirmed: bookings.filter(
//         (b) => b.booking_status.toLowerCase() === "confirmed"
//       ).length,
//       pending: bookings.filter(
//         (b) => b.booking_status.toLowerCase() === "pending"
//       ).length,
//       cancelled: bookings.filter(
//         (b) => b.booking_status.toLowerCase() === "cancelled"
//       ).length,
//     };
//   }, [bookingsData]);

//   const monthlyBookingData = useMemo(() => {
//     if (!bookingsData) return [];
//     const monthCounts = bookingsData.results.reduce((acc, booking) => {
//       const month = format(
//         startOfMonth(new Date(booking.created_at)),
//         "MMM yyyy"
//       );
//       acc[month] = (acc[month] || 0) + 1;
//       return acc;
//     }, {} as Record<string, number>);
//     return Object.entries(monthCounts)
//       .map(([name, value]) => ({ name, bookings: value }))
//       .slice(-6); // Last 6 months
//   }, [bookingsData]);

//   if (isHotelLoading) {
//     return (
//       <div className="p-8 bg-gray-100 min-h-screen">
//         <Skeleton className="h-12 w-1/3 mb-6" />
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
//           {[...Array(4)].map((_, i) => (
//             <Skeleton key={i} className="h-32 w-full" />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   if (isError) return <ErrorPage error={error as Error} onRetry={refetch} />;
//   if (!hotel)
//     return <div className="p-8 text-center">No hotel data available.</div>;

//   const amenities = amenityQueries
//     .filter((q) => q.isSuccess)
//     .map((q) => q.data);
//   const facilities = facilityQueries
//     .filter((q) => q.isSuccess)
//     .map((q) => q.data);
//   const services = serviceQueries.filter((q) => q.isSuccess).map((q) => q.data);
//   const mealTypes = mealTypeQueries
//     .filter((q) => q.isSuccess)
//     .map((q) => q.data);
//   const departments = departmentQueries
//     .filter((q) => q.isSuccess)
//     .map((q) => q.data);

//   const roomStatusData = {
//     Available: hotel.availability_stats?.status_counts?.Available || 0,
//     Booked: hotel.availability_stats?.status_counts?.Booked || 0,
//     Maintenance: hotel.availability_stats?.status_counts?.Maintenance || 0,
//   };

//   const pieChartData = [
//     { name: "Available", value: roomStatusData.Available, color: "#22c55e" },
//     { name: "Booked", value: roomStatusData.Booked, color: "#eab308" },
//     {
//       name: "Maintenance",
//       value: roomStatusData.Maintenance,
//       color: "#ef4444",
//     },
//   ].filter((entry) => entry.value > 0);

//   const renderStarRating = (rating: number) => {
//     const stars = [];
//     for (let i = 0; i < 5; i++) {
//       if (i < rating) {
//         stars.push(<FaStar key={i} className="text-yellow-400" />);
//       } else {
//         stars.push(<FaStar key={i} className="text-gray-300" />);
//       }
//     }
//     return <div className="flex items-center gap-1">{stars}</div>;
//   };

//   return (
//     <div className="container mx-auto p-8 bg-none min-h-screen">
//       <header className="mb-10">
//         <div className="flex flex-wrap items-center justify-between gap-4">
//           <div>
//             <h1 className="text-4xl font-bold text-gray-900">{hotel.name}</h1>
//             <div className="flex items-center gap-2 mt-2">
//               {renderStarRating(hotel.star_rating)}
//               <span className="text-sm text-gray-600">
//                 ({hotel.star_rating} Stars)
//               </span>
//             </div>
//             <p className="text-md text-gray-600 mt-2">{hotel.description}</p>
//           </div>
//           <Button
//             asChild
//             className="bg-[#FFFFFD] border-[1.25px] border-[#E7E5E4] text-[#19191A] shadow hover:bg-none hover:shadow-none hover:border-none"
//           >
//             <Link to="/hotel/customize-hotel">
//               <Pencil className="mr-1 h-4 w-4" /> Customize Hotel
//             </Link>
//           </Button>
//         </div>
//       </header>

//       {/* --- Main Stat Cards --- */}
//       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
//         <StatCard
//           title="Total Rooms"
//           value={hotel.summary_counts.rooms}
//           icon={<Hotel className="h-5 w-5 text-blue-600" />}
//           isLoading={isHotelLoading}
//           stats={[
//             {
//               label: "Available",
//               value: roomStatusData.Available,
//               color: "text-green-600 border-green-600",
//               icon: <CheckCircle className="h-3 w-3 mr-1" />,
//             },
//             {
//               label: "Booked",
//               value: roomStatusData.Booked,
//               color: "text-yellow-600 border-yellow-600",
//               icon: <ClockIcon className="h-3 w-3 mr-1" />,
//             },
//             {
//               label: "Maintenance",
//               value: roomStatusData.Maintenance,
//               color: "text-red-600 border-red-600",
//               icon: <XCircle className="h-3 w-3 mr-1" />,
//             },
//           ]}
//           onManageClick={() => navigate("/rooms/available-rooms")}
//         />
//         <StatCard
//           title="Total Bookings"
//           value={bookingStats.total}
//           icon={<FileText className="h-5 w-5 text-gray-600" />}
//           isLoading={isLoadingBookings}
//           stats={[
//             {
//               label: "Confirmed",
//               value: bookingStats.confirmed,
//               color: "text-green-600 border-green-600",
//               icon: <CheckCircle className="h-3 w-3 mr-1" />,
//             },
//             {
//               label: "Pending",
//               value: bookingStats.pending,
//               color: "text-yellow-600 border-yellow-600",
//               icon: <ClockIcon className="h-3 w-3 mr-1" />,
//             },
//             {
//               label: "Cancelled",
//               value: bookingStats.cancelled,
//               color: "text-red-600 border-red-600",
//               icon: <XCircle className="h-3 w-3 mr-1" />,
//             },
//           ]}
//           onManageClick={() => navigate("/bookings/all-bookings")}
//         />
//         <StatCard
//           title="Avg. Price"
//           value={`$${hotel.average_room_price.toFixed(2)}`}
//           icon={<DollarSign className="h-5 w-5 text-purple-600" />}
//           isLoading={isHotelLoading}
//           stats={[
//             {
//               label: "Min",
//               value: `$${hotel.pricing_data.min.toFixed(2)}`,
//               color: "text-blue-600 border-blue-600",
//             },
//             {
//               label: "Max",
//               value: `$${hotel.pricing_data.max.toFixed(2)}`,
//               color: "text-red-600 border-red-600",
//             },
//             {
//               label: "Discount",
//               value: `${hotel.discount}%`,
//               color: "text-green-600 border-green-600",
//             },
//           ]}
//         />
//         <StatCard
//           title="Occupancy"
//           value={`${hotel.occupancy_rate.toFixed(1)}%`}
//           icon={<Percent className="h-5 w-5 text-teal-600" />}
//           isLoading={isHotelLoading}
//         />
//       </div>

//       {/* --- Hotel Gallery --- */}
//       <div className="mt-6">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
//             <ImageIcon className="h-6 w-6 text-blue-600" /> Hotel Gallery
//           </h2>
//           <Button
//             variant="outline"
//             onClick={() => setIsAddImageModalOpen(true)}
//           >
//             <PlusCircle className="h-4 w-4 mr-2" />
//             Add Image
//           </Button>
//         </div>
//         <Card className="bg-white border-gray-200">
//           <CardContent className="p-4">
//             {isLoadingImages ? (
//               <Skeleton className="h-64 w-full" />
//             ) : (
//               <ImageSlider images={hotelImagesData || []} hotelId={HOTEL_ID} />
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       {/* --- Charts --- */}
//       <div className="grid gap-6 lg:grid-cols-5 mt-6">
//         <Card className="lg:col-span-3 bg-white border-gray-200">
//           <CardHeader>
//             <CardTitle className="text-lg font-semibold text-gray-900">
//               Monthly Bookings
//             </CardTitle>
//             <CardDescription className="text-sm text-gray-500">
//               Booking trends over the last few months
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="h-[350px]">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={monthlyBookingData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
//                 <XAxis dataKey="name" stroke="#6B7280" />
//                 <YAxis stroke="#6B7280" />
//                 <Tooltip
//                   contentStyle={{
//                     backgroundColor: "#FFF",
//                     borderColor: "#DADCE0",
//                   }}
//                 />
//                 <Legend />
//                 <Bar dataKey="bookings" fill="#155DFC" radius={[4, 4, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>
//         <Card className="lg:col-span-2 bg-white border-gray-200">
//           <CardHeader>
//             <CardTitle className="text-lg font-semibold text-gray-900">
//               Room Status Distribution
//             </CardTitle>
//             <CardDescription className="text-sm text-gray-500">
//               Live overview of room availability
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="h-[350px]">
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie
//                   data={pieChartData}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   outerRadius={100}
//                   dataKey="value"
//                   nameKey="name"
//                   label={({ name, percent }) =>
//                     `${name}: ${(percent * 100).toFixed(0)}%`
//                   }
//                 >
//                   {pieChartData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.color} />
//                   ))}
//                 </Pie>
//                 <Tooltip
//                   contentStyle={{
//                     backgroundColor: "#FFF",
//                     borderColor: "#DADCE0",
//                   }}
//                 />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>
//       </div>

//       {/* --- Additional Hotel Details --- */}
//       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
//         {/* Hotel Information Card */}
//         <Card className="lg:col-span-2 bg-white border-gray-200">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
//               <Info /> Hotel Information
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <DetailItem
//               icon={<FaStar />}
//               label="Star Rating"
//               value={`${hotel.star_rating} Stars`}
//             />
//             <DetailItem
//               icon={<FaMapMarkerAlt />}
//               label="Address"
//               value={`${hotel.address}, ${hotel.zip_code}, ${hotel.destination}`}
//             />
//             <DetailItem
//               icon={<Calendar />}
//               label="Year Built"
//               value={hotel.year_built}
//             />
//             <DetailItem
//               icon={<FaLeaf />}
//               label="Eco Certified"
//               value={hotel.is_eco_certified ? "Yes" : "No"}
//             />
//             <DetailItem
//               icon={<FaClock />}
//               label="Check-in Time"
//               value={hotel.check_in_from}
//             />
//             <DetailItem
//               icon={<FaClock />}
//               label="Check-out Time"
//               value={hotel.check_out_to}
//             />
//             <DetailItem
//               icon={<Tag />}
//               label="Rate Options"
//               value={hotel.rate_options}
//             />
//             <DetailItem
//               icon={<FaDirections />}
//               label="Directions"
//               value={hotel.directions}
//             />
//           </CardContent>
//         </Card>

//         {/* Property Details Card */}
//         <Card className="bg-white border-gray-200">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
//               <Building /> Property Details
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <DetailItem
//               icon={<FaRegBuilding />}
//               label="Floors"
//               value={hotel.number_floors}
//             />
//             <DetailItem
//               icon={<FaUtensils />}
//               label="Restaurants"
//               value={hotel.number_restaurants}
//             />
//             <DetailItem
//               icon={<GlassWater />}
//               label="Bars"
//               value={hotel.number_bars}
//             />
//             <DetailItem
//               icon={<ParkingCircle />}
//               label="Parks"
//               value={hotel.number_parks}
//             />
//             <DetailItem
//               icon={<Tally5 />}
//               label="Halls"
//               value={hotel.number_halls}
//             />
//             <DetailItem
//               icon={<Percent />}
//               label="Discount"
//               value={`${hotel.discount}%`}
//             />
//           </CardContent>
//         </Card>
//       </div>

//       {/* --- Room Types --- */}
//       <div className="mt-6">
//         <h2 className="text-2xl font-semibold text-gray-900 mb-4">
//           Room Types
//         </h2>
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//           {hotel.room_type.map((rt: RoomType) => (
//             <Card key={rt.id} className="bg-white border-gray-200">
//               <CardHeader>
//                 <CardTitle>{rt.name}</CardTitle>
//                 <CardDescription>Code: {rt.code}</CardDescription>
//               </CardHeader>
//               <CardContent className="text-sm space-y-2">
//                 <div className="flex justify-between">
//                   <span>Max Occupancy:</span>{" "}
//                   <span className="font-semibold">{rt.max_occupancy}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Bed Type:</span>{" "}
//                   <span className="font-semibold">{rt.bed_type}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Base Price:</span>{" "}
//                   <span className="font-semibold">
//                     ${parseFloat(rt.base_price).toFixed(2)}
//                   </span>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>

//       {/* --- Hotel Features --- */}
//       <div className="mt-6">
//         <h2 className="text-2xl font-semibold text-gray-900 mb-4">
//           Hotel Features
//         </h2>
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
//           <FeatureCard
//             title="Amenities"
//             icon={<Shapes className="h-5 w-5 text-indigo-600" />}
//             items={amenities}
//             isLoading={amenityQueries.some((q) => q.isLoading)}
//           />
//           <FeatureCard
//             title="Facilities"
//             icon={<Shapes className="h-5 w-5 text-pink-600" />}
//             items={facilities}
//             isLoading={facilityQueries.some((q) => q.isLoading)}
//           />
//           <FeatureCard
//             title="Services"
//             icon={<ConciergeBell className="h-5 w-5 text-blue-600" />}
//             items={services}
//             isLoading={serviceQueries.some((q) => q.isLoading)}
//           />
//           <FeatureCard
//             title="Meal Plans"
//             icon={<FaUtensils className="h-5 w-5 text-orange-600" />}
//             items={mealTypes}
//             isLoading={mealTypeQueries.some((q) => q.isLoading)}
//           />
//           <FeatureCard
//             title="Departments"
//             icon={<Building2 className="h-5 w-5 text-gray-600" />}
//             items={departments}
//             isLoading={departmentQueries.some((q) => q.isLoading)}
//           />
//         </div>
//       </div>
//       <AddEditImageModal
//         isOpen={isAddImageModalOpen}
//         onOpenChange={setIsAddImageModalOpen}
//         image={null}
//         hotelId={HOTEL_ID}
//       />
//     </div>
//   );
// }

// src/pages/HotelDetails.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useHotel } from "../../providers/hotel-provider";
import { IoInformationCircleOutline } from "react-icons/io5";
import {
  useQueries,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import hotelClient from "../../api/hotel-client";
import { toast } from "sonner";
import ErrorPage from "@/components/custom/error-page";
import {
  Loader,
  Pencil,
  Building,
  Clock,
  MapPin,
  Leaf,
  Utensils,
  ParkingCircle,
  GlassWater,
  Tally5,
  Image as ImageIcon,
  PlusCircle,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X as XIcon,
} from "lucide-react";
import { FaArrowLeft, FaStar } from "react-icons/fa";
import { LuNotebookText } from "react-icons/lu";
import { FaRegCircleCheck } from "react-icons/fa6";
import { Gauge } from "@mui/x-charts/Gauge";
import {
  BarChart,
  PieChart,
  Bar,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AddEditImageModal } from "./customize-hotel/AddEditImageModal"; // Ensure this component exists
import { PiMapPinSimpleArea } from "react-icons/pi";

// --- Type Imports ---
import type { Amenity } from "@/types/amenities";
import type { Facility } from "@/types/facilities";
import type {
  Service,
  Department,
  MealType,
  HotelImage,
} from "../../types/hotel-types";
import { shorten } from "@/utils/truncate";
import { ExpandableText } from "@/components/custom/expandable-text";

// --- Helper Components & Functions ---
const renderStarRating = (rating: number) => (
  <div className="flex items-center gap-1">
    {[...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        className={i < rating ? "text-yellow-400" : "text-gray-300"}
      />
    ))}
  </div>
);

const DetailItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | React.ReactNode;
}) => (
  <div>
    <p className="text-sm text-[#838383] flex items-center gap-2">
      {icon} {label}
    </p>
    <p className="font-semibold text-md text-[#334155] mt-1">
      {value || "N/A"}
    </p>
  </div>
);

const getStatusColor = (status: string) => {
  switch (status) {
    case "Available":
      return "#4ade80";
    case "Booked":
      return "#f87171";
    case "Maintenance":
      return "#fbbf24";
    default:
      return "#94a3b8";
  }
};

const getRoomTypeColor = (roomType: string) => {
  const colors = [
    "#00DA7F",
    "#00D490",
    "#00CC9F",
    "#1C90F5",
    "#00BDBB",
    "#00A6DC",
    "#1397EE",
    "#2881FF",
  ];
  const index =
    roomType.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    colors.length;
  return colors[index];
};

// --- Image Slider Component (Updated) ---
const ImageSlider = ({
  images,
  hotelId,
}: {
  images: HotelImage[];
  hotelId: string;
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<HotelImage | null>(null);
  const [imageToDelete, setImageToDelete] = useState<HotelImage | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<HotelImage | null>(
    null
  ); // State for fullscreen modal
  const queryClient = useQueryClient();

  const deleteImageMutation = useMutation({
    mutationFn: (imageId: string) =>
      hotelClient.delete(`/hotel-images/${imageId}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotelImages", hotelId] });
      setImageToDelete(null);
      toast.success("Image deleted successfully");
    },
    onError: () => toast.error("Failed to delete image. Please try again."),
  });

  const handleOpenAddModal = () => {
    setEditingImage(null);
    setIsModalOpen(true);
  };
  const handleOpenEditModal = (image: HotelImage) => {
    setEditingImage(image);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const checkScroll = () => {
      if (sliderRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5); // 5px buffer
      }
    };
    checkScroll();
    const slider = sliderRef.current;
    slider?.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      slider?.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [images]);

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <div className="relative">
        {!images || images.length === 0 ? (
          <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-500 rounded-lg">
            <div className="text-center">
              <p className="font-medium">No images available</p>
              <Button
                variant="ghost"
                onClick={handleOpenAddModal}
                className="mt-2 text-[#1D4ED8] hover:bg-blue-50"
              >
                <PlusCircle className="h-5 w-5 mr-2 text-[#0081FB]" /> Add
                Images
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div
              ref={sliderRef}
              className="w-fit flex overflow-x-scroll gap-x-4 pb-2 scroll-smooth"
              style={{ scrollbarWidth: "none" }}
            >
              {images.map((image) => (
                <div
                  key={image.id}
                  className="relative flex-shrink-0 w-64 h-64 snap-center group cursor-pointer"
                  onClick={() => setFullscreenImage(image)}
                >
                  <img
                    src={image.original}
                    alt={image.tag || "Hotel image"}
                    className="w-full h-full object-cover rounded-none shadow-md"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none">
                    <div className="absolute top-2 right-2 flex gap-2 pointer-events-auto">
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-none hover:text-[#FFF] hover:bg-[#0081FB] text-black cursor-pointer transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditModal(image);
                        }}
                        aria-label={`Edit image`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="hover:bg-red-500 hover:text-white border-none cursor-pointer transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImageToDelete(image);
                        }}
                        aria-label={`Delete image`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {canScrollLeft && (
              <Button
                onClick={() => scroll("left")}
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full shadow bg-[#0081FB] cursor-pointer hover:bg-blue-600"
                aria-label="Scroll left"
              >
                <ChevronLeft className="text-[#FFF]" />
              </Button>
            )}
            {canScrollRight && (
              <Button
                onClick={() => scroll("right")}
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full shadow bg-[#0081FB] cursor-pointer hover:bg-blue-600"
                aria-label="Scroll right"
              >
                <ChevronRight className="text-[#FFF]" />
              </Button>
            )}
          </>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AddEditImageModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        image={editingImage}
        hotelId={hotelId}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!imageToDelete}
        onOpenChange={() => setImageToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete the image.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteImageMutation.mutate(imageToDelete!.id)}
              disabled={deleteImageMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteImageMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* NEW: Fullscreen Image Viewer Modal */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setFullscreenImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-50"
            aria-label="Close fullscreen image"
          >
            <XIcon size={32} />
          </button>
          <img
            src={fullscreenImage.original}
            alt={fullscreenImage.tag || "Fullscreen hotel image"}
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image itself
          />
        </div>
      )}
    </>
  );
};

// --- Main Component ---
export default function HotelDetails() {
  const {
    hotel,
    isLoading: isHotelLoading,
    isError,
    error,
    refetch,
  } = useHotel();
  const navigate = useNavigate();

  // --- Data Fetching Logic ---
  const { data: hotelImagesData, isLoading: isLoadingImages } = useQuery({
    queryKey: ["hotelImages", hotel?.id],
    queryFn: async () => {
      const res = await hotelClient.get(`/hotel-images/?hotel_id=${hotel!.id}`);
      return (
        res.data && Array.isArray(res.data.results) ? res.data.results : []
      ) as HotelImage[];
    },
    enabled: !!hotel?.id,
  });
  const amenityQueries = useQueries({
    queries: (hotel?.amenities || []).map((id) => ({
      queryKey: ["amenity", id],
      queryFn: () =>
        hotelClient.get(`/amenities/${id}/`).then((res) => res.data as Amenity),
      enabled: !!hotel,
    })),
  });
  const facilityQueries = useQueries({
    queries: (hotel?.facilities || []).map((id) => ({
      queryKey: ["facility", id],
      queryFn: () =>
        hotelClient
          .get(`/facilities/${id}/`)
          .then((res) => res.data as Facility),
      enabled: !!hotel,
    })),
  });
  const serviceQueries = useQueries({
    queries: (hotel?.services || []).map((id) => ({
      queryKey: ["service", id],
      queryFn: () =>
        hotelClient.get(`/services/${id}/`).then((res) => res.data as Service),
      enabled: !!hotel,
    })),
  });
  const mealTypeQueries = useQueries({
    queries: (hotel?.meal_types || []).map((id) => ({
      queryKey: ["mealType", id],
      queryFn: () =>
        hotelClient
          .get(`/meal-types/${id}/`)
          .then((res) => res.data as MealType),
      enabled: !!hotel,
    })),
  });
  const departmentQueries = useQueries({
    queries: (hotel?.department_ids || []).map((id) => ({
      queryKey: ["department", id],
      queryFn: () =>
        hotelClient
          .get(`/departments/${id}/`)
          .then((res) => res.data as Department),
      enabled: !!hotel,
    })),
  });

  if (isHotelLoading) {
    return (
      <div className="p-6 w-full h-screen flex items-center justify-center text-[#334155]">
        <Loader className="animate-spin text-[#0081FB]" size={48} />
      </div>
    );
  }
  if (isError) {
    return <ErrorPage error={error as Error} onRetry={refetch} />;
  }
  if (!hotel) {
    return <div className="p-6 text-[#334155]">No hotel details found.</div>;
  }

  const amenities = amenityQueries
    .filter((q) => q.isSuccess)
    .map((q) => q.data);
  const facilities = facilityQueries
    .filter((q) => q.isSuccess)
    .map((q) => q.data);
  const services = serviceQueries.filter((q) => q.isSuccess).map((q) => q.data);
  const mealTypes = mealTypeQueries
    .filter((q) => q.isSuccess)
    .map((q) => q.data);
  const departments = departmentQueries
    .filter((q) => q.isSuccess)
    .map((q) => q.data);

  return (
    <div className="p-4 sm:p-6 bg-none min-h-screen">
      <div className="max-w-8xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            <FaArrowLeft className="mr-2 text-[#0081FB]" />
            Back
          </button>
          <Button
            asChild
            className="bg-[#0081FB] text-[#FFF] cursor-pointer hover:bg-blue-700 transition-all"
          >
            <Link to="/hotel/customize-hotel">
              <Pencil className="mr-1 h-4 w-4 text-[#FFF]" /> Customize Hotel
            </Link>
          </Button>
        </div>
        <div className="bg-none rounded-md border-none shadow-none py-6 px-0 mb-6">
          <h1 className="text-3xl uppercase font-bold text-[#202020]">
            {hotel.name}
          </h1>
          <div className="flex items-center gap-4 mt-2 mb-2">
            {renderStarRating(hotel.star_rating)}
            {hotel.year_built && (
              <>
                <span className="text-gray-300">|</span>
                <p className="text-sm text-gray-500">
                  Established {hotel.year_built}
                </p>
              </>
            )}
          </div>
          <p className="text-md text-[#838383]">
            {hotel.address}, {hotel.zip_code}
          </p>
        </div>

        <div className="w-full my-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-md shadow border-[1.25px] border-[#DADCE0] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Occupancy Rate</p>
                  <p className="text-2xl font-bold">{hotel.occupancy_rate}%</p>
                  <p className="text-xs text-gray-400">
                    Last updated:{" "}
                    {new Date(
                      hotel.availability_stats.last_updated
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div className="w-30 h-30">
                  <Gauge
                    value={hotel.occupancy_rate}
                    startAngle={360}
                    endAngle={0}
                    sx={{
                      [`& .MuiGauge-valueText`]: {
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                      },
                    }}
                    text={`${hotel.occupancy_rate}%`}
                  />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-md border-[1.25px] border-[#DADCE0] shadow p-4">
              <p className="text-sm text-gray-500">Room Pricing (USD)</p>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm">Average:</span>
                  <span className="font-semibold">
                    ${hotel.average_room_price?.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Min:</span>
                  <span className="font-semibold">
                    ${hotel.pricing_data.min?.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Max:</span>
                  <span className="font-semibold">
                    ${hotel.pricing_data.max?.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="mt-2 h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
                  style={{
                    width: `${
                      ((hotel.average_room_price - hotel.pricing_data.min) /
                        (hotel.pricing_data.max - hotel.pricing_data.min)) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="bg-white border-[1.25px] border-[#DADCE0] rounded-md shadow p-4">
              <p className="text-sm text-gray-500">Room Status</p>
              <div className="mt-2 space-y-2">
                {Object.entries(hotel.availability_stats.status_counts).map(
                  ([status, count]) => (
                    <div key={status} className="flex items-center">
                      <span className="text-xs w-24 truncate">{status}:</span>
                      <div className="flex-1 ml-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${
                                (count / hotel.summary_counts.rooms) * 100
                              }%`,
                              backgroundColor: getStatusColor(status),
                            }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-xs font-medium ml-2">{count}</span>
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="bg-white border-[1.25px] border-[#DADCE0] rounded-md shadow p-4">
              <p className="text-sm text-gray-500">Current Discount</p>
              <p className="text-3xl font-bold text-green-600 my-2">
                {hotel.discount}%
              </p>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="h-4 bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                  style={{ width: `${hotel.discount}%` }}
                ></div>
              </div>
              <p className="text-[0.875rem] text-gray-400 mt-1">
                Max discount: {hotel.max_discount_percent || hotel.discount}%
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border-[1.25px] border-[#DADCE0] rounded-md shadow p-4">
              <h3 className="text-lg font-semibold mb-4">
                Room Type Distribution
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={hotel.room_type.map((room) => ({
                        name: room.name,
                        value: room.room_counts.total,
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#1C90F5"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {hotel.room_type.map((room) => (
                        <Cell
                          key={`cell-${room.id}`}
                          fill={getRoomTypeColor(room.name)}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white border-[1.25px] border-[#DADCE0] rounded-md shadow p-4">
              <h3 className="text-lg font-semibold mb-4">
                Room Status Overview
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={hotel.room_type.map((room) => ({
                      name: room.name,
                      Available: room.availability.available_rooms,
                      Booked: room.availability.booked_rooms,
                      Maintenance: room.availability.maintenance_rooms,
                      Other:
                        room.room_counts.total -
                        (room.availability.available_rooms +
                          room.availability.booked_rooms +
                          room.availability.maintenance_rooms),
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Available" stackId="a" fill="#00C5AD" />
                    <Bar dataKey="Booked" stackId="a" fill="#089EE6" />
                    <Bar dataKey="Maintenance" stackId="a" fill="#fbbf24" />
                    <Bar dataKey="Other" stackId="a" fill="#94a3b8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className="bg-none shadow-none border-none max-w-[100%] py-6 px-0">
            <h2 className="flex items-center gap-x-2 text-xl font-semibold text-[#334155] border-b border-[#E8E8E8] pb-3 mb-4">
              <ImageIcon size={18} className="text-[#0081FB]" /> Hotel Gallery
            </h2>
            {isLoadingImages ? (
              <div className="h-64 flex justify-center items-center">
                <Loader className="animate-spin text-[#0081FB]" />
              </div>
            ) : (
              <ImageSlider images={hotelImagesData || []} hotelId={hotel.id} />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border-[1.25px] border-[#DADCE0] rounded-md shadow p-6">
              <h2 className="flex items-center gap-x-2 text-xl font-semibold text-[#334155] border-b border-[#E8E8E8] pb-3 mb-4">
                Hotel Description
              </h2>
              <p className="text-[#334155] text-[0.9375rem] leading-relaxed">
                <ExpandableText text={hotel.description} wordLimit={70} />
              </p>
            </div>
            {/* - - - - Hotel Direction Curently */}
            <div className="bg-white border-[1.25px] border-[#DADCE0] rounded-md shadow p-6">
              <h2 className="flex items-center gap-x-2 text-xl font-semibold text-[#334155] border-b border-[#E8E8E8] pb-3 mb-4">
                Hotel Direction
              </h2>
              <ExpandableText text={hotel.directions} wordLimit={70} />
            </div>
            <div className="bg-white border-[1.25px] border-[#DADCE0] rounded-md shadow p-6">
              <h2 className="text-xl font-semibold text-[#334155] pb-3 mb-4 border-b border-[#E8E8E8]">
                Hotel Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DetailItem
                  icon={<Clock size={16} className="text-[#0081FB]" />}
                  label="Check-in Time"
                  value={hotel.check_in_from}
                />
                <DetailItem
                  icon={<Clock size={16} className="text-[#0081FB]" />}
                  label="Check-out Time"
                  value={hotel.check_out_to}
                />
                <DetailItem
                  icon={<Leaf size={16} className="text-[#0081FB]" />}
                  label="Eco Certified"
                  value={hotel.is_eco_certified ? "Yes" : "No"}
                />
                {/* - - - Hotel Direction was here */}
                <DetailItem
                  icon={
                    <PiMapPinSimpleArea size={16} className="text-[#0081FB]" />
                  }
                  label="Latitude"
                  value={hotel.latitude}
                />

                <DetailItem
                  icon={
                    <PiMapPinSimpleArea size={16} className="text-[#0081FB]" />
                  }
                  label="Longitude"
                  value={hotel.longitude}
                />
              </div>
            </div>
            <div className="bg-white border-[1.25px] border-[#DADCE0] rounded-md shadow p-6">
              <h2 className="text-xl font-semibold text-[#334155] border-b border-[#E8E8E8] pb-3 mb-4">
                Hotel Features
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <FeatureList
                  title="Amenities"
                  items={amenities}
                  isLoading={amenityQueries.some((q) => q.isLoading)}
                />
                <FeatureList
                  title="Facilities"
                  items={facilities}
                  isLoading={facilityQueries.some((q) => q.isLoading)}
                />
                <FeatureList
                  title="Services"
                  items={services}
                  isLoading={serviceQueries.some((q) => q.isLoading)}
                />
                <FeatureList
                  title="Meal Plans"
                  items={mealTypes}
                  isLoading={mealTypeQueries.some((q) => q.isLoading)}
                />
                <FeatureList
                  title="Departments"
                  items={departments}
                  isLoading={departmentQueries.some((q) => q.isLoading)}
                />
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white border-[1.25px] border-[#DADCE0] rounded-md shadow p-6">
              <h2 className="text-xl font-semibold text-[#334155] border-b border-[#E8E8E8] pb-3 mb-4">
                Room & Pricing Overview
              </h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-[#838383]">Total Rooms</p>
                  <p className="font-bold text-lg text-[#334155]">
                    {hotel.summary_counts.rooms}
                  </p>
                </div>
                <div>
                  <p className="text-[#838383]">Occupancy Rate</p>
                  <p className="font-bold text-lg text-emerald-500">
                    {hotel.occupancy_rate}%
                  </p>
                </div>
                <div>
                  <p className="text-[#838383]">Average Price</p>
                  <p className="font-bold text-lg text-[#334155]">
                    ${hotel.average_room_price?.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-[#838383]">Discount</p>
                  <p className="font-bold text-lg text-[#334155]">
                    {hotel.discount}%
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white border-[1.25px] border-[#DADCE0] rounded-md shadow p-6">
              <h2 className="text-xl font-semibold text-[#334155] border-b border-[#E8E8E8] pb-3 mb-4">
                Property Details
              </h2>
              <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                <DetailItem
                  icon={<Building size={16} className="text-[#0081FB]" />}
                  label="Floors"
                  value={hotel.number_floors}
                />
                <DetailItem
                  icon={<Utensils size={16} className="text-[#0081FB]" />}
                  label="Restaurants"
                  value={hotel.number_restaurants}
                />
                <DetailItem
                  icon={<GlassWater size={16} className="text-[#0081FB]" />}
                  label="Bars"
                  value={hotel.number_bars}
                />
                <DetailItem
                  icon={<ParkingCircle size={16} className="text-[#0081FB]" />}
                  label="Parks"
                  value={hotel.number_parks}
                />
                <DetailItem
                  icon={<Tally5 size={16} className="text-[#0081FB]" />}
                  label="Halls"
                  value={hotel.number_halls}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const FeatureList = ({
  title,
  items,
  isLoading,
}: {
  title: string;
  items: { id: string; name: string }[];
  isLoading: boolean;
}) => (
  <div>
    <h3 className="text-md font-semibold text-[#334155] mb-2">{title}</h3>
    {isLoading ? (
      <p className="text-sm text-[#838383]">Loading...</p>
    ) : (
      <ul className="space-y-2">
        {items.length > 0 ? (
          items.map((item) => (
            <li
              key={item.id}
              className="flex items-center text-sm text-[#202020]"
            >
              <FaRegCircleCheck className="mr-2 text-green-500" /> {item.name}
            </li>
          ))
        ) : (
          <p className="text-sm text-gray-400">
            No {title.toLowerCase()} listed.
          </p>
        )}
      </ul>
    )}
  </div>
);
