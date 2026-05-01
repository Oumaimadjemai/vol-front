import { useState } from "react";
import { 
  X, 
  Send, 
  Calendar, 
  Image as ImageIcon,
  Mail,
  AlignLeft,
  AlignCenter,
  Bold,
  Italic,
  Underline,
  Link as LinkIcon,
  Save,
  Rocket,
  Loader,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";

export function NouvelleCampagne({ isOpen, onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Campaign data
  const [campaignData, setCampaignData] = useState({
    name: "",
    subject: "",
    previewText: "",
    fromName: "Traveling Agency",
    fromEmail: "newsletter@traveling.com",
    replyTo: "contact@traveling.com",
    template: "summer",
    status: "draft",
    scheduledDate: "",
    sendTime: "09:00",
    recipients: "all",
    audience: "all",
    segments: [],
    content: {
      title: "",
      subtitle: "",
      body: "",
      ctaText: "Réserver maintenant",
      ctaLink: "https://traveling.com/offers",
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600",
      featured: true
    },
    tracking: {
      openTracking: true,
      clickTracking: true,
      utmSource: "newsletter",
      utmMedium: "email",
      utmCampaign: ""
    },
    design: {
      primaryColor: "#00C0E8",
      headerStyle: "centered",
      showSocialLinks: true,
      showUnsubscribe: true
    }
  });
  
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags] = useState([
    "promotion", "seasonal", "flash", "weekly", "hot", "new", "destinations"
  ]);
  
  const [testEmail, setTestEmail] = useState("");
  const [showTestModal, setShowTestModal] = useState(false);
  
  const templates = [
    { id: "summer", name: "Été & Soleil", icon: "☀️" },
    { id: "winter", name: "Hiver & Neige", icon: "❄️" },
    { id: "flash", name: "Flash Sale", icon: "⚡" },
    { id: "weekly", name: "Hebdomadaire", icon: "📰" },
    { id: "destinations", name: "Destinations", icon: "🌍" }
  ];
  
  const audienceSegments = [
    { id: "all", name: "Tous les abonnés", count: 24700 },
    { id: "active", name: "Abonnés actifs", count: 22300 },
    { id: "inactive", name: "Abonnés inactifs", count: 2400 },
    { id: "new", name: "Nouveaux abonnés (30j)", count: 1850 },
    { id: "engaged", name: "Très engagés (+10 clics)", count: 5400 },
    { id: "recent", name: "Récents (90j)", count: 8900 }
  ];

  const handleChange = (field, value) => {
    setCampaignData(prev => ({ ...prev, [field]: value }));
  };

  const handleContentChange = (field, value) => {
    setCampaignData(prev => ({
      ...prev,
      content: { ...prev.content, [field]: value }
    }));
  };

  const handleTrackingChange = (field, value) => {
    setCampaignData(prev => ({
      ...prev,
      tracking: { ...prev.tracking, [field]: value }
    }));
  };

//   const handleDesignChange = (field, value) => {
//     setCampaignData(prev => ({
//       ...prev,
//       design: { ...prev.design, [field]: value }
//     }));
//   };

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const validateStep1 = () => {
    if (!campaignData.name) {
      toast.error("Veuillez saisir un nom pour la campagne");
      return false;
    }
    if (!campaignData.subject) {
      toast.error("Veuillez saisir un objet");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!campaignData.content.title) {
      toast.error("Veuillez saisir un titre");
      return false;
    }
    if (!campaignData.content.body) {
      toast.error("Veuillez saisir le contenu");
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (campaignData.status === "scheduled" && !campaignData.scheduledDate) {
      toast.error("Veuillez sélectionner une date de programmation");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSendTest = () => {
    if (!testEmail) {
      toast.error("Veuillez entrer une adresse email");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      toast.success(`Email test envoyé à ${testEmail}`);
      setLoading(false);
      setShowTestModal(false);
      setTestEmail("");
    }, 1500);
  };

  const handleCreateCampaign = () => {
    if (!validateStep3()) return;
    
    setLoading(true);
    setTimeout(() => {
    //   const campaignId = Math.floor(Math.random() * 1000);
      toast.success(`Campagne "${campaignData.name}" créée avec succès!`);
      setLoading(false);
      if (onSuccess) onSuccess(campaignData);
      onClose();
      resetForm();
    }, 1500);
  };

  const resetForm = () => {
    setStep(1);
    setCampaignData({
      name: "",
      subject: "",
      previewText: "",
      fromName: "Traveling Agency",
      fromEmail: "newsletter@traveling.com",
      replyTo: "contact@traveling.com",
      template: "summer",
      status: "draft",
      scheduledDate: "",
      sendTime: "09:00",
      recipients: "all",
      audience: "all",
      segments: [],
      content: {
        title: "",
        subtitle: "",
        body: "",
        ctaText: "Réserver maintenant",
        ctaLink: "https://traveling.com/offers",
        imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600",
        featured: true
      },
      tracking: {
        openTracking: true,
        clickTracking: true,
        utmSource: "newsletter",
        utmMedium: "email",
        utmCampaign: ""
      },
      design: {
        primaryColor: "#00C0E8",
        headerStyle: "centered",
        showSocialLinks: true,
        showUnsubscribe: true
      }
    });
    setSelectedTags([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-[#00C0E8] to-[#0099cc] rounded-xl">
                <Send className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Nouvelle campagne</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Étape {step} sur 3 - {step === 1 ? "Informations générales" : step === 2 ? "Contenu" : "Envoi"}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          {/* Progress bar */}
          <div className="mt-4 flex gap-1">
            <div className={`flex-1 h-1 rounded-full transition-all ${step >= 1 ? 'bg-[#00C0E8]' : 'bg-gray-200'}`} />
            <div className={`flex-1 h-1 rounded-full transition-all ${step >= 2 ? 'bg-[#00C0E8]' : 'bg-gray-200'}`} />
            <div className={`flex-1 h-1 rounded-full transition-all ${step >= 3 ? 'bg-[#00C0E8]' : 'bg-gray-200'}`} />
          </div>
        </div>

        {/* Step 1: General Information */}
        {step === 1 && (
          <div className="p-6 space-y-6">
            {/* Campaign Name */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Nom de la campagne *
              </label>
              <input
                type="text"
                value={campaignData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Ex: Summer Specials 2026"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C0E8]/20 focus:border-[#00C0E8] transition-all"
              />
            </div>

            {/* Subject & Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Objet de l'email *
                </label>
                <input
                  type="text"
                  value={campaignData.subject}
                  onChange={(e) => handleChange("subject", e.target.value)}
                  placeholder="Découvrez nos offres exceptionnelles!"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C0E8]/20 focus:border-[#00C0E8] transition-all"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Texte de prévisualisation
                </label>
                <input
                  type="text"
                  value={campaignData.previewText}
                  onChange={(e) => handleChange("previewText", e.target.value)}
                  placeholder="Apparaît après l'objet dans la boîte de réception"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C0E8]/20 focus:border-[#00C0E8] transition-all"
                />
              </div>
            </div>

            {/* From & Reply To */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Nom de l'expéditeur
                </label>
                <input
                  type="text"
                  value={campaignData.fromName}
                  onChange={(e) => handleChange("fromName", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C0E8]/20 focus:border-[#00C0E8] transition-all"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Email de l'expéditeur
                </label>
                <input
                  type="email"
                  value={campaignData.fromEmail}
                  onChange={(e) => handleChange("fromEmail", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C0E8]/20 focus:border-[#00C0E8] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Adresse de réponse
              </label>
              <input
                type="email"
                value={campaignData.replyTo}
                onChange={(e) => handleChange("replyTo", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C0E8]/20 focus:border-[#00C0E8] transition-all"
              />
            </div>

            {/* Template Selection */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Template
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleChange("template", template.id)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      campaignData.template === template.id
                        ? "border-[#00C0E8] bg-[#00C0E8]/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-2xl mb-1">{template.icon}</div>
                    <p className="text-xs font-medium">{template.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      selectedTags.includes(tag)
                        ? "bg-[#00C0E8] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Content */}
        {step === 2 && (
          <div className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Titre principal *
              </label>
              <input
                type="text"
                value={campaignData.content.title}
                onChange={(e) => handleContentChange("title", e.target.value)}
                placeholder="Titre accrocheur"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C0E8]/20 focus:border-[#00C0E8] transition-all"
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Sous-titre
              </label>
              <input
                type="text"
                value={campaignData.content.subtitle}
                onChange={(e) => handleContentChange("subtitle", e.target.value)}
                placeholder="Sous-titre optionnel"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C0E8]/20 focus:border-[#00C0E8] transition-all"
              />
            </div>

            {/* Body */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Contenu *
              </label>
              {/* Simple toolbar */}
              <div className="flex gap-2 p-2 border border-gray-200 rounded-t-xl bg-gray-50">
                <button className="p-1.5 rounded hover:bg-gray-200">
                  <Bold className="w-4 h-4" />
                </button>
                <button className="p-1.5 rounded hover:bg-gray-200">
                  <Italic className="w-4 h-4" />
                </button>
                <button className="p-1.5 rounded hover:bg-gray-200">
                  <Underline className="w-4 h-4" />
                </button>
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <button className="p-1.5 rounded hover:bg-gray-200">
                  <AlignLeft className="w-4 h-4" />
                </button>
                <button className="p-1.5 rounded hover:bg-gray-200">
                  <AlignCenter className="w-4 h-4" />
                </button>
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <button className="p-1.5 rounded hover:bg-gray-200">
                  <LinkIcon className="w-4 h-4" />
                </button>
                <button className="p-1.5 rounded hover:bg-gray-200">
                  <ImageIcon className="w-4 h-4" />
                </button>
              </div>
              <textarea
                value={campaignData.content.body}
                onChange={(e) => handleContentChange("body", e.target.value)}
                rows={8}
                placeholder="Votre message ici..."
                className="w-full px-4 py-2.5 border-x border-b border-gray-200 rounded-b-xl focus:outline-none focus:ring-2 focus:ring-[#00C0E8]/20 focus:border-[#00C0E8] transition-all resize-none"
              />
            </div>

            {/* CTA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Texte du bouton CTA
                </label>
                <input
                  type="text"
                  value={campaignData.content.ctaText}
                  onChange={(e) => handleContentChange("ctaText", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C0E8]/20 focus:border-[#00C0E8] transition-all"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Lien du bouton CTA
                </label>
                <input
                  type="url"
                  value={campaignData.content.ctaLink}
                  onChange={(e) => handleContentChange("ctaLink", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C0E8]/20 focus:border-[#00C0E8] transition-all"
                />
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                URL de l'image principale
              </label>
              <input
                type="url"
                value={campaignData.content.imageUrl}
                onChange={(e) => handleContentChange("imageUrl", e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C0E8]/20 focus:border-[#00C0E8] transition-all"
              />
              {campaignData.content.imageUrl && (
                <div className="mt-3 rounded-xl overflow-hidden border border-gray-200">
                  <img src={campaignData.content.imageUrl} alt="Preview" className="w-full h-48 object-cover" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Send Options */}
        {step === 3 && (
          <div className="p-6 space-y-6">
            {/* Send Type */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Type d'envoi
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleChange("status", "draft")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    campaignData.status === "draft"
                      ? "border-[#00C0E8] bg-[#00C0E8]/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Save className="w-5 h-5 mx-auto mb-2 text-gray-600" />
                  <p className="font-medium">Sauvegarder</p>
                  <p className="text-xs text-gray-500">En tant que brouillon</p>
                </button>
                <button
                  onClick={() => handleChange("status", "scheduled")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    campaignData.status === "scheduled"
                      ? "border-[#00C0E8] bg-[#00C0E8]/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Calendar className="w-5 h-5 mx-auto mb-2 text-gray-600" />
                  <p className="font-medium">Programmer</p>
                  <p className="text-xs text-gray-500">Envoi ultérieur</p>
                </button>
              </div>
            </div>

            {/* Schedule Date (if scheduled) */}
            {campaignData.status === "scheduled" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Date d'envoi
                  </label>
                  <input
                    type="date"
                    value={campaignData.scheduledDate}
                    onChange={(e) => handleChange("scheduledDate", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C0E8]/20 focus:border-[#00C0E8] transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Heure d'envoi
                  </label>
                  <input
                    type="time"
                    value={campaignData.sendTime}
                    onChange={(e) => handleChange("sendTime", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C0E8]/20 focus:border-[#00C0E8] transition-all"
                  />
                </div>
              </div>
            )}

            {/* Audience */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Audience cible
              </label>
              <div className="grid grid-cols-2 gap-3">
                {audienceSegments.map((segment) => (
                  <button
                    key={segment.id}
                    onClick={() => handleChange("audience", segment.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      campaignData.audience === segment.id
                        ? "border-[#00C0E8] bg-[#00C0E8]/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <p className="font-medium">{segment.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{segment.count.toLocaleString()} abonnés</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Tracking Options */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Suivi et analytics
              </label>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer">
                  <div>
                    <p className="font-medium">Suivi des ouvertures</p>
                    <p className="text-xs text-gray-500">Savoir qui a ouvert l'email</p>
                  </div>
                  <button
                    onClick={() => handleTrackingChange("openTracking", !campaignData.tracking.openTracking)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${campaignData.tracking.openTracking ? 'bg-[#00C0E8]' : 'bg-gray-300'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${campaignData.tracking.openTracking ? 'right-1' : 'left-1'}`} />
                  </button>
                </label>

                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer">
                  <div>
                    <p className="font-medium">Suivi des clics</p>
                    <p className="text-xs text-gray-500">Savoir qui a cliqué sur les liens</p>
                  </div>
                  <button
                    onClick={() => handleTrackingChange("clickTracking", !campaignData.tracking.clickTracking)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${campaignData.tracking.clickTracking ? 'bg-[#00C0E8]' : 'bg-gray-300'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${campaignData.tracking.clickTracking ? 'right-1' : 'left-1'}`} />
                  </button>
                </label>
              </div>
            </div>

            {/* UTM Parameters */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Paramètres UTM
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Source (utm_source)</label>
                  <input
                    type="text"
                    value={campaignData.tracking.utmSource}
                    onChange={(e) => handleTrackingChange("utmSource", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Medium (utm_medium)</label>
                  <input
                    type="text"
                    value={campaignData.tracking.utmMedium}
                    onChange={(e) => handleTrackingChange("utmMedium", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-gray-500 mb-1 block">Campagne (utm_campaign)</label>
                  <input
                    type="text"
                    value={campaignData.tracking.utmCampaign}
                    onChange={(e) => handleTrackingChange("utmCampaign", e.target.value)}
                    placeholder="ex: summer_specials_2026"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 flex justify-between">
          <div className="flex gap-3">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all"
              >
                Retour
              </button>
            )}
            <button
              onClick={() => setShowTestModal(true)}
              className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Tester
            </button>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all"
            >
              Annuler
            </button>
            {step < 3 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-gradient-to-r from-[#00C0E8] to-[#0099cc] text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
              >
                Suivant
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleCreateCampaign}
                disabled={loading}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}
                {loading ? "Création..." : "Créer la campagne"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Test Email Modal */}
      {showTestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-purple-500" />
                  <h3 className="text-lg font-semibold text-gray-900">Envoyer un test</h3>
                </div>
                <button onClick={() => setShowTestModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Adresse email de test</label>
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="test@example.com"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl"
              />
              <p className="text-xs text-gray-500 mt-2">Un email test sera envoyé à cette adresse</p>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setShowTestModal(false)} className="px-4 py-2 border border-gray-200 rounded-xl">Annuler</button>
              <button onClick={handleSendTest} disabled={loading} className="px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 flex items-center gap-2">
                {loading && <Loader className="w-4 h-4 animate-spin" />}
                Envoyer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

