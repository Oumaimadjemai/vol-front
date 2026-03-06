import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  MapPin,
  Users,
  Mail,
  MessageSquare,
  BarChart3,
  Settings,
  X,
  LogOut,
} from "lucide-react";
import { Button } from "@mui/material";

const navItems = [
  { path: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { path: "/admin/bookings", label: "Réservations", icon: Calendar },
  { path: "/admin/destinations", label: "Destinations", icon: MapPin },
  { path: "/users", label: "Utilisateurs", icon: Users },
  { path: "/admin/newsletter", label: "Newsletter", icon: Mail },
  { path: "/admin/messages", label: "Messages", icon: MessageSquare },
  { path: "/admin/analytics", label: "Analytiques", icon: BarChart3 },
  { path: "/admin/settings", label: "Paramètres", icon: Settings },
];

export default function AdminSidebar({ sidebarOpen, setSidebarOpen, handleLogout }) {
  const location = useLocation();

  return (
    <>
      <aside
        className={`fixed top-0 left-0 h-full w-60 bg-gray-900 text-white z-50 transform transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">

<div
  className="p-4 border-b border-gray-700 flex justify-between items-center
    
    hover:brightness-110 transition-all duration-200 cursor-pointer"
  onClick={() => setSidebarOpen(false)}
>
  <div className="flex items-center gap-3">
    <div
      className="w-10 h-10 rounded-lg bg-white flex items-center justify-center font-bold text-gray-900
        bg-gradient-to-r from-[#00C0E8] to-[#0093e8]
        hover:brightness-110 transition-all duration-200"
    >
      T
    </div>
    <h1 className="font-bold text-lg text-[#00c0e8]">Traveling</h1>
  </div>

  <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
    <X />
  </button>
</div>

          {/* NAVIGATION */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;

              const isActive =
                location.pathname === item.path ||
                (item.path !== "/admin" &&
                  location.pathname.startsWith(item.path));

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold
  transition-all duration-200
  ${
    isActive
      ? "text-white bg-gradient-to-r from-[#00C0E8] to-[#0093e8]"
      : "text-gray-400 hover:text-white hover:bg-white/5"
  }`}
                >
                  <Icon size={20} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* LOGOUT */}
          <div className="p-4 border-t border-gray-700">
            <Button
              onClick={handleLogout}
              variant="contained"
              color="error"
              fullWidth
              startIcon={<LogOut size={18} />}
            >
              Déconnexion
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}