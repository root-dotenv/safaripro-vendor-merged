// src/routes/index.tsx
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoutes from "./protected-routes";
import LoginPage from "@/pages/authentication/login";
import NotFoundPage from "@/pages/error/not-found-page";
import AllBookings from "@/pages/bookings/all-bookings";
import OnboardingWizard from "@/pages/onboarding/onboarding-wizard";
import AvailableRooms from "@/pages/rooms/available-rooms";
import BookedRooms from "@/pages/rooms/booked-rooms";
import MaintenanceRooms from "@/pages/rooms/maintenance-rooms";
import Allocations from "@/pages/rooms/allocations/allocations";
import HotelDetails from "@/pages/hotel/hotel-details";
import Charges from "@/pages/billings/charges";
import Payouts from "@/pages/billings/payouts";
import SafariProInvoices from "@/pages/billings/safaripro-invoices";
import InventoryItems from "@/pages/inventory/inventory-items";
import InventoryCategories from "@/pages/inventory/inventory-categories";
import Departments from "@/pages/inventory/departments";
import SpecialRequests from "@/pages/reservation/special-requests";
import UserAccountPage from "@/pages/authentication/user-account";
import HotelFeatures from "@/pages/hotel/hotel-features";
import HotelCustomizationPage from "@/pages/hotel/customize-hotel/HotelCustomizationPage";
import MakeBooking from "@/pages/bookings/make-booking";
import SafariproBookings from "@/pages/bookings/safaripro-bookings";
import BookingDetailsPage from "@/pages/bookings/booking-details";
import NewRoomPage from "@/pages/rooms/new-room";
import RoomTypesTabController from "@/pages/rooms/room-types/RoomTypesTabController";
import AvailableRoomsByDate from "@/pages/rooms/available-rooms-date";
import RoomDetailsPage from "@/pages/rooms/rooms-details";
import AllocateRooms from "@/pages/rooms/allocations/allocate-rooms";
import CheckedInGuests from "@/pages/reservation/checked-in";
import CheckedOutGuests from "@/pages/reservation/checked-out";
import HotelDepartments from "@/pages/inventory/departments";
import EventSpaceTypes from "@/pages/inventory/event-space-types";
import EventSpaces from "@/pages/inventory/events-spaces";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoutes />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HotelDetails />,
      },
      // - - - Booking routes
      { path: "bookings/new-booking", element: <MakeBooking /> },
      { path: "bookings/all-bookings", element: <AllBookings /> },
      {
        path: "bookings/safaripro-bookings",
        element: <SafariproBookings />,
      },
      { path: "bookings/:booking_id", element: <BookingDetailsPage /> },

      // - - - Rooms Section
      { path: "rooms/new-room", element: <NewRoomPage /> },
      { path: "rooms/available-rooms", element: <AvailableRooms /> },
      { path: "rooms/booked-rooms", element: <BookedRooms /> },
      {
        path: "rooms/maintenance-rooms",
        element: <MaintenanceRooms />,
      },
      { path: "rooms/room-types", element: <RoomTypesTabController /> },
      {
        path: "rooms/available-rooms-dates",
        element: <AvailableRoomsByDate />,
      },
      { path: "rooms/:room_id", element: <RoomDetailsPage /> },
      { path: "rooms/allocate-rooms", element: <AllocateRooms /> },
      { path: "rooms/allocations", element: <Allocations /> },

      // - - - Hotel Routes
      {
        path: "hotel/hotel-details",
        element: <HotelDetails />,
      },
      { path: "hotel/hotel-features", element: <HotelFeatures /> },
      {
        path: "hotel/customize-hotel",
        element: <HotelCustomizationPage />,
      },
      // - - - Billings Section
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
      // - - - Inventory Section
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
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/onboarding",
    element: <OnboardingWizard />,
  },
  {
    path: "/user-account",
    element: <UserAccountPage />,
  },
]);
