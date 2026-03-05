import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedAdmin() {

  const admin = localStorage.getItem("adminToken");

  return admin ? <Outlet /> : <Navigate to="/admin/login" />;
}