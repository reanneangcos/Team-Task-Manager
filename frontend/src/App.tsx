import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import ProfilePage from "./pages/profile/ProfilePage";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";
import { getStoredUser } from "./utils/auth";
import type { User } from "./types";

export default function App() {
  const [user, setUser] = useState<User | null>(() => getStoredUser());

  const homePath = user?.role === "admin" ? "/admin" : "/employee";

  return (
    <>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Navigate to={user ? homePath : "/login"} replace />} />
        <Route path="/login" element={<Login user={user} setUser={setUser} />} />
        <Route path="/register" element={<Register user={user} setUser={setUser} />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute user={user} allowedRoles={["admin"]}>
              <AppLayout user={user} setUser={setUser}>
                <AdminDashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee"
          element={
            <ProtectedRoute user={user} allowedRoles={["employee", "admin"]}>
              <AppLayout user={user} setUser={setUser}>
                <EmployeeDashboard user={user} />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute user={user}>
              <AppLayout user={user} setUser={setUser}>
                <ProfilePage user={user} setUser={setUser} />
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
