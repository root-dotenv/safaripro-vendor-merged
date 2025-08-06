"use client";

import { useState } from "react";
import { Wallet, Smartphone } from "lucide-react";
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
            <CardDescription className="text-gray-600">
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
            <CardDescription className="text-gray-600">
              Pay securely now using your mobile money provider (e.g., M-Pesa,
              Tigo Pesa). Ideal for online or remote bookings.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
