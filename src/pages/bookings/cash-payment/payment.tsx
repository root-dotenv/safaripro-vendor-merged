import React, { useState } from "react";
import {
  CircleDollarSign,
  AlertCircle,
  CheckCircle,
  Loader2,
  Wallet,
} from "lucide-react";
import type { BookingConfirmation } from "./types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface CashPaymentFormProps {
  bookingDetails: BookingConfirmation;
  onPaymentSuccess: () => void;
}

export const CashPaymentForm: React.FC<CashPaymentFormProps> = ({
  bookingDetails,
  onPaymentSuccess,
}) => {
  const [amountReceived, setAmountReceived] = useState("");
  const [confirmAmount, setConfirmAmount] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const currencyInfo = bookingDetails.status_history.find(
    (h) => h.action === "currency_conversion"
  )?.details;

  const calculateNights = (start: string, end: string): number => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };
  const numberOfNights = calculateNights(
    bookingDetails.start_date,
    bookingDetails.end_date
  );

  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (amountReceived !== confirmAmount) {
      setError("The amounts entered do not match. Please re-enter.");
      return;
    }
    if (!amountReceived) {
      setError("Please enter the amount received from the guest.");
      return;
    }

    setIsSubmitting(true);
    const payload = {
      booking_status: "Confirmed",
      currency_paid: "TZS",
      amount_paid: amountReceived,
    };

    console.log("Submitting Cash Payment Payload:", payload);

    try {
      const response = await fetch(
        `http://192.168.110.207:8010/api/v1/bookings/${bookingDetails.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update booking status.");
      }

      setIsConfirmed(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isConfirmed) {
    return (
      <Card className="max-w-[640px] w-[540px] mx-auto border-gray-200 shadow-sm">
        <CardHeader className="bg-gray-50/10 border-b border-gray-100 shadow">
          <CardTitle className="text-xl font-semibold text-green-800 flex items-center">
            <CheckCircle className="mr-2 h-6 w-6" />
            Booking Confirmed!
          </CardTitle>
          <CardDescription className="text-green-700">
            The cash payment has been registered and the booking is now
            confirmed.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <Button
            onClick={onPaymentSuccess}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Finish & View Ticket
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-[640px] w-[540px] mx-auto border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800">
          Register Cash Payment
        </CardTitle>
        <CardDescription className="text-gray-600">
          Booking Code:{" "}
          <strong className="font-mono">{bookingDetails.code}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="bg-[#FFF] border-[#D9D9D8] p-4 rounded-lg mb-6 space-y-3">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Price per night</span>
            <span>
              ${parseFloat(bookingDetails.amount_required).toFixed(2)} USD
            </span>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Number of nights</span>
            <span>{numberOfNights}</span>
          </div>
          <hr className="border-gray-200" />
          <div className="text-center">
            <p className="text-gray-600 text-sm">Total Amount Due</p>
            <p className="text-[1.75rem] font-bold text-yellow-600 mt-1">
              {currencyInfo?.converted_required.toLocaleString("en-US", {
                style: "currency",
                currency: "TZS",
                minimumFractionDigits: 2,
              })}
            </p>
            <p className="text-xs text-gray-600">
              (${currencyInfo?.original_required.toFixed(2)} USD)
            </p>
          </div>
        </div>

        <form onSubmit={handleConfirmPayment} className="space-y-4">
          <div>
            <Label
              htmlFor="amountReceived"
              className="text-sm font-medium text-gray-700"
            >
              Amount Received (TZS)
            </Label>
            <div className="relative mt-1">
              <CircleDollarSign className="absolute top-1/2 -translate-y-1/2 left-3 h-5 w-5 text-gray-400" />
              <Input
                type="number"
                id="amountReceived"
                value={amountReceived}
                onChange={(e) => setAmountReceived(e.target.value)}
                required
                placeholder="Enter cash amount received"
                className="pl-10 border-gray-300 focus:border-blue-600 focus:ring-blue-600"
              />
            </div>
          </div>
          <div>
            <Label
              htmlFor="confirmAmount"
              className="text-sm font-medium text-gray-700"
            >
              Confirm Amount (TZS)
            </Label>
            <div className="relative mt-1">
              <CircleDollarSign className="absolute top-1/2 -translate-y-1/2 left-3 h-5 w-5 text-gray-400" />
              <Input
                type="number"
                id="confirmAmount"
                value={confirmAmount}
                onChange={(e) => setConfirmAmount(e.target.value)}
                required
                placeholder="Confirm amount received"
                className="pl-10 border-gray-300 focus:border-blue-600 focus:ring-blue-600"
              />
            </div>
          </div>
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              {error}
            </div>
          )}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Confirming...
              </>
            ) : (
              <>
                <Wallet className="mr-2 h-4 w-4" />
                Confirm Cash Payment
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
