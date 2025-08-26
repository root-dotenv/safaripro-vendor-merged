// src/routes/protected-route.tsx
import { useAuth } from "@/context/auth-context";
import { Navigate, Outlet } from "react-router-dom";

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  return !isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
