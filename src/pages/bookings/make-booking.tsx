// // - - - src/pages/bookings/make-booking.tsx
// "use client";
// import { useState } from "react";
// import { Wallet, Smartphone } from "lucide-react";
// import CashBooking from "./cash-booking";
// import MobileBooking from "./mobile-booking";
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
//     return <MobileBooking onBack={() => setSelection(null)} />;
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
//             <CardDescription className="text-gray-600 text-[1rem]">
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
//             <CardDescription className="text-gray-600 text-[1rem]">
//               Pay securely now using your mobile money provider (e.g., M-Pesa,
//               Tigo Pesa). Ideal for online or remote bookings.
//             </CardDescription>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

// src/pages/bookings/make-booking.tsx
"use client";
import type { JSX } from "react";
import { Wallet, Smartphone } from "lucide-react";

// Component Imports
import CashBooking from "./cash-booking";
import MobileBooking from "./mobile-booking";

// Shadcn/ui Imports for Tabs
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MakeBooking(): JSX.Element {
  // Define the tabs in an array for clean mapping and scalability
  const tabs = [
    {
      id: "cash",
      label: "Pay with Cash",
      icon: <Wallet className="h-5 w-5" />,
      // NOTE: The `onBack` prop is no longer needed with a tabbed interface
      component: <CashBooking />,
    },
    {
      id: "mobile",
      label: "Pay with Mobile",
      icon: <Smartphone className="h-5 w-5" />,
      // NOTE: The `onBack` prop is no longer needed with a tabbed interface
      component: <MobileBooking />,
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Create a New Booking
          </h1>
          <p className="mt-1 text-gray-600">
            Select a payment method to proceed with the booking.
          </p>
        </header>

        <Tabs defaultValue="cash" className="w-full">
          {/* Reusing the exact styles from NewRoomPage for consistency */}
          <TabsList className="h-auto px-1.5 py-1.75 bg-gray-100 rounded-lg grid grid-cols-2 max-w-md mx-auto sm:mx-0">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="data-[state=active]:bg-[#0081FB] data-[state=active]:text-[#FFF] data-[state=active]:shadow-sm text-[#0081FB] bg-[#FFF] shadow flex items-center gap-2 hover:text-[#0081FB] mx-1"
              >
                {tab.icon}
                <span className="font-medium">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Render the content for each tab */}
          {tabs.map((tab) => (
            <TabsContent
              key={tab.id}
              value={tab.id}
              className="mt-6 rounded-lg"
            >
              {tab.component}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
