import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/hooks/auth";
import Loading from "@/components/Loading";

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return <Loading />;
  }

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export const GuestRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
