"use client";
import { useState } from "react";
import type {
  BookingConfirmation,
  GuestDetails,
  Room,
} from "./cash-payment/types";
import { GuestDetailsForm } from "./cash-payment/guest-details";
import { CheckinGuest } from "./cash-payment/checkin-guest";
import { SearchRoomAvailability } from "./cash-payment/search-room";
import { CashPaymentForm } from "./cash-payment/payment";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function CashBooking() {
  // State for application flow control
  type Step = "search" | "details" | "billing" | "payment" | "confirmation";
  const [step, setStep] = useState<Step>("search");

  // State for room search
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState("");

  // State for selected room and booking process
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [bookingConfirmation, setBookingConfirmation] =
    useState<BookingConfirmation | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Guest details state - UPDATED
  const [guestDetails, setGuestDetails] = useState<
    Omit<GuestDetails, "payment_method">
  >({
    full_name: "",
    phone_number: "",
    email: "", // Added email
    address: "", // Added address
    service_notes: "",
    special_requests: "",
    number_of_children: 0,
    number_of_guests: 1,
    number_of_infants: 0,
  });

  const HOTEL_ID = import.meta.env.VITE_HOTEL_ID;
  const SEARCH_API_URL = import.meta.env.VITE_HOTEL_BASE_URL;
  const BOOKING_API_URL = import.meta.env.VITE_BOOKING_BASE_URL;

  const handleSearchRooms = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates");
      return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      setError("End date must be after start date");
      return;
    }

    setSearchLoading(true);
    setError("");
    setAvailableRooms([]);

    try {
      const url = `${SEARCH_API_URL}rooms/availability/range/?hotel_id=${HOTEL_ID}&start_date=${startDate}&end_date=${endDate}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch room availability");
      }

      const data = await response.json();
      setAvailableRooms(data.rooms || []);
    } catch (err: any) {
      setError(
        err.message || "Error fetching room availability. Please try again."
      );
      console.error("Error:", err);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSelectRoom = (room: Room) => {
    setSelectedRoom(room);
    setStep("details");
  };

  const calculateNights = (start: string, end: string): number => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const handleSubmitBooking = async () => {
    if (!selectedRoom) {
      setError("No room selected. Please go back.");
      return;
    }
    setBookingLoading(true);
    setError("");

    const nights = calculateNights(startDate, endDate);
    const totalAmount = nights * selectedRoom.price_per_night;

    // Booking payload - UPDATED
    const bookingData = {
      full_name: guestDetails.full_name,
      phone_number: guestDetails.phone_number,
      email: guestDetails.email, // Added email
      address: guestDetails.address, // Added address
      amount_required: totalAmount.toString(),
      property_item_type: selectedRoom.room_type_name,
      start_date: startDate,
      end_date: endDate,
      microservice_item_id: HOTEL_ID,
      service_notes: guestDetails.service_notes || "not available",
      number_of_children: Number(guestDetails.number_of_children),
      number_of_guests: Number(guestDetails.number_of_guests),
      number_of_infants: Number(guestDetails.number_of_infants),
      booking_type: "Physical",
      special_requests: guestDetails.special_requests || "not available",
      payment_method: "Cash",
    };

    console.log("Booking Payload:", bookingData);
    try {
      const response = await fetch(`${BOOKING_API_URL}bookings/web-create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.detail || "Failed to create booking");
      }

      setBookingConfirmation(result);
      setStep("billing");
    } catch (err: any) {
      setError(err.message || "Error creating booking. Please try again.");
      console.error("Booking error:", err);
    } finally {
      setBookingLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setStep("confirmation");
  };

  const handleGoBack = () => {
    setError("");
    if (step === "details" || step === "billing") {
      setStep("search");
      setBookingConfirmation(null);
      setSelectedRoom(null);
    }
  };

  const renderStep = () => {
    switch (step) {
      case "search":
        return (
          <SearchRoomAvailability
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            availableRooms={availableRooms}
            loading={searchLoading}
            error={error}
            onSearchRooms={handleSearchRooms}
            onSelectRoom={handleSelectRoom}
          />
        );
      case "details":
      case "billing":
        return (
          <GuestDetailsForm
            step={step}
            selectedRoom={selectedRoom!}
            startDate={startDate}
            endDate={endDate}
            guestDetails={guestDetails}
            setGuestDetails={setGuestDetails}
            onBack={handleGoBack}
            onSubmitBooking={handleSubmitBooking}
            onProceedToPayment={() => setStep("payment")}
            bookingLoading={bookingLoading}
            bookingConfirmation={bookingConfirmation}
            error={error}
            setError={setError}
          />
        );
      case "payment":
        return (
          <CashPaymentForm
            bookingDetails={bookingConfirmation!}
            onPaymentSuccess={handlePaymentSuccess}
          />
        );
      case "confirmation":
        return <CheckinGuest bookingId={bookingConfirmation!.id} />;
      default:
        return <div>Invalid step</div>;
    }
  };

  return (
    <Card className="max-w-7xl mx-auto p-6 my-[2.5rem] bg-none border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800">
          Create New Booking
        </CardTitle>
        <CardDescription className="text-gray-600">
          Follow the steps below to complete your cash booking.
        </CardDescription>
      </CardHeader>
      <CardContent>{renderStep()}</CardContent>
    </Card>
  );
}
