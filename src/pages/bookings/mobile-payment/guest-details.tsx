// import React, { useState } from "react";
// import {
//   User,
//   Check,
//   Eye,
//   CreditCard,
//   Receipt,
//   AlertCircle,
//   MessageSquare,
//   Sparkles,
//   Loader2,
// } from "lucide-react";
// import type { BookingConfirmation, GuestDetails, Room } from "./types";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardContent,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";

// interface GuestDetailsFormProps {
//   step: "details" | "billing";
//   selectedRoom: Room;
//   startDate: string;
//   endDate: string;
//   guestDetails: Omit<GuestDetails, "payment_method">;
//   setGuestDetails: React.Dispatch<
//     React.SetStateAction<Omit<GuestDetails, "payment_method">>
//   >;
//   onBack: () => void;
//   onSubmitBooking: () => void;
//   onProceedToPayment: () => void;
//   bookingLoading: boolean;
//   bookingConfirmation: BookingConfirmation | null;
//   error: string;
//   setError: React.Dispatch<React.SetStateAction<string>>;
// }

// export const GuestDetailsForm: React.FC<GuestDetailsFormProps> = ({
//   step,
//   selectedRoom,
//   startDate,
//   endDate,
//   guestDetails,
//   setGuestDetails,
//   onBack,
//   onSubmitBooking,
//   onProceedToPayment,
//   bookingLoading,
//   bookingConfirmation,
//   error,
//   setError,
// }) => {
//   const [isReviewing, setIsReviewing] = useState(false);

//   const handleGuestDetailsChange = (
//     field: keyof Omit<GuestDetails, "payment_method">,
//     value: string | number
//   ) => {
//     setGuestDetails((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleReviewClick = () => {
//     if (!guestDetails.full_name || !guestDetails.phone_number) {
//       setError(
//         "Please fill in all required fields (Full Name and Phone Number)"
//       );
//       return;
//     }
//     setError("");
//     setIsReviewing(true);
//   };

//   if (step === "billing" && bookingConfirmation) {
//     const currencyInfo = bookingConfirmation.status_history.find(
//       (h) => h.action === "currency_conversion"
//     )?.details;

//     return (
//       <Card className="border-gray-200 shadow-sm w-[540px] max-w-[640px]">
//         <CardHeader className="bg-none border-b border-gray-100 shadow">
//           <CardTitle className="text-xl font-semibold text-green-800 flex items-center">
//             <Receipt className="mr-2 h-5 w-5" />
//             Booking Created - Please Confirm Billing
//           </CardTitle>
//           <CardDescription className="text-gray-600">
//             Your booking with code{" "}
//             <strong className="font-mono">{bookingConfirmation.code}</strong>{" "}
//             has been created. Please review the final charges before proceeding
//             to payment.
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="p-6">
//           <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6 space-y-3">
//             <h3 className="font-semibold text-lg text-gray-800">
//               Charge Breakdown
//             </h3>
//             {bookingConfirmation.billing_meta_data.charge_report.map(
//               (item, index) => (
//                 <div
//                   key={index}
//                   className="flex justify-between items-center text-sm text-gray-600"
//                 >
//                   <span>{item.description}</span>
//                   <span className="font-medium text-gray-800">
//                     ${parseFloat(item.amount).toFixed(2)}
//                   </span>
//                 </div>
//               )
//             )}
//             <hr className="my-3 border-gray-200" />
//             <div className="flex justify-between items-center font-bold text-gray-800">
//               <span>Total Amount (USD)</span>
//               <span>${currencyInfo?.original_required.toFixed(2)}</span>
//             </div>
//           </div>
//           <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
//             <p className="text-blue-700 text-sm">Total Amount to Pay in TZS</p>
//             <p className="text-blue-800 font-bold text-2xl mt-1">
//               {currencyInfo?.converted_required.toLocaleString("en-US", {
//                 style: "currency",
//                 currency: "TZS",
//                 minimumFractionDigits: 2,
//               })}
//             </p>
//             {currencyInfo && (
//               <p className="text-xs text-blue-600 mt-1">
//                 Exchange Rate: 1 USD ={" "}
//                 {(
//                   currencyInfo.converted_required /
//                   currencyInfo.original_required
//                 ).toFixed(2)}{" "}
//                 TZS
//               </p>
//             )}
//           </div>
//           <div className="mt-6 flex justify-end">
//             <Button
//               onClick={onProceedToPayment}
//               className="bg-blue-600 hover:bg-blue-700 text-white"
//             >
//               Confirm & Proceed to Payment
//               <CreditCard className="ml-2 h-4 w-4" />
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     );
//   }

//   if (isReviewing) {
//     return (
//       <Card className="border-gray-200 shadow-sm">
//         <CardHeader className="bg-none shadow shadow-gray-100 border-b">
//           <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
//             <Eye className="mr-2 h-5 w-5" />
//             Review Your Booking
//           </CardTitle>
//           <CardDescription className="text-gray-600">
//             Please review all details before confirming your booking
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="p-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-4">
//               <h3 className="font-semibold text-gray-800 border-b pb-2">
//                 Booking Details
//               </h3>
//               <p className="text-gray-600">
//                 <span className="font-medium">Room Type:</span>{" "}
//                 {selectedRoom.room_type_name}
//               </p>
//               <p className="text-gray-600">
//                 <span className="font-medium">Check-in:</span> {startDate}
//               </p>
//               <p className="text-gray-600">
//                 <span className="font-medium">Check-out:</span> {endDate}
//               </p>
//             </div>
//             <div className="space-y-4">
//               <h3 className="font-semibold text-gray-800 border-b pb-2">
//                 Guest Information
//               </h3>
//               <p className="text-gray-600">
//                 <span className="font-medium">Full Name:</span>{" "}
//                 {guestDetails.full_name}
//               </p>
//               <p className="text-gray-600">
//                 <span className="font-medium">Phone:</span>{" "}
//                 {guestDetails.phone_number}
//               </p>
//               <p className="text-gray-600">
//                 <span className="font-medium">Guests:</span>{" "}
//                 {guestDetails.number_of_guests} Adults,{" "}
//                 {guestDetails.number_of_children} Children,{" "}
//                 {guestDetails.number_of_infants} Infants
//               </p>
//             </div>
//           </div>
//           {(guestDetails.service_notes || guestDetails.special_requests) && (
//             <div className="mt-6 pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-6">
//               {guestDetails.service_notes && (
//                 <div>
//                   <h4 className="font-medium text-gray-800 flex items-center mb-2">
//                     <MessageSquare className="mr-2 h-4 w-4" />
//                     Service Notes
//                   </h4>
//                   <p className="text-gray-600 bg-gray-50 p-3 rounded-md text-sm">
//                     {guestDetails.service_notes}
//                   </p>
//                 </div>
//               )}
//               {guestDetails.special_requests && (
//                 <div>
//                   <h4 className="font-medium text-gray-800 flex items-center mb-2">
//                     <Sparkles className="mr-2 h-4 w-4" />
//                     Special Requests
//                   </h4>
//                   <p className="text-gray-600 bg-gray-50 p-3 rounded-md text-sm">
//                     {guestDetails.special_requests}
//                   </p>
//                 </div>
//               )}
//             </div>
//           )}
//           {error && (
//             <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-center gap-2">
//               <AlertCircle className="h-5 w-5" />
//               {error}
//             </div>
//           )}
//           <div className="mt-6 flex gap-4">
//             <Button
//               onClick={() => setIsReviewing(false)}
//               variant="outline"
//               className="border-gray-300 text-gray-700 hover:bg-gray-100"
//             >
//               Edit Details
//             </Button>
//             <Button
//               onClick={onSubmitBooking}
//               disabled={bookingLoading}
//               className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white"
//             >
//               {bookingLoading ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Creating Booking...
//                 </>
//               ) : (
//                 <>
//                   <Check className="mr-2 h-4 w-4" />
//                   Confirm Booking
//                 </>
//               )}
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <Card className="border-gray-200 shadow-sm">
//       <CardHeader className="bg-none shadow shadow-gray-100 border-b">
//         <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
//           <User className="mr-2 h-5 w-5" />
//           Guest Details
//         </CardTitle>
//         <CardDescription className="text-gray-600">
//           Booking for:{" "}
//           <strong className="text-gray-800">
//             {selectedRoom.room_type_name}
//           </strong>
//         </CardDescription>
//       </CardHeader>
//       <CardContent className="p-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <Label
//               htmlFor="fullName"
//               className="text-sm font-medium text-gray-700 mb-2"
//             >
//               Full Name *
//             </Label>
//             <Input
//               type="text"
//               id="fullName"
//               value={guestDetails.full_name}
//               onChange={(e) =>
//                 handleGuestDetailsChange("full_name", e.target.value)
//               }
//               className="border-gray-300 focus:border-blue-600 focus:ring-blue-600"
//               required
//             />
//           </div>
//           <div>
//             <Label
//               htmlFor="phoneNumber"
//               className="text-sm font-medium text-gray-700 mb-2"
//             >
//               Phone Number *
//             </Label>
//             <Input
//               type="tel"
//               id="phoneNumber"
//               value={guestDetails.phone_number}
//               onChange={(e) =>
//                 handleGuestDetailsChange("phone_number", e.target.value)
//               }
//               className="border-gray-300 focus:border-blue-600 focus:ring-blue-600"
//               required
//             />
//           </div>
//           <div className="grid grid-cols-3 gap-4">
//             <div>
//               <Label
//                 htmlFor="numGuests"
//                 className="text-sm font-medium text-gray-700 mb-2"
//               >
//                 Guests
//               </Label>
//               <Input
//                 type="number"
//                 id="numGuests"
//                 min="1"
//                 value={guestDetails.number_of_guests}
//                 onChange={(e) =>
//                   handleGuestDetailsChange(
//                     "number_of_guests",
//                     Number(e.target.value)
//                   )
//                 }
//                 className="border-gray-300 focus:border-blue-600 focus:ring-blue-600"
//               />
//             </div>
//             <div>
//               <Label
//                 htmlFor="numChildren"
//                 className="text-sm font-medium text-gray-700 mb-2"
//               >
//                 Children
//               </Label>
//               <Input
//                 type="number"
//                 id="numChildren"
//                 min="0"
//                 value={guestDetails.number_of_children}
//                 onChange={(e) =>
//                   handleGuestDetailsChange(
//                     "number_of_children",
//                     Number(e.target.value)
//                   )
//                 }
//                 className="border-gray-300 focus:border-blue-600 focus:ring-blue-600"
//               />
//             </div>
//             <div>
//               <Label
//                 htmlFor="numInfants"
//                 className="text-sm font-medium text-gray-700 mb-2"
//               >
//                 Infants
//               </Label>
//               <Input
//                 type="number"
//                 id="numInfants"
//                 min="0"
//                 value={guestDetails.number_of_infants}
//                 onChange={(e) =>
//                   handleGuestDetailsChange(
//                     "number_of_infants",
//                     Number(e.target.value)
//                   )
//                 }
//                 className="border-gray-300 focus:border-blue-600 focus:ring-blue-600"
//               />
//             </div>
//           </div>
//           <div className="md:col-span-2">
//             <Label
//               htmlFor="serviceNotes"
//               className="text-sm font-medium text-gray-700 mb-2"
//             >
//               Service Notes
//             </Label>
//             <Textarea
//               id="serviceNotes"
//               rows={3}
//               value={guestDetails.service_notes}
//               onChange={(e) =>
//                 handleGuestDetailsChange("service_notes", e.target.value)
//               }
//               className="border-gray-300 focus:border-blue-600 focus:ring-blue-600"
//               placeholder="Any additional service notes..."
//             />
//           </div>
//           <div className="md:col-span-2">
//             <Label
//               htmlFor="specialRequests"
//               className="text-sm font-medium text-gray-700 mb-2"
//             >
//               Special Requests
//             </Label>
//             <Textarea
//               id="specialRequests"
//               rows={3}
//               value={guestDetails.special_requests}
//               onChange={(e) =>
//                 handleGuestDetailsChange("special_requests", e.target.value)
//               }
//               className="border-gray-300 focus:border-blue-600 focus:ring-blue-600"
//               placeholder="e.g., late check-in, room preference..."
//             />
//           </div>
//         </div>
//         {error && (
//           <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-center gap-2">
//             <AlertCircle className="h-5 w-5" />
//             {error}
//           </div>
//         )}
//         <div className="mt-6 flex gap-4">
//           <Button
//             onClick={onBack}
//             variant="outline"
//             className="border-gray-300 text-gray-700 hover:bg-gray-100"
//           >
//             Back to Room Selection
//           </Button>
//           <Button
//             onClick={handleReviewClick}
//             className="bg-blue-600 hover:bg-blue-700 text-white"
//           >
//             <Eye className="mr-2 h-4 w-4" />
//             Review Booking
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

import React, { useState } from "react";
import {
  User,
  Check,
  Eye,
  CreditCard,
  Receipt,
  AlertCircle,
  MessageSquare,
  Sparkles,
  Loader2,
} from "lucide-react";
import type { BookingConfirmation, GuestDetails, Room } from "./types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface GuestDetailsFormProps {
  step: "details" | "billing";
  selectedRoom: Room;
  startDate: string;
  endDate: string;
  guestDetails: Omit<GuestDetails, "payment_method">;
  setGuestDetails: React.Dispatch<
    React.SetStateAction<Omit<GuestDetails, "payment_method">>
  >;
  onBack: () => void;
  onSubmitBooking: () => void;
  onProceedToPayment: () => void;
  bookingLoading: boolean;
  bookingConfirmation: BookingConfirmation | null;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

export const GuestDetailsForm: React.FC<GuestDetailsFormProps> = ({
  step,
  selectedRoom,
  startDate,
  endDate,
  guestDetails,
  setGuestDetails,
  onBack,
  onSubmitBooking,
  onProceedToPayment,
  bookingLoading,
  bookingConfirmation,
  error,
  setError,
}) => {
  const [isReviewing, setIsReviewing] = useState(false);

  const handleGuestDetailsChange = (
    field: keyof Omit<GuestDetails, "payment_method">,
    value: string | number
  ) => {
    setGuestDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleReviewClick = () => {
    if (
      !guestDetails.full_name ||
      !guestDetails.phone_number ||
      !guestDetails.email
    ) {
      setError(
        "Please fill in all required fields (Full Name, Phone Number, and Email)"
      );
      return;
    }
    setError("");
    setIsReviewing(true);
  };

  if (step === "billing" && bookingConfirmation) {
    const currencyInfo = bookingConfirmation.status_history.find(
      (h) => h.action === "currency_conversion"
    )?.details;

    return (
      <Card className="border-gray-200 shadow-sm w-[540px] max-w-[640px]">
        <CardHeader className="bg-none border-b border-gray-100 shadow">
          <CardTitle className="text-xl font-semibold text-green-800 flex items-center">
            <Receipt className="mr-2 h-5 w-5" />
            Booking Created - Please Confirm Billing
          </CardTitle>
          <CardDescription className="text-gray-600">
            Your booking with code{" "}
            <strong className="font-mono">{bookingConfirmation.code}</strong>{" "}
            has been created. Please review the final charges before proceeding
            to payment.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6 space-y-3">
            <h3 className="font-semibold text-lg text-gray-800">
              Charge Breakdown
            </h3>
            {bookingConfirmation.billing_meta_data.charge_report.map(
              (item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center text-sm text-gray-600"
                >
                  <span>{item.description}</span>
                  <span className="font-medium text-gray-800">
                    ${parseFloat(item.amount).toFixed(2)}
                  </span>
                </div>
              )
            )}
            <hr className="my-3 border-gray-200" />
            <div className="flex justify-between items-center font-bold text-gray-800">
              <span>Total Amount (USD)</span>
              <span>${currencyInfo?.original_required.toFixed(2)}</span>
            </div>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
            <p className="text-blue-700 text-sm">Total Amount to Pay in TZS</p>
            <p className="text-blue-800 font-bold text-2xl mt-1">
              {currencyInfo?.converted_required.toLocaleString("en-US", {
                style: "currency",
                currency: "TZS",
                minimumFractionDigits: 2,
              })}
            </p>
            {currencyInfo && (
              <p className="text-xs text-blue-600 mt-1">
                Exchange Rate: 1 USD ={" "}
                {(
                  currencyInfo.converted_required /
                  currencyInfo.original_required
                ).toFixed(2)}{" "}
                TZS
              </p>
            )}
          </div>
          <div className="mt-6 flex justify-end">
            <Button
              onClick={onProceedToPayment}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Confirm & Proceed to Payment
              <CreditCard className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isReviewing) {
    return (
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="bg-none shadow shadow-gray-100 border-b">
          <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
            <Eye className="mr-2 h-5 w-5" />
            Review Your Booking
          </CardTitle>
          <CardDescription className="text-gray-600">
            Please review all details before confirming your booking
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 border-b pb-2">
                Booking Details
              </h3>
              <p className="text-gray-600">
                <span className="font-medium">Room Type:</span>{" "}
                {selectedRoom.room_type_name}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Check-in:</span> {startDate}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Check-out:</span> {endDate}
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 border-b pb-2">
                Guest Information
              </h3>
              <p className="text-gray-600">
                <span className="font-medium">Full Name:</span>{" "}
                {guestDetails.full_name}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Email:</span> {guestDetails.email}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Phone:</span>{" "}
                {guestDetails.phone_number}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Address:</span>{" "}
                {guestDetails.address}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Guests:</span>{" "}
                {guestDetails.number_of_guests} Adults,{" "}
                {guestDetails.number_of_children} Children,{" "}
                {guestDetails.number_of_infants} Infants
              </p>
            </div>
          </div>
          {(guestDetails.service_notes || guestDetails.special_requests) && (
            <div className="mt-6 pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-6">
              {guestDetails.service_notes && (
                <div>
                  <h4 className="font-medium text-gray-800 flex items-center mb-2">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Service Notes
                  </h4>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-md text-sm">
                    {guestDetails.service_notes}
                  </p>
                </div>
              )}
              {guestDetails.special_requests && (
                <div>
                  <h4 className="font-medium text-gray-800 flex items-center mb-2">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Special Requests
                  </h4>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-md text-sm">
                    {guestDetails.special_requests}
                  </p>
                </div>
              )}
            </div>
          )}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              {error}
            </div>
          )}
          <div className="mt-6 flex gap-4">
            <Button
              onClick={() => setIsReviewing(false)}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Edit Details
            </Button>
            <Button
              onClick={onSubmitBooking}
              disabled={bookingLoading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white"
            >
              {bookingLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Booking...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Confirm Booking
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="bg-none shadow shadow-gray-100 border-b">
        <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
          <User className="mr-2 h-5 w-5" />
          Guest Details
        </CardTitle>
        <CardDescription className="text-gray-600">
          Booking for:{" "}
          <strong className="text-gray-800">
            {selectedRoom.room_type_name}
          </strong>
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label
              htmlFor="fullName"
              className="text-sm font-medium text-gray-700 mb-2"
            >
              Full Name *
            </Label>
            <Input
              type="text"
              id="fullName"
              value={guestDetails.full_name}
              onChange={(e) =>
                handleGuestDetailsChange("full_name", e.target.value)
              }
              className="border-gray-300 focus:border-blue-600 focus:ring-blue-600"
              required
            />
          </div>
          <div>
            <Label
              htmlFor="phoneNumber"
              className="text-sm font-medium text-gray-700 mb-2"
            >
              Phone Number *
            </Label>
            <Input
              type="tel"
              id="phoneNumber"
              value={guestDetails.phone_number}
              onChange={(e) =>
                handleGuestDetailsChange("phone_number", e.target.value)
              }
              className="border-gray-300 focus:border-blue-600 focus:ring-blue-600"
              required
            />
          </div>
          <div className="md:col-span-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700 mb-2"
            >
              Email Address *
            </Label>
            <Input
              type="email"
              id="email"
              value={guestDetails.email}
              onChange={(e) =>
                handleGuestDetailsChange("email", e.target.value)
              }
              className="border-gray-300 focus:border-blue-600 focus:ring-blue-600"
              required
            />
          </div>
          <div className="md:col-span-2">
            <Label
              htmlFor="address"
              className="text-sm font-medium text-gray-700 mb-2"
            >
              Address
            </Label>
            <Input
              type="text"
              id="address"
              value={guestDetails.address}
              onChange={(e) =>
                handleGuestDetailsChange("address", e.target.value)
              }
              className="border-gray-300 focus:border-blue-600 focus:ring-blue-600"
              placeholder="e.g. 123 Main St, City, Country"
            />
          </div>
          <div className="grid grid-cols-3 gap-4 md:col-span-2">
            <div>
              <Label
                htmlFor="numGuests"
                className="text-sm font-medium text-gray-700 mb-2"
              >
                Guests
              </Label>
              <Input
                type="number"
                id="numGuests"
                min="1"
                value={guestDetails.number_of_guests}
                onChange={(e) =>
                  handleGuestDetailsChange(
                    "number_of_guests",
                    Number(e.target.value)
                  )
                }
                className="border-gray-300 focus:border-blue-600 focus:ring-blue-600"
              />
            </div>
            <div>
              <Label
                htmlFor="numChildren"
                className="text-sm font-medium text-gray-700 mb-2"
              >
                Children
              </Label>
              <Input
                type="number"
                id="numChildren"
                min="0"
                value={guestDetails.number_of_children}
                onChange={(e) =>
                  handleGuestDetailsChange(
                    "number_of_children",
                    Number(e.target.value)
                  )
                }
                className="border-gray-300 focus:border-blue-600 focus:ring-blue-600"
              />
            </div>
            <div>
              <Label
                htmlFor="numInfants"
                className="text-sm font-medium text-gray-700 mb-2"
              >
                Infants
              </Label>
              <Input
                type="number"
                id="numInfants"
                min="0"
                value={guestDetails.number_of_infants}
                onChange={(e) =>
                  handleGuestDetailsChange(
                    "number_of_infants",
                    Number(e.target.value)
                  )
                }
                className="border-gray-300 focus:border-blue-600 focus:ring-blue-600"
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <Label
              htmlFor="serviceNotes"
              className="text-sm font-medium text-gray-700 mb-2"
            >
              Service Notes
            </Label>
            <Textarea
              id="serviceNotes"
              rows={3}
              value={guestDetails.service_notes}
              onChange={(e) =>
                handleGuestDetailsChange("service_notes", e.target.value)
              }
              className="border-gray-300 focus:border-blue-600 focus:ring-blue-600"
              placeholder="Any additional service notes..."
            />
          </div>
          <div className="md:col-span-2">
            <Label
              htmlFor="specialRequests"
              className="text-sm font-medium text-gray-700 mb-2"
            >
              Special Requests
            </Label>
            <Textarea
              id="specialRequests"
              rows={3}
              value={guestDetails.special_requests}
              onChange={(e) =>
                handleGuestDetailsChange("special_requests", e.target.value)
              }
              className="border-gray-300 focus:border-blue-600 focus:ring-blue-600"
              placeholder="e.g., late check-in, room preference..."
            />
          </div>
        </div>
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}
        <div className="mt-6 flex gap-4">
          <Button
            onClick={onBack}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Back to Room Selection
          </Button>
          <Button
            onClick={handleReviewClick}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Eye className="mr-2 h-4 w-4" />
            Review Booking
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
