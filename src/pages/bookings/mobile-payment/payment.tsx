import React, { useState } from "react";
import {
  CreditCard,
  Phone,
  CircleDollarSign,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import type { BookingConfirmation, PaymentSuccessResponse } from "./types";
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

interface PaymentFormProps {
  bookingDetails: BookingConfirmation;
  onPaymentSuccess: () => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  bookingDetails,
  onPaymentSuccess,
}) => {
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [confirmAmount, setConfirmAmount] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentResponse, setPaymentResponse] =
    useState<PaymentSuccessResponse | null>(null);

  const currencyInfo = bookingDetails.status_history.find(
    (h) => h.action === "currency_conversion"
  )?.details;

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (amount !== confirmAmount) {
      setError("The amounts entered do not match. Please re-enter.");
      return;
    }
    if (!accountNumber || !amount) {
      setError("Please fill in all payment fields.");
      return;
    }

    setIsSubmitting(true);
    const payload = {
      referenceId: bookingDetails.payment_reference,
      amount: amount,
      accountNumber: accountNumber,
    };

    console.log("Submitting Payment Payload:", payload);

    try {
      const response = await fetch(
        "http://192.168.110.207:8025/api/v1/checkout",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Payment request failed.");
      }
      setPaymentResponse(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (paymentResponse?.success) {
    return (
      <Card className="w-[540px] max-w-[640px] mx-auto border-gray-200 shadow-sm">
        <CardHeader className="bg-gray-50/20 border-b border-gray-100 shadow">
          <CardTitle className="text-xl mx-auto font-semibold text-green-800 flex items-center">
            <CheckCircle className="mr-2 h-6 w-6" />
            Payment Request Received
          </CardTitle>
          <CardDescription className="text-green-700 mx-auto">
            {paymentResponse.message}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <p className="text-sm text-gray-600 mb-4">
            Transaction ID:{" "}
            <strong className="font-mono">
              {paymentResponse.transactionId}
            </strong>
          </p>
          <Button
            onClick={onPaymentSuccess}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Next: Verify Payment & Check-In
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-[540px] max-w-[640px] mx-auto border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl mx-auto font-semibold text-gray-800">
          Complete Your Payment
        </CardTitle>
        <CardDescription className="text-gray-600 mx-auto">
          Booking Code:{" "}
          <strong className="font-mono">{bookingDetails.code}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="bg-[#FFF] shadow border border-[#E5E5E4] p-4 rounded-lg mb-6 text-center">
          <p className="text-gray-600 text-sm">Total Amount to Pay</p>
          <p className="text-[1.75rem] font-bold text-yellow-700 mt-1">
            {currencyInfo?.converted_required.toLocaleString("en-US", {
              style: "currency",
              currency: "TZS",
            })}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            (${currencyInfo?.original_required.toFixed(2)} USD)
          </p>
        </div>

        <form onSubmit={handlePaymentSubmit} className="space-y-4">
          <div>
            <Label
              htmlFor="accountNumber"
              className="text-sm font-medium text-gray-700"
            >
              Phone Number (For Payment)
            </Label>
            <div className="relative mt-1">
              <Phone className="absolute top-1/2 -translate-y-1/2 left-3 h-5 w-5 text-gray-400" />
              <Input
                type="tel"
                id="accountNumber"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required
                className="pl-10 border-gray-300 focus:border-blue-600 focus:ring-blue-600"
              />
            </div>
          </div>
          <div>
            <Label
              htmlFor="amount"
              className="text-sm font-medium text-gray-700"
            >
              Amount (TZS)
            </Label>
            <div className="relative mt-1">
              <CircleDollarSign className="absolute top-1/2 -translate-y-1/2 left-3 h-5 w-5 text-gray-400" />
              <Input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                placeholder="e.g., 3000000"
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
                placeholder="Confirm amount"
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
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Pay Now
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
