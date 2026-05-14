// Components/pages/TripHubDz/Admin/Navbar.jsx
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Download, CheckCircle, AlertCircle, Info } from 'lucide-react';

const menuItems = [
  { id: 'dashboard', label: 'Tableau de bord', path: '/TripHubDz/admin/dashboard' },
  { id: 'agencies', label: 'Agences', path: '/TripHubDz/admin/agencies' },
  { id: 'payments', label: 'Paiements', path: '/TripHubDz/admin/payments' },
  { id: 'analytics', label: 'Analyses', path: '/TripHubDz/admin/analytics' },
  { id: 'users', label: 'Utilisateurs', path: '/TripHubDz/admin/users' },
  { id: 'settings', label: 'Paramètres', path: '/TripHubDz/admin/settings' }
];

export default function Navbar() {
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Nouvelle agence inscrite", message: "Aventure Monde a rejoint la plateforme", time: "Il y a 5 min", read: false, type: "success" },
    { id: 2, title: "Paiement reçu", message: "Global Voyages - 29,900 DA", time: "Il y a 2 heures", read: false, type: "info" },
    { id: 3, title: "Maintenance planifiée", message: "Maintenance prévue le 25 mars", time: "Il y a 1 jour", read: true, type: "warning" }
  ]);

  const currentPage = menuItems.find(item => item.path === location.pathname)?.label || 'Tableau de bord';
  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default: return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const exportData = () => {
    // Export logic based on current page
    console.log('Exporting data...');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{currentPage}</h1>
          <p className="text-sm text-gray-500 mt-0.5">Bienvenue sur votre espace d'administration</p>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={exportData} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <Download className="h-5 w-5 text-gray-600" />
          </button>
          
          <div className="relative">
            <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 hover:bg-gray-100 rounded-lg transition">
              <Bell className="h-5 w-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </button>
            
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border overflow-hidden z-50"
                >
                  <div className="p-3 border-b bg-gray-50 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800">Notifications</h3>
                    {unreadCount > 0 && (
                      <button onClick={markAllAsRead} className="text-xs text-[#00c0e8] hover:underline">
                        Tout marquer comme lu
                      </button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 text-sm">
                        Aucune notification
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => markAsRead(notif.id)}
                          className={`p-3 border-b hover:bg-gray-50 cursor-pointer transition ${!notif.read ? 'bg-[#00c0e8]/5' : ''}`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5">{getNotificationIcon(notif.type)}</div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800">{notif.title}</p>
                              <p className="text-xs text-gray-500 mt-1">{notif.message}</p>
                              <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                            </div>
                            {!notif.read && <div className="w-2 h-2 bg-[#00c0e8] rounded-full mt-2"></div>}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="w-9 h-9 bg-[#00c0e8] rounded-xl flex items-center justify-center text-white font-semibold shadow-md">
            SA
          </div>
        </div>
      </div>
    </header>
  );
}