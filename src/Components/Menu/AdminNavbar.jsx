import { useState } from "react";
import {
  Bell,
  Menu,
  Search,
  Calendar,
  DollarSign,
  UserPlus,
  MessageSquare,
  AlertCircle,
  Info,
} from "lucide-react";
import {
  Badge,
  TextField,
  Avatar,
  Menu as MuiMenu,
  MenuItem,
  Divider,
} from "@mui/material";
import { Link } from "react-router-dom";

const notifications = [
  {
    id: 1,
    type: "booking",
    title: "Nouvelle réservation",
    message: "Marie Dubois a réservé un voyage à Bali",
    time: "Il y a 5 min",
    icon: Calendar,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    unread: true,
  },
  {
    id: 2,
    type: "payment",
    title: "Paiement reçu",
    message: "Paiement de €2,850 confirmé pour la réservation BK-045",
    time: "Il y a 15 min",
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-50",
    unread: true,
  },
  {
    id: 3,
    type: "user",
    title: "Nouvel utilisateur",
    message: "Jean Martin s'est inscrit sur la plateforme",
    time: "Il y a 1 heure",
    icon: UserPlus,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    unread: true,
  },
  {
    id: 4,
    type: "message",
    title: "Nouveau message",
    message: "Sophie Laurent a envoyé un message de contact",
    time: "Il y a 2 heures",
    icon: MessageSquare,
    color: "text-[#00C0E8]",
    bgColor: "bg-cyan-50",
    unread: false,
  },
  {
    id: 5,
    type: "alert",
    title: "Destination populaire",
    message: "Paris a atteint 90% de réservations ce mois",
    time: "Il y a 3 heures",
    icon: AlertCircle,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    unread: false,
  },
  {
    id: 6,
    type: "info",
    title: "Mise à jour système",
    message: "Nouvelle fonctionnalité d'analyse disponible",
    time: "Il y a 5 heures",
    icon: Info,
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    unread: false,
  },
];

export default function AdminNavbar({ setSidebarOpen }) {
  const [anchorEl, setAnchorEl] = useState(null);
const isOpen = Boolean(anchorEl);
  const unreadCount = notifications.filter((n) => n.unread).length;

  const openNotifications = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeNotifications = () => {
    setAnchorEl(null);
  };

  return (
    <header className="bg-white border-b sticky top-0 z-30">
      <div className="flex items-center justify-between px-6 py-4">
        {/* LEFT */}
        <div className="flex items-center gap-4">
          <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu />
          </button>

          <div className="hidden md:flex items-center">
  <div className="relative">
    <Search
      size={18}
      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
    />

    <TextField
      size="small"
      placeholder="Rechercher..."
      variant="outlined"
      sx={{
        width: 260,
        "& .MuiOutlinedInput-root": {
          borderRadius: "12px",
          backgroundColor: "#f9fafb",
          paddingLeft: "32px",
          transition: "all .2s",
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "#e5e7eb",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "#00C0E8",
        },
        "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "#00C0E8",
          borderWidth: "2px",
        },
      }}
    />
  </div>
</div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
         <Badge badgeContent={unreadCount} color="error">
  <button
    onClick={openNotifications}
    className={`p-2 rounded-lg transition-all duration-300 ${
      isOpen ? "bg-cyan-50" : "hover:bg-gray-100"
    }`}
  >
    <Bell
      size={20}
      className={`transition-all duration-300 ${
        isOpen
          ? "text-[#00C0E8] scale-110 rotate-12"
          : "text-gray-700"
      }`}
    />
  </button>
</Badge>

         <MuiMenu
  anchorEl={anchorEl}
  open={Boolean(anchorEl)}
  onClose={closeNotifications}
  
  anchorOrigin={{
    vertical: "bottom",
    horizontal: "center",
  }}

  transformOrigin={{
    vertical: "top",
    horizontal: "center",
  }}

  TransitionProps={{
    timeout: 250,
  }}

  PaperProps={{
    elevation: 4,
    sx: {
      width: 380,
      mt: 1.5,
      borderRadius: "14px",
      overflow: "hidden",
      boxShadow: "0 10px 35px rgba(0,0,0,0.15)",
    },
  }}
>
            {/* HEADER */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div>
                <p className="font-semibold text-sm">Notifications</p>
                <p className="text-xs text-gray-500">
                  Vous avez {unreadCount} notification
                  {unreadCount > 1 ? "s" : ""} non lue
                  {unreadCount > 1 ? "s" : ""}
                </p>
              </div>

              {unreadCount > 0 && (
                <button className="text-xs text-[#00C0E8] font-medium hover:underline">
                  Tout marquer comme lu
                </button>
              )}
            </div>

            {/* LIST */}
            {notifications.map((n) => {
              const Icon = n.icon;

              return (
                <MenuItem
                  key={n.id}
                  className={`!flex !items-start !gap-3 !py-3 ${
                    n.unread ? "!bg-blue-50/30" : ""
                  }`}
                >
                  {/* ICON */}
                  <div className={`p-2 rounded-lg ${n.bgColor}`}>
                    <Icon size={16} className={n.color} />
                  </div>

                  {/* TEXT */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <p className="font-medium text-sm">{n.title}</p>

                      {n.unread && (
                        <span className="w-2 h-2 bg-[#00C0E8] rounded-full mt-2"></span>
                      )}
                    </div>

                    <p className="text-xs text-gray-500">{n.message}</p>
                    <p className="text-xs text-gray-400">{n.time}</p>
                  </div>
                </MenuItem>
              );
            })}

            <Divider />

            {/* FOOTER */}
            <MenuItem
              component={Link}
              to="/admin/settings"
              className="!text-[#00C0E8] !text-sm !justify-center "
            >
              Voir tous les paramètres de notification
            </MenuItem>
          </MuiMenu>

          {/* PROFILE */}
          <div className="flex items-center gap-3">
            <Avatar sx={{ bgcolor: "#00C0E8" }}>AD</Avatar>

            <div className="hidden sm:block text-sm">
              <p className="font-semibold">Admin</p>
              <p className="text-gray-500 text-xs">admin@traveling.com</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
