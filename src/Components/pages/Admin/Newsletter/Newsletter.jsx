import { useState } from "react";
import { 
  Mail, 
  Send, 
  Users, 
  TrendingUp, 
  Clock, 
  Eye, 
  MousePointerClick,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Download,
  Search,
  Plus,
  Edit2,
  Trash2,
  Copy,
  UserPlus,
  FileText,
  X,
  Loader,
  MailX,
  UserCheck,
  Ban,
 
} from "lucide-react";
import { toast } from "sonner";
import { NouvelleCampagne } from "./NouvelleCampagne";
import { motion } from "framer-motion";

const newsletterData = {
  campaigns: [
    {
      id: 1,
      name: "Summer Specials 2026",
      subject: "Découvrez nos offres d'été exceptionnelles!",
      status: "sent",
      sentDate: "2026-06-15",
      openRate: 45.2,
      clickRate: 12.8,
      recipients: 12500,
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400",
      template: "summer",
      tags: ["promotion", "summer", "hot"]
    },
    {
      id: 2,
      name: "Winter Collection",
      subject: "Préparez votre hiver avec nos meilleures offres",
      status: "scheduled",
      scheduledDate: "2026-12-01",
      recipients: 15000,
      image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400",
      template: "winter",
      tags: ["winter", "seasonal"]
    },
    {
      id: 3,
      name: "Flash Sale - 24h",
      subject: "⚡ -50% sur toutes les destinations!",
      status: "draft",
      recipients: 0,
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400",
      template: "flash",
      tags: ["flash", "promotion", "urgent"]
    },
    {
      id: 4,
      name: "Newsletter Hebdomadaire #45",
      subject: "Votre dose de voyage de la semaine",
      status: "sent",
      sentDate: "2026-04-10",
      openRate: 38.7,
      clickRate: 9.4,
      recipients: 9800,
      image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400",
      template: "weekly",
      tags: ["weekly", "news"]
    },
    {
      id: 5,
      name: "Black Friday 2026",
      subject: "Offres exceptionnelles jusqu'à -70%!",
      status: "draft",
      recipients: 0,
      image: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400",
      template: "blackfriday",
      tags: ["blackfriday", "promotion", "hot"]
    },
    {
      id: 6,
      name: "Nouveautés Destinations",
      subject: "Découvrez 10 nouvelles destinations",
      status: "scheduled",
      scheduledDate: "2026-05-20",
      recipients: 11200,
      image: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=400",
      template: "destinations",
      tags: ["new", "destinations"]
    }
  ],
  
  subscribers: [
    { id: 1, email: "jean.dupont@email.com", name: "Jean Dupont", status: "active", subscribedDate: "2026-01-15", opens: 24, clicks: 8 },
    { id: 2, email: "marie.martin@email.com", name: "Marie Martin", status: "active", subscribedDate: "2026-02-20", opens: 18, clicks: 5 },
    { id: 3, email: "pierre.bernard@email.com", name: "Pierre Bernard", status: "inactive", subscribedDate: "2025-12-10", opens: 3, clicks: 1 },
    { id: 4, email: "sophie.laurent@email.com", name: "Sophie Laurent", status: "active", subscribedDate: "2026-03-05", opens: 31, clicks: 12 },
    { id: 5, email: "luc.moreau@email.com", name: "Luc Moreau", status: "unsubscribed", subscribedDate: "2025-11-01", opens: 0, clicks: 0 },
    { id: 6, email: "claire.dubois@email.com", name: "Claire Dubois", status: "active", subscribedDate: "2026-01-28", opens: 19, clicks: 7 }
  ],
  
  templates: [
    { id: "summer", name: "Été & Soleil", thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200" },
    { id: "winter", name: "Hiver & Neige", thumbnail: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=200" },
    { id: "flash", name: "Flash Sale", thumbnail: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=200" },
    { id: "weekly", name: "Hebdomadaire", thumbnail: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=200" },
    { id: "destinations", name: "Destinations", thumbnail: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=200" }
  ],
  
  stats: {
    totalSubscribers: 24700,
    activeSubscribers: 22300,
    unsubscribed: 1200,
    bounced: 1200,
    averageOpenRate: 42.5,
    averageClickRate: 11.3,
    totalCampaignsSent: 24,
    monthlyGrowth: 8.5
  }
};

export function Newsletter() {
  const [activeTab, setActiveTab] = useState("campaigns");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [schedulingCampaign, setSchedulingCampaign] = useState(null);
  const [scheduleDate, setScheduleDate] = useState("");
  
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicatingCampaign, setDuplicatingCampaign] = useState(null);
  const [duplicateName, setDuplicateName] = useState("");
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingCampaign, setDeletingCampaign] = useState(null);
  
  const [showSendTestModal, setShowSendTestModal] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  
  const [showSubscriberModal, setShowSubscriberModal] = useState(false);
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);
  const [subscriberAction, setSubscriberAction] = useState(null);
  
  const [showAddSubscriberModal, setShowAddSubscriberModal] = useState(false);
  const [newSubscriber, setNewSubscriber] = useState({ name: "", email: "" });
  
  const [showBulkActionModal, setShowBulkActionModal] = useState(false);
  const [bulkAction, setBulkAction] = useState(null);
  const [selectedSubscribers, setSelectedSubscribers] = useState([]);
  
  const [showTemplatePreviewModal, setShowTemplatePreviewModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState("csv");
  const [showNewCampaignModal, setShowNewCampaignModal] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const filteredCampaigns = newsletterData.campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  const getStatusBadge = (status) => {
    switch(status) {
      case "sent":
        return { color: "bg-green-100 text-green-700", icon: CheckCircle2, label: "Envoyé" };
      case "scheduled":
        return { color: "bg-blue-100 text-blue-700", icon: Calendar, label: "Programmé" };
      case "draft":
        return { color: "bg-gray-100 text-gray-700", icon: FileText, label: "Brouillon" };
      default:
        return { color: "bg-gray-100 text-gray-700", icon: FileText, label: status };
    }
  };

  const statsCards = [
    { label: "Abonnés totaux", value: newsletterData.stats.totalSubscribers.toLocaleString(), icon: <Users className="text-[#00C0E8]" size={24} />, color: "from-cyan-50 to-blue-50", change: `+${newsletterData.stats.monthlyGrowth}%` },
    { label: "Taux d'ouverture", value: `${newsletterData.stats.averageOpenRate}%`, icon: <Eye className="text-[#00C0E8]" size={22} />, color: "from-green-50 to-emerald-50", change: "+5.2%" },
    { label: "Taux de clic", value: `${newsletterData.stats.averageClickRate}%`, icon: <MousePointerClick className="text-[#00C0E8]" size={22} />, color: "from-purple-50 to-pink-50", change: "+3.8%" },
    { label: "Campagnes", value: newsletterData.stats.totalCampaignsSent, icon: <Send className="text-[#00C0E8]" size={22} />, color: "from-amber-50 to-orange-50", change: "+12%" },
  ];

  const handleViewCampaign = (campaign) => {
    setSelectedCampaign(campaign);
    setShowViewModal(true);
  };

  const handleEditCampaign = (campaign) => {
    setEditingCampaign({ ...campaign });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    setLoading(true);
    setTimeout(() => {
      toast.success("Campagne modifiée avec succès");
      setLoading(false);
      setShowEditModal(false);
    }, 1000);
  };

  const handleScheduleCampaign = (campaign) => {
    setSchedulingCampaign(campaign);
    setScheduleDate(campaign.scheduledDate || "");
    setShowScheduleModal(true);
  };

  const handleConfirmSchedule = () => {
    setLoading(true);
    setTimeout(() => {
      toast.success(`Campagne programmée pour le ${scheduleDate}`);
      setLoading(false);
      setShowScheduleModal(false);
    }, 1000);
  };

  const handleDuplicateCampaign = (campaign) => {
    setDuplicatingCampaign(campaign);
    setDuplicateName(`${campaign.name} (copie)`);
    setShowDuplicateModal(true);
  };

  const handleConfirmDuplicate = () => {
    setLoading(true);
    setTimeout(() => {
      toast.success(`Campagne "${duplicateName}" dupliquée avec succès`);
      setLoading(false);
      setShowDuplicateModal(false);
    }, 1000);
  };

  const handleDeleteCampaign = (campaign) => {
    setDeletingCampaign(campaign);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    setLoading(true);
    setTimeout(() => {
      toast.success(`Campagne "${deletingCampaign?.name}" supprimée`);
      setLoading(false);
      setShowDeleteModal(false);
    }, 1000);
  };

  const handleSendTest = (campaign) => {
    setSelectedCampaign(campaign);
    setTestEmail("");
    setShowSendTestModal(true);
  };

  const handleConfirmSendTest = () => {
    if (!testEmail) {
      toast.error("Veuillez entrer une adresse email");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      toast.success(`Email test envoyé à ${testEmail}`);
      setLoading(false);
      setShowSendTestModal(false);
    }, 1000);
  };

  const handleSubscriberAction = (subscriber, action) => {
    setSelectedSubscriber(subscriber);
    setSubscriberAction(action);
    setShowSubscriberModal(true);
  };

  const handleConfirmSubscriberAction = () => {
    setLoading(true);
    setTimeout(() => {
      const actionMessages = {
        activate: "Abonné activé avec succès",
        deactivate: "Abonné désactivé",
        unsubscribe: "Abonné désabonné",
        delete: "Abonné supprimé"
      };
      toast.success(actionMessages[subscriberAction]);
      setLoading(false);
      setShowSubscriberModal(false);
    }, 1000);
  };

  const handleAddSubscriber = () => {
    if (!newSubscriber.name || !newSubscriber.email) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      toast.success(`Abonné ${newSubscriber.name} ajouté avec succès`);
      setLoading(false);
      setShowAddSubscriberModal(false);
      setNewSubscriber({ name: "", email: "" });
    }, 1000);
  };

  const handleBulkAction = (action) => {
    if (selectedSubscribers.length === 0) {
      toast.error("Veuillez sélectionner au moins un abonné");
      return;
    }
    setBulkAction(action);
    setShowBulkActionModal(true);
  };

  const handleConfirmBulkAction = () => {
    setLoading(true);
    setTimeout(() => {
      toast.success(`${selectedSubscribers.length} abonnés ${bulkAction === "export" ? "exportés" : "supprimés"} avec succès`);
      setLoading(false);
      setShowBulkActionModal(false);
      setSelectedSubscribers([]);
    }, 1000);
  };

  const handleExport = () => {
    setShowExportModal(true);
  };

  const handleConfirmExport = () => {
    setLoading(true);
    setTimeout(() => {
      toast.success(`Export en format ${exportFormat.toUpperCase()} réussi`);
      setLoading(false);
      setShowExportModal(false);
    }, 1000);
  };

  const handleTemplateAction = (template, action) => {
    setSelectedTemplate(template);
    if (action === "preview") {
      setShowTemplatePreviewModal(true);
    } else if (action === "use") {
      toast.success(`Template "${template.name}" chargé avec succès`);
    }
  };

  return (
    <>
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Hero Header */}
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
                    <Mail className="text-white text-2xl" />
                  </div>
                  <span className="text-white/80 text-sm font-medium tracking-wide">NEWSLETTER</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Gestion des Newsletters
                </h1>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <button 
                onClick={() => setShowNewCampaignModal(true)}
                className="bg-white text-[#00C0E8] px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all hover:scale-105 group"
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition" />
                Nouvelle campagne
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Stats Cards - Style comme Bookings */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
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
              <p className="text-xs text-green-600 mt-2">{stat.change}</p>
            </motion.div>
          ))}
        </div>

        {/* Revenue Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-[#00C0E8] to-[#0096b8] rounded-2xl p-6 shadow-lg mb-10"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Taux d'engagement total</p>
              <h3 className="text-3xl font-bold text-white mt-1">{(newsletterData.stats.averageOpenRate + newsletterData.stats.averageClickRate).toFixed(1)}%</h3>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <TrendingUp className="size-6 text-white" />
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("campaigns")}
              className={`px-4 py-2 font-medium transition-all relative ${
                activeTab === "campaigns"
                  ? "text-[#00C0E8] border-b-2 border-[#00C0E8]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <Send className="size-4" />
                Campagnes
              </div>
            </button>
            <button
              onClick={() => setActiveTab("subscribers")}
              className={`px-4 py-2 font-medium transition-all relative ${
                activeTab === "subscribers"
                  ? "text-[#00C0E8] border-b-2 border-[#00C0E8]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="size-4" />
                Abonnés
              </div>
            </button>
            <button
              onClick={() => setActiveTab("templates")}
              className={`px-4 py-2 font-medium transition-all relative ${
                activeTab === "templates"
                  ? "text-[#00C0E8] border-b-2 border-[#00C0E8]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="size-4" />
                Templates
              </div>
            </button>
          </div>
        </div>

        {/* Campagnes Tab */}
        {activeTab === "campaigns" && (
          <>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher une campagne..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C0E8]/20 focus:border-[#00C0E8] transition-all"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C0E8]/20 focus:border-[#00C0E8] transition-all"
              >
                <option value="all">Tous les statuts</option>
                <option value="sent">Envoyées</option>
                <option value="scheduled">Programmées</option>
                <option value="draft">Brouillons</option>
              </select>
              <button onClick={handleExport} className="px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-2">
                <Download className="w-4 h-4" />
                Exporter
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCampaigns.map((campaign, idx) => {
                const StatusBadge = getStatusBadge(campaign.status);
                const StatusIcon = StatusBadge.icon;
                
                return (
                  <motion.div
                    key={campaign.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col h-full"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={campaign.image} 
                        alt={campaign.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                      <div className="absolute top-4 right-4">
                        <div className="backdrop-blur-md bg-white/90 px-3 py-1 rounded-full shadow-lg">
                          <span className={`inline-flex items-center gap-1 text-xs font-semibold ${StatusBadge.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {StatusBadge.label}
                          </span>
                        </div>
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <div className="backdrop-blur-md bg-black/50 px-3 py-1.5 rounded-lg">
                          <div className="flex items-center gap-2 text-white">
                            <Users className="w-3 h-3" />
                            <span className="text-sm font-semibold">{campaign.recipients.toLocaleString()} destinataires</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-grow">
                      <h3 className="font-bold text-gray-800 text-xl group-hover:text-[#00C0E8] transition">
                        {campaign.name}
                      </h3>
                      <p className="text-gray-500 text-sm line-clamp-2 mb-3 flex-grow">
                        {campaign.subject}
                      </p>

                      {campaign.status === "sent" && (
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Ouverture</span>
                            <span className="font-semibold text-gray-700">{campaign.openRate}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className="bg-green-500 rounded-full h-1.5" style={{ width: `${campaign.openRate}%` }}></div>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Clics</span>
                            <span className="font-semibold text-gray-700">{campaign.clickRate}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className="bg-purple-500 rounded-full h-1.5" style={{ width: `${campaign.clickRate}%` }}></div>
                          </div>
                        </div>
                      )}

                      {campaign.status === "scheduled" && (
                        <div className="mb-4 p-3 bg-amber-50 rounded-xl">
                          <div className="flex items-center gap-2 text-amber-600">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm font-medium">Programmé le {campaign.scheduledDate}</span>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={() => handleViewCampaign(campaign)}
                          className="flex-1 py-2.5 rounded-xl bg-gray-50 text-gray-700 text-sm font-semibold hover:bg-[#00C0E8] hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Voir
                        </button>
                        {campaign.status === "draft" && (
                          <>
                            <button
                              onClick={() => handleEditCampaign(campaign)}
                              className="flex-1 py-2.5 rounded-xl bg-gray-50 text-gray-700 text-sm font-semibold hover:bg-[#00C0E8] hover:text-white transition-all"
                            >
                              <Edit2 className="w-4 h-4 inline mr-1" />
                              Modifier
                            </button>
                            <button
                              onClick={() => handleSendTest(campaign)}
                              className="px-4 py-2.5 rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-500 hover:text-white transition-all"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {campaign.status === "scheduled" && (
                          <>
                            <button
                              onClick={() => handleScheduleCampaign(campaign)}
                              className="flex-1 py-2.5 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white transition-all"
                            >
                              <Clock className="w-4 h-4 inline mr-1" />
                              Modifier
                            </button>
                            <button
                              onClick={() => handleDeleteCampaign(campaign)}
                              className="px-4 py-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-500 hover:text-white transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {campaign.status === "sent" && (
                          <>
                            <button
                              onClick={() => handleDuplicateCampaign(campaign)}
                              className="flex-1 py-2.5 rounded-xl bg-green-50 text-green-600 hover:bg-green-500 hover:text-white transition-all"
                            >
                              <Copy className="w-4 h-4 inline mr-1" />
                              Dupliquer
                            </button>
                            <button
                              onClick={() => handleSendTest(campaign)}
                              className="px-4 py-2.5 rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-500 hover:text-white transition-all"
                            >
                              <Mail className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}

        {/* Subscribers Tab */}
        {activeTab === "subscribers" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un abonné..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C0E8]/20 focus:border-[#00C0E8] transition-all"
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleBulkAction("export")} className="px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Exporter CSV
                  </button>
                  <button onClick={() => setShowAddSubscriberModal(true)} className="px-4 py-2.5 bg-[#00C0E8] text-white rounded-xl hover:bg-[#0099cc] transition-all flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Ajouter
                  </button>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Abonné</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Statut</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Inscrit le</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Ouvertures</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Clics</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {newsletterData.subscribers.map((subscriber) => (
                    <tr key={subscriber.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-[#00C0E8] to-[#0099cc] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {subscriber.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{subscriber.name}</p>
                            <p className="text-xs text-gray-400">ID: #{subscriber.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{subscriber.email}</td>
                      <td className="px-6 py-4">
                        {subscriber.status === "active" && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                            <CheckCircle2 className="w-3 h-3" />
                            Actif
                          </span>
                        )}
                        {subscriber.status === "inactive" && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                            <AlertCircle className="w-3 h-3" />
                            Inactif
                          </span>
                        )}
                        {subscriber.status === "unsubscribed" && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                            <XCircle className="w-3 h-3" />
                            Désabonné
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{subscriber.subscribedDate}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">{subscriber.opens}</span>
                          {subscriber.opens > 20 && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{subscriber.clicks}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {subscriber.status === "active" && (
                            <button onClick={() => handleSubscriberAction(subscriber, "deactivate")} className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors">
                              <Ban className="w-4 h-4" />
                            </button>
                          )}
                          {subscriber.status === "inactive" && (
                            <button onClick={() => handleSubscriberAction(subscriber, "activate")} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                              <UserCheck className="w-4 h-4" />
                            </button>
                          )}
                          {subscriber.status !== "unsubscribed" && (
                            <button onClick={() => handleSubscriberAction(subscriber, "unsubscribe")} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                              <MailX className="w-4 h-4" />
                            </button>
                          )}
                          <button onClick={() => handleSubscriberAction(subscriber, "delete")} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === "templates" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsletterData.templates.map((template, idx) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col h-full"
              >
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img 
                    src={template.thumbnail} 
                    alt={template.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <div className="backdrop-blur-md bg-black/50 px-3 py-1.5 rounded-lg">
                      <span className="text-white font-semibold text-sm">{template.name}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <p className="text-gray-500 text-sm mb-4">Template prêt à l'emploi pour vos campagnes email</p>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleTemplateAction(template, "preview")}
                      className="flex-1 py-2.5 rounded-xl bg-gray-50 text-gray-700 text-sm font-semibold hover:bg-[#00C0E8] hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Aperçu
                    </button>
                    <button
                      onClick={() => handleTemplateAction(template, "use")}
                      className="flex-1 py-2.5 rounded-xl bg-[#00C0E8] text-white text-sm font-semibold hover:bg-[#0099cc] transition-all"
                    >
                      <Plus className="w-4 h-4 inline mr-1" />
                      Utiliser
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Rest of modals remain the same */}
      {/* View Campaign Modal */}
      {showViewModal && selectedCampaign && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 sticky top-0 bg-white">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-50 rounded-xl">
                    <Eye className="w-5 h-5 text-[#00C0E8]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Aperçu de la campagne</h3>
                    <p className="text-sm text-gray-500">{selectedCampaign.name}</p>
                  </div>
                </div>
                <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <img src={selectedCampaign.image} alt={selectedCampaign.name} className="w-full h-64 object-cover rounded-xl" />
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Objet</p>
                <p className="text-gray-900">{selectedCampaign.subject}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Contenu</p>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-700">Contenu de la campagne {selectedCampaign.name}...</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Destinataires</p>
                  <p className="font-semibold">{selectedCampaign.recipients.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Statut</p>
                  <p className="font-semibold capitalize">{selectedCampaign.status}</p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end">
              <button onClick={() => setShowViewModal(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Campaign Modal */}
      {showEditModal && editingCampaign && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Edit2 className="w-5 h-5 text-[#00C0E8]" />
                  <h3 className="text-lg font-semibold text-gray-900">Modifier la campagne</h3>
                </div>
                <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Nom</label>
                <input type="text" value={editingCampaign.name} onChange={(e) => setEditingCampaign({...editingCampaign, name: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Objet</label>
                <input type="text" value={editingCampaign.subject} onChange={(e) => setEditingCampaign({...editingCampaign, subject: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl" />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setShowEditModal(false)} className="px-4 py-2 border border-gray-200 rounded-xl">Annuler</button>
              <button onClick={handleSaveEdit} disabled={loading} className="px-4 py-2 bg-[#00C0E8] text-white rounded-xl hover:bg-[#0099cc] flex items-center gap-2">
                {loading && <Loader className="w-4 h-4 animate-spin" />}
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && schedulingCampaign && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-semibold text-gray-900">Programmer la campagne</h3>
              </div>
            </div>
            <div className="p-6">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Date de programmation</label>
              <input type="datetime-local" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-xl" />
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setShowScheduleModal(false)} className="px-4 py-2 border border-gray-200 rounded-xl">Annuler</button>
              <button onClick={handleConfirmSchedule} disabled={loading} className="px-4 py-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600 flex items-center gap-2">
                {loading && <Loader className="w-4 h-4 animate-spin" />}
                Programmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Duplicate Modal */}
      {showDuplicateModal && duplicatingCampaign && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Copy className="w-5 h-5 text-green-500" />
                <h3 className="text-lg font-semibold text-gray-900">Dupliquer la campagne</h3>
              </div>
            </div>
            <div className="p-6">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Nom de la copie</label>
              <input type="text" value={duplicateName} onChange={(e) => setDuplicateName(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-xl" />
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setShowDuplicateModal(false)} className="px-4 py-2 border border-gray-200 rounded-xl">Annuler</button>
              <button onClick={handleConfirmDuplicate} disabled={loading} className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 flex items-center gap-2">
                {loading && <Loader className="w-4 h-4 animate-spin" />}
                Dupliquer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && deletingCampaign && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <h3 className="text-lg font-semibold text-gray-900">Confirmer la suppression</h3>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600">Êtes-vous sûr de vouloir supprimer la campagne <span className="font-semibold">"{deletingCampaign.name}"</span> ?</p>
              <p className="text-sm text-red-500 mt-2">Cette action est irréversible.</p>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 border border-gray-200 rounded-xl">Annuler</button>
              <button onClick={handleConfirmDelete} disabled={loading} className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 flex items-center gap-2">
                {loading && <Loader className="w-4 h-4 animate-spin" />}
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Test Email Modal */}
      {showSendTestModal && selectedCampaign && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-purple-500" />
                <h3 className="text-lg font-semibold text-gray-900">Envoyer un email test</h3>
              </div>
            </div>
            <div className="p-6">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Adresse email</label>
              <input type="email" value={testEmail} onChange={(e) => setTestEmail(e.target.value)} placeholder="test@example.com" className="w-full px-4 py-2 border border-gray-200 rounded-xl" />
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setShowSendTestModal(false)} className="px-4 py-2 border border-gray-200 rounded-xl">Annuler</button>
              <button onClick={handleConfirmSendTest} disabled={loading} className="px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 flex items-center gap-2">
                {loading && <Loader className="w-4 h-4 animate-spin" />}
                Envoyer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subscriber Action Modal */}
      {showSubscriberModal && selectedSubscriber && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                {subscriberAction === "activate" && <UserCheck className="w-5 h-5 text-green-500" />}
                {subscriberAction === "deactivate" && <Ban className="w-5 h-5 text-yellow-500" />}
                {subscriberAction === "unsubscribe" && <MailX className="w-5 h-5 text-red-500" />}
                {subscriberAction === "delete" && <Trash2 className="w-5 h-5 text-red-500" />}
                <h3 className="text-lg font-semibold text-gray-900">
                  {subscriberAction === "activate" && "Activer l'abonné"}
                  {subscriberAction === "deactivate" && "Désactiver l'abonné"}
                  {subscriberAction === "unsubscribe" && "Désabonner"}
                  {subscriberAction === "delete" && "Supprimer l'abonné"}
                </h3>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600">
                {subscriberAction === "activate" && `Êtes-vous sûr de vouloir réactiver ${selectedSubscriber.name} ?`}
                {subscriberAction === "deactivate" && `Êtes-vous sûr de vouloir désactiver ${selectedSubscriber.name} ?`}
                {subscriberAction === "unsubscribe" && `Êtes-vous sûr de vouloir désabonner ${selectedSubscriber.name} ?`}
                {subscriberAction === "delete" && `Êtes-vous sûr de vouloir supprimer ${selectedSubscriber.name} ?`}
              </p>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setShowSubscriberModal(false)} className="px-4 py-2 border border-gray-200 rounded-xl">Annuler</button>
              <button onClick={handleConfirmSubscriberAction} disabled={loading} className="px-4 py-2 bg-[#00C0E8] text-white rounded-xl hover:bg-[#0099cc] flex items-center gap-2">
                {loading && <Loader className="w-4 h-4 animate-spin" />}
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Subscriber Modal */}
      {showAddSubscriberModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#00C0E8]" />
                <h3 className="text-lg font-semibold text-gray-900">Ajouter un abonné</h3>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Nom complet</label>
                <input type="text" value={newSubscriber.name} onChange={(e) => setNewSubscriber({...newSubscriber, name: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                <input type="email" value={newSubscriber.email} onChange={(e) => setNewSubscriber({...newSubscriber, email: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl" />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setShowAddSubscriberModal(false)} className="px-4 py-2 border border-gray-200 rounded-xl">Annuler</button>
              <button onClick={handleAddSubscriber} disabled={loading} className="px-4 py-2 bg-[#00C0E8] text-white rounded-xl hover:bg-[#0099cc] flex items-center gap-2">
                {loading && <Loader className="w-4 h-4 animate-spin" />}
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Action Modal */}
      {showBulkActionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                {bulkAction === "export" && <Download className="w-5 h-5 text-green-500" />}
                {bulkAction === "delete" && <Trash2 className="w-5 h-5 text-red-500" />}
                <h3 className="text-lg font-semibold text-gray-900">
                  {bulkAction === "export" ? "Exporter les abonnés" : "Supprimer les abonnés"}
                </h3>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600">
                {bulkAction === "export" 
                  ? `Vous allez exporter ${selectedSubscribers.length} abonnés.`
                  : `Êtes-vous sûr de vouloir supprimer ${selectedSubscribers.length} abonnés ?`
                }
              </p>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setShowBulkActionModal(false)} className="px-4 py-2 border border-gray-200 rounded-xl">Annuler</button>
              <button onClick={handleConfirmBulkAction} disabled={loading} className={`px-4 py-2 rounded-xl flex items-center gap-2 ${bulkAction === "export" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"} text-white`}>
                {loading && <Loader className="w-4 h-4 animate-spin" />}
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Template Preview Modal */}
      {showTemplatePreviewModal && selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 sticky top-0 bg-white">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-[#00C0E8]" />
                  <h3 className="text-lg font-semibold text-gray-900">Aperçu du template</h3>
                </div>
                <button onClick={() => setShowTemplatePreviewModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <img src={selectedTemplate.thumbnail} alt={selectedTemplate.name} className="w-full rounded-xl" />
              <h4 className="text-xl font-bold text-gray-900 mt-4">{selectedTemplate.name}</h4>
              <p className="text-gray-500 mt-2">Template prêt à l'emploi pour vos campagnes email.</p>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-[#00C0E8]" />
                <h3 className="text-lg font-semibold text-gray-900">Exporter les données</h3>
              </div>
            </div>
            <div className="p-6">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Format d'export</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input type="radio" value="csv" checked={exportFormat === "csv"} onChange={(e) => setExportFormat(e.target.value)} className="text-[#00C0E8]" />
                  <span>CSV</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" value="excel" checked={exportFormat === "excel"} onChange={(e) => setExportFormat(e.target.value)} className="text-[#00C0E8]" />
                  <span>Excel</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" value="pdf" checked={exportFormat === "pdf"} onChange={(e) => setExportFormat(e.target.value)} className="text-[#00C0E8]" />
                  <span>PDF</span>
                </label>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setShowExportModal(false)} className="px-4 py-2 border border-gray-200 rounded-xl">Annuler</button>
              <button onClick={handleConfirmExport} disabled={loading} className="px-4 py-2 bg-[#00C0E8] text-white rounded-xl hover:bg-[#0099cc] flex items-center gap-2">
                {loading && <Loader className="w-4 h-4 animate-spin" />}
                Exporter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    <NouvelleCampagne 
      isOpen={showNewCampaignModal}
      onClose={() => setShowNewCampaignModal(false)}
      onSuccess={(data) => {
        console.log("Campagne créée:", data);
      }}
    />
    </>
  );
}