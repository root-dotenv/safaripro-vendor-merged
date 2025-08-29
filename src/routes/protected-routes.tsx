// - - - src/routes/protected-routes.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import DashboardLayout from "@/components/layout/dashboard-layout";

export default function ProtectedRoutes() {
  const { isAuthenticated, onboardingCompleted } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
