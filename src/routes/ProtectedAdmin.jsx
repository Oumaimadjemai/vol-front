import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedAdmin() {
  const accessToken = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");
  
  console.log("ProtectedAdmin check:", { 
    hasToken: !!accessToken, 
    role: role,
    isValid: !!(accessToken && (role === "admin" || role === "agent"))
  });
  
  if (!accessToken) {
    return <Navigate to="/admin/login" replace />;
  }
  
  if (role !== "admin" && role !== "agent") {
    // Clear invalid tokens
    localStorage.clear();
    return <Navigate to="/admin/login" replace />;
  }
  
  return <Outlet />;
}