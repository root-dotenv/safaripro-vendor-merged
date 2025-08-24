// src/routes/index.tsx
import { createBrowserRouter, Outlet } from "react-router-dom";

// Providers and Context
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/providers/theme-provider";
import { HotelProvider } from "@/providers/hotel-provider";
import { AuthProvider } from "@/context/auth-context";

// Layouts and Pages
import DashboardLayout from "@/components/layout/dashboard-layout";
import HotelFeatures from "@/pages/hotel/hotel-features";
import AllBookings from "@/pages/bookings/all-bookings";
import SafariproBookings from "@/pages/bookings/safaripro-bookings";
import BookingDetailsPage from "@/pages/bookings/booking-details";
import NewRoom from "@/pages/rooms/new-room";
import AvailableRooms from "@/pages/rooms/available-rooms";
import BookedRooms from "@/pages/rooms/booked-rooms";
import MaintenanceRooms from "@/pages/rooms/maintenance-rooms";
import AvailableRoomsByDate from "@/pages/rooms/available-rooms-date";
import RoomDetailsPage from "@/pages/rooms/rooms-details";
import CheckedInGuests from "@/pages/reservation/checked-in";
import CheckedOutGuests from "@/pages/reservation/checked-out";
import SpecialRequests from "@/pages/reservation/special-requests";
import NotFoundPage from "@/pages/error/not-found-page";

// --- AUTHENTICATION ---
import LoginPage from "@/pages/authentication/login";
import OtpVerificationPage from "@/pages/authentication/otp-verify";
import { ProtectedRoute } from "./protected-routes";
import QueryProvider from "@/providers/query-provider";
import MakeBooking from "@/pages/bookings/make-booking";
import HotelCustomizationPage from "@/pages/hotel/customize-hotel/HotelCustomizationPage";
import InventoryCategories from "@/pages/inventory/inventory-categories";
import InventoryItems from "@/pages/inventory/inventory-items";
import HotelDepartments from "@/pages/inventory/departments";
import EventSpaces from "@/pages/inventory/events-spaces";
import EventSpaceTypes from "@/pages/inventory/event-space-types";
import RoomTypesTabController from "@/pages/rooms/room-types/RoomTypesTabController";
import HotelDetails from "@/pages/hotel/hotel-details";
import Payouts from "@/pages/billings/payouts";
import Charges from "@/pages/billings/charges";
import SafariProInvoices from "@/pages/billings/safaripro-invoices";
import WelcomeWalkthroughs from "@/pages/miscellaneous/welcome-walkthroughs";
import AllocateRooms from "@/pages/rooms/allocations/allocate-rooms";
import Allocations from "@/pages/rooms/allocations/allocations";

const RootLayout = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="hotel-management-theme">
      <QueryProvider>
        <AuthProvider>
          <HotelProvider>
            <Outlet />
            <Toaster richColors />
          </HotelProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
};

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <NotFoundPage />, // A single error boundary for the whole app
    children: [
      // --- Public Routes ---
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/verify-otp",
        element: <OtpVerificationPage />,
      },
      {
        path: "/welcome",
        element: <WelcomeWalkthroughs />,
      },

      // --- Protected Routes ---
      // All routes inside this object will be protected by ProtectedRoute.
      {
        element: <ProtectedRoute />, // This layout route checks for auth and renders an <Outlet />.
        children: [
          {
            path: "/",
            element: <DashboardLayout />,
            children: [
              { index: true, element: <HotelDetails /> },
              // - - - Hotel routes
              { path: "hotel/hotel-details", element: <HotelDetails /> },
              { path: "hotel/hotel-features", element: <HotelFeatures /> },
              {
                path: "hotel/customize-hotel",
                element: <HotelCustomizationPage />,
              },
              // - - - Booking routes
              // { path: "bookings/new-booking", element: <NewBooking /> },
              { path: "bookings/new-booking", element: <MakeBooking /> },
              { path: "bookings/all-bookings", element: <AllBookings /> },
              {
                path: "bookings/safaripro-bookings",
                element: <SafariproBookings />,
              },
              { path: "bookings/:booking_id", element: <BookingDetailsPage /> },
              // - - - Room routes
              { path: "rooms/new-room", element: <NewRoom /> },
              { path: "rooms/available-rooms", element: <AvailableRooms /> },
              { path: "rooms/booked-rooms", element: <BookedRooms /> },
              {
                path: "rooms/maintenance-rooms",
                element: <MaintenanceRooms />,
              },
              // { path: "rooms/room-types", element: <RoomTypes /> },
              { path: "rooms/room-types", element: <RoomTypesTabController /> },
              {
                path: "rooms/available-rooms-dates",
                element: <AvailableRoomsByDate />,
              },
              { path: "rooms/:room_id", element: <RoomDetailsPage /> },
              { path: "rooms/allocate-rooms", element: <AllocateRooms /> },
              { path: "rooms/allocations", element: <Allocations /> },
              // - - - Reservations routes
              { path: "reservations/checkin", element: <CheckedInGuests /> },
              { path: "reservations/checkout", element: <CheckedOutGuests /> },
              {
                path: "reservations/special-requests",
                element: <SpecialRequests />,
              },
              // - - - Housekeeping routes
              {
                path: "house-keeping/inventory-categories",
                element: <InventoryCategories />,
              },
              {
                path: "house-keeping/inventory-items",
                element: <InventoryItems />,
              },
              {
                path: "house-keeping/departments",
                element: <HotelDepartments />,
              },
              {
                path: "house-keeping/event-space-types",
                element: <EventSpaceTypes />,
              },
              {
                path: "house-keeping/event-spaces",
                element: <EventSpaces />,
              },
              {
                path: "billings/payouts",
                element: <Payouts />,
              },
              {
                path: "billings/charges",
                element: <Charges />,
              },
              {
                path: "billings/invoices",
                element: <SafariProInvoices />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
