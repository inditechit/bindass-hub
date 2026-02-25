// Location: src/hooks/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
  // Check if token exists in localStorage
  const isAuthenticated = !!localStorage.getItem("astro_admin_token");

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the child routes via Outlet
  return <Outlet />;
};