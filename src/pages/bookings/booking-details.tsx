// // - - - src/pages/bookings/booking-details.tsx
// "use client";
// import { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
// import { format } from "date-fns";
// import {
//   Mail,
//   Phone,
//   MapPin,
//   CreditCard,
//   Monitor,
//   Wifi,
//   Car,
//   Utensils,
//   Dumbbell,
//   Coffee,
//   Printer,
//   FilePenLine,
//   CalendarDays,
//   Clock,
//   Home,
//   Users as UsersIcon,
//   Check,
//   FileText,
//   BedDouble,
//   ArrowLeft,
//   DollarSign,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { Skeleton } from "@/components/ui/skeleton";
// import EditBookingModal from "./edit-booking-modal";
// import BookingPrintTicket from "./booking-ticket";

// // --- TYPE DEFINITIONS ---
// interface Booking {
//   id: string;
//   code: string;
//   full_name: string;
//   email: string;
//   phone_number: string;
//   address: string;
//   start_date: string;
//   end_date: string;
//   checkin: string | null;
//   checkout: string | null;
//   duration_days: number;
//   number_of_guests: number;
//   booking_status: string;
//   payment_status: string;
//   amount_required: string;
//   amount_paid: string;
//   payment_reference: string;
//   booking_type: string;
//   microservice_item_name: string;
//   property_item_type: string;
//   property_id: string;
//   special_requests: string | null;
//   service_notes: string | null;
//   feedback: string | null;
//   voucher_code: string | null;
//   created_at: string;
// }

// interface Amenity {
//   id: string;
//   name: string;
//   icon: string | null;
// }

// interface RoomDetails {
//   id: string;
//   code: string;
//   image: string;
//   description: string;
//   max_occupancy: number;
//   average_rating: string;
//   room_type_name: string;
//   amenities: Amenity[];
// }

// // --- HELPER FUNCTIONS ---
// const getAmenityIcon = (name: string): React.ReactNode => {
//   const lname = name.toLowerCase();
//   if (lname.includes("wifi")) return <Wifi className="h-4 w-4 text-blue-600" />;
//   if (lname.includes("parking"))
//     return <Car className="h-4 w-4 text-gray-600" />;
//   if (lname.includes("restaurant"))
//     return <Utensils className="h-4 w-4 text-orange-500" />;
//   if (lname.includes("gym"))
//     return <Dumbbell className="h-4 w-4 text-red-500" />;
//   if (lname.includes("breakfast"))
//     return <Coffee className="h-4 w-4 text-amber-700" />;
//   return <Check className="h-4 w-4 text-green-600" />;
// };

// const getStatusBadgeVariant = (
//   status: string
// ): "default" | "secondary" | "destructive" | "outline" => {
//   const s = status?.toLowerCase();
//   if (s === "confirmed" || s === "checked in") return "default";
//   if (s === "cancelled") return "destructive";
//   if (s === "checked out") return "outline";
//   return "secondary";
// };

// const getPaymentBadgeVariant = (
//   status: string
// ): "default" | "secondary" | "destructive" => {
//   const s = status?.toLowerCase();
//   if (s === "paid") return "default";
//   if (s === "pending") return "secondary";
//   return "destructive";
// };

// // --- UI HELPER COMPONENTS ---
// const DetailRow = ({
//   icon,
//   label,
//   value,
// }: {
//   icon: React.ReactNode;
//   label: string;
//   value: React.ReactNode;
// }) => (
//   <div className="flex items-start gap-4">
//     <div className="flex-shrink-0 text-muted-foreground">{icon}</div>
//     <div className="flex-1">
//       <p className="text-sm text-muted-foreground">{label}</p>
//       <p className="font-medium text-foreground break-words">{value}</p>
//     </div>
//   </div>
// );

// const InfoCard = ({
//   icon,
//   title,
//   value,
// }: {
//   icon: React.ReactNode;
//   title: string;
//   value: React.ReactNode;
// }) => (
//   <Card>
//     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//       <CardTitle className="text-sm font-medium">{title}</CardTitle>
//       <div className="text-muted-foreground">{icon}</div>
//     </CardHeader>
//     <CardContent>
//       <div className="text-2xl font-bold">{value}</div>
//     </CardContent>
//   </Card>
// );

// export default function BookingDetailsPage() {
//   const { booking_id } = useParams<{ booking_id: string }>();
//   const navigate = useNavigate();
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [showPrintView, setShowPrintView] = useState(false);

//   const HOTEL_BASE_URL = import.meta.env.VITE_HOTEL_BASE_URL;
//   const BOOKING_BASE_URL = import.meta.env.VITE_BOOKING_BASE_URL;

//   const {
//     data: booking,
//     isLoading: isLoadingBooking,
//     isError,
//     error,
//   } = useQuery<Booking>({
//     queryKey: ["bookingDetails", booking_id],
//     queryFn: async () => {
//       const response = await axios.get(
//         `${BOOKING_BASE_URL}bookings/${booking_id}`
//       );
//       return response.data;
//     },
//     enabled: !!booking_id,
//   });

//   const { data: roomDetails, isLoading: isLoadingRoom } = useQuery<RoomDetails>(
//     {
//       queryKey: ["roomDetails", booking?.property_id],
//       queryFn: async () => {
//         if (!booking?.property_id)
//           throw new Error("No room ID found in booking.");
//         const response = await axios.get(
//           `${HOTEL_BASE_URL}rooms/${booking.property_id}/`
//         );
//         return response.data;
//       },
//       enabled: !!booking?.property_id,
//     }
//   );

//   // Print function
//   const handlePrint = () => {
//     setShowPrintView(true);
//     setTimeout(() => {
//       window.print();
//       setShowPrintView(false);
//     }, 100);
//   };

//   if (isLoadingBooking || isLoadingRoom) {
//     return (
//       <div className="p-4 sm:p-6 lg:p-8 space-y-6">
//         <div className="flex justify-between items-center">
//           <Skeleton className="h-10 w-24" />
//           <div className="flex gap-2">
//             <Skeleton className="h-10 w-32" />
//             <Skeleton className="h-10 w-24" />
//           </div>
//         </div>
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
//           <div className="lg:col-span-4">
//             <Skeleton className="h-[500px] w-full" />
//           </div>
//           <div className="lg:col-span-8 space-y-6">
//             <Skeleton className="h-40 w-full" />
//             <Skeleton className="h-64 w-full" />
//             <Skeleton className="h-40 w-full" />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (isError)
//     return (
//       <div className="p-6 text-destructive">
//         Error loading booking: {(error as Error).message}
//       </div>
//     );

//   if (!booking) return <div className="p-6">Booking not found.</div>;

//   // Print view - shows only the ticket
//   if (showPrintView) {
//     return (
//       <div className="print:block hidden">
//         <BookingPrintTicket booking={booking} roomDetails={roomDetails} />
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* Print CSS */}
//       <style jsx>{`
//         @media print {
//           body * {
//             visibility: hidden;
//           }
//           .print-area,
//           .print-area * {
//             visibility: visible;
//           }
//           .print-area {
//             position: absolute;
//             left: 0;
//             top: 0;
//             width: 100%;
//           }
//           .no-print {
//             display: none !important;
//           }
//         }
//       `}</style>

//       <div className="p-4 sm:p-6 lg:p-8 space-y-6">
//         <div className="flex justify-between items-center no-print">
//           <Button variant="outline" onClick={() => navigate(-1)}>
//             <ArrowLeft className="mr-2 h-4 w-4" /> Back
//           </Button>
//           <div className="flex space-x-2">
//             <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>
//               <FilePenLine className="mr-2 h-4 w-4" /> Edit
//             </Button>
//             <Button variant="outline" onClick={handlePrint}>
//               <Printer className="mr-2 h-4 w-4" /> Print Ticket
//             </Button>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
//           <div className="lg:col-span-4">
//             <Card>
//               <CardHeader className="text-center items-center">
//                 <div className="relative mb-4">
//                   <div className="flex items-center justify-center bg-muted rounded-full h-24 w-24 text-4xl font-bold mx-auto">
//                     {booking.full_name.charAt(0)}
//                     <span className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
//                       <Check className="w-4 h-4 text-white" />
//                     </span>
//                   </div>
//                 </div>
//                 <CardTitle>{booking.full_name}</CardTitle>
//                 <CardDescription>Booking Code: {booking.code}</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <Separator />
//                 <DetailRow
//                   icon={<Phone size={16} />}
//                   label="Phone Number"
//                   value={booking.phone_number}
//                 />
//                 <Separator />
//                 <DetailRow
//                   icon={<Mail size={16} />}
//                   label="Email Address"
//                   value={booking.email}
//                 />
//                 <Separator />
//                 <DetailRow
//                   icon={<MapPin size={16} />}
//                   label="Address"
//                   value={booking.address}
//                 />
//               </CardContent>
//             </Card>
//             {roomDetails && (
//               <Card className="mt-6">
//                 <CardHeader>
//                   <CardTitle className="text-base">
//                     {roomDetails.room_type_name}
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="overflow-hidden rounded-lg">
//                     <img
//                       src={
//                         roomDetails.image ||
//                         "https://placehold.co/600x400?text=Room"
//                       }
//                       alt={roomDetails.room_type_name}
//                       className="w-full h-48 object-cover"
//                     />
//                   </div>
//                 </CardContent>
//               </Card>
//             )}
//           </div>

//           <div className="lg:col-span-8 space-y-6">
//             <Card>
//               <CardHeader>
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <CardTitle>Booking Information</CardTitle>
//                     <CardDescription>
//                       Booked on: {format(new Date(booking.created_at), "PPP")}
//                     </CardDescription>
//                   </div>
//                   <Badge
//                     variant={getStatusBadgeVariant(booking.booking_status)}
//                     className="capitalize bg-green-600 text-white"
//                   >
//                     {booking.booking_status}
//                   </Badge>
//                 </div>
//               </CardHeader>
//               <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 <InfoCard
//                   icon={<CalendarDays size={16} />}
//                   title="Check-in"
//                   value={format(new Date(booking.start_date), "PP")}
//                 />
//                 <InfoCard
//                   icon={<CalendarDays size={16} />}
//                   title="Check-out"
//                   value={format(new Date(booking.end_date), "PP")}
//                 />
//                 <InfoCard
//                   icon={<Clock size={16} />}
//                   title="Duration"
//                   value={`${booking.duration_days} Nights`}
//                 />
//                 <InfoCard
//                   icon={<Home size={16} />}
//                   title="Room Type"
//                   value={booking.property_item_type}
//                 />
//                 <InfoCard
//                   icon={<BedDouble size={16} />}
//                   title="Room Code"
//                   value={roomDetails?.code || "N/A"}
//                 />
//                 <InfoCard
//                   icon={<UsersIcon size={16} />}
//                   title="Guests"
//                   value={booking.number_of_guests}
//                 />
//               </CardContent>
//             </Card>

//             <div className="grid md:grid-cols-2 gap-6">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Payment Details</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <DetailRow
//                     icon={<CreditCard size={16} />}
//                     label="Payment Status"
//                     value={
//                       <Badge
//                         className="bg-green-500/70"
//                         variant={getPaymentBadgeVariant(booking.payment_status)}
//                       >
//                         {booking.payment_status}
//                       </Badge>
//                     }
//                   />
//                   <DetailRow
//                     icon={<Monitor size={16} />}
//                     label="Booking Type"
//                     value={
//                       <Badge
//                         className={
//                           booking.booking_type === "Physical"
//                             ? "bg-blue-100 text-blue-800"
//                             : "bg-yellow-100 text-yellow-800"
//                         }
//                       >
//                         {booking.booking_type}
//                       </Badge>
//                     }
//                   />
//                   <DetailRow
//                     icon={<DollarSign size={16} />}
//                     label="Amount Paid"
//                     value={new Intl.NumberFormat("en-US", {
//                       style: "currency",
//                       currency: "TZS",
//                     }).format(parseFloat(booking.amount_paid))}
//                   />
//                 </CardContent>
//               </Card>
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Room Amenities</CardTitle>
//                 </CardHeader>
//                 <CardContent className="grid grid-cols-2 gap-2 text-sm">
//                   {roomDetails?.amenities.slice(0, 6).map((amenity) => (
//                     <div key={amenity.id} className="flex items-center gap-2">
//                       {getAmenityIcon(amenity.name)}
//                       <span className="text-muted-foreground">
//                         {amenity.name}
//                       </span>
//                     </div>
//                   ))}
//                 </CardContent>
//               </Card>
//             </div>

//             {(booking.special_requests || booking.service_notes) && (
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Additional Information</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   {booking.special_requests && (
//                     <DetailRow
//                       icon={<FileText size={16} />}
//                       label="Special Requests"
//                       value={booking.special_requests}
//                     />
//                   )}
//                   {booking.service_notes && (
//                     <DetailRow
//                       icon={<FileText size={16} />}
//                       label="Service Notes"
//                       value={booking.service_notes}
//                     />
//                   )}
//                 </CardContent>
//               </Card>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Hidden print ticket - only visible during printing */}
//       <div className="print-area hidden">
//         <BookingPrintTicket booking={booking} roomDetails={roomDetails} />
//       </div>

//       {isEditModalOpen && booking && (
//         <EditBookingModal
//           booking={booking}
//           onClose={() => setIsEditModalOpen(false)}
//         />
//       )}
//     </>
//   );
// }

// - - - src/pages/bookings/booking-details.tsx
"use client";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import {
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Monitor,
  Wifi,
  Car,
  Utensils,
  Dumbbell,
  Coffee,
  Printer,
  FilePenLine,
  CalendarDays,
  Clock,
  Home,
  Users as UsersIcon,
  Check,
  FileText,
  BedDouble,
  ArrowLeft,
  DollarSign,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import EditBookingModal from "./edit-booking-modal";
import BookingPrintTicket from "./booking-ticket";

// --- TYPE DEFINITIONS ---
interface Booking {
  id: string;
  code: string;
  full_name: string;
  email: string;
  phone_number: string;
  address: string;
  start_date: string;
  end_date: string;
  checkin: string | null;
  checkout: string | null;
  duration_days: number;
  number_of_guests: number;
  booking_status: string;
  payment_status: string;
  amount_required: string;
  amount_paid: string;
  payment_reference: string;
  booking_type: string;
  microservice_item_name: string;
  property_item_type: string;
  property_id: string;
  special_requests: string | null;
  service_notes: string | null;
  feedback: string | null;
  voucher_code: string | null;
  created_at: string;
}

interface Amenity {
  id: string;
  name: string;
  icon: string | null;
}

interface RoomDetails {
  id: string;
  code: string;
  image: string;
  description: string;
  max_occupancy: number;
  average_rating: string;
  room_type_name: string;
  amenities: Amenity[];
}

// --- HELPER FUNCTIONS ---
const getAmenityIcon = (name: string): React.ReactNode => {
  const lname = name.toLowerCase();
  if (lname.includes("wifi")) return <Wifi className="h-4 w-4 text-blue-600" />;
  if (lname.includes("parking"))
    return <Car className="h-4 w-4 text-gray-600" />;
  if (lname.includes("restaurant"))
    return <Utensils className="h-4 w-4 text-orange-500" />;
  if (lname.includes("gym"))
    return <Dumbbell className="h-4 w-4 text-red-500" />;
  if (lname.includes("breakfast"))
    return <Coffee className="h-4 w-4 text-amber-700" />;
  return <Check className="h-4 w-4 text-green-600" />;
};

const getStatusBadgeVariant = (
  status: string
): "default" | "secondary" | "destructive" | "outline" => {
  const s = status?.toLowerCase();
  if (s === "confirmed" || s === "checked in") return "default";
  if (s === "cancelled") return "destructive";
  if (s === "checked out") return "outline";
  return "secondary";
};

const getPaymentBadgeVariant = (
  status: string
): "default" | "secondary" | "destructive" => {
  const s = status?.toLowerCase();
  if (s === "paid") return "default";
  if (s === "pending") return "secondary";
  return "destructive";
};

// --- UI HELPER COMPONENTS ---
const DetailRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex items-start gap-4">
    <div className="flex-shrink-0 text-muted-foreground">{icon}</div>
    <div className="flex-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium text-foreground break-words">{value}</p>
    </div>
  </div>
);

const InfoCard = ({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="text-muted-foreground">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

export default function BookingDetailsPage() {
  const { booking_id } = useParams<{ booking_id: string }>();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showPrintView, setShowPrintView] = useState(false);

  const HOTEL_BASE_URL = import.meta.env.VITE_HOTEL_BASE_URL;
  const BOOKING_BASE_URL = import.meta.env.VITE_BOOKING_BASE_URL;

  const {
    data: booking,
    isLoading: isLoadingBooking,
    isError,
    error,
  } = useQuery<Booking>({
    queryKey: ["bookingDetails", booking_id],
    queryFn: async () => {
      const response = await axios.get(
        `${BOOKING_BASE_URL}bookings/${booking_id}`
      );
      return response.data;
    },
    enabled: !!booking_id,
  });

  const { data: roomDetails, isLoading: isLoadingRoom } = useQuery<RoomDetails>(
    {
      queryKey: ["roomDetails", booking?.property_id],
      queryFn: async () => {
        if (!booking?.property_id)
          throw new Error("No room ID found in booking.");
        const response = await axios.get(
          `${HOTEL_BASE_URL}rooms/${booking.property_id}/`
        );
        return response.data;
      },
      enabled: !!booking?.property_id,
    }
  );

  // Print function
  const handlePrint = () => {
    setShowPrintView(true);
    setTimeout(() => {
      window.print();
      setShowPrintView(false);
    }, 100);
  };

  if (isLoadingBooking || isLoadingRoom) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-24" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <Skeleton className="h-[500px] w-full" />
          </div>
          <div className="lg:col-span-8 space-y-6">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError)
    return (
      <div className="p-6 text-destructive">
        Error loading booking: {(error as Error).message}
      </div>
    );

  if (!booking) return <div className="p-6">Booking not found.</div>;

  // Print view - shows only the ticket
  if (showPrintView) {
    return (
      <div className="print:block hidden">
        <BookingPrintTicket booking={booking} roomDetails={roomDetails} />
      </div>
    );
  }

  return (
    <>
      {/* Print CSS */}
      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area,
          .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex justify-between items-center no-print">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>
              <FilePenLine className="mr-2 h-4 w-4" /> Edit
            </Button>
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" /> Print Ticket
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <Card>
              <CardHeader className="text-center items-center">
                <div className="relative mb-4">
                  <div className="flex items-center justify-center bg-muted rounded-full h-24 w-24 text-4xl font-bold mx-auto">
                    {booking.full_name.charAt(0)}
                    <span className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </span>
                  </div>
                </div>
                <CardTitle>{booking.full_name}</CardTitle>
                <CardDescription>Booking Code: {booking.code}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Separator />
                <DetailRow
                  icon={<Phone size={16} />}
                  label="Phone Number"
                  value={booking.phone_number}
                />
                <Separator />
                <DetailRow
                  icon={<Mail size={16} />}
                  label="Email Address"
                  value={booking.email}
                />
                <Separator />
                <DetailRow
                  icon={<MapPin size={16} />}
                  label="Address"
                  value={booking.address}
                />
              </CardContent>
            </Card>
            {roomDetails && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-base">
                    {roomDetails.room_type_name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-hidden rounded-lg">
                    <img
                      src={
                        roomDetails.image ||
                        "https://placehold.co/600x400?text=Room"
                      }
                      alt={roomDetails.room_type_name}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-8 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Booking Information</CardTitle>
                    <CardDescription>
                      Booked on: {format(new Date(booking.created_at), "PPP")}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={getStatusBadgeVariant(booking.booking_status)}
                    className="capitalize bg-green-600 text-white"
                  >
                    {booking.booking_status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InfoCard
                  icon={<CalendarDays size={16} />}
                  title="Check-in"
                  value={format(new Date(booking.start_date), "PP")}
                />
                <InfoCard
                  icon={<CalendarDays size={16} />}
                  title="Check-out"
                  value={format(new Date(booking.end_date), "PP")}
                />
                <InfoCard
                  icon={<Clock size={16} />}
                  title="Duration"
                  value={`${booking.duration_days} Nights`}
                />
                <InfoCard
                  icon={<Home size={16} />}
                  title="Room Type"
                  value={booking.property_item_type}
                />
                <InfoCard
                  icon={<BedDouble size={16} />}
                  title="Room Code"
                  value={roomDetails?.code || "N/A"}
                />
                <InfoCard
                  icon={<UsersIcon size={16} />}
                  title="Guests"
                  value={booking.number_of_guests}
                />
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <DetailRow
                    icon={<CreditCard size={16} />}
                    label="Payment Status"
                    value={
                      <Badge
                        className="bg-green-500/70"
                        variant={getPaymentBadgeVariant(booking.payment_status)}
                      >
                        {booking.payment_status}
                      </Badge>
                    }
                  />
                  <DetailRow
                    icon={<Monitor size={16} />}
                    label="Booking Type"
                    value={
                      <Badge
                        className={
                          booking.booking_type === "Physical"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {booking.booking_type}
                      </Badge>
                    }
                  />
                  <DetailRow
                    icon={<DollarSign size={16} />}
                    label="Amount Paid"
                    value={new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "TZS",
                    }).format(parseFloat(booking.amount_paid))}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Room Amenities</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-2 text-sm">
                  {roomDetails?.amenities.slice(0, 6).map((amenity) => (
                    <div key={amenity.id} className="flex items-center gap-2">
                      {getAmenityIcon(amenity.name)}
                      <span className="text-muted-foreground">
                        {amenity.name}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {(booking.special_requests || booking.service_notes) && (
              <Card>
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {booking.special_requests && (
                    <DetailRow
                      icon={<FileText size={16} />}
                      label="Special Requests"
                      value={booking.special_requests}
                    />
                  )}
                  {booking.service_notes && (
                    <DetailRow
                      icon={<FileText size={16} />}
                      label="Service Notes"
                      value={booking.service_notes}
                    />
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Hidden print ticket - only visible during printing */}
      <div className="print-area hidden">
        <BookingPrintTicket booking={booking} roomDetails={roomDetails} />
      </div>

      {isEditModalOpen && booking && (
        <EditBookingModal
          booking={booking}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </>
  );
}
