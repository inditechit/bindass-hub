// Location: src/hooks/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
  // Check if token exists in localStorage
  const isAuthenticated = !!localStorage.getItem("astro_admin_token");

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // additional role-based checks
  try {
    const stored = localStorage.getItem("astro_user");
    if (stored) {
      const parsed = JSON.parse(stored);
      const userType = parsed?.type;
      if (userType === "agent") {
        // agents are not allowed to access certain admin pages
        const pathname = window.location.pathname;
        if (pathname === "/coins" || pathname === "/leaderboard") {
          return <Navigate to="/" replace />;
        }
      }
    }
  } catch (e) {
    // ignore parse errors
  }

  // If authenticated, render the child routes via Outlet
  return <Outlet />;
};