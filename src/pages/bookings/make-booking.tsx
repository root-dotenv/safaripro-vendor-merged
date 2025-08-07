// "use client";

// import { useState } from "react";
// import { Wallet, Smartphone } from "lucide-react";
// import CashBooking from "./cash-booking";
// import NewBooking from "./new-booking";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";

// // Define the type for the selection
// type PaymentSelection = "cash" | "mobile" | null;

// export default function MakeBooking() {
//   const [selection, setSelection] = useState<PaymentSelection>(null);

//   // If a selection has been made, render the corresponding component
//   if (selection === "cash") {
//     return <CashBooking onBack={() => setSelection(null)} />;
//   }

//   if (selection === "mobile") {
//     return <NewBooking onBack={() => setSelection(null)} />;
//   }

//   // If no selection has been made, show the choice cards
//   return (
//     <div className="max-w-4xl mx-auto p-6 md:p-8 space-y-6">
//       <div className="text-center">
//         <h1 className="text-3xl font-bold text-gray-800 mb-2">
//           Create a New Booking
//         </h1>
//         <p className="text-gray-600 text-lg">
//           How would you like to pay for your booking?
//         </p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Card for Cash Payment */}
//         <Card
//           onClick={() => setSelection("cash")}
//           className="border-gray-200 shadow-sm hover:shadow-md hover:border-blue-600 transition-all duration-300 cursor-pointer"
//         >
//           <CardHeader className="flex items-center justify-center">
//             <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
//               <Wallet className="h-6 w-6 text-blue-600" />
//             </div>
//           </CardHeader>
//           <CardContent className="text-center">
//             <CardTitle className="text-xl font-semibold text-gray-800 mb-3">
//               Pay with Cash
//             </CardTitle>
//             <CardDescription className="text-gray-600">
//               Complete the booking now and pay with cash upon arrival at the
//               front desk. Ideal for walk-in guests or staff-assisted bookings.
//             </CardDescription>
//           </CardContent>
//         </Card>

//         {/* Card for Mobile Payment */}
//         <Card
//           onClick={() => setSelection("mobile")}
//           className="border-gray-200 shadow-sm hover:shadow-md hover:border-green-600 transition-all duration-300 cursor-pointer"
//         >
//           <CardHeader className="flex items-center justify-center">
//             <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
//               <Smartphone className="h-6 w-6 text-green-600" />
//             </div>
//           </CardHeader>
//           <CardContent className="text-center">
//             <CardTitle className="text-xl font-semibold text-gray-800 mb-3">
//               Pay with Mobile
//             </CardTitle>
//             <CardDescription className="text-gray-600">
//               Pay securely now using your mobile money provider (e.g., M-Pesa,
//               Tigo Pesa). Ideal for online or remote bookings.
//             </CardDescription>
//           </CardContent>
//         </Card>
//       </div>

//       {/*  - - - Notes Accordion and Guides Goes Here */}
//       <div className="w-full h-full flex items-center justify-center p-4 mt-6 rounded-lg">
//         <p>This is for experimental purpose only</p>
//       </div>
//     </div>
//   );
// }

"use client";
import { useState } from "react";
import { Wallet, Smartphone } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CashBooking from "./cash-booking";
import NewBooking from "./new-booking";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

// Define the type for the selection
type PaymentSelection = "cash" | "mobile" | null;

export default function MakeBooking() {
  const [selection, setSelection] = useState<PaymentSelection>(null);

  // If a selection has been made, render the corresponding component
  if (selection === "cash") {
    return <CashBooking onBack={() => setSelection(null)} />;
  }

  if (selection === "mobile") {
    return <NewBooking onBack={() => setSelection(null)} />;
  }

  // If no selection has been made, show the choice cards
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Create a New Booking
        </h1>
        <p className="text-gray-600 text-lg">
          How would you like to pay for your booking?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card for Cash Payment */}
        <Card
          onClick={() => setSelection("cash")}
          className="border-gray-200 shadow-sm hover:shadow-md hover:border-blue-600 transition-all duration-300 cursor-pointer"
        >
          <CardHeader className="flex items-center justify-center">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Wallet className="h-6 w-6 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent className="text-center">
            <CardTitle className="text-xl font-semibold text-gray-800 mb-3">
              Pay with Cash
            </CardTitle>
            <CardDescription className="text-gray-600 text-[1rem]">
              Complete the booking now and pay with cash upon arrival at the
              front desk. Ideal for walk-in guests or staff-assisted bookings.
            </CardDescription>
          </CardContent>
        </Card>

        {/* Card for Mobile Payment */}
        <Card
          onClick={() => setSelection("mobile")}
          className="border-gray-200 shadow-sm hover:shadow-md hover:border-green-600 transition-all duration-300 cursor-pointer"
        >
          <CardHeader className="flex items-center justify-center">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <Smartphone className="h-6 w-6 text-green-600" />
            </div>
          </CardHeader>
          <CardContent className="text-center">
            <CardTitle className="text-xl font-semibold text-gray-800 mb-3">
              Pay with Mobile
            </CardTitle>
            <CardDescription className="text-gray-600 text-[1rem]">
              Pay securely now using your mobile money provider (e.g., M-Pesa,
              Tigo Pesa). Ideal for online or remote bookings.
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* FAQ and Guidelines Accordion */}
      <Card className="border-gray-200 shadow-sm mt-6">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800">
            BOOKING GUIDELINES
          </CardTitle>
          <CardDescription className="text-gray-800 text-[1rem]">
            Important information for guests and front desk staff to ensure a
            smooth booking process.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="confirm-cash">
              <AccordionTrigger className="text-[1.125rem] hover:no-underline no-underline font-medium">
                1. Always confirm the cash amount before submitting.
              </AccordionTrigger>
              <AccordionContent className="text-[1rem]">
                For all cash bookings, it is crucial to count and verify the
                full payment from the guest before clicking the "Confirm
                Booking" button. This prevents financial discrepancies and
                ensures the booking is logged correctly in the system.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="verify-ticket">
              <AccordionTrigger className="text-[1.125rem] hover:no-underline no-underline font-medium">
                2. Always verify the booking ticket at check-in.
              </AccordionTrigger>
              <AccordionContent className="text-[1rem]">
                Before handing over room keys, ask the guest for their booking
                confirmation (on their printed tickets or on their device).
                Match the booking code and guest name with the details in the
                system to ensure the correct person is checking into the correct
                room.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="confirm-amount">
              <AccordionTrigger className="text-[1.125rem] hover:no-underline no-underline font-medium">
                3. Be certain of the total amount for mobile payments.
              </AccordionTrigger>
              <AccordionContent className="text-[1rem]">
                When processing a mobile payment, double-check the total amount
                displayed on the confirmation screen. Once the payment request
                is sent to the customer's mobile provider, it cannot be easily
                altered.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="check-in-procedure">
              <AccordionTrigger className="text-[1.125rem] hover:no-underline no-underline font-medium">
                4. Handle special requests and notes carefully.
              </AccordionTrigger>
              <AccordionContent className="text-[1rem]">
                Pay close attention to any "Service Notes" or "Special Requests"
                entered during the booking process. These contain important
                guest information (e.g., allergies, late check-in, pet
                information) that is vital for providing good service.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
