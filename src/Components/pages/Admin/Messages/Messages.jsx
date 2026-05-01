import { useState } from "react";
import { 
  Mail, 
  Inbox, 
  Send, 
  Archive, 
  Trash2, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  Search,
  RefreshCw,
  Reply,
  Paperclip,
  Image as ImageIcon,
  Link as LinkIcon,
  Phone,
  Calendar,
  MapPin,
  FileText,
  Download,
  X,
  Archive as ArchiveIcon,
  MailOpen,
  MailX,
  Plus,
  Trash2 as Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const messagesData = {
  inbox: [
    {
      id: 1,
      sender: {
        name: "Jean Dupont",
        email: "jean.dupont@email.com",
        avatar: "JD",
        type: "voyageur",
        phone: "+213 551 234 567",
        location: "Algiers, Algeria",
        memberSince: "2024-01-15"
      },
      subject: "Question sur mon vol Paris - Tokyo",
      message: "Bonjour, j'ai réservé un vol pour Tokyo le 15 juillet. Je souhaiterais savoir si je peux ajouter un bagage supplémentaire et quel serait le coût. Merci d'avance pour votre réponse.",
      date: "2026-04-28T10:30:00",
      status: "unread",
      priority: "high",
      category: "booking",
      attachments: [],
      responses: [
        {
          id: 101,
          sender: "Support Traveling",
          message: "Bonjour Jean, nous avons bien reçu votre demande. Pouvez-vous nous fournir votre numéro de réservation ?",
          date: "2026-04-28T14:20:00",
          isAgent: true
        }
      ]
    },
    {
      id: 2,
      sender: {
        name: "Marie Martin",
        email: "marie.martin@email.com",
        avatar: "MM",
        type: "voyageur",
        phone: "+213 552 345 678",
        location: "Oran, Algeria",
        memberSince: "2024-02-20"
      },
      subject: "Annulation de réservation",
      message: "Je dois annuler mon voyage à Dubaï prévu le 10 mai pour raisons médicales. Quelles sont les conditions d'annulation et de remboursement ?",
      date: "2026-04-27T15:45:00",
      status: "read",
      priority: "urgent",
      category: "cancellation",
      attachments: [
        { name: "certificat_medical.pdf", size: "1.2 MB", url: "#" }
      ],
      responses: []
    },
    {
      id: 3,
      sender: {
        name: "Pierre Bernard",
        email: "pierre.bernard@email.com",
        avatar: "PB",
        type: "voyageur",
        phone: "+213 553 456 789",
        location: "Constantine, Algeria",
        memberSince: "2024-03-10"
      },
      subject: "Problème de paiement",
      message: "J'ai essayé de payer ma réservation plusieurs fois mais le paiement échoue. J'ai vérifié mes coordonnées bancaires, tout semble correct. Pouvez-vous m'aider ?",
      date: "2026-04-26T09:15:00",
      status: "read",
      priority: "high",
      category: "payment",
      attachments: [],
      responses: [
        {
          id: 102,
          sender: "Support Traveling",
          message: "Bonjour Pierre, nous avons vérifié notre système. Pouvez-vous réessayer avec une autre carte ou nous contacter par téléphone ?",
          date: "2026-04-26T11:30:00",
          isAgent: true
        },
        {
          id: 103,
          sender: "Pierre Bernard",
          message: "J'ai réussi avec une autre carte, merci pour votre aide !",
          date: "2026-04-26T14:00:00",
          isAgent: false
        }
      ]
    },
    {
      id: 4,
      sender: {
        name: "Sophie Laurent",
        email: "sophie.laurent@email.com",
        avatar: "SL",
        type: "voyageur",
        phone: "+213 554 567 890",
        location: "Annaba, Algeria",
        memberSince: "2024-01-05"
      },
      subject: "Demande d'information sur les offres",
      message: "Bonjour, je suis intéressée par vos offres pour l'été. Pouvez-vous m'envoyer plus d'informations sur les destinations et les prix ? Merci.",
      date: "2026-04-25T16:20:00",
      status: "unread",
      priority: "normal",
      category: "information",
      attachments: [],
      responses: []
    }
  ],
  sent: [
    {
      id: 5,
      recipient: "Jean Dupont",
      subject: "Réponse: Question sur votre vol Paris - Tokyo",
      message: "Bonjour Jean, nous avons bien reçu votre demande. Pour ajouter un bagage supplémentaire, le coût est de 50€ par vol. Vous pouvez le faire depuis votre espace client.",
      date: "2026-04-28T14:20:00",
      status: "sent"
    }
  ],
  archived: [],
  trash: []
};

const categories = [
  { id: "all", label: "Tous", icon: Mail, color: "from-gray-500 to-gray-600" },
  { id: "unread", label: "Non lus", icon: MailOpen, color: "from-blue-500 to-blue-600" },
  { id: "urgent", label: "Urgents", icon: AlertCircle, color: "from-red-500 to-red-600" },
  { id: "booking", label: "Réservations", icon: Calendar, color: "from-green-500 to-green-600" },
  { id: "cancellation", label: "Annulations", icon: MailX, color: "from-orange-500 to-orange-600" },
  { id: "payment", label: "Paiements", icon: FileText, color: "from-purple-500 to-purple-600" }
];

export function Messages() {
  const [activeTab, setActiveTab] = useState("inbox");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [showReply, setShowReply] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isSending, setIsSending] = useState(false);
  const [showCompose, setShowCompose] = useState(false);
  const [composeData, setComposeData] = useState({
    to: "",
    subject: "",
    message: ""
  });

  const getCurrentMessages = () => {
    let messages = [];
    if (activeTab === "inbox") messages = messagesData.inbox;
    else if (activeTab === "sent") messages = messagesData.sent;
    else if (activeTab === "archived") messages = messagesData.archived;
    else if (activeTab === "trash") messages = messagesData.trash;
    
    if (searchTerm) {
      messages = messages.filter(msg => {
        const senderName = msg.sender?.name || msg.recipient;
        return senderName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               msg.subject.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }
    
    if (selectedCategory !== "all" && activeTab === "inbox") {
      messages = messages.filter(msg => {
        if (selectedCategory === "unread") return msg.status === "unread";
        return msg.category === selectedCategory;
      });
    }
    
    return messages;
  };

  const unreadCount = messagesData.inbox.filter(m => m.status === "unread").length;
  const totalMessages = messagesData.inbox.length;
  const responseRate = Math.round((messagesData.inbox.filter(m => m.responses?.length > 0).length / totalMessages) * 100);

  const statsCards = [
    { label: "Messages reçus", value: totalMessages, icon: <Inbox className="text-[#00C0E8]" size={24} />, color: "from-cyan-50 to-blue-50" },
    { label: "Non lus", value: unreadCount, icon: <MailOpen className="text-[#00C0E8]" size={22} />, color: "from-blue-50 to-indigo-50" },
    { label: "Messages envoyés", value: messagesData.sent.length, icon: <Send className="text-[#00C0E8]" size={22} />, color: "from-green-50 to-emerald-50" },
    { label: "Taux de réponse", value: `${responseRate}%`, icon: <CheckCircle2 className="text-[#00C0E8]" size={22} />, color: "from-purple-50 to-pink-50" },
  ];

  const handleSendReply = async () => {
    if (!replyText.trim()) {
      toast.error("Veuillez écrire votre réponse");
      return;
    }
    
    setIsSending(true);
    setTimeout(() => {
      toast.success("Réponse envoyée avec succès");
      setReplyText("");
      setShowReply(false);
      setIsSending(false);
      
      if (selectedMessage?.status === "unread") {
        const message = messagesData.inbox.find(m => m.id === selectedMessage.id);
        if (message) message.status = "read";
      }
    }, 1000);
  };

  const handleSendMessage = async () => {
    if (!composeData.to || !composeData.subject || !composeData.message) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    
    setIsSending(true);
    setTimeout(() => {
      toast.success("Message envoyé avec succès");
      setComposeData({ to: "", subject: "", message: "" });
      setShowCompose(false);
      setIsSending(false);
    }, 1000);
  };

  const handleArchive = (message) => {
    toast.success("Message archivé");
  };

  const handleDelete = (message) => {
    toast.success("Message déplacé vers la corbeille");
  };

  const handleMarkAsRead = (message) => {
    if (message.status === "unread") {
      message.status = "read";
      toast.success("Message marqué comme lu");
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case "urgent": return "bg-red-100 text-red-700";
      case "high": return "bg-orange-100 text-orange-700";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const messages = getCurrentMessages();

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
                    <Mail className="text-white text-2xl" />
                  </div>
                  <span className="text-white/80 text-sm font-medium tracking-wide">MESSAGERIE</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Messages
                </h1>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <button
                onClick={() => setShowCompose(true)}
                className="bg-white text-[#00C0E8] px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all hover:scale-105 group"
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition" />
                Nouveau message
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

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 border-b border-gray-200">
            {[
              { id: "inbox", label: "Boîte de réception", icon: Inbox, badge: unreadCount },
              { id: "sent", label: "Envoyés", icon: Send },
              { id: "archived", label: "Archivés", icon: Archive },
              { id: "trash", label: "Corbeille", icon: Trash2 }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 font-medium transition-all relative flex items-center gap-2 ${
                    activeTab === tab.id
                      ? "text-[#00C0E8] border-b-2 border-[#00C0E8]"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Icon className="size-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  {tab.badge > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par expéditeur ou sujet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C0E8]/20 focus:border-[#00C0E8] transition-all"
            />
          </div>
          {activeTab === "inbox" && (
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1 ${
                      selectedCategory === cat.id
                        ? "bg-[#00C0E8] text-white"
                        : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    {cat.label}
                  </button>
                );
              })}
            </div>
          )}
          <button className="px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Actualiser
          </button>
        </div>

        {/* Messages List and Detail View */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1 space-y-2">
            {messages.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                <Mail className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">Aucun message</p>
              </div>
            ) : (
              messages.map((message, idx) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => {
                    setSelectedMessage(message);
                    handleMarkAsRead(message);
                  }}
                  className={`bg-white rounded-xl p-4 border cursor-pointer transition-all hover:shadow-md ${
                    selectedMessage?.id === message.id
                      ? "border-[#00C0E8] shadow-md"
                      : message.status === "unread"
                      ? "border-l-4 border-l-[#00C0E8] border-gray-100"
                      : "border-gray-100"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00C0E8] to-[#0099cc] flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {message.sender?.avatar || message.recipient?.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium truncate ${message.status === "unread" ? "text-gray-900" : "text-gray-600"}`}>
                          {message.sender?.name || message.recipient}
                        </p>
                        <p className="text-sm text-gray-500 truncate">{message.subject}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <p className="text-xs text-gray-400">
                            {new Date(message.date).toLocaleDateString('fr-FR')}
                          </p>
                          {message.priority && (
                            <span className={`text-xs px-1.5 py-0.5 rounded ${getPriorityColor(message.priority)}`}>
                              {message.priority === "urgent" ? "Urgent" : message.priority === "high" ? "Priorité" : "Normal"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {message.status === "unread" && (
                      <div className="w-2 h-2 rounded-full bg-[#00C0E8] flex-shrink-0"></div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                {/* Message Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex justify-between items-start flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00C0E8] to-[#0099cc] flex items-center justify-center text-white font-semibold text-lg">
                        {selectedMessage.sender?.avatar || selectedMessage.recipient?.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{selectedMessage.subject}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-sm text-gray-600">
                            De: {selectedMessage.sender?.name || "Moi"} ({selectedMessage.sender?.email})
                          </p>
                          {selectedMessage.sender?.type === "voyageur" && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">Client</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(selectedMessage.date).toLocaleString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleArchive(selectedMessage)}
                        className="p-2 text-gray-400 hover:text-amber-600 transition-colors"
                        title="Archiver"
                      >
                        <ArchiveIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(selectedMessage)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2Icon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Message Body */}
                <div className="p-6">
                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>

                  {/* Attachments */}
                  {selectedMessage.attachments?.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm font-medium text-gray-700 mb-2">Pièces jointes</p>
                      <div className="flex gap-2">
                        {selectedMessage.attachments.map((file, idx) => (
                          <a
                            key={idx}
                            href={file.url}
                            className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                          >
                            <Paperclip className="w-4 h-4 text-gray-400" />
                            <span>{file.name}</span>
                            <span className="text-xs text-gray-400">({file.size})</span>
                            <Download className="w-4 h-4 text-gray-400" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Responses Thread */}
                  {selectedMessage.responses?.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <p className="text-sm font-medium text-gray-700 mb-3">Historique des échanges</p>
                      <div className="space-y-3">
                        {selectedMessage.responses.map((response) => (
                          <div
                            key={response.id}
                            className={`p-4 rounded-xl ${
                              response.isAgent
                                ? "bg-[#00C0E8]/5 border-l-4 border-l-[#00C0E8]"
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

                  {/* Reply Button */}
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    {!showReply ? (
                      <button
                        onClick={() => setShowReply(true)}
                        className="px-4 py-2 bg-[#00C0E8] text-white rounded-xl hover:bg-[#0099cc] transition-all flex items-center gap-2"
                      >
                        <Reply className="w-4 h-4" />
                        Répondre
                      </button>
                    ) : (
                      <div className="space-y-3">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Écrivez votre réponse..."
                          rows={4}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C0E8]/20 focus:border-[#00C0E8] transition-all resize-none"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleSendReply}
                            disabled={isSending}
                            className="px-4 py-2 bg-[#00C0E8] text-white rounded-xl hover:bg-[#0099cc] transition-all flex items-center gap-2"
                          >
                            {isSending && <RefreshCw className="w-4 h-4 animate-spin" />}
                            <Send className="w-4 h-4" />
                            Envoyer
                          </button>
                          <button
                            onClick={() => setShowReply(false)}
                            className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all"
                          >
                            Annuler
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Client Info */}
                  {selectedMessage.sender?.type === "voyageur" && (
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <p className="text-sm font-medium text-gray-700 mb-3">Informations client</p>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-4 h-4 text-gray-400" />
                          {selectedMessage.sender.phone}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="w-4 h-4 text-gray-400" />
                          {selectedMessage.sender.email}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {selectedMessage.sender.location}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          Membre depuis: {selectedMessage.sender.memberSince}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                <Mail className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun message sélectionné</h3>
                <p className="text-gray-500">Sélectionnez un message pour voir son contenu</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Compose Message Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 sticky top-0 bg-white">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Send className="w-5 h-5 text-[#00C0E8]" />
                  <h3 className="text-xl font-semibold text-gray-900">Nouveau message</h3>
                </div>
                <button onClick={() => setShowCompose(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Destinataire *</label>
                <input
                  type="email"
                  value={composeData.to}
                  onChange={(e) => setComposeData({ ...composeData, to: e.target.value })}
                  placeholder="client@email.com"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C0E8]/20 focus:border-[#00C0E8]"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Sujet *</label>
                <input
                  type="text"
                  value={composeData.subject}
                  onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
                  placeholder="Sujet du message"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C0E8]/20 focus:border-[#00C0E8]"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Message *</label>
                <textarea
                  value={composeData.message}
                  onChange={(e) => setComposeData({ ...composeData, message: e.target.value })}
                  placeholder="Votre message..."
                  rows={8}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C0E8]/20 focus:border-[#00C0E8] transition-all resize-none"
                />
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                  <Paperclip className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                  <ImageIcon className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                  <LinkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowCompose(false)}
                className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSendMessage}
                disabled={isSending}
                className="px-6 py-2 bg-gradient-to-r from-[#00C0E8] to-[#0099cc] text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
              >
                {isSending && <RefreshCw className="w-4 h-4 animate-spin" />}
                <Send className="w-4 h-4" />
                Envoyer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}