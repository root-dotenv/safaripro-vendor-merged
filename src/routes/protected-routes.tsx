// // - - - src/routes/protected-routes.tsx
// import { Navigate } from "react-router-dom";
// import { useAuthStore } from "@/store/auth.store";
// import DashboardLayout from "@/components/layout/dashboard-layout";
// import { HotelProvider } from "@/providers/hotel-provider";

// export default function ProtectedRoutes() {
//   const { isAuthenticated, onboardingCompleted } = useAuthStore();

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   if (!onboardingCompleted) {
//     return <Navigate to="/onboarding" replace />;
//   }

//   // --- 2. WRAP THE LAYOUT WITH THE PROVIDER ---
//   return (
//     <HotelProvider>
//       <DashboardLayout />
//     </HotelProvider>
//   );
// }

// - - - src/routes/protected-routes.tsx
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { HotelProvider } from "@/providers/hotel-provider";

export default function ProtectedRoutes() {
  const { isAuthenticated, onboardingCompleted } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <HotelProvider>
      <DashboardLayout />
    </HotelProvider>
  );
}
