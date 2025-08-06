// src/routes/protected-route.tsx
import { useAuth } from "@/context/auth-context";
import { Navigate, Outlet } from "react-router-dom";

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  // You might want a loading state from your context as well
  // For now, we'll just check the boolean

  return !isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
// TODO: uncomment the line above to make sure authentication works again like it used to
