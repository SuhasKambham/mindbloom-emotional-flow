
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/layouts/AppLayout";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-mindbloom-primary text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
};

export default ProtectedRoute;
