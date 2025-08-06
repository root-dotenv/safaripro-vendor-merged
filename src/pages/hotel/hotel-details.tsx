// "use client";
// import { useHotel } from "../../providers/hotel-provider";
// import { useQueries, useQuery } from "@tanstack/react-query";
// import hotelClient from "../../api/hotel-client";
// import { Bar, BarChart, CartesianGrid, Cell, Rectangle, XAxis } from "recharts";
// import {
//   FaWifi,
//   FaCoffee,
//   FaSnowflake,
//   FaTv,
//   FaCar,
//   FaUtensils,
//   FaSwimmer,
//   FaSpa,
//   FaStar,
//   FaUsers,
//   FaTree,
//   FaHeart,
//   FaBriefcase,
//   FaSun,
//   FaFacebook,
//   FaInstagram,
//   FaTwitter,
//   FaGlobe,
//   FaImages,
//   FaMapMarkerAlt,
//   FaPencilAlt,
//   FaBuilding,
//   FaDoorClosed,
//   FaGlassCheers,
// } from "react-icons/fa";
// import { GiMeal, GiGreenhouse } from "react-icons/gi";
// import { TrendingUp } from "lucide-react";
// import { Link } from "react-router-dom";

// // Shadcn UI Components
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
// import { Separator } from "@/components/ui/separator";
// import {
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
//   type ChartConfig,
// } from "@/components/ui/chart";
// import type {
//   Theme,
//   MealType,
//   HotelType,
//   HotelImage,
// } from "../../types/hotel-types";
// import type { Amenity } from "@/types/amenities";
// import type { Facility } from "@/types/facilities";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";

// // --- HELPER FUNCTIONS ---
// const getIconForEntity = (
//   name: string,
//   type: "amenity" | "facility" | "theme"
// ) => {
//   const lname = name.toLowerCase();
//   if (type === "amenity" || type === "facility") {
//     if (lname.includes("wifi")) return <FaWifi className="text-blue-500" />;
//     if (lname.includes("pool")) return <FaSwimmer className="text-cyan-500" />;
//     if (lname.includes("parking")) return <FaCar className="text-gray-600" />;
//     if (lname.includes("restaurant"))
//       return <FaUtensils className="text-orange-500" />;
//     if (lname.includes("spa")) return <FaSpa className="text-purple-500" />;
//     if (lname.includes("tv")) return <FaTv className="text-slate-700" />;
//     if (lname.includes("air cond"))
//       return <FaSnowflake className="text-sky-400" />;
//     if (lname.includes("coffee"))
//       return <FaCoffee className="text-yellow-800" />;
//   }
//   if (type === "theme") {
//     if (lname.includes("family")) return <FaUsers className="text-green-500" />;
//     if (lname.includes("business"))
//       return <FaBriefcase className="text-blue-700" />;
//     if (lname.includes("romantic")) return <FaHeart className="text-red-500" />;
//     if (lname.includes("beach")) return <FaSun className="text-yellow-500" />;
//     if (lname.includes("safari")) return <FaTree className="text-lime-600" />;
//   }
//   return <GiMeal className="text-amber-600" />;
// };

// // --- MAIN COMPONENT ---
// export default function HotelDashboard() {
//   const { hotel, isLoading: isHotelLoading } = useHotel();

//   const { data: hotelTypeDetails } = useQuery<HotelType>({
//     queryKey: ["hotelType", hotel?.hotel_type],
//     queryFn: () =>
//       hotelClient
//         .get(`/hotel-types/${hotel?.hotel_type}/`)
//         .then((res) => res.data),
//     enabled: !!hotel?.hotel_type,
//   });

//   const imageQueries = useQueries({
//     queries: (hotel?.image_ids || []).map((id) => ({
//       queryKey: ["hotelImage", id],
//       queryFn: () =>
//         hotelClient
//           .get(`/hotel-images/${id}/`)
//           .then((res) => res.data as HotelImage),
//       enabled: !!hotel,
//     })),
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

//   const themeQueries = useQueries({
//     queries: (hotel?.themes || []).map((id) => ({
//       queryKey: ["theme", id],
//       queryFn: () =>
//         hotelClient.get(`/themes/${id}/`).then((res) => res.data as Theme),
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

//   if (isHotelLoading)
//     return <div className="p-6">Loading hotel information...</div>;
//   if (!hotel) return <div className="p-6">No hotel data available.</div>;

//   const hotelImages = imageQueries
//     .filter((q) => q.isSuccess)
//     .map((q) => q.data.original);
//   const amenities = amenityQueries
//     .filter((q) => q.isSuccess)
//     .map((q) => q.data);
//   const facilities = facilityQueries
//     .filter((q) => q.isSuccess)
//     .map((q) => q.data);
//   const themes = themeQueries.filter((q) => q.isSuccess).map((q) => q.data);
//   const mealTypes = mealTypeQueries
//     .filter((q) => q.isSuccess)
//     .map((q) => q.data);

//   const roomStatusData = {
//     Available: hotel.availability_stats.status_counts.Available || 0,
//     Booked: hotel.availability_stats.status_counts.Booked || 0,
//     Maintenance: hotel.room_type.reduce(
//       (acc, rt) => acc + (rt.room_counts.Maintenance || 0),
//       0
//     ),
//   };

//   const roomTypeDistributionData = hotel.room_type.map((rt) => ({
//     name: rt.name,
//     total: rt.room_counts.total,
//     fill: `var(--chart-${hotel.room_type.indexOf(rt) + 1})`,
//   }));

//   const chartConfig = {
//     total: { label: "Total Rooms" },
//     ...Object.fromEntries(
//       hotel.room_type.map((rt) => [
//         rt.name,
//         {
//           label: rt.name,
//           color: `var(--chart-${hotel.room_type.indexOf(rt) + 1})`,
//         },
//       ])
//     ),
//   } satisfies ChartConfig;

//   return (
//     <div className="p-4 sm:p-6 lg:p-8 min-h-screen space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-start">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight text-gray-900">
//             {hotel.name}
//           </h1>
//           <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-2 text-sm text-muted-foreground">
//             <span>{hotel.address}</span>
//             <span className="text-gray-300 hidden md:inline">•</span>
//             <span className="font-semibold text-primary">
//               {hotelTypeDetails?.name || "..."}
//             </span>
//             <span className="text-gray-300 hidden md:inline">•</span>
//             <div className="flex items-center gap-1">
//               {Array.from({ length: hotel.star_rating }).map((_, i) => (
//                 <FaStar key={i} className="text-yellow-400" />
//               ))}
//             </div>
//           </div>
//         </div>

//         <Button variant={"outline"} asChild>
//           <Link to="/hotel/customize-hotel">
//             <FaPencilAlt className="mr-2 h-4 w-4" />
//             Customize Hotel
//           </Link>
//         </Button>
//       </div>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Occupancy Rate</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <TooltipProvider delayDuration={0}>
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <p className="text-4xl font-bold">
//                     {hotel.occupancy_rate.toFixed(1)}%
//                   </p>
//                 </TooltipTrigger>
//                 <TooltipContent className="py-2">
//                   <div className="space-y-2">
//                     <div className="text-[13px] font-medium">
//                       Current Occupancy
//                     </div>
//                     <div className="flex items-center gap-2 text-xs">
//                       <svg
//                         width="8"
//                         height="8"
//                         fill="currentColor"
//                         viewBox="0 0 8 8"
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="shrink-0 text-indigo-500"
//                         aria-hidden="true"
//                       >
//                         <circle cx="4" cy="4" r="4"></circle>
//                       </svg>
//                       <span className="flex grow gap-2">
//                         Available{" "}
//                         <span className="ml-auto">
//                           {roomStatusData.Available}
//                         </span>
//                       </span>
//                     </div>
//                     <div className="flex items-center gap-2 text-xs">
//                       <svg
//                         width="8"
//                         height="8"
//                         fill="currentColor"
//                         viewBox="0 0 8 8"
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="shrink-0 text-purple-500"
//                         aria-hidden="true"
//                       >
//                         <circle cx="4" cy="4" r="4"></circle>
//                       </svg>
//                       <span className="flex grow gap-2">
//                         Booked{" "}
//                         <span className="ml-auto">{roomStatusData.Booked}</span>
//                       </span>
//                     </div>
//                   </div>
//                 </TooltipContent>
//               </Tooltip>
//             </TooltipProvider>
//             <Progress value={hotel.occupancy_rate} className="mt-2 h-2" />
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader>
//             <CardTitle>Avg. Room Price</CardTitle>
//             <CardDescription>(USD)</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <TooltipProvider delayDuration={0}>
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <p className="text-4xl font-bold">
//                     ${hotel.average_room_price.toFixed(2)}
//                   </p>
//                 </TooltipTrigger>
//                 <TooltipContent className="py-2">
//                   <div className="space-y-2">
//                     <div className="text-[13px] font-medium">Pricing Range</div>
//                     <div className="flex items-center gap-2 text-xs">
//                       <svg
//                         width="8"
//                         height="8"
//                         fill="currentColor"
//                         viewBox="0 0 8 8"
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="shrink-0 text-indigo-500"
//                         aria-hidden="true"
//                       >
//                         <circle cx="4" cy="4" r="4"></circle>
//                       </svg>
//                       <span className="flex grow gap-2">
//                         Min{" "}
//                         <span className="ml-auto">
//                           ${hotel.pricing_data.min.toFixed(2)}
//                         </span>
//                       </span>
//                     </div>
//                     <div className="flex items-center gap-2 text-xs">
//                       <svg
//                         width="8"
//                         height="8"
//                         fill="currentColor"
//                         viewBox="0 0 8 8"
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="shrink-0 text-purple-500"
//                         aria-hidden="true"
//                       >
//                         <circle cx="4" cy="4" r="4"></circle>
//                       </svg>
//                       <span className="flex grow gap-2">
//                         Max{" "}
//                         <span className="ml-auto">
//                           ${hotel.pricing_data.max.toFixed(2)}
//                         </span>
//                       </span>
//                     </div>
//                   </div>
//                 </TooltipContent>
//               </Tooltip>
//             </TooltipProvider>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader>
//             <CardTitle>Room Status</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-2 text-sm">
//             <div className="flex justify-between items-center">
//               <span className="text-green-600">Available</span>
//               <span className="font-mono font-semibold">
//                 {roomStatusData.Available}
//               </span>
//             </div>
//             <div className="flex justify-between items-center">
//               <span className="text-amber-600">Booked</span>
//               <span className="font-mono font-semibold">
//                 {roomStatusData.Booked}
//               </span>
//             </div>
//             <div className="flex justify-between items-center">
//               <span className="text-red-600">Maintenance</span>
//               <span className="font-mono font-semibold">
//                 {roomStatusData.Maintenance}
//               </span>
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader>
//             <CardTitle>Property Details</CardTitle>
//           </CardHeader>
//           <CardContent className="grid grid-cols-2 gap-2 text-sm">
//             <div className="flex items-center gap-2">
//               <FaBuilding className="text-blue-500" />
//               <span>{hotel.number_floors} Floors</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <FaDoorClosed className="text-blue-500" />
//               <span>{hotel.number_rooms} Rooms</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <FaUtensils className="text-blue-500" />
//               <span>{hotel.number_restaurants} Restaurants</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <FaGlassCheers className="text-blue-500" />
//               <span>{hotel.number_bars} Bars</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <GiGreenhouse className="text-blue-500" />
//               <span>{hotel.number_parks} Parks</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <FaUsers className="text-blue-500" />
//               <span>{hotel.number_halls} Halls</span>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Gallery Card */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <FaImages /> Gallery
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-3">
//             {hotelImages.slice(0, 8).map((src, index) => (
//               <img
//                 key={index}
//                 src={src}
//                 alt={`Hotel ${index + 1}`}
//                 className="w-full h-28 object-cover rounded-md shadow-sm hover:scale-105 transition-transform cursor-pointer"
//               />
//             ))}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Charts & Details Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <Card className="lg:col-span-2">
//           <CardHeader>
//             <CardTitle>Room Type Distribution</CardTitle>
//             <CardDescription>Current room inventory by type</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <ChartContainer config={chartConfig} className="h-[250px] w-full">
//               <BarChart accessibilityLayer data={roomTypeDistributionData}>
//                 <CartesianGrid vertical={false} />
//                 <XAxis
//                   dataKey="name"
//                   tickLine={false}
//                   tickMargin={10}
//                   axisLine={false}
//                   tickFormatter={(value) =>
//                     chartConfig[value as keyof typeof chartConfig]?.label
//                   }
//                 />
//                 <ChartTooltip
//                   cursor={false}
//                   content={<ChartTooltipContent hideLabel />}
//                 />
//                 <Bar
//                   dataKey="total"
//                   strokeWidth={2}
//                   radius={8}
//                   activeBar={({ ...props }) => {
//                     return (
//                       <Rectangle
//                         {...props}
//                         fillOpacity={0.8}
//                         stroke={props.payload.fill}
//                         strokeDasharray={4}
//                         strokeDashoffset={4}
//                       />
//                     );
//                   }}
//                 >
//                   {roomTypeDistributionData.map((entry, index) => {
//                     // Blue color palette with different shades
//                     const blueColors = [
//                       "#193bb9", // Dark blue
//                       "#2c7fff", // Medium blue
//                       "#8FC5FF", // Light blue
//                       "#1547e5", // Royal blue
//                       "#5aa0ff", // Sky blue
//                     ];
//                     return (
//                       <Cell
//                         key={`cell-${index}`}
//                         fill={blueColors[index % blueColors.length]}
//                       />
//                     );
//                   })}
//                 </Bar>
//               </BarChart>
//             </ChartContainer>
//           </CardContent>
//           <CardContent className="flex-col items-start gap-2 text-sm">
//             <div className="flex gap-2 leading-none font-medium">
//               <TrendingUp className="h-4 w-4" /> Showing distribution across all
//               room types
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader>
//             <CardTitle>Details</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div>
//               <h3 className="font-semibold">Description</h3>
//               <p className="text-sm text-muted-foreground">
//                 {hotel.description}
//               </p>
//             </div>
//             <Separator />
//             <div>
//               <h3 className="font-semibold mb-2">Themes</h3>
//               <div className="flex flex-wrap gap-2">
//                 {themes.map((t) => (
//                   <Badge key={t.id} variant="outline">
//                     {t.name}
//                   </Badge>
//                 ))}
//               </div>
//             </div>
//             <Separator />
//             <div>
//               <h3 className="font-semibold mb-2">Meal Plans</h3>
//               <div className="flex flex-wrap gap-2">
//                 {mealTypes.map((m) => (
//                   <Badge key={m.id} variant="secondary">
//                     {m.name}
//                   </Badge>
//                 ))}
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Amenities, Facilities, Contact Section */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Amenities</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ul className="space-y-2 text-sm">
//               {amenities.map((a) => (
//                 <li key={a.id} className="flex items-center gap-2">
//                   {getIconForEntity(a.name, "amenity")} {a.name}
//                 </li>
//               ))}
//             </ul>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader>
//             <CardTitle>Facilities</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ul className="space-y-2 text-sm">
//               {facilities.map((f) => (
//                 <li key={f.id} className="flex items-center gap-2">
//                   {getIconForEntity(f.name, "facility")} {f.name}
//                 </li>
//               ))}
//             </ul>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader>
//             <CardTitle>Contact & Location</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ul className="space-y-3 text-sm">
//               <li className="flex items-center gap-2">
//                 <FaMapMarkerAlt /> {hotel.zip_code}, {hotel.address}
//               </li>
//               <li className="flex items-center gap-2">
//                 Lat: {hotel.latitude}, Lng: {hotel.longitude}
//               </li>
//               <li className="flex gap-3 pt-2">
//                 <Button variant="outline" size="icon" asChild>
//                   <a href={hotel.website_url || "#"}>
//                     <FaGlobe />
//                   </a>
//                 </Button>
//                 <Button variant="outline" size="icon" asChild>
//                   <a href={hotel.facebook_url || "#"}>
//                     <FaFacebook />
//                   </a>
//                 </Button>
//                 <Button variant="outline" size="icon" asChild>
//                   <a href={hotel.instagram_url || "#"}>
//                     <FaInstagram />
//                   </a>
//                 </Button>
//                 <Button variant="outline" size="icon" asChild>
//                   <a href={hotel.twitter_url || "#"}>
//                     <FaTwitter />
//                   </a>
//                 </Button>
//               </li>
//             </ul>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

"use client";
import { useHotel } from "../../providers/hotel-provider";
import { useQueries, useQuery } from "@tanstack/react-query";
import hotelClient from "../../api/hotel-client";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaGlobe,
  FaImages,
  FaMapMarkerAlt,
  FaPencilAlt,
  FaDoorClosed,
  FaUserTie,
  FaStar,
} from "react-icons/fa";
import {
  TrendingUp,
  Star,
  Phone,
  Mail,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import { BsDashSquare } from "react-icons/bs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Types
import type {
  MealType,
  HotelType,
  HotelImage,
  Service,
} from "../../types/hotel-types";
import type { Amenity } from "@/types/amenities";
import type { Facility } from "@/types/facilities";
import type { RoomType } from "./customize-hotel/hotel";
import React, { useState } from "react";
import { Collapsible, CollapsibleContent } from "@radix-ui/react-collapsible";
import { FaRegCircleCheck } from "react-icons/fa6";

// Helper functions
const getIconForEntity = (
  name: string,
  type: "amenity" | "facility" | "theme" | "service"
) => {
  const lname = name.toLowerCase();
  if (type === "amenity" || type === "facility" || type === "service") {
    if (lname.includes("wifi"))
      return <FaRegCircleCheck className="text-neutral-800" />;
    if (lname.includes("pool"))
      return <FaRegCircleCheck className="text-neutral-800" />;
    if (lname.includes("parking"))
      return <FaRegCircleCheck className="text-neutral-800" />;
    if (lname.includes("restaurant"))
      return <FaRegCircleCheck className="text-neutral-800" />;
    if (lname.includes("spa"))
      return <FaRegCircleCheck className="text-neutral-800" />;
    if (lname.includes("tv"))
      return <FaRegCircleCheck className="text-neutral-800" />;
    if (lname.includes("air cond"))
      return <FaRegCircleCheck className="text-neutral-800" />;
    if (lname.includes("coffee"))
      return <FaRegCircleCheck className="text-neutral-800" />;
    if (lname.includes("transport") || lname.includes("shuttle"))
      return <FaRegCircleCheck className="text-neutral-800" />;
    if (lname.includes("concierge") || lname.includes("desk"))
      return <FaRegCircleCheck className="text-neutral-800" />;
  }
  if (type === "theme") {
    if (lname.includes("family"))
      return <FaRegCircleCheck className="text-neutral-800" />;
    if (lname.includes("business"))
      return <FaRegCircleCheck className="text-neutral-800" />;
    if (lname.includes("romantic"))
      return <FaRegCircleCheck className="text-neutral-800" />;
    if (lname.includes("beach"))
      return <FaRegCircleCheck className="text-neutral-800" />;
    if (lname.includes("safari"))
      return <FaRegCircleCheck className="text-neutral-800" />;
  }
  return <FaRegCircleCheck className="text-neutral-800" />;
};

// Enhanced staff data with additional fields
const staffData = [
  {
    id: "1",
    name: "Florence Mushi",
    department: "Front Desk",
    jobTitle: "Receptionist",
    email: "florence.mushi@hotel.com",
    phone: "+2554567890",
    rating: 4.5,
    isActive: true,
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    hireDate: "2022-03-15",
    address: "123 Ocean Drive, Dar es Salaam, Tanzania",
    skills: ["Customer Service", "Multilingual", "Reservation Systems"],
  },
  {
    id: "2",
    name: "Justin Lasway",
    department: "Housekeeping",
    jobTitle: "Housekeeping Supervisor",
    email: "justin.lasway@hotel.com",
    phone: "+2554567891",
    rating: 4.2,
    isActive: true,
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    hireDate: "2021-07-22",
    address: "456 Palm Street, Arusha, Tanzania",
    skills: ["Team Management", "Cleaning Protocols", "Inventory Control"],
  },
  {
    id: "3",
    name: "Bashiri Iddi",
    department: "Maintenance",
    jobTitle: "Maintenance Technician",
    email: "bashiri.iddi@hotel.com",
    phone: "+2554567892",
    rating: 4.8,
    isActive: true,
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    hireDate: "2020-11-10",
    address: "789 River Road, Zanzibar, Tanzania",
    skills: ["Electrical Repairs", "Plumbing", "HVAC Maintenance"],
  },
  {
    id: "4",
    name: "Emily Davis",
    department: "Restaurant",
    jobTitle: "Head Chef",
    email: "emily.davis@hotel.com",
    phone: "+2554567893",
    rating: 4.0,
    isActive: true,
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    hireDate: "2023-01-05",
    address: "101 Coral Avenue, Mwanza, Tanzania",
    skills: ["Culinary Arts", "Menu Planning", "Food Safety"],
  },
  {
    id: "5",
    name: "Elibariki Basso",
    department: "Security",
    jobTitle: "Security Officer",
    email: "elibariki.basso@hotel.com",
    phone: "+2554567894",
    rating: 4.7,
    isActive: false,
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    hireDate: "2019-09-18",
    address: "202 Beach Lane, Dodoma, Tanzania",
    skills: ["Surveillance", "Conflict Resolution", "First Aid"],
  },
];

export default function HotelOverview() {
  const [expandedRow, setExpandedRow] = useState(null);

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const { hotel, isLoading: isHotelLoading } = useHotel();
  const HOTEL_ID = import.meta.env.VITE_HOTEL_ID;

  // Fetch hotel type details
  const { data: hotelTypeDetails } = useQuery<HotelType>({
    queryKey: ["hotelType", hotel?.hotel_type],
    queryFn: () =>
      hotelClient
        .get(`/hotel-types/${hotel?.hotel_type}/`)
        .then((res) => res.data),
    enabled: !!hotel?.hotel_type,
  });

  // Fetch hotel departments
  const { data: departments } = useQuery({
    queryKey: ["departments", HOTEL_ID],
    queryFn: () =>
      hotelClient
        .get(`/departments/?hotel_id=${HOTEL_ID}`)
        .then((res) => res.data.results),
    enabled: !!HOTEL_ID,
  });

  // Fetch hotel images
  const imageQueries = useQueries({
    queries: (hotel?.image_ids || []).map((id) => ({
      queryKey: ["hotelImage", id],
      queryFn: () =>
        hotelClient
          .get(`/hotel-images/${id}/`)
          .then((res) => res.data as HotelImage),
      enabled: !!hotel,
    })),
  });

  // Fetch amenities
  const amenityQueries = useQueries({
    queries: (hotel?.amenities || []).map((id) => ({
      queryKey: ["amenity", id],
      queryFn: () =>
        hotelClient.get(`/amenities/${id}/`).then((res) => res.data as Amenity),
      enabled: !!hotel,
    })),
  });

  // Fetch facilities
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

  // Fetch services
  const serviceQueries = useQueries({
    queries: (hotel?.services || []).map((id) => ({
      queryKey: ["service", id],
      queryFn: () =>
        hotelClient.get(`/services/${id}/`).then((res) => res.data as Service),
      enabled: !!hotel,
    })),
  });

  // Fetch meal types
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

  if (isHotelLoading)
    return <div className="p-6">Loading hotel information...</div>;
  if (!hotel) return <div className="p-6">No hotel data available.</div>;

  // Process fetched data
  const hotelImages = imageQueries
    .filter((q) => q.isSuccess)
    .map((q) => q.data.original);
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

  // Room status data
  const roomStatusData = {
    Available: hotel.availability_stats.status_counts.Available || 0,
    Booked: hotel.availability_stats.status_counts.Booked || 0,
    Maintenance: hotel.room_type.reduce(
      (acc, rt) => acc + (rt.room_counts.Maintenance || 0),
      0
    ),
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {hotel.name} - Overview
          </h1>
          <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-2 text-sm text-muted-foreground">
            <span>{hotel.address}</span>
            <span className="text-gray-300 hidden md:inline">•</span>
            <span className="font-semibold text-primary">
              {hotelTypeDetails?.name || "..."}
            </span>
            <span className="text-gray-300 hidden md:inline">•</span>
            <div className="flex items-center gap-1">
              {Array.from({ length: hotel.star_rating }).map((_, i) => (
                <FaStar key={i} className="text-yellow-400" />
              ))}
            </div>
          </div>
        </div>

        <Button variant={"outline"} asChild>
          <Link to="/hotel/customize-hotel">
            <FaPencilAlt className="mr-2 h-4 w-4" />
            Customize Hotel
          </Link>
        </Button>
      </div>

      {/* Second Row - Location, Status, etc. */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Location & Contact Card */}
        <Card className="rounded-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[1.125rem] text-[#155DFC] font-semibold">
              <FaMapMarkerAlt color="#155DFC" /> Location & Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-bold">Address</p>
              <p className="text-muted-foreground">
                {hotel.address}, {hotel.zip_code}
              </p>
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-800">
                Location Coordinates
              </p>
              <span className="block text-[0.9375rem] text-muted-foreground">
                Latitude {hotel.latitude}
              </span>
              <span className="block text-[0.9375rem] text-muted-foreground">
                Longitude {hotel.longitude}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {hotel.website_url && (
                <Button variant="outline" size="sm" asChild>
                  <a href={hotel.website_url} target="_blank" rel="noreferrer">
                    <FaGlobe className="mr-2 h-4 w-4" />
                    Website
                  </a>
                </Button>
              )}
              {hotel.facebook_url && (
                <Button variant="outline" size="sm" asChild>
                  <a href={hotel.facebook_url} target="_blank" rel="noreferrer">
                    <FaFacebook className="mr-2 h-4 w-4" />
                    Facebook
                  </a>
                </Button>
              )}
              {hotel.instagram_url && (
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={hotel.instagram_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaInstagram className="mr-2 h-4 w-4" />
                    Instagram
                  </a>
                </Button>
              )}
              {hotel.twitter_url && (
                <Button variant="outline" size="sm" asChild>
                  <a href={hotel.twitter_url} target="_blank" rel="noreferrer">
                    <FaTwitter className="mr-2 h-4 w-4" />
                    Twitter
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Room Status Card */}
        <Card className="rounded-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#155DFC]">
              <FaDoorClosed /> Room Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Available</span>
                <span className="font-mono font-semibold text-green-600">
                  {roomStatusData.Available}
                </span>
              </div>
              <Progress
                value={(roomStatusData.Available / hotel.number_rooms) * 100}
                className="h-2 border-green-600"
                indicatorClassName="bg-green-600"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Booked</span>
                <span className="font-mono font-semibold text-amber-600">
                  {roomStatusData.Booked}
                </span>
              </div>
              <Progress
                value={(roomStatusData.Booked / hotel.number_rooms) * 100}
                className="h-2 border-amber-600 "
                indicatorClassName="bg-amber-600"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Maintenance</span>
                <span className="font-mono font-semibold text-red-600">
                  {roomStatusData.Maintenance}
                </span>
              </div>
              <Progress
                value={(roomStatusData.Maintenance / hotel.number_rooms) * 100}
                className="h-2 border-red-600"
                indicatorClassName="bg-red-600"
              />
            </div>
          </CardContent>
        </Card>

        {/* Occupancy & Pricing Card */}
        <Card className="rounded-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#155DFC]">
              <TrendingUp /> Occupancy & Pricing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">Occupancy Rate</p>
              <div className="flex items-end gap-2">
                <p className="text-2xl font-bold">
                  {hotel.occupancy_rate.toFixed(1)}%
                </p>
                <p className="text-sm text-muted-foreground mb-1">
                  of total capacity
                </p>
              </div>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium">Average Room Price</p>
              <p className="text-2xl font-bold">
                ${hotel.average_room_price.toFixed(2)}
              </p>
              <div className="flex gap-4 mt-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Min</p>
                  <p>${hotel.pricing_data.min.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Max</p>
                  <p>${hotel.pricing_data.max.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hotel Spaces & Pricing Card */}
        <Card className="rounded-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#155DFC]">
              <BsDashSquare />
              Hotel Spaces
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="w-full flex flex-col gap-y-2">
              <li className="block text-[1rem] font-medium">
                Floors{" "}
                <span className="text-neutral-800 font-bold text-[1.125rem]">
                  {hotel.number_floors}
                </span>{" "}
              </li>
              <li className="block text-[1rem] font-medium">
                Rooms{" "}
                <span className="text-neutral-800 font-bold text-[1.125rem]">
                  {hotel.number_rooms}
                </span>{" "}
              </li>
              <li className="block text-[1rem] font-medium">
                Bars{" "}
                <span className="text-neutral-800 font-bold text-[1.125rem]">
                  {hotel.number_bars}
                </span>
              </li>
              <li className="block text-[1rem] font-medium">
                Halls{" "}
                <span className="text-neutral-800 font-bold text-[1.125rem]">
                  {hotel.number_halls}
                </span>
              </li>
              <li className="block text-[1rem] font-medium">
                Parks{" "}
                <span className="text-neutral-800 font-bold text-[1.125rem]">
                  {hotel.number_parks}
                </span>
              </li>
              <li className="block text-[1rem] font-medium">
                Restaurants{" "}
                <span className="text-neutral-800 font-bold text-[1.125rem]">
                  {" "}
                  {hotel.number_restaurants}
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
      {/* - - - - -  */}

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Gallery Card */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-3 rounded-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#155DFC]">
              <FaImages /> Gallery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {[
                "https://placehold.co/600x400",
                "https://placehold.co/600x400",
                "https://placehold.co/600x400",
                "https://placehold.co/600x400",
                "https://placehold.co/600x400",
              ].map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`Hotel ${index + 1}`}
                  className="h-60 w-auto rounded-md object-cover shadow-sm"
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Staff Table */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-3 rounded-md shadow bg-white">
          <CardHeader className="bg-none">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <FaUserTie className="text-blue-600" />
              Staff Members
            </CardTitle>
            <CardDescription className="text-gray-600">
              Current hotel staff directory
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Table>
              <TableHeader>
                <TableRow className="bg-none">
                  <TableHead className="text-gray-700">Name</TableHead>
                  <TableHead className="text-gray-700">Department</TableHead>
                  <TableHead className="text-gray-700">Contact</TableHead>
                  <TableHead className="text-gray-700">Rating</TableHead>
                  <TableHead className="text-gray-700">Status</TableHead>
                  <TableHead className="text-gray-700"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staffData.map((staff) => (
                  <React.Fragment key={staff.id}>
                    <TableRow
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => toggleRow(staff.id)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={staff.avatar} />
                            <AvatarFallback className="bg-blue-100 text-blue-800">
                              {staff.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-gray-800 font-medium">
                            {staff.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {staff.department}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-700" />
                            <span className="text-sm text-gray-600">
                              {staff.email}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-700" />
                            <span className="text-sm text-gray-600">
                              {staff.phone}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-gray-700">{staff.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={staff.isActive ? "secondary" : "outline"}
                          className={
                            staff.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-600"
                          }
                        >
                          {staff.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {expandedRow === staff.id ? (
                          <ChevronUp className="h-4 w-4 text-blue-600" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-blue-600" />
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={6} className="p-0">
                        <Collapsible open={expandedRow === staff.id}>
                          <CollapsibleContent>
                            <div className="p-4 bg-none border-t border-gray-200">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-800">
                                    Job Title
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    {staff.jobTitle}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-800">
                                    Hire Date
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    {staff.hireDate}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-800">
                                    Address
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    {staff.address}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-800">
                                    Skills
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {staff.skills.map((skill, index) => (
                                      <Badge
                                        key={index}
                                        variant="outline"
                                        className="bg-green-100 text-green-800 border-green-200"
                                      >
                                        {skill}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        {/*  - - - - - Table Card End Here */}

        {/* Amenities Card */}
        <Card className="rounded-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BsDashSquare /> Amenities
            </CardTitle>
            <CardDescription>Available in-room amenities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {amenities.length > 0 ? (
                amenities.map((amenity) => (
                  <div key={amenity.id} className="flex items-center gap-3">
                    <span className="bg-slate-100 p-2 rounded">
                      {getIconForEntity(amenity.name, "amenity")}
                    </span>
                    <div>
                      <p className="font-medium">{amenity.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {amenity.description}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground">
                  No amenities listed
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Facilities Card */}
        <Card className="rounded-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BsDashSquare /> Facilities
            </CardTitle>
            <CardDescription>Available hotel facilities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {facilities.length > 0 ? (
                facilities.map((facility) => (
                  <div key={facility.id} className="flex items-center gap-3">
                    <span className="bg-slate-100 p-2 rounded">
                      {getIconForEntity(facility.name, "facility")}
                    </span>
                    <div>
                      <p className="font-medium">{facility.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {facility.description}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground">
                  No facilities listed
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Meal Types Card */}
        <Card className="rounded-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BsDashSquare /> Meal Plans
            </CardTitle>
            <CardDescription>Available meal options</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mealTypes.length > 0 ? (
                mealTypes.map((meal) => (
                  <div key={meal.id} className="flex items-center gap-3">
                    <span className="bg-slate-100 p-2 rounded">
                      {getIconForEntity(meal.name, "amenity")}
                    </span>
                    <div>
                      <p className="font-medium">{meal.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span>{meal.score || "N/A"} Rating</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground">
                  No meal plans listed
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Services Card */}
        <Card className="rounded-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BsDashSquare /> Services
            </CardTitle>
            <CardDescription>Available hotel services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {services.length > 0 ? (
                services.map((service) => (
                  <div key={service.id} className="flex items-center gap-3">
                    <span className="bg-slate-100 p-2 rounded">
                      {getIconForEntity(service.name, "service")}
                    </span>
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {service.service_type_name}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground">
                  No services listed
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Room Types Card */}
        <Card className="rounded-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BsDashSquare /> Room Types
            </CardTitle>
            <CardDescription>Available room categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {hotel.room_type?.length > 0 ? (
                hotel.room_type.map((room: RoomType) => (
                  <div key={room.id} className="flex items-center gap-3">
                    <span className="bg-slate-100 p-2 rounded">
                      <FaRegCircleCheck className="h-5 w-5 text-neutral-800" />
                    </span>
                    <div>
                      <p className="font-medium">
                        {room.name} ({room.code})
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {room.max_occupancy} max occupancy • {room.bed_type}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground">
                  No room types listed
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Departments Card */}
        <Card className="rounded-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BsDashSquare /> Departments
            </CardTitle>
            <CardDescription>Hotel operational departments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {departments?.length > 0 ? (
                departments.map((dept) => (
                  <div key={dept.id} className="flex items-center gap-3">
                    <span className="bg-slate-100 p-2 rounded">
                      <FaRegCircleCheck className="h-5 w-5 text-neutral-800" />
                    </span>
                    <div>
                      <p className="font-medium">{dept.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {dept.code} • {dept.description}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground">
                  No departments listed
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
