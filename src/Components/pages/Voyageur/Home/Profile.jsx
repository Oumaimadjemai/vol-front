import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaPassport,
  FaCreditCard,
  FaHistory,
  FaFileAlt,
  FaLock,
  FaSave,
  FaEdit,
  FaSignOutAlt,
  FaPlane,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaPrint,
  FaDownload,
  FaEye,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaFilter,
  FaTimes,
  FaFlag,
  FaComment,
  FaQuestionCircle,
  FaBug,
  FaExclamationTriangle,
  FaMoneyBillWave,
  FaTrashAlt,
  FaPaperPlane,
  FaTicketAlt,
  FaStar,
  FaGift,
  FaPlaneDeparture,
  FaIdCard,
  FaPhoneAlt,
  FaMapMarkedAlt,
  FaBirthdayCake,
} from "react-icons/fa";
import { DatePicker } from "../../../Vol/Reservation/DatePicker";
import { CustomSelect } from "../../../Vol/Reservation/CustomSelect";
import { WILAYAS } from "../../../Vol/Reservation/constants/flightConstants";

import { toast } from "sonner";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import axiosInstance from "../../../../api/axiosInstance";

// Main color
const MAIN_COLOR = "#00C0E8";
const MAIN_COLOR_DARK = "#0096b8";
const MAIN_COLOR_GRADIENT = "from-[#00C0E8] to-[#0096b8]";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("info");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userData, setUserData] = useState(null);
  const [voyageurData, setVoyageurData] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [reportPeriod, setReportPeriod] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showReservationDetail, setShowReservationDetail] = useState(false);

  // Report states
  const [reportData, setReportData] = useState({
    subject: "",
    category: "issue",
    message: "",
    reservation_id: null,
  });
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  // Refund states
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundReservation, setRefundReservation] = useState(null);
  const [refundReason, setRefundReason] = useState("");
  const [refundEligibility, setRefundEligibility] = useState(null);
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(false);

  // Cancellation states
  const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);
  const [cancelConfirmReservation, setCancelConfirmReservation] =
    useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelEligibility, setCancelEligibility] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    wilaya: "",
    commune: "",
    sexe: "",
    date_naissance: "",
    num_passport: "",
    date_exp_passport: "",
  });

  // Fetch user data
  useEffect(() => {
    fetchUserData();
    fetchReservations();
  }, []);

  // Filter reservations
  useEffect(() => {
    let filtered = [...reservations];

    if (reportPeriod !== "all") {
      const now = new Date();
      const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));
      const threeMonthsAgo = new Date(now.setMonth(now.getMonth() - 2));
      const sixMonthsAgo = new Date(now.setMonth(now.getMonth() - 5));

      if (reportPeriod === "month") {
        filtered = filtered.filter((r) => new Date(r.created_at) > oneMonthAgo);
      } else if (reportPeriod === "3months") {
        filtered = filtered.filter(
          (r) => new Date(r.created_at) > threeMonthsAgo,
        );
      } else if (reportPeriod === "6months") {
        filtered = filtered.filter(
          (r) => new Date(r.created_at) > sixMonthsAgo,
        );
      }
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (r) =>
          r.reservation_number
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          r.amadeus_pnr?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredReservations(filtered);
  }, [reservations, reportPeriod, searchTerm]);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const meResponse = await axiosInstance.get("/auth-service/auth/me/");
      const currentUser = meResponse.data;

      const voyageurResponse = await axiosInstance.get(
        `/auth-service/auth/voyageurs/by-user/${currentUser.id}/`,
      );
      const voyageur = voyageurResponse.data;

      setUserData(currentUser);
      setVoyageurData(voyageur);

      setFormData({
        nom: voyageur.nom || "",
        prenom: voyageur.prenom || "",
        email: voyageur.email || currentUser.email || "",
        telephone: voyageur.telephone || "",
        wilaya: voyageur.wilaya || "",
        commune: voyageur.commune || "",
        sexe: voyageur.sexe || "",
        date_naissance: voyageur.date_naissance || "",
        num_passport: voyageur.num_passport || "",
        date_exp_passport: voyageur.date_exp_passport || "",
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Erreur lors du chargement des données");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReservations = async () => {
    try {
      const response = await axiosInstance.get(
        "/ms-reservation/reservations/my-reservations/",
      );
      console.log("Reservations response:", response.data);

      let reservationsList = [];
      if (response.data.results) {
        reservationsList = response.data.results;
      } else if (response.data.reservations) {
        reservationsList = response.data.reservations;
      } else if (Array.isArray(response.data)) {
        reservationsList = response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        reservationsList = response.data.data;
      } else {
        reservationsList = [];
      }

      setReservations(reservationsList);
      setFilteredReservations(reservationsList);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      toast.error("Erreur lors du chargement des réservations");
      setReservations([]);
      setFilteredReservations([]);
    }
  };

  const checkRefundEligibility = async (reservation) => {
    setIsCheckingEligibility(true);
    try {
      const response = await axiosInstance.get(
        `/ms-reservation/reservations/${reservation.id}/refund_eligibility/`,
      );
      return response.data;
    } catch (error) {
      console.error("Error checking eligibility:", error);
      return null;
    } finally {
      setIsCheckingEligibility(false);
    }
  };

  const openCancelModal = async (reservation) => {
    setCancelConfirmReservation(reservation);
    setCancelEligibility(null);
    setCancelReason("");
    setShowCancelConfirmModal(true);

    const eligibility = await checkRefundEligibility(reservation);
    setCancelEligibility(eligibility);

    if (eligibility?.eligible) {
      toast.info(
        `Cette réservation est éligible à un remboursement de ${eligibility.estimated_refund} ${eligibility.currency}`,
      );
    }
  };

  const handleCancelReservation = async () => {
    if (!cancelReason.trim()) {
      toast.error("Veuillez indiquer la raison de l'annulation");
      return;
    }

    setIsSubmittingReport(true);
    try {
      const response = await axiosInstance.post(
        `/ms-reservation/reservations/${cancelConfirmReservation.id}/cancel_reservation/`,
      );

      if (response.data.success) {
        toast.success("Réservation annulée avec succès");
        setShowCancelConfirmModal(false);
        setCancelConfirmReservation(null);
        setCancelReason("");
        fetchReservations();

        if (response.data.refund_eligibility?.eligible) {
          toast.info(
            `Vous pouvez demander un remboursement de ${response.data.refund_eligibility.estimated_refund} ${response.data.refund_eligibility.currency}`,
          );
        }
      }
    } catch (error) {
      console.error("Error cancelling reservation:", error);
      toast.error(error.response?.data?.error || "Erreur lors de l'annulation");
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const openRefundModal = async (reservation) => {
    setRefundReservation(reservation);
    setRefundEligibility(null);
    setRefundReason("");
    setShowRefundModal(true);

    const eligibility = await checkRefundEligibility(reservation);
    setRefundEligibility(eligibility);
  };

  const handleRequestRefund = async () => {
    if (!refundReason.trim()) {
      toast.error("Veuillez indiquer la raison du remboursement");
      return;
    }

    setIsSubmittingReport(true);
    try {
      const response = await axiosInstance.post(
        `/ms-reservation/reservations/${refundReservation.id}/request_refund/`,
        {
          reason: refundReason,
        },
      );

      if (response.data.success) {
        toast.success(
          `Remboursement de ${response.data.refund_amount} ${response.data.currency} effectué avec succès`,
        );
        setShowRefundModal(false);
        setRefundReservation(null);
        setRefundReason("");
        fetchReservations();
      }
    } catch (error) {
      console.error("Error requesting refund:", error);
      toast.error(
        error.response?.data?.error ||
          "Erreur lors de la demande de remboursement",
      );
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const updateData = {
        nom: formData.nom,
        prenom: formData.prenom,
        telephone: formData.telephone,
        wilaya: formData.wilaya,
        commune: formData.commune,
        sexe: formData.sexe,
        date_naissance: formData.date_naissance,
        num_passport: formData.num_passport,
        date_exp_passport: formData.date_exp_passport,
      };

      await axiosInstance.patch(
        `/auth-service/auth/voyageurs/${voyageurData.id}/update/`,
        updateData,
      );

      if (formData.email !== voyageurData.email) {
        await axiosInstance.patch(
          `/auth-service/auth/users/${userData.id}/update/`,
          {
            email: formData.email,
          },
        );
      }

      toast.success("Profil mis à jour avec succès");
      setIsEditing(false);
      fetchUserData();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    if (passwordData.new_password.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    setIsSaving(true);
    try {
      await axiosInstance.post("/auth-service/auth/change-password/", {
        old_password: passwordData.old_password,
        new_password: passwordData.new_password,
        new_password_confirm: passwordData.confirm_password,
      });

      toast.success("Mot de passe changé avec succès");
      setPasswordData({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(
        error.response?.data?.message ||
          "Erreur lors du changement de mot de passe",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitReport = async () => {
    if (!reportData.message.trim()) {
      toast.error("Veuillez saisir un message");
      return;
    }

    setIsSubmittingReport(true);
    try {
      await axiosInstance.post("/support-service/reports/", {
        subject:
          reportData.subject ||
          `${reportData.category.toUpperCase()} - ${new Date().toLocaleDateString()}`,
        category: reportData.category,
        message: reportData.message,
        reservation_id: reportData.reservation_id || null,
      });

      toast.success(
        "Rapport envoyé avec succès. Notre équipe vous répondra dans les plus brefs délais.",
      );
      setReportData({
        subject: "",
        category: "issue",
        message: "",
        reservation_id: null,
      });
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("Erreur lors de l'envoi du rapport");
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const exportReservations = () => {
    const dataToExport = filteredReservations.map((r) => ({
      "Numéro de réservation": r.reservation_number,
      PNR: r.amadeus_pnr || "N/A",
      Statut: r.status,
      "Type de vol":
        r.trip_type === "ALLER_SIMPLE" ? "Aller simple" : "Aller-retour",
      "Prix total": `${r.total_price} ${r.currency}`,
      "Date de création": new Date(r.created_at).toLocaleDateString("fr-FR"),
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Mes réservations");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    saveAs(
      new Blob([excelBuffer], { type: "application/octet-stream" }),
      `reservations_${new Date().toISOString().split("T")[0]}.xlsx`,
    );
    toast.success("Export réussi");
  };

  const printReservations = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Mes réservations</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            h1 { color: ${MAIN_COLOR}; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .status-confirmed { color: green; }
            .status-cancelled { color: red; }
            .status-pending { color: orange; }
          </style>
        </head>
        <body>
          <h1>Mes réservations</h1>
          <p>Date: ${new Date().toLocaleDateString("fr-FR")}</p>
          <table>
            <thead>
              <tr><th>N° réservation</th><th>PNR</th><th>Statut</th><th>Type</th><th>Prix</th><th>Date</th></tr>
            </thead>
            <tbody>
              ${filteredReservations
                .map(
                  (r) => `
                <tr>
                  <td>${r.reservation_number}</td>
                  <td>${r.amadeus_pnr || "N/A"}</td>
                  <td class="status-${r.status?.toLowerCase()}">${r.status}</td>
                  <td>${r.trip_type === "ALLER_SIMPLE" ? "Aller simple" : "Aller-retour"}</td>
                  <td>${r.total_price} ${r.currency}</td>
                  <td>${new Date(r.created_at).toLocaleDateString("fr-FR")}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      CONFIRMED: {
        color: "bg-green-100 text-green-700",
        icon: FaCheckCircle,
        label: "Confirmé",
      },
      CANCELLED: {
        color: "bg-red-100 text-red-700",
        icon: FaTimesCircle,
        label: "Annulé",
      },
      PENDING_PRICE: {
        color: "bg-yellow-100 text-yellow-700",
        icon: FaClock,
        label: "En attente",
      },
      PRICE_CONFIRMED: {
        color: "bg-blue-100 text-blue-700",
        icon: FaCheckCircle,
        label: "Prix confirmé",
      },
      FAILED: {
        color: "bg-red-100 text-red-700",
        icon: FaTimesCircle,
        label: "Échoué",
      },
    };

    const config = statusConfig[status] || statusConfig["PENDING_PRICE"];
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const tabs = [
    { id: "info", label: "Informations personnelles", icon: FaUser },
    { id: "reservations", label: "Mes réservations", icon: FaHistory },
    { id: "reports", label: "Support & Rapports", icon: FaFlag },
    { id: "password", label: "Changer mot de passe", icon: FaLock },
  ];

  const reportCategories = [
    {
      value: "issue",
      label: "Problème technique",
      icon: FaBug,
      color: "text-red-500",
    },
    {
      value: "complaint",
      label: "Réclamation",
      icon: FaExclamationTriangle,
      color: "text-orange-500",
    },
    {
      value: "question",
      label: "Question",
      icon: FaQuestionCircle,
      color: "text-blue-500",
    },
    {
      value: "feedback",
      label: "Suggestion",
      icon: FaComment,
      color: "text-green-500",
    },
    {
      value: "baggage",
      label: "Bagages",
      icon: FaTicketAlt,
      color: "text-purple-500",
    },
    { value: "other", label: "Autre", icon: FaFlag, color: "text-gray-500" },
  ];

  const getFlightDetailsDisplay = (reservation) => {
    if (reservation.flight_segments && reservation.flight_segments.length > 0) {
      const first = reservation.flight_segments[0];
      const last =
        reservation.flight_segments[reservation.flight_segments.length - 1];
      return `${first.origin} → ${last.destination}`;
    }
    return "Vol";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-[#00C0E8] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Modern Header Design */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#00C0E8] to-[#0096b8] shadow-xl">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="absolute top-10 right-10 text-white/5">
          <FaPlaneDeparture className="w-32 h-32 transform rotate-45" />
        </div>
        <div className="absolute bottom-0 left-20 text-white/5">
          <FaPlane className="w-24 h-24 transform -rotate-12" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <div className="w-28 h-28 bg-gradient-to-br from-white to-gray-100 rounded-2xl shadow-2xl flex items-center justify-center transform rotate-6 hover:rotate-0 transition-transform duration-300">
                <FaUser className="w-12 h-12 text-[#00C0E8]" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-green-500 w-5 h-5 rounded-full border-2 border-white"></div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  {formData.prenom} {formData.nom}
                </h1>
                <div className="flex justify-center md:justify-start gap-2">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white">
                    Voyageur
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 justify-center md:justify-start text-white/80 text-sm">
                <div className="flex items-center gap-2">
                  <FaEnvelope className="w-4 h-4" />
                  <span>{formData.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaPhoneAlt className="w-4 h-4" />
                  <span>+213 {formData.telephone || "XXXX XX XX"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaMapMarkedAlt className="w-4 h-4" />
                  <span>
                    {formData.wilaya || "Wilaya"},{" "}
                    {formData.commune || "Commune"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaBirthdayCake className="w-4 h-4" />
                  <span>
                    {formData.date_naissance
                      ? new Date(formData.date_naissance).toLocaleDateString(
                          "fr-FR",
                        )
                      : "Date de naissance"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 text-center">
                <div className="text-2xl font-bold text-white">
                  {reservations.length}
                </div>
                <div className="text-xs text-white/70">Réservations</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 text-center">
                <div className="text-2xl font-bold text-white">
                  {reservations.filter((r) => r.status === "CONFIRMED").length}
                </div>
                <div className="text-xs text-white/70">Confirmés</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 text-center">
                <div className="text-2xl font-bold text-white">
                  {new Date().getFullYear() -
                    (userData?.date_joined
                      ? new Date(userData.date_joined).getFullYear()
                      : 2024)}
                </div>
                <div className="text-xs text-white/70">Années</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Modern Tabs Design */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group relative flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-[#00C0E8] text-white shadow-lg shadow-[#00C0E8]/25"
                  : "bg-white text-gray-600 hover:bg-gray-50 hover:text-[#00C0E8]"
              }`}
            >
              <tab.icon
                className={`w-4 h-4 transition-transform group-hover:scale-110 ${activeTab === tab.id ? "text-white" : "text-gray-400 group-hover:text-[#00C0E8]"}`}
              />
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-[#00C0E8] rounded-xl -z-10"
                  initial={false}
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Content - Info Tab */}
        <AnimatePresence mode="wait">
          {activeTab === "info" && (
            <motion.div
              key="info"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-xl p-6"
            >
              <div className="flex justify-between items-center mb-6 pb-4 border-b">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Informations personnelles
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Gérez vos informations personnelles et documents de voyage
                  </p>
                </div>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#00C0E8]/10 text-[#00C0E8] rounded-xl hover:bg-[#00C0E8]/20 transition"
                  >
                    <FaEdit className="w-4 h-4" />
                    Modifier
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border rounded-xl hover:bg-gray-50 transition"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-4 py-2 bg-[#00C0E8] text-white rounded-xl hover:bg-[#0096b8] transition disabled:opacity-50"
                    >
                      {isSaving ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <FaSave className="w-4 h-4" />
                      )}
                      Enregistrer
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-600 text-sm mb-1">
                    Nom *
                  </label>
                  <input
                    type="text"
                    value={formData.nom}
                    onChange={(e) => handleInputChange("nom", e.target.value)}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:border-[#00C0E8] focus:ring-2 focus:ring-[#00C0E8]/20 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 text-sm mb-1">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    value={formData.prenom}
                    onChange={(e) =>
                      handleInputChange("prenom", e.target.value)
                    }
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:border-[#00C0E8] focus:ring-2 focus:ring-[#00C0E8]/20 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 text-sm mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:border-[#00C0E8] focus:ring-2 focus:ring-[#00C0E8]/20 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 text-sm mb-1">
                    Téléphone *
                  </label>
                  <div className="flex gap-2">
                    <div className="flex items-center px-3 border border-gray-300 rounded-xl bg-gray-50">
                      <span className="text-gray-600">+213</span>
                    </div>
                    <input
                      type="tel"
                      value={formData.telephone}
                      onChange={(e) =>
                        handleInputChange("telephone", e.target.value)
                      }
                      disabled={!isEditing}
                      className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 focus:border-[#00C0E8] focus:ring-2 focus:ring-[#00C0E8]/20 disabled:bg-gray-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-600 text-sm mb-1">
                    Wilaya
                  </label>
                  {isEditing ? (
                    <CustomSelect
                      value={formData.wilaya}
                      onChange={(value) => handleInputChange("wilaya", value)}
                      options={WILAYAS}
                      placeholder="Sélectionnez une wilaya"
                    />
                  ) : (
                    <input
                      type="text"
                      value={formData.wilaya}
                      disabled
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 bg-gray-100"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-gray-600 text-sm mb-1">
                    Commune
                  </label>
                  <input
                    type="text"
                    value={formData.commune}
                    onChange={(e) =>
                      handleInputChange("commune", e.target.value)
                    }
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:border-[#00C0E8] focus:ring-2 focus:ring-[#00C0E8]/20 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 text-sm mb-1">
                    Civilité
                  </label>
                  {isEditing ? (
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          value="homme"
                          checked={formData.sexe === "homme"}
                          onChange={(e) =>
                            handleInputChange("sexe", e.target.value)
                          }
                        />
                        <span>Homme</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          value="femme"
                          checked={formData.sexe === "femme"}
                          onChange={(e) =>
                            handleInputChange("sexe", e.target.value)
                          }
                        />
                        <span>Femme</span>
                      </label>
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={
                        formData.sexe === "homme"
                          ? "Homme"
                          : formData.sexe === "femme"
                            ? "Femme"
                            : "-"
                      }
                      disabled
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 bg-gray-100"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-gray-600 text-sm mb-1">
                    Date de naissance
                  </label>
                  {isEditing ? (
                    <DatePicker
                      value={formData.date_naissance}
                      onChange={(value) =>
                        handleInputChange("date_naissance", value)
                      }
                      placeholder="JJ/MM/AAAA"
                      maxDate={new Date().toISOString().split("T")[0]}
                    />
                  ) : (
                    <input
                      type="text"
                      value={
                        formData.date_naissance
                          ? new Date(
                              formData.date_naissance,
                            ).toLocaleDateString("fr-FR")
                          : "-"
                      }
                      disabled
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 bg-gray-100"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-gray-600 text-sm mb-1">
                    Numéro de passeport
                  </label>
                  <input
                    type="text"
                    value={formData.num_passport}
                    onChange={(e) =>
                      handleInputChange("num_passport", e.target.value)
                    }
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:border-[#00C0E8] focus:ring-2 focus:ring-[#00C0E8]/20 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 text-sm mb-1">
                    Date d'expiration passeport
                  </label>
                  {isEditing ? (
                    <DatePicker
                      value={formData.date_exp_passport}
                      onChange={(value) =>
                        handleInputChange("date_exp_passport", value)
                      }
                      placeholder="JJ/MM/AAAA"
                      minDate={new Date().toISOString().split("T")[0]}
                    />
                  ) : (
                    <input
                      type="text"
                      value={
                        formData.date_exp_passport
                          ? new Date(
                              formData.date_exp_passport,
                            ).toLocaleDateString("fr-FR")
                          : "-"
                      }
                      disabled
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 bg-gray-100"
                    />
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Reservations Tab */}
          {activeTab === "reservations" && (
            <motion.div
              key="reservations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-xl p-6"
            >
              <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Mes réservations
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Consultez l'historique de vos vols
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={exportReservations}
                    disabled={filteredReservations.length === 0}
                    className="flex items-center gap-2 px-3 py-2 border rounded-xl hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaDownload className="w-4 h-4 text-green-600" />
                    Exporter
                  </button>
                  <button
                    onClick={printReservations}
                    disabled={filteredReservations.length === 0}
                    className="flex items-center gap-2 px-3 py-2 border rounded-xl hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaPrint className="w-4 h-4 text-blue-600" />
                    Imprimer
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher par n° réservation ou PNR..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-xl focus:border-[#00C0E8] focus:ring-2 focus:ring-[#00C0E8]/20"
                    />
                  </div>
                </div>
                <div className="w-48">
                  <select
                    value={reportPeriod}
                    onChange={(e) => setReportPeriod(e.target.value)}
                    className="w-full px-4 py-2 border rounded-xl focus:border-[#00C0E8]"
                  >
                    <option value="all">Toutes les réservations</option>
                    <option value="month">Dernier mois</option>
                    <option value="3months">3 derniers mois</option>
                    <option value="6months">6 derniers mois</option>
                  </select>
                </div>
              </div>

              <div className="mb-4 text-sm text-gray-500">
                {filteredReservations.length} réservation(s) trouvée(s)
              </div>

              <div className="space-y-4">
                {filteredReservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    className="border rounded-xl p-4 hover:shadow-md transition cursor-pointer"
                    onClick={() => {
                      setSelectedReservation(reservation);
                      setShowReservationDetail(true);
                    }}
                  >
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-800">
                            {reservation.reservation_number}
                          </span>
                          {getStatusBadge(reservation.status)}
                        </div>
                        {reservation.amadeus_pnr && (
                          <div className="text-sm text-gray-500">
                            PNR: {reservation.amadeus_pnr}
                          </div>
                        )}
                        <div className="text-sm text-gray-600 mt-1">
                          {getFlightDetailsDisplay(reservation)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-[#00C0E8]">
                          {reservation.total_price} {reservation.currency}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(reservation.created_at).toLocaleDateString(
                            "fr-FR",
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span className="text-gray-600">
                          {reservation.trip_type === "ALLER_SIMPLE"
                            ? "Aller simple"
                            : "Aller-retour"}
                        </span>
                      </div>
                      <div className="flex gap-3">
                        {reservation.status === "CONFIRMED" &&
                          (() => {
                            // Check if flight has already departed
                            const hasFlightDeparted =
                              reservation.flight_segments &&
                              reservation.flight_segments.length > 0 &&
                              new Date(
                                reservation.flight_segments[0].departure_date,
                              ) < new Date();

                            // Don't show cancel button if flight has departed
                            if (hasFlightDeparted) {
                              return null;
                            }

                            return (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openCancelModal(reservation);
                                }}
                                className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
                              >
                                <FaTrashAlt className="w-3 h-3" />
                                Annuler
                              </button>
                            );
                          })()}
                        {reservation.status === "CANCELLED" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openRefundModal(reservation);
                            }}
                            className="text-orange-600 hover:text-orange-700 text-sm flex items-center gap-1"
                          >
                            <FaMoneyBillWave className="w-3 h-3" />
                            Demander remboursement
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedReservation(reservation);
                            setShowReservationDetail(true);
                          }}
                          className="text-[#00C0E8] hover:text-[#0096b8] text-sm font-medium"
                        >
                          Voir détails →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredReservations.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <FaPlane className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Aucune réservation trouvée</p>
                    <button
                      onClick={() => (window.location.href = "/")}
                      className="mt-4 px-4 py-2 bg-[#00C0E8] text-white rounded-lg hover:bg-[#0096b8] transition"
                    >
                      Réserver un vol
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Reports Tab */}
          {activeTab === "reports" && (
            <motion.div
              key="reports"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-xl p-6"
            >
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  Support client
                </h2>
                <p className="text-gray-600">
                  Besoin d'aide ? Envoyez-nous un rapport, une réclamation ou
                  une suggestion.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FaPaperPlane className="text-[#00C0E8]" />
                    Envoyer un rapport
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 text-sm mb-2">
                        Catégorie *
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {reportCategories.map((cat) => {
                          const Icon = cat.icon;
                          return (
                            <button
                              key={cat.value}
                              onClick={() =>
                                setReportData((prev) => ({
                                  ...prev,
                                  category: cat.value,
                                }))
                              }
                              className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${
                                reportData.category === cat.value
                                  ? "border-[#00C0E8] bg-[#00C0E8]/10 text-[#00C0E8]"
                                  : "border-gray-200 hover:border-gray-300 text-gray-600"
                              }`}
                            >
                              <Icon
                                className={`w-4 h-4 ${reportData.category === cat.value ? "text-[#00C0E8]" : cat.color}`}
                              />
                              <span className="text-sm">{cat.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm mb-2">
                        Sujet
                      </label>
                      <input
                        type="text"
                        value={reportData.subject}
                        onChange={(e) =>
                          setReportData((prev) => ({
                            ...prev,
                            subject: e.target.value,
                          }))
                        }
                        placeholder="Ex: Problème de connexion..."
                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:border-[#00C0E8] focus:ring-2 focus:ring-[#00C0E8]/20"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm mb-2">
                        Réservation concernée
                      </label>
                      <select
                        value={reportData.reservation_id || ""}
                        onChange={(e) =>
                          setReportData((prev) => ({
                            ...prev,
                            reservation_id: e.target.value || null,
                          }))
                        }
                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:border-[#00C0E8]"
                      >
                        <option value="">
                          -- Sélectionnez une réservation --
                        </option>
                        {reservations.map((res) => (
                          <option key={res.id} value={res.id}>
                            {res.reservation_number} - {res.total_price}{" "}
                            {res.currency}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm mb-2">
                        Message *
                      </label>
                      <textarea
                        value={reportData.message}
                        onChange={(e) =>
                          setReportData((prev) => ({
                            ...prev,
                            message: e.target.value,
                          }))
                        }
                        rows="5"
                        placeholder="Décrivez votre problème en détail..."
                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:border-[#00C0E8] focus:ring-2 focus:ring-[#00C0E8]/20 resize-none"
                      />
                    </div>

                    <button
                      onClick={handleSubmitReport}
                      disabled={
                        isSubmittingReport || !reportData.message.trim()
                      }
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#00C0E8] text-white rounded-xl font-semibold hover:bg-[#0096b8] transition disabled:opacity-50"
                    >
                      {isSubmittingReport ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <FaPaperPlane className="w-4 h-4" />
                      )}
                      Envoyer le rapport
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FaQuestionCircle className="text-[#00C0E8]" />
                    Informations utiles
                  </h3>

                  <div className="bg-blue-50 rounded-xl p-4 mb-4">
                    <h4 className="font-semibold text-blue-800 mb-2">
                      📋 Délais de réponse
                    </h4>
                    <p className="text-sm text-blue-700">
                      Réponse sous 24 à 48 heures ouvrables.
                    </p>
                  </div>

                  <div className="bg-green-50 rounded-xl p-4 mb-4">
                    <h4 className="font-semibold text-green-800 mb-2">
                      💰 Remboursements
                    </h4>
                    <p className="text-sm text-green-700">
                      Traitement sous 7 à 14 jours ouvrés.
                    </p>
                  </div>

                  <div className="bg-orange-50 rounded-xl p-4">
                    <h4 className="font-semibold text-orange-800 mb-2">
                      ❌ Annulations
                    </h4>
                    <p className="text-sm text-orange-700">
                      Des frais peuvent s'appliquer selon les conditions.
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t">
                    <h4 className="font-semibold text-gray-800 mb-3">
                      Contact direct
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p className="flex items-center gap-2">
                        <FaEnvelope className="text-gray-400" />
                        <span>support@flycompany.com</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <FaPhone className="text-gray-400" />
                        <span>+213 (0) 123 456 789</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Password Tab */}
          {activeTab === "password" && (
            <motion.div
              key="password"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-xl p-6"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Changer le mot de passe
              </h2>

              <div className="max-w-md mx-auto space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Ancien mot de passe *
                  </label>
                  <input
                    type="password"
                    value={passwordData.old_password}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        old_password: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:border-[#00C0E8] focus:ring-2 focus:ring-[#00C0E8]/20"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Nouveau mot de passe *
                  </label>
                  <input
                    type="password"
                    value={passwordData.new_password}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        new_password: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:border-[#00C0E8] focus:ring-2 focus:ring-[#00C0E8]/20"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum 8 caractères
                  </p>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Confirmer *
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirm_password}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        confirm_password: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:border-[#00C0E8] focus:ring-2 focus:ring-[#00C0E8]/20"
                  />
                </div>

                <button
                  onClick={handleChangePassword}
                  disabled={isSaving}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#00C0E8] text-white rounded-xl font-semibold hover:bg-[#0096b8] transition disabled:opacity-50"
                >
                  {isSaving ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <FaLock className="w-4 h-4" />
                  )}
                  Changer le mot de passe
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Reservation Detail Modal */}
      <AnimatePresence>
        {showReservationDetail && selectedReservation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-[600px] max-h-[90vh] overflow-hidden"
            >
              <div className="bg-gradient-to-r from-[#00C0E8] to-[#0096b8] px-6 py-4 flex justify-between items-center">
                <h3 className="text-white font-bold text-lg">
                  Détails de la réservation
                </h3>
                <button
                  onClick={() => setShowReservationDetail(false)}
                  className="text-white hover:bg-white/20 rounded-lg p-1 transition"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-130px)]">
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">N° réservation</p>
                        <p className="font-semibold">
                          {selectedReservation.reservation_number}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">PNR</p>
                        <p className="font-semibold">
                          {selectedReservation.amadeus_pnr || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Statut</p>
                        <p>{getStatusBadge(selectedReservation.status)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">
                          Date de création
                        </p>
                        <p className="font-semibold">
                          {new Date(
                            selectedReservation.created_at,
                          ).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Type de vol</p>
                        <p>
                          {selectedReservation.trip_type === "ALLER_SIMPLE"
                            ? "Aller simple"
                            : "Aller-retour"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Prix total</p>
                        <p className="font-bold text-[#00C0E8]">
                          {selectedReservation.total_price}{" "}
                          {selectedReservation.currency}
                        </p>
                      </div>
                    </div>
                  </div>

                  {selectedReservation.flight_segments &&
                    selectedReservation.flight_segments.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Vols</h4>
                        {selectedReservation.flight_segments.map(
                          (segment, idx) => (
                            <div
                              key={idx}
                              className="bg-gray-50 rounded-xl p-3 mb-2"
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="font-semibold">
                                    {segment.origin} → {segment.destination}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {segment.departure_date} à{" "}
                                    {segment.departure_time}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-semibold">
                                    {segment.price}{" "}
                                    {selectedReservation.currency}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cancellation Confirmation Modal */}
      <AnimatePresence>
        {showCancelConfirmModal && cancelConfirmReservation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-[550px] max-h-[90vh] overflow-y-auto"
            >
              <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 flex justify-between items-center sticky top-0">
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                  <FaTrashAlt className="w-5 h-5" />
                  Confirmer l'annulation
                </h3>
                <button
                  onClick={() => {
                    setShowCancelConfirmModal(false);
                    setCancelConfirmReservation(null);
                  }}
                  className="text-white hover:bg-white/20 rounded-lg p-1 transition"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                {/* Reservation Summary */}
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <p className="text-sm text-gray-600">Réservation</p>
                  <p className="font-semibold">
                    {cancelConfirmReservation.reservation_number}
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Vol</p>
                      <p className="text-sm font-medium">
                        {getFlightDetailsDisplay(cancelConfirmReservation)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Montant payé</p>
                      <p className="text-lg font-bold text-red-600">
                        {cancelConfirmReservation.total_price}{" "}
                        {cancelConfirmReservation.currency}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Refund Eligibility */}
                {isCheckingEligibility ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-8 h-8 border-4 border-[#00C0E8] border-t-transparent rounded-full animate-spin"></div>
                    <span className="ml-3 text-gray-600">
                      Vérification de l'éligibilité...
                    </span>
                  </div>
                ) : (
                  cancelEligibility && (
                    <div
                      className={`rounded-xl p-4 mb-4 ${cancelEligibility.eligible ? "bg-green-50 border border-green-200" : "bg-gray-50"}`}
                    >
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        {cancelEligibility.eligible ? (
                          <FaCheckCircle className="text-green-600" />
                        ) : (
                          <FaExclamationTriangle className="text-orange-500" />
                        )}
                        Informations de remboursement
                      </h4>

                      {cancelEligibility.eligible ? (
                        <>
                          <p className="text-sm text-gray-700 mb-2">
                            {cancelEligibility.reason}
                          </p>
                          <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-green-200">
                            <div>
                              <p className="text-xs text-gray-500">
                                Montant total
                              </p>
                              <p className="font-semibold">
                                {cancelEligibility.total_amount}{" "}
                                {cancelEligibility.currency}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">
                                Frais d'annulation
                              </p>
                              <p className="font-semibold text-orange-600">
                                -{cancelEligibility.cancellation_fee}{" "}
                                {cancelEligibility.currency}
                              </p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-xs text-gray-500">
                                Montant remboursable
                              </p>
                              <p className="text-xl font-bold text-green-600">
                                {cancelEligibility.estimated_refund}{" "}
                                {cancelEligibility.currency}
                              </p>
                              <p className="text-xs text-gray-500">
                                ({cancelEligibility.refund_percentage}% du
                                montant)
                              </p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <p className="text-sm text-gray-600">
                          {cancelEligibility.reason}
                        </p>
                      )}
                    </div>
                  )
                )}

                {/* Reason Input */}
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm mb-2">
                    Raison de l'annulation *
                  </label>
                  <textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    rows="3"
                    placeholder="Expliquez la raison de votre annulation..."
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 resize-none"
                  />
                </div>

                {/* Warning */}
                {cancelEligibility?.eligible &&
                  cancelEligibility.refund_percentage < 100 && (
                    <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-start gap-2">
                        <FaExclamationTriangle className="text-yellow-600 mt-0.5" />
                        <div className="text-sm text-yellow-800">
                          <p className="font-semibold">
                            Information importante
                          </p>
                          <p>
                            Des frais d'annulation de{" "}
                            {cancelEligibility.cancellation_fee}{" "}
                            {cancelEligibility.currency} seront appliqués.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowCancelConfirmModal(false);
                      setCancelConfirmReservation(null);
                      setCancelReason("");
                    }}
                    className="flex-1 px-4 py-2 border rounded-xl hover:bg-gray-50 transition"
                  >
                    Retour
                  </button>
                  <button
                    onClick={handleCancelReservation}
                    disabled={isSubmittingReport || !cancelReason.trim()}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition disabled:opacity-50"
                  >
                    {isSubmittingReport ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <FaTrashAlt className="w-4 h-4" />
                    )}
                    Confirmer l'annulation
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Refund Modal */}
      <AnimatePresence>
        {showRefundModal && refundReservation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-[500px]"
            >
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 flex justify-between items-center">
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                  <FaMoneyBillWave className="w-5 h-5" />
                  Demande de remboursement
                </h3>
                <button
                  onClick={() => {
                    setShowRefundModal(false);
                    setRefundReservation(null);
                  }}
                  className="text-white hover:bg-white/20 rounded-lg p-1 transition"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <p className="text-sm text-gray-600">Réservation</p>
                  <p className="font-semibold">
                    {refundReservation.reservation_number}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Montant</p>
                  <p className="font-bold text-lg text-orange-600">
                    {refundReservation.total_price} {refundReservation.currency}
                  </p>
                </div>

                {refundEligibility && (
                  <div className="bg-green-50 rounded-xl p-4 mb-4 border border-green-200">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-500">Montant total</p>
                        <p className="font-semibold">
                          {refundEligibility.total_amount}{" "}
                          {refundEligibility.currency}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">
                          Montant remboursé
                        </p>
                        <p className="font-bold text-green-600">
                          {refundEligibility.estimated_refund}{" "}
                          {refundEligibility.currency}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm mb-2">
                    Raison *
                  </label>
                  <textarea
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    rows="4"
                    placeholder="Expliquez la raison..."
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowRefundModal(false);
                      setRefundReservation(null);
                      setRefundReason("");
                    }}
                    className="flex-1 px-4 py-2 border rounded-xl hover:bg-gray-50 transition"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleRequestRefund}
                    disabled={isSubmittingReport || !refundReason.trim()}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition disabled:opacity-50"
                  >
                    {isSubmittingReport ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <FaMoneyBillWave className="w-4 h-4" />
                    )}
                    Envoyer
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
