import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import AdminSidebar from "../Components/Menu/AdminSidebar";
import AdminNavbar from "../Components/Menu/AdminNavbar";



export default function AdminLayout() {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");

    toast.success("Déconnexion réussie");

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        handleLogout={handleLogout}
      />

      <div className="min-h-screen bg-gray-100">

  {sidebarOpen && (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
      onClick={() => setSidebarOpen(false)}
    />
  )}

  <AdminSidebar
    sidebarOpen={sidebarOpen}
    setSidebarOpen={setSidebarOpen}
    handleLogout={handleLogout}
  />

  <div
    className={`lg:ml-60 transition-all duration-300 ${
      sidebarOpen ? "blur-sm pointer-events-none select-none" : ""
    }`}
  >

    <AdminNavbar setSidebarOpen={setSidebarOpen} />

    <main>
      <Outlet />
    </main>

  </div>
</div>
    </div>
  );
}