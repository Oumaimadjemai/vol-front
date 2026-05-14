// Components/pages/TripHubDz/Admin/Sidebar.jsx
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, X, LogOut, Shield, PieChart, Building2, 
  CreditCard, TrendingUp, Users, Settings 
} from 'lucide-react';
import tripLogo from '../../../../assets/images/triplogo.png';


const menuItems = [
  { id: 'dashboard', icon: PieChart, label: 'Tableau de bord', path: '/TripHubDz/admin/dashboard' },
  { id: 'agencies', icon: Building2, label: 'Agences', path: '/TripHubDz/admin/agencies' },
  { id: 'payments', icon: CreditCard, label: 'Paiements', path: '/TripHubDz/admin/payments' },
  { id: 'analytics', icon: TrendingUp, label: 'Analyses', path: '/TripHubDz/admin/analytics' },
  { id: 'users', icon: Users, label: 'Utilisateurs', path: '/TripHubDz/admin/users' },
  { id: 'settings', icon: Settings, label: 'Paramètres', path: '/TripHubDz/admin/settings' }
];

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('super_admin_token');
    localStorage.removeItem('super_admin_email');
    navigate('/TripHubDz/admin/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`fixed left-0 top-0 h-full bg-gray-50 text-gray-800 transition-all duration-300 z-50 shadow-xl ${sidebarOpen ? 'w-64' : 'w-20'}`}>
      <div className="p-5">
        <div className="flex items-center justify-between mb-8">
          <div className={`top-0 flex items-center ${!sidebarOpen ? 'hidden' : ''}`}>
            <img src={tripLogo} alt="TripHubDz" className={`transition-all duration-300 ${sidebarOpen ? 'h-16 w-auto ml-16' : 'h-10 w-auto'}`} />
          </div>
          {/* Hamburger menu button - always visible */}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="text-white/70 hover:text-white transition p-1 rounded-lg hover:bg-white/10"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5 ml-2" />}
          </button>
        </div>
        
        <div className="bg-white/10 rounded-xl p-3 mb-6">
          {sidebarOpen ? (
            <>
              <div className="text-xs text-[#00c0e8] mb-1">Super Admin</div>
              <div className="font-semibold text-sm text-white">Administrateur</div>
              <div className="text-xs text-white/50 mt-1">admin@triphubdz.com</div>
            </>
          ) : (
            <div className="flex justify-center">
              <Shield className="h-6 w-6 text-[#00c0e8]" />
            </div>
          )}
        </div>
      </div>
      
      <nav className="mt-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center px-5 py-3 transition-all duration-300 ${
              isActive(item.path)
                ? 'bg-[#00c0e8]/20 border-l-4 border-[#00c0e8] text-black'
                : 'text-black/70 hover:bg-white/10 hover:text-white'
            } ${!sidebarOpen && 'justify-center'}`}
          >
            <item.icon className="h-5 w-5" />
            {sidebarOpen && <span className="ml-3 text-sm">{item.label}</span>}
          </button>
        ))}
      </nav>
      
      <button
        onClick={handleLogout}
        className={`absolute bottom-6 left-0 right-0 mx-auto px-5 py-3 bg-red-600/20 text-red-400 hover:bg-red-600/30 transition flex items-center ${!sidebarOpen ? 'justify-center' : 'mx-5 rounded-lg'}`}
      >
        <LogOut className="h-5 w-5" />
        {sidebarOpen && <span className="ml-3 text-sm">Déconnexion</span>}
      </button>
    </div>
  );
}