// Components/pages/TravelHub/SuperAdminDashboard.jsx (Complete Version)
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Building2, TrendingUp, DollarSign, CheckCircle, XCircle,
  Eye, MoreVertical, Search, Filter, Calendar, Download, Plus,
  Edit, Trash2, Ban, RefreshCw, Mail, Phone, MapPin, Globe,
  Star, Award, Shield, Zap, Crown, Plane, Cloud, Sun, Moon,
  Activity, PieChart, BarChart3, LineChart, Target, AlertCircle,
  Settings, UserPlus, LogOut, Menu, X, ChevronDown,
  Info, Bell, CreditCard, Receipt, FileText, Clock,
  Layers, Smartphone, Database, Cloud as CloudIcon, Lock,
  Palette, BellRing, Mail as MailIcon, Key, Globe as GlobeIcon,
  BarChart, TrendingUp as TrendingUpIcon, Users as UsersIcon
} from 'lucide-react';

// Mock data
const initialAgencies = [
  {
    id: 1,
    name: "Global Voyages",
    subdomain: "global-voyages",
    domain: "global-voyages.travelhub.com",
    plan: "Professional",
    status: "active",
    registered: "2024-01-15",
    revenue: 299,
    agents: 12,
    voyageurs: 456,
    email: "contact@global-voyages.com",
    phone: "+33 1 23 45 67 89",
    address: "15 Avenue des Champs-Élysées, Paris",
    logo: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=80&h=80&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=400&h=200&fit=crop",
    rating: 4.8,
    description: "Expert en voyages internationaux depuis 2010",
    owner: "Jean Dupont",
    ownerEmail: "jean@global-voyages.com",
    paymentMethod: "Stripe",
    paymentStatus: "active",
    nextBilling: "2024-04-15"
  },
  {
    id: 2,
    name: "SkyHigh Travel",
    subdomain: "skyhigh",
    domain: "skyhigh.travelhub.com",
    plan: "Enterprise",
    status: "active",
    registered: "2024-02-20",
    revenue: 299,
    agents: 8,
    voyageurs: 234,
    email: "contact@skyhigh.com",
    phone: "+33 1 98 76 54 32",
    address: "23 Rue de la Paix, Paris",
    logo: "https://images.unsplash.com/photo-1542296332-2e4473faf563?w=80&h=80&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=400&h=200&fit=crop",
    rating: 4.9,
    description: "Voyages de luxe et expériences uniques",
    owner: "Marie Laurent",
    ownerEmail: "marie@skyhigh.com",
    paymentMethod: "PayPal",
    paymentStatus: "active",
    nextBilling: "2024-04-20"
  },
  {
    id: 3,
    name: "Aventure Monde",
    subdomain: "aventure-monde",
    domain: "aventure-monde.travelhub.com",
    plan: "Basic",
    status: "pending",
    registered: "2024-03-10",
    revenue: 49,
    agents: 3,
    voyageurs: 89,
    email: "contact@aventure-monde.com",
    phone: "+33 1 45 67 89 01",
    address: "8 Rue de Rivoli, Paris",
    logo: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=80&h=80&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=200&fit=crop",
    rating: 4.7,
    description: "Spécialiste des voyages d'aventure",
    owner: "Thomas Martin",
    ownerEmail: "thomas@aventure-monde.com",
    paymentMethod: "Stripe",
    paymentStatus: "pending",
    nextBilling: "2024-04-10"
  }
];

const recentPayments = [
  { id: 1, agency: "Global Voyages", amount: 299, date: "2024-03-15", status: "completed", method: "Stripe" },
  { id: 2, agency: "SkyHigh Travel", amount: 299, date: "2024-03-20", status: "completed", method: "PayPal" },
  { id: 3, agency: "Aventure Monde", amount: 49, date: "2024-03-10", status: "pending", method: "Stripe" },
  { id: 4, agency: "Global Voyages", amount: 299, date: "2024-02-15", status: "completed", method: "Stripe" },
  { id: 5, agency: "SkyHigh Travel", amount: 299, date: "2024-02-20", status: "completed", method: "PayPal" }
];

const monthlyRevenue = [
  { month: "Jan", revenue: 12450 },
  { month: "Fév", revenue: 15680 },
  { month: "Mar", revenue: 18920 },
  { month: "Avr", revenue: 21450 },
  { month: "Mai", revenue: 23560 },
  { month: "Jun", revenue: 26780 }
];

const recentActivities = [
  { id: 1, action: "Nouvelle agence inscrite", agency: "Global Voyages", user: "Jean Dupont", date: "2024-01-15 10:30", type: "success" },
  { id: 2, action: "Paiement reçu", agency: "SkyHigh Travel", amount: 299, date: "2024-02-20 14:15", type: "success" },
  { id: 3, action: "Agence suspendue", agency: "Aventure Monde", date: "2024-03-10 09:00", type: "warning" },
  { id: 4, action: "Nouvel agent ajouté", agency: "Global Voyages", user: "Pierre Martin", date: "2024-03-12 11:20", type: "info" },
  { id: 5, action: "Plan mis à jour", agency: "SkyHigh Travel", plan: "Enterprise", date: "2024-03-15 16:45", type: "success" }
];

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [agencies, setAgencies] = useState(initialAgencies);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dateRange, setDateRange] = useState('month');
  const [formData, setFormData] = useState({
    name: '', subdomain: '', plan: 'Basic', email: '', phone: '', address: '', owner: '', ownerEmail: ''
  });
  const [showUserModal, setShowUserModal] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    siteName: 'TravelHub',
    siteEmail: 'contact@travelhub.com',
    sitePhone: '+33 1 23 45 67 89',
    siteAddress: 'Paris, France',
    currency: 'EUR',
    timezone: 'Europe/Paris',
    emailNotifications: true,
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUser: 'noreply@travelhub.com',
    theme: 'light',
    primaryColor: '#0EA5E9',
    maintenanceMode: false
  });
  const [users, setUsers] = useState([
    { id: 1, name: "Admin User", email: "admin@travelhub.com", role: "Super Admin", status: "active", lastLogin: "2024-03-20 09:30" },
    { id: 2, name: "Support Team", email: "support@travelhub.com", role: "Support", status: "active", lastLogin: "2024-03-19 14:20" },
    { id: 3, name: "Billing Manager", email: "billing@travelhub.com", role: "Billing", status: "inactive", lastLogin: "2024-03-15 11:00" }
  ]);

  useEffect(() => {
    const token = localStorage.getItem('super_admin_token');
    if (!token) {
      navigate('/travelhub/admin/login');
    }
  }, [navigate]);

  const filteredAgencies = agencies.filter(agency => {
    const matchesSearch = agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          agency.subdomain.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          agency.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || agency.status === statusFilter;
    const matchesPlan = planFilter === 'all' || agency.plan === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const stats = {
    total: agencies.length,
    active: agencies.filter(a => a.status === 'active').length,
    pending: agencies.filter(a => a.status === 'pending').length,
    suspended: agencies.filter(a => a.status === 'suspended').length,
    totalRevenue: agencies.reduce((sum, a) => sum + a.revenue, 0),
    totalAgents: agencies.reduce((sum, a) => sum + a.agents, 0),
    totalVoyageurs: agencies.reduce((sum, a) => sum + a.voyageurs, 0),
    averageRating: (agencies.reduce((sum, a) => sum + a.rating, 0) / agencies.length).toFixed(1)
  };

  const paymentStats = {
    totalRevenue: recentPayments.reduce((sum, p) => p.status === 'completed' ? sum + p.amount : sum, 0),
    pendingRevenue: recentPayments.reduce((sum, p) => p.status === 'pending' ? sum + p.amount : sum, 0),
    totalTransactions: recentPayments.length,
    successRate: ((recentPayments.filter(p => p.status === 'completed').length / recentPayments.length) * 100).toFixed(1)
  };

  const handleAddAgency = () => {
    const newAgency = {
      id: agencies.length + 1,
      ...formData,
      status: 'pending',
      registered: new Date().toISOString().split('T')[0],
      revenue: formData.plan === 'Enterprise' ? 299 : formData.plan === 'Professional' ? 99 : 49,
      agents: 0,
      voyageurs: 0,
      rating: 0,
      logo: `https://ui-avatars.com/api/?name=${formData.name.replace(/ /g, '+')}&background=0D8ABC&color=fff&size=80`,
      coverImage: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=400&h=200&fit=crop',
      description: `Nouvelle agence ${formData.name}`,
      paymentMethod: 'Stripe',
      paymentStatus: 'pending',
      nextBilling: new Date().toISOString().split('T')[0]
    };
    setAgencies([...agencies, newAgency]);
    setShowModal(false);
    setFormData({ name: '', subdomain: '', plan: 'Basic', email: '', phone: '', address: '', owner: '', ownerEmail: '' });
  };

  const handleUpdateAgency = () => {
    setAgencies(agencies.map(a => 
      a.id === selectedAgency.id ? { ...a, ...formData } : a
    ));
    setShowModal(false);
    setSelectedAgency(null);
  };

  const handleDeleteAgency = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette agence ?')) {
      setAgencies(agencies.filter(a => a.id !== id));
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setAgencies(agencies.map(a =>
      a.id === id ? { ...a, status: newStatus } : a
    ));
  };

  const handlePaymentStatusChange = (id, newStatus) => {
    // Update payment status logic
    console.log(`Update payment status for ${id} to ${newStatus}`);
  };

  const handleAddUser = () => {
    const newUser = {
      id: users.length + 1,
      name: formData.name,
      email: formData.email,
      role: formData.role || 'Support',
      status: 'active',
      lastLogin: new Date().toLocaleString()
    };
    setUsers([...users, newUser]);
    setShowUserModal(false);
    setFormData({ name: '', email: '', role: 'Support' });
  };

  const handleLogout = () => {
    localStorage.removeItem('super_admin_token');
    localStorage.removeItem('super_admin_email');
    navigate('/travelhub/admin/login');
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-red-100 text-red-800',
      completed: 'bg-green-100 text-green-800'
    };
    const labels = {
      active: 'Actif',
      pending: 'En attente',
      suspended: 'Suspendu',
      completed: 'Complété'
    };
    return (
      <span className={`px-2 py-1 rounded text-xs ${badges[status] || 'bg-gray-100 text-gray-800'}`}>
        {labels[status] || status}
      </span>
    );
  };

  const getPlanBadge = (plan) => {
    const badges = {
      Basic: 'bg-blue-100 text-blue-800',
      Professional: 'bg-purple-100 text-purple-800',
      Enterprise: 'bg-yellow-100 text-yellow-800'
    };
    return (
      <span className={`px-2 py-1 rounded text-xs ${badges[plan]}`}>
        {plan}
      </span>
    );
  };

  const getActivityIcon = (type) => {
    switch(type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default: return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const handleViewAgency = (agency) => {
    setSelectedAgency(agency);
    setModalType('view');
    setShowModal(true);
  };

  const handleEditAgency = (agency) => {
    setSelectedAgency(agency);
    setFormData({
      name: agency.name,
      subdomain: agency.subdomain,
      plan: agency.plan,
      email: agency.email,
      phone: agency.phone,
      address: agency.address,
      owner: agency.owner,
      ownerEmail: agency.ownerEmail
    });
    setModalType('edit');
    setShowModal(true);
  };

  const exportData = (type) => {
    let data = [];
    let filename = '';
    
    switch(type) {
      case 'agencies':
        data = agencies;
        filename = 'agences_export.json';
        break;
      case 'payments':
        data = recentPayments;
        filename = 'paiements_export.json';
        break;
      case 'users':
        data = users;
        filename = 'utilisateurs_export.json';
        break;
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-all duration-300 z-50 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className={`flex items-center space-x-2 ${!sidebarOpen && 'justify-center w-full'}`}>
              <Plane className="h-8 w-8 text-sky-400" />
              {sidebarOpen && <span className="text-xl font-bold">TravelHub</span>}
            </div>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white/70 hover:text-white">
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
          
          <div className={`text-sm text-sky-300 mb-2 ${!sidebarOpen && 'text-center'}`}>
            {sidebarOpen ? 'Connecté en tant que' : ''}
          </div>
          {sidebarOpen && (
            <>
              <div className="font-semibold">Super Admin</div>
              <div className="text-sky-300 text-sm">admin@travelhub.com</div>
            </>
          )}
        </div>
        
        <nav className="mt-8">
          {[
            { id: 'dashboard', icon: PieChart, label: 'Tableau de bord' },
            { id: 'agencies', icon: Building2, label: 'Agences' },
            { id: 'payments', icon: CreditCard, label: 'Paiements' },
            { id: 'analytics', icon: TrendingUp, label: 'Analyses' },
            { id: 'users', icon: Users, label: 'Utilisateurs' },
            { id: 'settings', icon: Settings, label: 'Paramètres' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-6 py-3 transition ${
                activeTab === item.id
                  ? 'bg-sky-600/20 border-r-4 border-sky-400'
                  : 'hover:bg-white/10'
              } ${!sidebarOpen && 'justify-center'}`}
            >
              <item.icon className="h-5 w-5" />
              {sidebarOpen && <span className="ml-3">{item.label}</span>}
            </button>
          ))}
        </nav>
        
        <button
          onClick={handleLogout}
          className={`absolute bottom-8 left-0 right-0 mx-auto px-6 py-3 bg-red-600/20 text-red-400 hover:bg-red-600/30 transition flex items-center ${!sidebarOpen && 'justify-center'}`}
        >
          <LogOut className="h-5 w-5" />
          {sidebarOpen && <span className="ml-3">Déconnexion</span>}
        </button>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
              {activeTab === 'dashboard' && 'Tableau de bord'}
              {activeTab === 'agencies' && 'Gestion des agences'}
              {activeTab === 'payments' && 'Gestion des paiements'}
              {activeTab === 'analytics' && 'Analyses et statistiques'}
              {activeTab === 'users' && 'Gestion des utilisateurs'}
              {activeTab === 'settings' && 'Paramètres'}
            </h1>
            <div className="flex items-center space-x-4">
              <button onClick={() => exportData(activeTab === 'agencies' ? 'agencies' : activeTab === 'payments' ? 'payments' : 'users')} className="p-2 hover:bg-gray-100 rounded-lg">
                <Download className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="h-5 w-5 text-gray-600" />
              </button>
              <div className="w-8 h-8 bg-gradient-to-r from-sky-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                SA
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  { icon: Building2, label: "Agences totales", value: stats.total, color: "from-blue-500 to-cyan-500", change: "+12%" },
                  { icon: CheckCircle, label: "Agences actives", value: stats.active, color: "from-green-500 to-emerald-500", change: "+5%" },
                  { icon: DollarSign, label: "Revenus mensuels", value: `$${stats.totalRevenue}`, color: "from-yellow-500 to-orange-500", change: "+18%" },
                  { icon: Star, label: "Note moyenne", value: stats.averageRating, color: "from-purple-500 to-pink-500", change: "+0.2" }
                ].map((stat, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`bg-gradient-to-r ${stat.color} p-3 rounded-lg`}>
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                    <div className="text-gray-600 text-sm mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Croissance des agences</h3>
                    <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="text-sm border rounded-lg px-2 py-1">
                      <option value="month">Mois</option>
                      <option value="quarter">Trimestre</option>
                      <option value="year">Année</option>
                    </select>
                  </div>
                  <div className="h-64 flex items-end space-x-2">
                    {['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'].map((month, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full bg-gradient-to-t from-sky-500 to-blue-500 rounded-t-lg transition-all hover:from-sky-600 hover:to-blue-600"
                          style={{ height: `${20 + Math.random() * 80}px` }}
                        ></div>
                        <span className="text-xs text-gray-600 mt-2">{month}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Répartition des plans</h3>
                  <div className="space-y-4">
                    {[
                      { name: 'Basic', count: agencies.filter(a => a.plan === 'Basic').length, color: 'bg-blue-500' },
                      { name: 'Professional', count: agencies.filter(a => a.plan === 'Professional').length, color: 'bg-purple-500' },
                      { name: 'Enterprise', count: agencies.filter(a => a.plan === 'Enterprise').length, color: 'bg-yellow-500' }
                    ].map((plan) => (
                      <div key={plan.name}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">{plan.name}</span>
                          <span className="text-sm font-medium">{plan.count} agences</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className={`${plan.color} h-2 rounded-full`} style={{ width: `${(plan.count / stats.total) * 100}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Activités récentes</h3>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between py-2 border-b">
                      <div className="flex items-center space-x-3">
                        {getActivityIcon(activity.type)}
                        <div>
                          <p className="font-medium text-gray-800">{activity.action}</p>
                          <p className="text-sm text-gray-500">{activity.agency}</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">{activity.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* AGENCIES TAB */}
          {activeTab === 'agencies' && (
            <>
              <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher une agence..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="active">Actif</option>
                    <option value="pending">En attente</option>
                    <option value="suspended">Suspendu</option>
                  </select>
                  <select
                    value={planFilter}
                    onChange={(e) => setPlanFilter(e.target.value)}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="all">Tous les plans</option>
                    <option value="Basic">Basic</option>
                    <option value="Professional">Professional</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                  <button
                    onClick={() => { setSearchTerm(''); setStatusFilter('all'); setPlanFilter('all'); }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                  >
                    Réinitialiser
                  </button>
                  <button
                    onClick={() => { setModalType('add'); setShowModal(true); }}
                    className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-lg hover:from-sky-600 hover:to-blue-600 transition flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Nouvelle agence
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAgencies.map((agency) => (
                  <div key={agency.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
                    <div className="relative h-32">
                      <img src={agency.coverImage} alt={agency.name} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 flex space-x-1">
                        <button onClick={() => handleViewAgency(agency)} className="p-1 bg-white/90 rounded hover:bg-white transition">
                          <Eye className="h-4 w-4 text-gray-600" />
                        </button>
                        <button onClick={() => handleEditAgency(agency)} className="p-1 bg-white/90 rounded hover:bg-white transition">
                          <Edit className="h-4 w-4 text-gray-600" />
                        </button>
                        <button onClick={() => handleDeleteAgency(agency.id)} className="p-1 bg-white/90 rounded hover:bg-white transition">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <img src={agency.logo} alt={agency.name} className="w-12 h-12 rounded-full mr-3" />
                        <div>
                          <h3 className="font-semibold text-lg">{agency.name}</h3>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600 ml-1">{agency.rating}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{agency.description}</p>
                      <div className="flex justify-between items-center mb-3">
                        {getStatusBadge(agency.status)}
                        {getPlanBadge(agency.plan)}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center"><Users className="h-4 w-4 mr-1" />{agency.agents} agents</div>
                        <div className="flex items-center"><Users className="h-4 w-4 mr-1" />{agency.voyageurs} voyageurs</div>
                        <div className="flex items-center"><Calendar className="h-4 w-4 mr-1" />{agency.registered}</div>
                        <div className="flex items-center"><DollarSign className="h-4 w-4 mr-1" />${agency.revenue}/mois</div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => agency.status === 'active' ? handleStatusChange(agency.id, 'suspended') : handleStatusChange(agency.id, 'active')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${agency.status === 'active' ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                          {agency.status === 'active' ? 'Suspendre' : 'Activer'}
                        </button>
                        <a href={`http://${agency.subdomain}.127.0.0.1.nip.io:3000`} target="_blank" rel="noopener noreferrer" className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium text-center hover:bg-gray-200 transition">
                          Visiter
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* PAYMENTS TAB */}
          {activeTab === 'payments' && (
            <>
              {/* Payment Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                  { icon: DollarSign, label: "Revenus totaux", value: `$${paymentStats.totalRevenue}`, color: "from-green-500 to-emerald-500" },
                  { icon: Clock, label: "En attente", value: `$${paymentStats.pendingRevenue}`, color: "from-yellow-500 to-orange-500" },
                  { icon: Receipt, label: "Transactions", value: paymentStats.totalTransactions, color: "from-blue-500 to-cyan-500" },
                  { icon: CheckCircle, label: "Taux de succès", value: `${paymentStats.successRate}%`, color: "from-purple-500 to-pink-500" }
                ].map((stat, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`bg-gradient-to-r ${stat.color} p-3 rounded-lg`}>
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                    <div className="text-gray-600 text-sm mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Revenue Chart */}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h3 className="text-lg font-semibold mb-4">Évolution des revenus</h3>
                <div className="h-64 flex items-end space-x-4">
                  {monthlyRevenue.map((item, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-gradient-to-t from-sky-500 to-blue-500 rounded-t-lg transition-all hover:from-sky-600 hover:to-blue-600" style={{ height: `${(item.revenue / 30000) * 100}px` }}>
                        <div className="text-xs text-center text-white mt-1">{item.revenue}</div>
                      </div>
                      <span className="text-xs text-gray-600 mt-2">{item.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payments Table */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="px-6 py-4 border-b">
                  <h3 className="text-lg font-semibold">Historique des paiements</h3>
                </div>
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Agence</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Montant</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Date</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Méthode</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Statut</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPayments.map((payment) => (
                      <tr key={payment.id} className="border-t">
                        <td className="px-6 py-4 font-medium">{payment.agency}</td>
                        <td className="px-6 py-4">${payment.amount}</td>
                        <td className="px-6 py-4 text-gray-600">{payment.date}</td>
                        <td className="px-6 py-4">{payment.method}</td>
                        <td className="px-6 py-4">{getStatusBadge(payment.status)}</td>
                        <td className="px-6 py-4">
                          <button className="text-blue-600 hover:text-blue-800 mr-2">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-800">
                            <Download className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <>
              {/* Analytics Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                  { icon: TrendingUpIcon, label: "Taux de croissance", value: "+23%", color: "from-green-500 to-emerald-500", detail: "vs mois dernier" },
                  { icon: UsersIcon, label: "Utilisateurs actifs", value: "2,345", color: "from-blue-500 to-cyan-500", detail: "+189 ce mois" },
                  { icon: Target, label: "Taux de conversion", value: "68%", color: "from-purple-500 to-pink-500", detail: "+5% vs cible" }
                ].map((stat, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`bg-gradient-to-r ${stat.color} p-3 rounded-lg`}>
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
                    </div>
                    <div className="text-gray-600 text-sm">{stat.label}</div>
                    <div className="text-xs text-gray-400 mt-1">{stat.detail}</div>
                  </div>
                ))}
              </div>

              {/* Agency Performance */}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h3 className="text-lg font-semibold mb-4">Performance des agences</h3>
                <div className="space-y-4">
                  {agencies.slice(0, 5).map((agency) => (
                    <div key={agency.id}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{agency.name}</span>
                        <span className="text-sm text-gray-600">{agency.voyageurs} voyageurs</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-sky-500 to-blue-500 h-2 rounded-full" style={{ width: `${(agency.voyageurs / 1500) * 100}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Geographic Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Top destinations</h3>
                  <div className="space-y-3">
                    {['Paris', 'New York', 'Tokyo', 'London', 'Dubai'].map((city, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <span className="text-gray-600">{city}</span>
                        <div className="flex-1 mx-4">
                          <div className="bg-gray-200 rounded-full h-2">
                            <div className="bg-sky-500 h-2 rounded-full" style={{ width: `${80 - i * 15}%` }}></div>
                          </div>
                        </div>
                        <span className="text-sm font-medium">{80 - i * 15}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Prévisions</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Prochain mois</span>
                        <span className="text-sm font-medium">$28,500</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Trimestre</span>
                        <span className="text-sm font-medium">$85,200</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Année</span>
                        <span className="text-sm font-medium">$340,000</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* USERS TAB */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Utilisateurs du TravelHub</h3>
                <button onClick={() => setShowUserModal(true)} className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-lg hover:from-sky-600 hover:to-blue-600 transition flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Ajouter un utilisateur
                </button>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Nom</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Rôle</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Statut</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Dernière connexion</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-t">
                      <td className="px-6 py-4 font-medium">{user.name}</td>
                      <td className="px-6 py-4 text-gray-600">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          user.role === 'Super Admin' ? 'bg-purple-100 text-purple-800' :
                          user.role === 'Admin' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(user.status)}</td>
                      <td className="px-6 py-4 text-gray-600">{user.lastLogin}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button className="text-blue-600 hover:text-blue-800"><Edit className="h-4 w-4" /></button>
                          <button className="text-red-600 hover:text-red-800"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* General Settings */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center"><GlobeIcon className="h-5 w-5 mr-2 text-sky-500" /> Paramètres généraux</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom du site</label>
                    <input type="text" value={settingsForm.siteName} onChange={(e) => setSettingsForm({...settingsForm, siteName: e.target.value})} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email de contact</label>
                    <input type="email" value={settingsForm.siteEmail} onChange={(e) => setSettingsForm({...settingsForm, siteEmail: e.target.value})} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                    <input type="text" value={settingsForm.sitePhone} onChange={(e) => setSettingsForm({...settingsForm, sitePhone: e.target.value})} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                    <input type="text" value={settingsForm.siteAddress} onChange={(e) => setSettingsForm({...settingsForm, siteAddress: e.target.value})} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Devise</label>
                    <select value={settingsForm.currency} onChange={(e) => setSettingsForm({...settingsForm, currency: e.target.value})} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500">
                      <option value="EUR">EUR - Euro</option>
                      <option value="USD">USD - Dollar US</option>
                      <option value="GBP">GBP - Livre sterling</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fuseau horaire</label>
                    <select value={settingsForm.timezone} onChange={(e) => setSettingsForm({...settingsForm, timezone: e.target.value})} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500">
                      <option value="Europe/Paris">Europe/Paris</option>
                      <option value="Europe/London">Europe/London</option>
                      <option value="America/New_York">America/New_York</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Email Settings */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center"><MailIcon className="h-5 w-5 mr-2 text-sky-500" /> Configuration email</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Serveur SMTP</label>
                    <input type="text" value={settingsForm.smtpHost} onChange={(e) => setSettingsForm({...settingsForm, smtpHost: e.target.value})} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Port SMTP</label>
                    <input type="text" value={settingsForm.smtpPort} onChange={(e) => setSettingsForm({...settingsForm, smtpPort: e.target.value})} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Utilisateur SMTP</label>
                    <input type="text" value={settingsForm.smtpUser} onChange={(e) => setSettingsForm({...settingsForm, smtpUser: e.target.value})} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notifications email</label>
                    <label className="inline-flex items-center mt-2">
                      <input type="checkbox" checked={settingsForm.emailNotifications} onChange={(e) => setSettingsForm({...settingsForm, emailNotifications: e.target.checked})} className="rounded" />
                      <span className="ml-2 text-gray-600">Activer les notifications</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Appearance Settings */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center"><Palette className="h-5 w-5 mr-2 text-sky-500" /> Apparence</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Thème</label>
                    <select value={settingsForm.theme} onChange={(e) => setSettingsForm({...settingsForm, theme: e.target.value})} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500">
                      <option value="light">Clair</option>
                      <option value="dark">Sombre</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Couleur principale</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={settingsForm.primaryColor} onChange={(e) => setSettingsForm({...settingsForm, primaryColor: e.target.value})} className="w-12 h-10 border rounded cursor-pointer" />
                      <span className="text-sm text-gray-500">{settingsForm.primaryColor}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Settings */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center"><Lock className="h-5 w-5 mr-2 text-sky-500" /> Sécurité</h3>
                <div className="space-y-4">
                  <label className="inline-flex items-center">
                    <input type="checkbox" className="rounded" />
                    <span className="ml-2 text-gray-600">Activer l'authentification à deux facteurs</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input type="checkbox" className="rounded" />
                    <span className="ml-2 text-gray-600">Forcer HTTPS</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input type="checkbox" checked={settingsForm.maintenanceMode} onChange={(e) => setSettingsForm({...settingsForm, maintenanceMode: e.target.checked})} className="rounded" />
                    <span className="ml-2 text-gray-600">Mode maintenance</span>
                  </label>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button className="px-6 py-2 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-lg hover:from-sky-600 hover:to-blue-600 transition">
                  Enregistrer les modifications
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals remain the same */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">
                  {modalType === 'view' ? 'Détails de l\'agence' : modalType === 'add' ? 'Nouvelle agence' : 'Modifier l\'agence'}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              {modalType === 'view' && selectedAgency && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <img src={selectedAgency.logo} alt={selectedAgency.name} className="w-16 h-16 rounded-full" />
                    <div>
                      <h4 className="text-lg font-semibold">{selectedAgency.name}</h4>
                      <div className="flex items-center"><Star className="h-4 w-4 text-yellow-400 fill-current" /><span className="ml-1">{selectedAgency.rating}</span></div>
                    </div>
                  </div>
                  <div className="border-t pt-4 space-y-2">
                    <p><strong>Email:</strong> {selectedAgency.email}</p>
                    <p><strong>Téléphone:</strong> {selectedAgency.phone}</p>
                    <p><strong>Adresse:</strong> {selectedAgency.address}</p>
                    <p><strong>Propriétaire:</strong> {selectedAgency.owner}</p>
                    <p><strong>Email proprio:</strong> {selectedAgency.ownerEmail}</p>
                    <p><strong>Plan:</strong> {selectedAgency.plan}</p>
                    <p><strong>Date d'inscription:</strong> {selectedAgency.registered}</p>
                  </div>
                </div>
              )}
              
              {(modalType === 'add' || modalType === 'edit') && (
                <div className="space-y-4">
                  <input type="text" placeholder="Nom de l'agence" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded-lg" />
                  <input type="text" placeholder="Sous-domaine" value={formData.subdomain} onChange={(e) => setFormData({...formData, subdomain: e.target.value})} className="w-full p-2 border rounded-lg" />
                  <select value={formData.plan} onChange={(e) => setFormData({...formData, plan: e.target.value})} className="w-full p-2 border rounded-lg">
                    <option value="Basic">Basic</option>
                    <option value="Professional">Professional</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                  <input type="email" placeholder="Email de contact" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full p-2 border rounded-lg" />
                  <input type="text" placeholder="Téléphone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full p-2 border rounded-lg" />
                  <input type="text" placeholder="Adresse" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full p-2 border rounded-lg" />
                  <input type="text" placeholder="Nom du propriétaire" value={formData.owner} onChange={(e) => setFormData({...formData, owner: e.target.value})} className="w-full p-2 border rounded-lg" />
                  <input type="email" placeholder="Email du propriétaire" value={formData.ownerEmail} onChange={(e) => setFormData({...formData, ownerEmail: e.target.value})} className="w-full p-2 border rounded-lg" />
                  <button onClick={modalType === 'add' ? handleAddAgency : handleUpdateAgency} className="w-full py-2 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-lg font-semibold">
                    {modalType === 'add' ? 'Créer l\'agence' : 'Mettre à jour'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showUserModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Ajouter un utilisateur</h3>
                <button onClick={() => setShowUserModal(false)} className="text-gray-400 hover:text-gray-600"><X className="h-6 w-6" /></button>
              </div>
              <div className="space-y-4">
                <input type="text" placeholder="Nom complet" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded-lg" />
                <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full p-2 border rounded-lg" />
                <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full p-2 border rounded-lg">
                  <option value="Super Admin">Super Admin</option>
                  <option value="Admin">Admin</option>
                  <option value="Support">Support</option>
                  <option value="Billing">Billing</option>
                </select>
                <button onClick={handleAddUser} className="w-full py-2 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-lg font-semibold">Ajouter l'utilisateur</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}