import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { useEffect } from "react";

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/login");
      return;
    }

    if (user?.role !== "admin") {
      setLocation("/dashboard");
      return;
    }
  }, [isAuthenticated, user, setLocation]);

  // Only render children if user is authenticated and is admin
  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  return <>{children}</>;
};

export default AdminRoute;