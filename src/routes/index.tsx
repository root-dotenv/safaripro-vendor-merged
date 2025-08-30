// src/routes/index.tsx
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoutes from "./protected-routes";
import LoginPage from "@/pages/authentication/login";
import MainOverview from "@/pages/dashboard/main-overview";
import NotFoundPage from "@/pages/error/not-found-page";
import AllBookings from "@/pages/bookings/all-bookings";

// Import all the dashboard pages from your project structure
import CashBooking from "@/pages/bookings/cash-booking";
import MobileBooking from "@/pages/bookings/mobile-booking";
import SafariProBookings from "@/pages/bookings/safaripro-bookings";
import AvailableRooms from "@/pages/rooms/available-rooms";
import BookedRooms from "@/pages/rooms/booked-rooms";
import MaintenanceRooms from "@/pages/rooms/maintenance-rooms";
import RoomTypes from "@/pages/rooms/room-types";
import Allocations from "@/pages/rooms/allocations/allocations";
import HotelDetails from "@/pages/hotel/hotel-details";
import CustomizeHotelPage from "@/pages/hotel/customize-hotel";
import Charges from "@/pages/billings/charges";
import Payouts from "@/pages/billings/payouts";
import SafariProInvoices from "@/pages/billings/safaripro-invoices";
import InventoryItems from "@/pages/inventory/inventory-items";
import InventoryCategories from "@/pages/inventory/inventory-categories";
import Departments from "@/pages/inventory/departments";
import CheckedIn from "@/pages/reservation/checked-in";
import CheckedOut from "@/pages/reservation/checked-out";
import SpecialRequests from "@/pages/reservation/special-requests";
import OnboardingWizard from "@/pages/onboarding/onboarding-wizard";
import UserAccountPage from "@/pages/authentication/user-account";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoutes />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <MainOverview />,
      },
      {
        path: "user-account",
        element: <UserAccountPage />,
      },
      {
        path: "bookings/all-bookings",
        element: <AllBookings />,
      },
      {
        path: "bookings/cash-booking",
        element: <CashBooking />,
      },
      {
        path: "bookings/mobile-booking",
        element: <MobileBooking />,
      },
      {
        path: "bookings/safaripro-booking",
        element: <SafariProBookings />,
      },
      // Rooms Section
      {
        path: "rooms/available",
        element: <AvailableRooms />,
      },
      {
        path: "rooms/booked",
        element: <BookedRooms />,
      },
      {
        path: "rooms/maintenance",
        element: <MaintenanceRooms />,
      },
      {
        path: "rooms/types",
        element: <RoomTypes />,
      },
      {
        path: "rooms/allocations",
        element: <Allocations />,
      },
      // Hotel Section
      {
        path: "hotel/details",
        element: <HotelDetails />,
      },
      {
        path: "hotel/customize",
        element: <CustomizeHotelPage />,
      },
      // Billings Section
      {
        path: "billings/charges",
        element: <Charges />,
      },
      {
        path: "billings/payouts",
        element: <Payouts />,
      },
      {
        path: "billings/invoices",
        element: <SafariProInvoices />,
      },
      // Inventory Section
      {
        path: "inventory/items",
        element: <InventoryItems />,
      },
      {
        path: "inventory/categories",
        element: <InventoryCategories />,
      },
      {
        path: "inventory/departments",
        element: <Departments />,
      },
      // Reservation Section
      {
        path: "reservations/checked-in",
        element: <CheckedIn />,
      },
      {
        path: "reservations/checked-out",
        element: <CheckedOut />,
      },
      {
        path: "reservations/special-requests",
        element: <SpecialRequests />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/onboarding",
    element: <OnboardingWizard />,
  },
]);
