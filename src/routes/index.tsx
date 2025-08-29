// // src/routes/index.tsx
// import { createBrowserRouter, Outlet } from "react-router-dom";
// import { Toaster } from "@/components/ui/sonner";
// import { ThemeProvider } from "@/providers/theme-provider";
// import { HotelProvider } from "@/providers/hotel-provider";
// import QueryProvider from "@/providers/query-provider";
// import DashboardLayout from "@/components/layout/dashboard-layout";
// import HotelFeatures from "@/pages/hotel/hotel-features";
// import AllBookings from "@/pages/bookings/all-bookings";
// import SafariproBookings from "@/pages/bookings/safaripro-bookings";
// import BookingDetailsPage from "@/pages/bookings/booking-details";
// import NewRoom from "@/pages/rooms/new-room";
// import AvailableRooms from "@/pages/rooms/available-rooms";
// import BookedRooms from "@/pages/rooms/booked-rooms";
// import MaintenanceRooms from "@/pages/rooms/maintenance-rooms";
// import AvailableRoomsByDate from "@/pages/rooms/available-rooms-date";
// import RoomDetailsPage from "@/pages/rooms/rooms-details";
// import CheckedInGuests from "@/pages/reservation/checked-in";
// import CheckedOutGuests from "@/pages/reservation/checked-out";
// import SpecialRequests from "@/pages/reservation/special-requests";
// import NotFoundPage from "@/pages/error/not-found-page";
// import LoginPage from "@/pages/authentication/login";
// import { ProtectedRoute } from "./protected-routes";
// import MakeBooking from "@/pages/bookings/make-booking";
// import HotelCustomizationPage from "@/pages/hotel/customize-hotel/HotelCustomizationPage";
// import InventoryCategories from "@/pages/inventory/inventory-categories";
// import InventoryItems from "@/pages/inventory/inventory-items";
// import HotelDepartments from "@/pages/inventory/departments";
// import EventSpaces from "@/pages/inventory/events-spaces";
// import EventSpaceTypes from "@/pages/inventory/event-space-types";
// import RoomTypesTabController from "@/pages/rooms/room-types/RoomTypesTabController";
// import HotelDetails from "@/pages/hotel/hotel-details";
// import Payouts from "@/pages/billings/payouts";
// import Charges from "@/pages/billings/charges";
// import SafariProInvoices from "@/pages/billings/safaripro-invoices";
// import WelcomeWalkthroughs from "@/pages/miscellaneous/welcome-walkthroughs";
// import AllocateRooms from "@/pages/rooms/allocations/allocate-rooms";
// import Allocations from "@/pages/rooms/allocations/allocations";

// const RootLayout = () => {
//   return (
//     <ThemeProvider defaultTheme="system" storageKey="hotel-management-theme">
//       <QueryProvider>
//         <HotelProvider>
//           <Outlet />
//           <Toaster richColors position="top-right" />
//         </HotelProvider>
//       </QueryProvider>
//     </ThemeProvider>
//   );
// };

// export const router = createBrowserRouter([
//   {
//     element: <RootLayout />,
//     errorElement: <NotFoundPage />,
//     children: [
//       // --- Public Route ---
//       {
//         path: "/login",
//         element: <LoginPage />,
//       },

//       // --- Protected Routes ---
//       {
//         element: <ProtectedRoute />,
//         children: [
//           {
//             // The Welcome Walkthrough is now protected
//             path: "/welcome",
//             element: <WelcomeWalkthroughs />,
//           },
//           {
//             path: "/",
//             element: <DashboardLayout />,
//             children: [
//               { index: true, element: <HotelDetails /> },
//               // - - - Hotel routes
//               { path: "hotel/hotel-details", element: <HotelDetails /> },
//               { path: "hotel/hotel-features", element: <HotelFeatures /> },
//               {
//                 path: "hotel/customize-hotel",
//                 element: <HotelCustomizationPage />,
//               },
//               // - - - Booking routes
//               { path: "bookings/new-booking", element: <MakeBooking /> },
//               { path: "bookings/all-bookings", element: <AllBookings /> },
//               {
//                 path: "bookings/safaripro-bookings",
//                 element: <SafariproBookings />,
//               },
//               { path: "bookings/:booking_id", element: <BookingDetailsPage /> },
//               // - - - Room routes
//               { path: "rooms/new-room", element: <NewRoom /> },
//               { path: "rooms/available-rooms", element: <AvailableRooms /> },
//               { path: "rooms/booked-rooms", element: <BookedRooms /> },
//               {
//                 path: "rooms/maintenance-rooms",
//                 element: <MaintenanceRooms />,
//               },
//               { path: "rooms/room-types", element: <RoomTypesTabController /> },
//               {
//                 path: "rooms/available-rooms-dates",
//                 element: <AvailableRoomsByDate />,
//               },
//               { path: "rooms/:room_id", element: <RoomDetailsPage /> },
//               { path: "rooms/allocate-rooms", element: <AllocateRooms /> },
//               { path: "rooms/allocations", element: <Allocations /> },
//               // - - - Reservations routes
//               { path: "reservations/checkin", element: <CheckedInGuests /> },
//               { path: "reservations/checkout", element: <CheckedOutGuests /> },
//               {
//                 path: "reservations/special-requests",
//                 element: <SpecialRequests />,
//               },
//               // - - - Housekeeping routes
//               {
//                 path: "house-keeping/inventory-categories",
//                 element: <InventoryCategories />,
//               },
//               {
//                 path: "house-keeping/inventory-items",
//                 element: <InventoryItems />,
//               },
//               {
//                 path: "house-keeping/departments",
//                 element: <HotelDepartments />,
//               },
//               {
//                 path: "house-keeping/event-space-types",
//                 element: <EventSpaceTypes />,
//               },
//               {
//                 path: "house-keeping/event-spaces",
//                 element: <EventSpaces />,
//               },
//               {
//                 path: "billings/payouts",
//                 element: <Payouts />,
//               },
//               {
//                 path: "billings/charges",
//                 element: <Charges />,
//               },
//               {
//                 path: "billings/invoices",
//                 element: <SafariProInvoices />,
//               },
//             ],
//           },
//         ],
//       },
//     ],
//   },
// ]);

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
      // Bookings Section
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
  // The Onboarding route, handled by the wizard component
  {
    path: "/onboarding",
    element: <OnboardingWizard />,
  },
]);
