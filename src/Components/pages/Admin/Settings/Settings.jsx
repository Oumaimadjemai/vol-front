import { useState, useRef } from "react";
import { toast } from "sonner";
import { 
  Save, 
  Upload, 
  Bell, 
  Lock, 
  Globe, 
  Mail, 
  Building2, 
  MapPin, 
  Phone, 
  AtSign,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Shield,
  Key,
  Monitor,
  Smartphone,
  CheckCircle2,
  Palette,
  FileText,
  CreditCard,
  Users,
  Eye,
  EyeOff,
  BarChart3,
  Calendar,
  Database,
  Cloud,
  Crown,
  Download,
  Receipt,
  Edit2,
  Trash2,
  XCircle,
  Loader,
  X as XIcon,
  Settings as SettingsIcon,
  TrendingUp,
  ArrowUpRight,
  Plane
} from "lucide-react";
import { motion } from "framer-motion";

export function Settings() {
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [logoPreview, setLogoPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  // Theme customization
  const [themeColors, setThemeColors] = useState({
    primary: "#00C0E8",
    secondary: "#0099cc",
    accent: "#8b5cf6",
    background: "#f9fafb"
  });
  
  // Email templates customization
  const [selectedEmailTemplate, setSelectedEmailTemplate] = useState("confirmation");
  const [emailTemplates, setEmailTemplates] = useState({
    confirmation: {
      subject: "Confirmation de votre réservation",
      body: "Bonjour {name},\n\nVotre réservation a été confirmée avec succès.\n\nDétails du voyage :\n- Destination : {destination}\n- Date de départ : {departure_date}\n- Numéro de réservation : {booking_id}\n\nMerci de faire confiance à {agency_name} !\n\nCordialement,\nL'équipe {agency_name}"
    },
    cancellation: {
      subject: "Annulation de votre réservation",
      body: "Bonjour {name},\n\nNous vous informons que votre réservation a été annulée.\n\nNuméro de réservation : {booking_id}\n\nPour toute question, n'hésitez pas à nous contacter.\n\nCordialement,\nL'équipe {agency_name}"
    },
    welcome: {
      subject: "Bienvenue chez {agency_name} !",
      body: "Bonjour {name},\n\nNous sommes ravis de vous accueillir chez {agency_name}.\n\nVotre compte a été créé avec succès. Vous pouvez dès maintenant :\n- Explorer nos destinations\n- Réserver vos voyages\n- Suivre vos réservations\n\nÀ très bientôt !\n\nL'équipe {agency_name}"
    },
    newsletter: {
      subject: "Nos dernières offres de voyage",
      body: "Bonjour {name},\n\nDécouvrez nos meilleures offres du moment :\n\n{offers_list}\n\nNe manquez pas ces opportunités uniques !\n\nCordialement,\nL'équipe {agency_name}"
    }
  });
  
  const [showEmailEditor, setShowEmailEditor] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  
  // Subscription & Usage data
  const [subscription] = useState({
    plan: "Professional",
    status: "active",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    price: 299,
    currency: "DZD",
    features: [
      "Réservations illimitées",
      "Support prioritaire 24/7",
      "API complète",
      "Jusqu'à 10 agents",
      "Rapports avancés"
    ]
  });
  
  const [usageStats] = useState({
    totalBookings: 145,
    monthlyBookings: 32,
    apiCalls: 2847,
    apiLimit: 10000,
    storageUsed: "245 MB",
    storageLimit: "2 GB",
    activeAgents: 4,
    maxAgents: 10
  });
  
  const [recentInvoices] = useState([
    { id: "INV-2024-001", date: "2024-01-01", amount: 299, status: "paid", description: "Abonnement Mensuel - Janvier 2024" },
    { id: "INV-2024-002", date: "2024-02-01", amount: 299, status: "paid", description: "Abonnement Mensuel - Février 2024" },
    { id: "INV-2024-003", date: "2024-03-01", amount: 299, status: "paid", description: "Abonnement Mensuel - Mars 2024" }
  ]);

  const statsCards = [
    { label: "Abonnement actif", value: subscription.plan, icon: <Crown className="text-[#00C0E8]" size={24} />, color: "from-amber-50 to-yellow-50" },
    { label: "Agents actifs", value: `${usageStats.activeAgents}/${usageStats.maxAgents}`, icon: <Users className="text-[#00C0E8]" size={22} />, color: "from-blue-50 to-indigo-50" },
    { label: "Appels API", value: usageStats.apiCalls.toLocaleString(), icon: <Cloud className="text-[#00C0E8]" size={22} />, color: "from-purple-50 to-pink-50" },
    { label: "Stockage", value: usageStats.storageUsed, icon: <Database className="text-[#00C0E8]" size={22} />, color: "from-green-50 to-emerald-50" },
  ];

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Le fichier ne doit pas dépasser 2MB");
        return;
      }
      if (!file.type.includes("image")) {
        toast.error("Veuillez sélectionner une image (PNG, JPG, SVG)");
        return;
      }
      
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
        setIsUploading(false);
        toast.success("Logo mis à jour avec succès");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorChange = (colorName, value) => {
    setThemeColors(prev => ({ ...prev, [colorName]: value }));
    toast.success(`Couleur ${colorName} mise à jour`);
  };

  const handleSaveEmailTemplate = () => {
    if (editingTemplate) {
      setEmailTemplates(prev => ({
        ...prev,
        [selectedEmailTemplate]: editingTemplate
      }));
      toast.success("Template email mis à jour avec succès");
      setShowEmailEditor(false);
      setEditingTemplate(null);
    }
  };

  const openEmailEditor = () => {
    setEditingTemplate({ ...emailTemplates[selectedEmailTemplate] });
    setShowEmailEditor(true);
  };

  const handleSave = () => {
    toast.success("Paramètres sauvegardés avec succès");
  };

  const tabs = [
    { id: "general", label: "Général", icon: Globe },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "email", label: "Email", icon: Mail },
    { id: "security", label: "Sécurité", icon: Shield },
    { id: "subscription", label: "Abonnement", icon: CreditCard },
    { id: "theme", label: "Personnalisation", icon: Palette }
  ];

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Hero Header Style */}
      <div className="relative bg-gradient-to-r from-[#00C0E8] to-[#0096b8] overflow-hidden rounded-2xl">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="relative px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-3 mb-3 justify-center md:justify-start">
                  <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
                    <SettingsIcon className="text-white text-2xl" />
                  </div>
                  <span className="text-white/80 text-sm font-medium tracking-wide">CONFIGURATION</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Paramètres
                </h1>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full"
            >
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm font-medium text-white">Tous les systèmes opérationnels</span>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
          {statsCards.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`bg-gradient-to-br ${stat.color} backdrop-blur-sm rounded-2xl p-5 shadow-md hover:shadow-lg transition-all hover:-translate-y-1`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="bg-white/50 backdrop-blur-sm p-2 rounded-xl">
                  {stat.icon}
                </div>
                <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
              </div>
              <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Revenue Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-[#00C0E8] to-[#0096b8] rounded-2xl p-6 shadow-lg mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Forfait actuel</p>
              <h3 className="text-3xl font-bold text-white mt-1">Plan {subscription.plan}</h3>
              <p className="text-white/70 text-xs mt-1">{subscription.price.toLocaleString()} {subscription.currency}/mois</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <TrendingUp className="size-6 text-white" />
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="border-b border-gray-200 overflow-x-auto mb-6">
          <div className="flex gap-1 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-5 py-3 font-medium transition-all relative
                    ${activeTab === tab.id 
                      ? "text-[#00C0E8]" 
                      : "text-gray-500 hover:text-gray-700"
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00C0E8] rounded-full"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ==================== GENERAL TAB ==================== */}
        {activeTab === "general" && (
          <div className="space-y-6">
            {/* Agency Information */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-cyan-50 rounded-xl">
                    <Building2 className="w-5 h-5 text-[#00C0E8]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Informations de l'agence</h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Gérez les informations de base de votre agence de voyage
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      Nom de l'agence
                    </label>
                    <input
                      type="text"
                      defaultValue="Traveling!"
                      placeholder="Nom de votre agence"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C0E8]/20 focus:border-[#00C0E8] transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Phone className="w-4 h-4 text-gray-400" />
                      Téléphone
                    </label>
                    <input
                      type="text"
                      defaultValue="+213 (0) 123 456 789"
                      placeholder="+33 X XX XX XX XX"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C0E8]/20 focus:border-[#00C0E8] transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <AtSign className="w-4 h-4 text-gray-400" />
                    Email professionnel
                  </label>
                  <input
                    type="email"
                    defaultValue="info@traveling.com"
                    placeholder="contact@agence.com"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C0E8]/20 focus:border-[#00C0E8] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    Adresse
                  </label>
                  <input
                    type="text"
                    defaultValue="123 Travel Street, Algiers, Algeria"
                    placeholder="Adresse complète"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C0E8]/20 focus:border-[#00C0E8] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <FileText className="w-4 h-4 text-gray-400" />
                    Description
                  </label>
                  <textarea
                    rows={4}
                    defaultValue="Découvrez le monde avec nous. Nous offrons les meilleures expériences de voyage adaptées à vous."
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C0E8]/20 focus:border-[#00C0E8] transition-all resize-none"
                  />
                </div>
                <div className="border-t border-gray-100 pt-4">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                    <Palette className="w-4 h-4 text-gray-400" />
                    Logo de l'agence
                  </label>
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200">
                    <div className="relative">
                      {logoPreview ? (
                        <img 
                          src={logoPreview} 
                          alt="Logo preview" 
                          className="w-20 h-20 rounded-xl object-cover shadow-lg"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#00C0E8] to-[#0099cc] flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                          T!
                        </div>
                      )}
                      {isUploading && (
                        <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                          <Loader className="w-6 h-6 text-white animate-spin" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Logo de l'agence</p>
                      <p className="text-xs text-gray-500 mt-0.5">Format recommandé: PNG, SVG • Max: 2MB</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-[#00C0E8] hover:text-white hover:border-[#00C0E8] transition-all"
                      >
                        <Upload className="w-4 h-4 inline mr-2" />
                        Changer
                      </button>
                      {logoPreview && (
                        <button
                          onClick={() => {
                            setLogoPreview(null);
                            toast.success("Logo supprimé");
                          }}
                          className="px-4 py-2 border border-red-200 rounded-xl text-red-500 hover:bg-red-50 transition-all"
                        >
                          <Trash2 className="w-4 h-4 inline mr-2" />
                          Supprimer
                        </button>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-purple-50 rounded-xl">
                    <Globe className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Réseaux sociaux</h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Connectez vos comptes de réseaux sociaux pour une meilleure visibilité
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Facebook className="w-4 h-4 text-blue-600" />
                      Facebook
                    </label>
                    <input
                      type="url"
                      placeholder="https://facebook.com/votre-page"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Twitter className="w-4 h-4 text-sky-500" />
                      Twitter / X
                    </label>
                    <input
                      type="url"
                      placeholder="https://twitter.com/votre-compte"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Instagram className="w-4 h-4 text-pink-600" />
                      Instagram
                    </label>
                    <input
                      type="url"
                      placeholder="https://instagram.com/votre-compte"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Youtube className="w-4 h-4 text-red-600" />
                      YouTube
                    </label>
                    <input
                      type="url"
                      placeholder="https://youtube.com/votre-chaine"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className="px-6 py-2.5 bg-gradient-to-r from-[#00C0E8] to-[#0099cc] text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Sauvegarder les modifications
              </button>
            </div>
          </div>
        )}

        {/* ==================== NOTIFICATIONS TAB ==================== */}
        {activeTab === "notifications" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-cyan-50 rounded-xl">
                    <Bell className="w-5 h-5 text-[#00C0E8]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Préférences de notification</h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Choisissez les notifications que vous souhaitez recevoir
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-50/50 to-transparent border border-blue-100">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="font-semibold text-gray-900">Nouvelles réservations</span>
                      <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">Important</span>
                    </div>
                    <p className="text-sm text-gray-500 ml-12">Recevoir une notification pour chaque nouvelle réservation</p>
                  </div>
                  <button className="relative w-11 h-6 rounded-full bg-[#00C0E8]">
                    <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-white"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== THEME CUSTOMIZATION TAB ==================== */}
        {activeTab === "theme" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-purple-50 rounded-xl">
                    <Palette className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Personnalisation des couleurs</h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Personnalisez les couleurs de votre agence
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Color pickers... */}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== SUBSCRIPTION & USAGE TAB ==================== */}
        {activeTab === "subscription" && (
          <div className="space-y-6">
            {/* Subscription Info */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-green-50 rounded-xl">
                    <CreditCard className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Abonnement actuel</h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Gérez votre abonnement et facturation
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-6 border border-cyan-100">
                  <div className="flex justify-between items-start flex-wrap gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Crown className="w-5 h-5 text-amber-500" />
                        <h4 className="text-xl font-bold text-gray-900">Plan {subscription.plan}</h4>
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">Actif</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        {subscription.price.toLocaleString()} {subscription.currency}/mois
                      </p>
                      <div className="mt-4 space-y-1">
                        {subscription.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Période d'abonnement</p>
                      <p className="font-semibold text-gray-900">
                        {subscription.startDate} au {subscription.endDate}
                      </p>
                      <button className="mt-4 px-4 py-2 border border-amber-500 text-amber-600 rounded-lg hover:bg-amber-50 transition-all">
                        Gérer l'abonnement
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Usage Statistics */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-50 rounded-xl">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Statistiques d'utilisation</h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Consultez votre consommation et vos limites
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-[#00C0E8]" />
                      <span className="text-sm text-gray-600">Réservations ce mois</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{usageStats.monthlyBookings}</p>
                    <p className="text-xs text-gray-500 mt-1">Total: {usageStats.totalBookings}</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-[#00C0E8]" />
                      <span className="text-sm text-gray-600">Agents actifs</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{usageStats.activeAgents} / {usageStats.maxAgents}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-[#00C0E8] rounded-full h-2 transition-all"
                        style={{ width: `${(usageStats.activeAgents / usageStats.maxAgents) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Cloud className="w-4 h-4 text-[#00C0E8]" />
                      <span className="text-sm text-gray-600">Appels API</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{usageStats.apiCalls.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1">Limite: {usageStats.apiLimit.toLocaleString()}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-[#00C0E8] rounded-full h-2 transition-all"
                        style={{ width: `${(usageStats.apiCalls / usageStats.apiLimit) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Database className="w-4 h-4 text-[#00C0E8]" />
                      <span className="text-sm text-gray-600">Stockage utilisé</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{usageStats.storageUsed}</p>
                    <p className="text-xs text-gray-500 mt-1">Limite: {usageStats.storageLimit}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-[#00C0E8] rounded-full h-2 transition-all"
                        style={{ width: `${(parseInt(usageStats.storageUsed) / parseInt(usageStats.storageLimit)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice History */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-amber-50 rounded-xl">
                      <Receipt className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Historique des factures</h3>
                      <p className="text-sm text-gray-500 mt-0.5">
                        Consultez et téléchargez vos factures
                      </p>
                    </div>
                  </div>
                  <button className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Tout télécharger
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">N° Facture</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Description</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Montant</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Statut</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentInvoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{invoice.id}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{invoice.date}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{invoice.description}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">{invoice.amount.toLocaleString()} DZD</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                            <CheckCircle2 className="w-3 h-3" />
                            Payée
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-[#00C0E8] hover:text-[#0099cc] transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================== EMAIL TEMPLATES TAB ==================== */}
        {activeTab === "email" && (
          <div className="space-y-6">
            {/* SMTP Configuration */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-cyan-50 rounded-xl">
                    <Mail className="w-5 h-5 text-[#00C0E8]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Configuration Email SMTP</h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Configurez votre serveur d'envoi d'emails
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Serveur SMTP</label>
                    <input
                      type="text"
                      defaultValue="smtp.traveling.com"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C0E8]/20 focus:border-[#00C0E8] transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Port SMTP</label>
                    <input
                      type="text"
                      defaultValue="587"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C0E8]/20 focus:border-[#00C0E8] transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Email Templates */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-purple-50 rounded-xl">
                    <FileText className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Personnalisation des emails</h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Personnalisez les templates d'emails pour chaque type de notification
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                  {Object.keys(emailTemplates).map((template) => (
                    <button
                      key={template}
                      onClick={() => setSelectedEmailTemplate(template)}
                      className={`p-3 rounded-xl text-left transition-all ${
                        selectedEmailTemplate === template
                          ? "bg-[#00C0E8]/10 border-2 border-[#00C0E8]"
                          : "bg-gray-50 border border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {template === "confirmation" && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                        {template === "cancellation" && <XCircle className="w-4 h-4 text-red-600" />}
                        {template === "welcome" && <Users className="w-4 h-4 text-blue-600" />}
                        {template === "newsletter" && <Mail className="w-4 h-4 text-purple-600" />}
                        <span className="font-medium text-gray-900 capitalize">
                          {template === "confirmation" ? "Confirmation" :
                           template === "cancellation" ? "Annulation" :
                           template === "welcome" ? "Bienvenue" : "Newsletter"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {template === "confirmation" && "Envoyé après réservation"}
                        {template === "cancellation" && "Envoyé en cas d'annulation"}
                        {template === "welcome" && "Envoyé aux nouveaux utilisateurs"}
                        {template === "newsletter" && "Pour vos campagnes marketing"}
                      </p>
                    </button>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Template: {selectedEmailTemplate === "confirmation" ? "Confirmation" :
                                   selectedEmailTemplate === "cancellation" ? "Annulation" :
                                   selectedEmailTemplate === "welcome" ? "Bienvenue" : "Newsletter"}
                      </h4>
                      <p className="text-xs text-gray-500">Variables disponibles: {'{name}'}, {'{destination}'}, {'{booking_id}'}, {'{departure_date}'}, {'{agency_name}'}</p>
                    </div>
                    <button
                      onClick={openEmailEditor}
                      className="px-4 py-2 bg-[#00C0E8] text-white rounded-lg hover:bg-[#0099cc] transition-all flex items-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Personnaliser
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Sujet</label>
                      <div className="p-3 bg-white rounded-lg border border-gray-200">
                        {emailTemplates[selectedEmailTemplate]?.subject}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Contenu</label>
                      <div className="p-3 bg-white rounded-lg border border-gray-200 whitespace-pre-wrap">
                        {emailTemplates[selectedEmailTemplate]?.body}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className="px-6 py-2.5 bg-gradient-to-r from-[#00C0E8] to-[#0099cc] text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Sauvegarder la configuration
              </button>
            </div>
          </div>
        )}

        {/* ==================== SECURITY TAB ==================== */}
        {activeTab === "security" && (
          <div className="space-y-6">
            {/* Change Password */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-red-50 rounded-xl">
                    <Key className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Modifier le mot de passe</h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Assurez-vous d'utiliser un mot de passe fort et unique
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Mot de passe actuel</label>
                  <input type="password" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Nouveau mot de passe</label>
                  <input type="password" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" />
                  <p className="text-xs text-gray-500">Minimum 8 caractères avec lettres, chiffres et symboles</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Confirmer le nouveau mot de passe</label>
                  <input type="password" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" />
                </div>
                <button className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all shadow-md flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Changer le mot de passe
                </button>
              </div>
            </div>

            {/* Two Factor Authentication */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-cyan-50 rounded-xl">
                    <Shield className="w-5 h-5 text-[#00C0E8]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Authentification à deux facteurs</h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Renforcez la sécurité de votre compte avec une couche supplémentaire
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-cyan-50/50 to-transparent border border-cyan-100">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${twoFactorEnabled ? 'bg-green-100' : 'bg-gray-100'}`}>
                        {twoFactorEnabled ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : (
                          <Shield className="w-4 h-4 text-gray-600" />
                        )}
                      </div>
                      <span className="font-semibold text-gray-900">Activer l'authentification 2FA</span>
                      {twoFactorEnabled && (
                        <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">Activé</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 ml-12">
                      {twoFactorEnabled 
                        ? "Votre compte est protégé par l'authentification à deux facteurs"
                        : "Ajoutez une couche de sécurité supplémentaire à votre compte"
                      }
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setTwoFactorEnabled(!twoFactorEnabled);
                      toast.success(twoFactorEnabled ? "2FA désactivé" : "2FA activé");
                    }}
                    className={`relative w-11 h-6 rounded-full transition-colors ${twoFactorEnabled ? 'bg-[#00C0E8]' : 'bg-gray-300'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${twoFactorEnabled ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Sessions */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-50 rounded-xl">
                    <Monitor className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Sessions actives</h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Gérez les appareils connectés à votre compte
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-3">
                {/* Current Session */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-green-50/50 to-transparent border-2 border-green-200">
                  <div className="flex items-start justify-between flex-wrap gap-3">
                    <div className="flex gap-3">
                      <div className="p-2 bg-green-100 rounded-lg h-fit">
                        <Monitor className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-gray-900">Session actuelle</p>
                          <span className="text-xs px-2 py-0.5 bg-green-500 text-white rounded-full flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                            En ligne
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Monitor className="w-3.5 h-3.5" />
                          Chrome sur Windows
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          Paris, France
                        </p>
                        <p className="text-xs text-gray-400">Dernière activité: Il y a 5 minutes</p>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">Actif</span>
                  </div>
                </div>

                {/* Other Session */}
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 hover:border-gray-300 transition-colors">
                  <div className="flex items-start justify-between flex-wrap gap-3">
                    <div className="flex gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg h-fit">
                        <Smartphone className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold text-gray-900">iPhone 13</p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Smartphone className="w-3.5 h-3.5" />
                          Safari sur iOS
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          Algiers, Algeria
                        </p>
                        <p className="text-xs text-gray-400">Dernière activité: Il y a 2 heures</p>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all">
                      Déconnecter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Email Editor Modal */}
        {showEmailEditor && editingTemplate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-100 sticky top-0 bg-white">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-cyan-50 rounded-xl">
                      <Mail className="w-5 h-5 text-[#00C0E8]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Personnaliser l'email</h3>
                      <p className="text-sm text-gray-500">Modifiez le template pour {selectedEmailTemplate}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowEmailEditor(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Sujet</label>
                  <input
                    type="text"
                    value={editingTemplate.subject}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, subject: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C0E8]/20 focus:border-[#00C0E8] transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Contenu</label>
                  <textarea
                    rows={12}
                    value={editingTemplate.body}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, body: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C0E8]/20 focus:border-[#00C0E8] transition-all resize-none font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Variables disponibles: {'{name}'}, {'{destination}'}, {'{booking_id}'}, {'{departure_date}'}, {'{agency_name}'}
                  </p>
                </div>
              </div>
              <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                <button
                  onClick={() => setShowEmailEditor(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveEmailTemplate}
                  className="px-4 py-2 bg-[#00C0E8] text-white rounded-xl hover:bg-[#0099cc] transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Sauvegarder
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}