import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import type { User, UserRole } from "../../types";

interface ProtectedRouteProps {
  user: User | null;
  allowedRoles?: UserRole[];
  children: ReactNode;
}

export default function ProtectedRoute({
  user,
  allowedRoles,
  children,
}: ProtectedRouteProps) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/employee/tasks"} replace />;
  }

  return <>{children}</>;
}
