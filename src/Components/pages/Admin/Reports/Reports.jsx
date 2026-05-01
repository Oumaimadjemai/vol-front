import { useState } from "react";
import {
  Flag,
  AlertTriangle,
  Bug,
  MessageCircle,
  FileText,
  Clock,
  CheckCircle2,
  Search,
  RefreshCw,
  User,
  Mail,
  Calendar,
  Download,
  MessageSquare,
  ThumbsUp,
  Shield,
  Send,
  Reply,
  X,
  Archive,
  HelpCircle,
  ImageIcon,
  Phone,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const reportsData = {
  reports: [
    {
      id: 1,
      client: {
        name: "Jean Dupont",
        email: "jean.dupont@email.com",
        avatar: "JD",
        type: "voyageur",
        phone: "+213 551 234 567"
      },
      title: "Problème de connexion à l'application",
      description: "Bonjour, je n'arrive pas à me connecter à l'application depuis 2 jours. J'ai essayé de réinitialiser mon mot de passe mais je ne reçois pas l'email. Pouvez-vous m'aider ?",
      type: "technical",
      priority: "high",
      status: "pending",
      date: "2026-04-28T10:30:00",
      lastUpdate: "2026-04-28T10:30:00",
      attachments: [
        { name: "screenshot_error.png", size: "1.2 MB", url: "#", type: "image" }
      ],
      responses: [],
      relatedBookings: ["RES-2024-00123"],
      assignedTo: null,
      resolution: null
    },
    {
      id: 2,
      client: {
        name: "Marie Martin",
        email: "marie.martin@email.com",
        avatar: "MM",
        type: "voyageur",
        phone: "+213 552 345 678"
      },
      title: "Réclamation concernant le vol Paris-Dubaï",
      description: "Mon vol Paris-Dubaï du 15 avril a été annulé sans préavis. J'ai été réacheminé sur un vol avec 8 heures de retard. Je souhaite demander une compensation.",
      type: "complaint",
      priority: "urgent",
      status: "in_progress",
      date: "2026-04-20T15:45:00",
      lastUpdate: "2026-04-22T09:00:00",
      attachments: [
        { name: "boarding_pass.pdf", size: "0.8 MB", url: "#", type: "pdf" },
        { name: "confirmation_email.pdf", size: "0.5 MB", url: "#", type: "pdf" }
      ],
      responses: [
        {
          id: 101,
          sender: "Support Traveling",
          message: "Bonjour Marie, nous avons bien reçu votre réclamation. Notre équipe va analyser votre dossier et vous reviendra dans les plus brefs délais. Merci de votre patience.",
          date: "2026-04-21T14:30:00",
          isAgent: true
        },
        {
          id: 102,
          sender: "Marie Martin",
          message: "Merci pour votre retour. J'attends votre analyse avec impatience.",
          date: "2026-04-21T16:00:00",
          isAgent: false
        }
      ],
      relatedBookings: ["RES-2024-00456"],
      assignedTo: "Sophie Admin",
      resolution: null
    },
    {
      id: 3,
      client: {
        name: "Pierre Bernard",
        email: "pierre.bernard@email.com",
        avatar: "PB",
        type: "voyageur",
        phone: "+213 553 456 789"
      },
      title: "Question sur les formalités visa",
      description: "Je prévois un voyage à Dubaï en juin. Pouvez-vous me renseigner sur les formalités de visa pour les citoyens algériens ? Quels sont les délais et les documents nécessaires ?",
      type: "question",
      priority: "normal",
      status: "resolved",
      date: "2026-04-15T09:15:00",
      lastUpdate: "2026-04-18T11:00:00",
      attachments: [],
      responses: [
        {
          id: 103,
          sender: "Visa Support",
          message: "Bonjour Pierre, pour voyager à Dubaï, les citoyens algériens ont besoin d'un visa touristique. Les délais sont de 5 à 7 jours ouvrés. Documents requis: passeport (validité 6 mois), photo d'identité, réservation d'hôtel, billet d'avion (aller-retour).",
          date: "2026-04-16T10:00:00",
          isAgent: true
        },
        {
          id: 104,
          sender: "Pierre Bernard",
          message: "Super, merci beaucoup pour ces informations !",
          date: "2026-04-18T11:00:00",
          isAgent: false
        }
      ],
      relatedBookings: [],
      assignedTo: "Visa Team",
      resolution: "Informations visa fournies au client"
    },
    {
      id: 4,
      client: {
        name: "Sophie Laurent",
        email: "sophie.laurent@email.com",
        avatar: "SL",
        type: "voyageur",
        phone: "+213 554 567 890"
      },
      title: "Suggestion pour améliorer l'application",
      description: "Je suggestion d'ajouter une fonctionnalité de notification push pour les offres spéciales. Cela permettrait aux clients d'être informés en temps réel des promotions.",
      type: "suggestion",
      priority: "low",
      status: "closed",
      date: "2026-04-10T14:20:00",
      lastUpdate: "2026-04-25T00:00:00",
      attachments: [],
      responses: [
        {
          id: 105,
          sender: "Product Team",
          message: "Merci Sophie pour cette excellente suggestion ! Nous allons l'étudier pour une prochaine version de l'application.",
          date: "2026-04-25T00:00:00",
          isAgent: true
        }
      ],
      relatedBookings: [],
      assignedTo: "Product Team",
      resolution: "Suggestion acceptée pour étude"
    },
    {
      id: 5,
      client: {
        name: "Luc Moreau",
        email: "luc.moreau@email.com",
        avatar: "LM",
        type: "voyageur",
        phone: "+213 555 678 901"
      },
      title: "Bug sur la page de paiement",
      description: "Quand j'essaie de payer avec ma carte bancaire, j'obtiens une erreur 'transaction refusée' alors que ma banque confirme que le paiement est accepté. Voici une capture d'écran.",
      type: "technical",
      priority: "high",
      status: "in_progress",
      date: "2026-04-27T10:00:00",
      lastUpdate: "2026-04-27T14:30:00",
      attachments: [
        { name: "payment_error.jpg", size: "0.9 MB", url: "#", type: "image" }
      ],
      responses: [
        {
          id: 106,
          sender: "Technical Support",
          message: "Nous avons identifié le problème. Notre équipe technique travaille sur une solution. Nous vous tiendrons informé.",
          date: "2026-04-27T14:30:00",
          isAgent: true
        }
      ],
      relatedBookings: [],
      assignedTo: "Technical Team",
      resolution: null
    }
  ],
  stats: {
    total: 5,
    pending: 1,
    inProgress: 2,
    resolved: 1,
    closed: 1,
    averageResponseTime: "2.5 heures",
    satisfactionRate: 92,
    byType: {
      technical: 2,
      complaint: 1,
      question: 1,
      suggestion: 1
    }
  }
};

const reportTypes = [
  { id: "all", label: "Tous", icon: FileText, color: "from-gray-500 to-gray-600" },
  { id: "technical", label: "Problème technique", icon: Bug, color: "from-orange-500 to-orange-600" },
  { id: "complaint", label: "Réclamation", icon: AlertTriangle, color: "from-red-500 to-red-600" },
  { id: "question", label: "Question", icon: HelpCircle, color: "from-blue-500 to-blue-600" },
  { id: "suggestion", label: "Suggestion", icon: MessageCircle, color: "from-green-500 to-green-600" }
];

const statusConfig = {
  pending: { label: "En attente", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  in_progress: { label: "En cours", color: "bg-blue-100 text-blue-700", icon: RefreshCw },
  resolved: { label: "Résolu", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  closed: { label: "Fermé", color: "bg-gray-100 text-gray-700", icon: Archive }
};

export function Reports() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedReport, setSelectedReport] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [responseText, setResponseText] = useState("");
  const [showResponse, setShowResponse] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showResolutionModal, setShowResolutionModal] = useState(false);
  const [resolutionText, setResolutionText] = useState("");
  const [assignToModal, setAssignToModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState("");
  
  const agents = ["Sophie Admin", "Technical Team", "Visa Support", "Product Team", "Billing Team"];

  const statsCards = [
    { label: "Total rapports", value: reportsData.stats.total, icon: <FileText className="text-[#00C0E8]" size={24} />, color: "from-cyan-50 to-blue-50" },
    { label: "Temps réponse moyen", value: reportsData.stats.averageResponseTime, icon: <Clock className="text-[#00C0E8]" size={22} />, color: "from-green-50 to-emerald-50" },
    { label: "Satisfaction", value: `${reportsData.stats.satisfactionRate}%`, icon: <ThumbsUp className="text-[#00C0E8]" size={22} />, color: "from-purple-50 to-pink-50" },
    { label: "En cours", value: reportsData.stats.inProgress, icon: <RefreshCw className="text-[#00C0E8]" size={22} />, color: "from-blue-50 to-indigo-50" },
  ];

  const getFilteredReports = () => {
    let filtered = reportsData.reports;
    
    if (activeTab !== "all") {
      filtered = filtered.filter(r => r.status === activeTab);
    }
    if (selectedType !== "all") {
      filtered = filtered.filter(r => r.type === selectedType);
    }
    if (selectedStatus !== "all") {
      filtered = filtered.filter(r => r.status === selectedStatus);
    }
    if (searchTerm) {
      filtered = filtered.filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  };

  const handleSendResponse = async () => {
    if (!responseText.trim()) {
      toast.error("Veuillez écrire votre réponse");
      return;
    }
    setIsSending(true);
    setTimeout(() => {
      toast.success("Réponse envoyée avec succès");
      setResponseText("");
      setShowResponse(false);
      setIsSending(false);
    }, 1000);
  };

  const handleUpdateStatus = (report, newStatus) => {
    report.status = newStatus;
    toast.success(`Statut mis à jour: ${statusConfig[newStatus].label}`);
  };

  const handleAssign = () => {
    if (!selectedAgent) {
      toast.error("Veuillez sélectionner un agent");
      return;
    }
    selectedReport.assignedTo = selectedAgent;
    toast.success(`Report assigné à ${selectedAgent}`);
    setAssignToModal(false);
    setSelectedAgent("");
  };

  const handleResolve = () => {
    if (!resolutionText.trim()) {
      toast.error("Veuillez décrire la résolution");
      return;
    }
    selectedReport.resolution = resolutionText;
    selectedReport.status = "resolved";
    toast.success("Report marqué comme résolu");
    setShowResolutionModal(false);
    setResolutionText("");
  };

  const getTypeIcon = (type) => {
    const typeConfig = reportTypes.find(t => t.id === type);
    if (typeConfig) {
      const Icon = typeConfig.icon;
      return <Icon className={`w-4 h-4 text-${typeConfig.color.split('-')[1]}-500`} />;
    }
    return <FileText className="w-4 h-4 text-gray-400" />;
  };

  const reports = getFilteredReports();
  const stats = reportsData.stats;
  const statuses = ["pending", "in_progress", "resolved", "closed"];

  return (
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
                    <Flag className="text-white text-2xl" />
                  </div>
                  <span className="text-white/80 text-sm font-medium tracking-wide">SUPPORT CLIENT</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Rapports clients
                </h1>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <button className="bg-white text-[#00C0E8] px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all hover:scale-105 group">
                <Download className="w-5 h-5 group-hover:rotate-12 transition" />
                Exporter les rapports
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Stats Cards */}
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
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par titre, client ou description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C0E8]/20 focus:border-[#00C0E8] transition-all"
            />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C0E8]/20 focus:border-[#00C0E8]"
          >
            <option value="all">Tous les types</option>
            <option value="technical">Problème technique</option>
            <option value="complaint">Réclamation</option>
            <option value="question">Question</option>
            <option value="suggestion">Suggestion</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C0E8]/20 focus:border-[#00C0E8]"
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="in_progress">En cours</option>
            <option value="resolved">Résolu</option>
            <option value="closed">Fermé</option>
          </select>
          <button className="px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Actualiser
          </button>
        </div>

        {/* Status Tabs */}
        <div className="flex gap-2 overflow-x-auto border-b border-gray-200 pb-2 mb-6">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === "all"
                ? "bg-[#00C0E8] text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Tous ({stats.total})
          </button>
          {statuses.map(status => {
            const Icon = statusConfig[status].icon;
            return (
              <button
                key={status}
                onClick={() => setActiveTab(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  activeTab === status
                    ? statusConfig[status].color.replace("text-", "bg-") + " text-" + statusConfig[status].color.split(" ")[1]
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                {statusConfig[status].label} ({reportsData.reports.filter(r => r.status === status).length})
              </button>
            );
          })}
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {reports.map((report, idx) => {
            const StatusIcon = statusConfig[report.status].icon;
            return (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setSelectedReport(report)}
                className={`bg-white rounded-2xl border p-5 cursor-pointer transition-all hover:shadow-lg ${
                  selectedReport?.id === report.id
                    ? "border-[#00C0E8] shadow-md"
                    : "border-gray-100"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(report.type)}
                    <span className="text-xs font-medium text-gray-500">
                      {reportTypes.find(t => t.id === report.type)?.label}
                    </span>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig[report.status].color}`}>
                    <StatusIcon className="w-3 h-3" />
                    {statusConfig[report.status].label}
                  </span>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2">{report.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{report.description}</p>
                
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {report.client.name}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(report.date).toLocaleDateString('fr-FR')}
                  </div>
                  {report.responses.length > 0 && (
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      {report.responses.length} réponse(s)
                    </div>
                  )}
                </div>
                
                {report.assignedTo && (
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Shield className="w-3 h-3" />
                    Assigné à: {report.assignedTo}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Report Detail Modal (same structure but with improved styling) */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 sticky top-0 bg-white">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-[#00C0E8] to-[#0099cc] rounded-xl">
                    {getTypeIcon(selectedReport.type)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedReport.title}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[selectedReport.status].color}`}>
                        {(() => {
                          const Icon = statusConfig[selectedReport.status].icon;
                          return <Icon className="w-3 h-3" />;
                        })()}
                        {statusConfig[selectedReport.status].label}
                      </span>
                      <span className="text-xs text-gray-400">
                        #{selectedReport.id} • {new Date(selectedReport.date).toLocaleString('fr-FR')}
                      </span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedReport(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Client Info */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100">
                <p className="text-sm font-medium text-gray-700 mb-3">Informations client</p>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="w-4 h-4 text-[#00C0E8]" />
                    {selectedReport.client.name}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4 text-[#00C0E8]" />
                    {selectedReport.client.email}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4 text-[#00C0E8]" />
                    {selectedReport.client.phone}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Description</p>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedReport.description}</p>
                </div>
              </div>

              {/* Attachments */}
              {selectedReport.attachments?.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Pièces jointes</p>
                  <div className="flex gap-2">
                    {selectedReport.attachments.map((file, idx) => (
                      <a
                        key={idx}
                        href={file.url}
                        className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                      >
                        {file.type === "image" ? <ImageIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                        <span>{file.name}</span>
                        <span className="text-xs text-gray-400">({file.size})</span>
                        <Download className="w-4 h-4 text-gray-400" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Responses Thread */}
              {selectedReport.responses?.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">Historique des échanges</p>
                  <div className="space-y-3">
                    {selectedReport.responses.map((response) => (
                      <div
                        key={response.id}
                        className={`p-4 rounded-xl ${
                          response.isAgent
                            ? "bg-gradient-to-r from-[#00C0E8]/5 to-transparent border-l-4 border-l-[#00C0E8]"
                            : "bg-gray-50"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <p className={`font-medium ${response.isAgent ? "text-[#00C0E8]" : "text-gray-700"}`}>
                            {response.sender}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(response.date).toLocaleString('fr-FR')}
                          </p>
                        </div>
                        <p className="text-gray-600 text-sm">{response.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Resolution */}
              {selectedReport.resolution && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                  <p className="text-sm font-medium text-green-800 mb-1">Résolution</p>
                  <p className="text-green-700 text-sm">{selectedReport.resolution}</p>
                </div>
              )}

              {/* Actions */}
              <div className="pt-4 border-t border-gray-100">
                {!showResponse ? (
                  <div className="flex gap-3 flex-wrap">
                    <button
                      onClick={() => setShowResponse(true)}
                      className="px-4 py-2 bg-gradient-to-r from-[#00C0E8] to-[#0099cc] text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                    >
                      <Reply className="w-4 h-4" />
                      Répondre
                    </button>
                    {selectedReport.status !== "resolved" && selectedReport.status !== "closed" && (
                      <>
                        <button
                          onClick={() => setAssignToModal(true)}
                          className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-2"
                        >
                          <User className="w-4 h-4" />
                          Assigner
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(selectedReport, "in_progress")}
                          className="px-4 py-2 border border-blue-200 text-blue-600 rounded-xl hover:bg-blue-50 transition-all"
                        >
                          Prendre en charge
                        </button>
                        <button
                          onClick={() => setShowResolutionModal(true)}
                          className="px-4 py-2 border border-green-200 text-green-600 rounded-xl hover:bg-green-50 transition-all"
                        >
                          <CheckCircle2 className="w-4 h-4 inline mr-2" />
                          Résoudre
                        </button>
                      </>
                    )}
                    {selectedReport.status === "resolved" && (
                      <button
                        onClick={() => handleUpdateStatus(selectedReport, "closed")}
                        className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all"
                      >
                        <Archive className="w-4 h-4 inline mr-2" />
                        Fermer
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <textarea
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      placeholder="Écrivez votre réponse..."
                      rows={4}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C0E8]/20 focus:border-[#00C0E8] transition-all resize-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSendResponse}
                        disabled={isSending}
                        className="px-4 py-2 bg-gradient-to-r from-[#00C0E8] to-[#0099cc] text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                      >
                        {isSending && <RefreshCw className="w-4 h-4 animate-spin" />}
                        <Send className="w-4 h-4" />
                        Envoyer
                      </button>
                      <button
                        onClick={() => setShowResponse(false)}
                        className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign to Agent Modal */}
      {assignToModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Assigner à un agent</h3>
                <button onClick={() => setAssignToModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Sélectionner un agent</label>
              <select
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C0E8]/20"
              >
                <option value="">-- Choisir un agent --</option>
                {agents.map(agent => (
                  <option key={agent} value={agent}>{agent}</option>
                ))}
              </select>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setAssignToModal(false)} className="px-4 py-2 border border-gray-200 rounded-xl">Annuler</button>
              <button onClick={handleAssign} className="px-4 py-2 bg-gradient-to-r from-[#00C0E8] to-[#0099cc] text-white rounded-xl">Assigner</button>
            </div>
          </div>
        </div>
      )}

      {/* Resolution Modal */}
      {showResolutionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Décrire la résolution</h3>
                <button onClick={() => setShowResolutionModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <textarea
                value={resolutionText}
                onChange={(e) => setResolutionText(e.target.value)}
                placeholder="Décrivez comment le problème a été résolu..."
                rows={4}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C0E8]/20"
              />
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setShowResolutionModal(false)} className="px-4 py-2 border border-gray-200 rounded-xl">Annuler</button>
              <button onClick={handleResolve} className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl">Résoudre</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}