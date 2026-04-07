import { useState, useEffect } from "react";
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import axiosInstance, { isAuthenticated, logout } from "../../../../api/axiosInstance";

// Status Badge Component
const StatusBadge = ({ status }) => {
  const config = {
    CONFIRMED: { label: "Confirmé", bg: "bg-green-100", text: "text-green-800", icon: "✓" },
    CANCELLED: { label: "Annulé", bg: "bg-red-100", text: "text-red-800", icon: "✗" },
    PENDING_PRICE: { label: "En attente", bg: "bg-yellow-100", text: "text-yellow-800", icon: "⏳" },
    PRICE_CONFIRMED: { label: "Prix confirmé", bg: "bg-blue-100", text: "text-blue-800", icon: "✓" },
    FAILED: { label: "Échoué", bg: "bg-red-100", text: "text-red-800", icon: "✗" },
    EXPIRED: { label: "Expiré", bg: "bg-gray-100", text: "text-gray-800", icon: "⌛" },
  };
  const { label, bg, text, icon } = config[status] || config.PENDING_PRICE;
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
      <span>{icon}</span>
      {label}
    </span>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, color }) => (
  <div className={`bg-gradient-to-r ${color} rounded-xl p-4 text-white shadow-lg`}>
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm opacity-80">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
      <div className="text-2xl">{icon}</div>
    </div>
  </div>
);

export function Bookings() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    pending: 0,
    cancelled: 0,
    failed: 0,
    expired: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    // Check authentication before loading
    if (!isAuthenticated()) {
      toast.error("Veuillez vous connecter pour accéder à cette page");
      logout();
      return;
    }
    fetchAllReservations();
  }, []);

  // Fetch all reservations with pagination handling
  const fetchAllReservations = async () => {
    setIsLoading(true);
    try {
      let allReservations = [];
      let page = 1;
      let hasMore = true;
      
      // First, test if we can access the API with current token
      const testResponse = await axiosInstance.get('/ms-reservation/reservations/');
      console.log('API access test:', testResponse.status);
      
      // Fetch all pages
      while (hasMore) {
        try {
          console.log(`Fetching page ${page}...`);
          const response = await axiosInstance.get(`/ms-reservation/reservations/?page=${page}`);
          const data = response.data;
          
          if (data.results && data.results.length > 0) {
            allReservations = [...allReservations, ...data.results];
            page++;
            hasMore = data.next !== null;
            console.log(`Page ${page-1} fetched: ${data.results.length} reservations`);
          } else {
            hasMore = false;
          }
        } catch (error) {
          console.error(`Error fetching page ${page}:`, error);
          if (error.response?.status === 401) {
            toast.error("Session expirée, veuillez vous reconnecter");
            logout();
            return;
          }
          hasMore = false;
        }
      }
      
      console.log("Total reservations fetched:", allReservations.length);
      setReservations(allReservations);
      
      // Calculate stats
      const confirmed = allReservations.filter(r => r.status === "CONFIRMED").length;
      const pending = allReservations.filter(r => r.status === "PENDING_PRICE" || r.status === "PRICE_CONFIRMED").length;
      const cancelled = allReservations.filter(r => r.status === "CANCELLED").length;
      const failed = allReservations.filter(r => r.status === "FAILED").length;
      const expired = allReservations.filter(r => r.status === "EXPIRED").length;
      const totalRevenue = allReservations
        .filter(r => r.status === "CONFIRMED")
        .reduce((sum, r) => sum + parseFloat(r.total_price || 0), 0);
      
      setStats({
        total: allReservations.length,
        confirmed,
        pending,
        cancelled,
        failed,
        expired,
        totalRevenue,
      });
      
      if (allReservations.length > 0) {
        toast.success(`${allReservations.length} réservations chargées`);
      } else {
        toast.info("Aucune réservation trouvée");
      }
    } catch (error) {
      console.error("Error fetching reservations:", error);
      if (error.response?.status === 401) {
        toast.error("Session expirée, veuillez vous reconnecter");
        logout();
      } else {
        toast.error("Erreur lors du chargement des réservations");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReservationDetails = async (reservationId) => {
    setIsLoadingDetails(true);
    try {
      const response = await axiosInstance.get(`/ms-reservation/reservations/${reservationId}/full-details/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching details:", error);
      if (error.response?.status === 401) {
        toast.error("Session expirée, veuillez vous reconnecter");
        logout();
      } else {
        toast.error("Erreur lors du chargement des détails");
      }
      return null;
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const fetchVoyageurDetails = async (voyageurId) => {
    try {
      const response = await axiosInstance.get(`/auth-service/auth/voyageurs/${voyageurId}/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching voyageur:", error);
      return null;
    }
  };

  const handleViewDetails = async (booking) => {
    setSelectedBooking(null);
    setDialogOpen(true);
    
    const details = await fetchReservationDetails(booking.id);
    
    if (details) {
      if (details.voyageur) {
        const voyageurDetails = await fetchVoyageurDetails(details.voyageur);
        setSelectedBooking({ ...details, voyageur_details: voyageurDetails });
      } else {
        setSelectedBooking(details);
      }
    }
  };

  const filteredReservations = reservations.filter((res) => {
    const matchesSearch =
      res.reservation_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (res.amadeus_pnr && res.amadeus_pnr.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || res.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExport = () => {
    try {
      const dataToExport = filteredReservations.map((r) => ({
        'Numéro': r.reservation_number,
        'PNR': r.amadeus_pnr || 'N/A',
        'Statut': getStatusLabel(r.status),
        'Type': r.trip_type === 'ALLER_SIMPLE' ? 'Aller simple' : 'Aller-retour',
        'Prix': `${parseFloat(r.total_price).toLocaleString()} ${r.currency}`,
        'Date': new Date(r.created_at).toLocaleDateString('fr-FR'),
      }));
      
      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Réservations');
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), `reservations_${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success("Export réussi !");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Erreur lors de l'export");
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      CONFIRMED: "Confirmé",
      CANCELLED: "Annulé",
      PENDING_PRICE: "En attente",
      PRICE_CONFIRMED: "Prix confirmé",
      FAILED: "Échoué",
      EXPIRED: "Expiré",
    };
    return labels[status] || "En attente";
  };

  const getTripTypeLabel = (type) => {
    return type === 'ALLER_SIMPLE' ? 'Aller simple' : 'Aller-retour';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
              {[1,2,3,4,5,6].map(i => <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>)}
            </div>
            <div className="h-12 bg-gray-200 rounded mb-4"></div>
            {[1,2,3,4,5].map(i => <div key={i} className="h-16 bg-gray-200 rounded mb-2"></div>)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Gestion des Réservations</h1>
          <p className="text-gray-500 mt-1">Gérez toutes les réservations de vols, suivez les paiements et les statuts</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <StatCard title="Total" value={stats.total} icon="📊" color="from-purple-500 to-indigo-600" />
          <StatCard title="Confirmées" value={stats.confirmed} icon="✓" color="from-cyan-500 to-blue-600" />
          <StatCard title="En attente" value={stats.pending} icon="⏳" color="from-amber-500 to-orange-600" />
          <StatCard title="Expirées" value={stats.expired} icon="⌛" color="from-gray-500 to-gray-700" />
          <StatCard title="Échouées" value={stats.failed} icon="✗" color="from-red-500 to-red-700" />
          <StatCard title="Revenus" value={`${stats.totalRevenue.toLocaleString()} DZD`} icon="💰" color="from-emerald-500 to-teal-600" />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Rechercher par numéro de réservation ou PNR..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
              />
            </div>
            <div className="w-full md:w-64">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
              >
                <option value="all">Tous les statuts</option>
                <option value="CONFIRMED">Confirmé</option>
                <option value="PENDING_PRICE">En attente de prix</option>
                <option value="PRICE_CONFIRMED">Prix confirmé</option>
                <option value="CANCELLED">Annulé</option>
                <option value="EXPIRED">Expiré</option>
                <option value="FAILED">Échoué</option>
              </select>
            </div>
            <button
              onClick={handleExport}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
            >
              📥 Exporter
            </button>
            <button
              onClick={fetchAllReservations}
              className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition flex items-center gap-2"
            >
              🔄 Rafraîchir
            </button>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-3 text-sm text-gray-500">
          {filteredReservations.length} réservation(s) trouvée(s) sur {reservations.length} au total
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Réservation</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Client ID</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Type</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Date</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Montant</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Statut</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReservations.map((reservation) => (
                  <tr key={reservation.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-800">{reservation.reservation_number}</div>
                      {reservation.amadeus_pnr && (
                        <div className="text-xs text-gray-500 font-mono">PNR: {reservation.amadeus_pnr}</div>
                      )}
                      <div className="text-xs text-gray-400">ID: {reservation.id}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs">
                        👤 #{reservation.voyageur || "N/A"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-sm">
                        ✈️ {getTripTypeLabel(reservation.trip_type)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(reservation.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-cyan-600">
                        {parseFloat(reservation.total_price).toLocaleString()} {reservation.currency}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={reservation.status} />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleViewDetails(reservation)}
                        className="text-cyan-500 hover:text-cyan-700 transition p-1"
                        title="Voir détails"
                      >
                        👁️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredReservations.length === 0 && (
            <div className="text-center py-12">
              <div className="text-5xl mb-3">✈️</div>
              <h3 className="text-lg font-medium text-gray-700">Aucune réservation trouvée</h3>
              <p className="text-gray-400 mt-1">Essayez de modifier vos critères de recherche</p>
            </div>
          )}
        </div>
      </div>

      {/* Simple Modal Dialog */}
      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setDialogOpen(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4 flex justify-between items-center">
              <h2 className="text-white font-bold text-lg">Détails de la réservation</h2>
              <button onClick={() => setDialogOpen(false)} className="text-white hover:bg-white/20 rounded-lg p-1 transition">
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-130px)]">
              {isLoadingDetails ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
                </div>
              ) : selectedBooking ? (
                <>
                  {/* Status Alert */}
                  <div className={`p-4 rounded-xl mb-4 ${selectedBooking.status === "CONFIRMED" ? "bg-green-50 border border-green-200" : "bg-yellow-50 border border-yellow-200"}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{selectedBooking.status === "CONFIRMED" ? "✅" : "⚠️"}</span>
                      <span className="font-semibold">Statut: {getStatusLabel(selectedBooking.status)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Réservation créée le {new Date(selectedBooking.created_at).toLocaleString('fr-FR')}
                      {selectedBooking.confirmation_date && ` • Confirmée le ${new Date(selectedBooking.confirmation_date).toLocaleString('fr-FR')}`}
                    </p>
                  </div>

                  {/* Voyageur Information */}
                  {selectedBooking.voyageur_details && (
                    <div className="bg-blue-50 rounded-xl p-4 mb-4">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">👤 Informations du client</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500">Nom complet:</span>
                          <p className="font-medium">{selectedBooking.voyageur_details.prenom} {selectedBooking.voyageur_details.nom}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Email:</span>
                          <p>{selectedBooking.voyageur_details.email || "N/A"}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Téléphone:</span>
                          <p>{selectedBooking.voyageur_details.telephone || "N/A"}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Wilaya / Commune:</span>
                          <p>{selectedBooking.voyageur_details.wilaya || "N/A"} / {selectedBooking.voyageur_details.commune || "N/A"}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Date de naissance:</span>
                          <p>{selectedBooking.voyageur_details.date_naissance ? new Date(selectedBooking.voyageur_details.date_naissance).toLocaleDateString('fr-FR') : "N/A"}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Passeport:</span>
                          <p>{selectedBooking.voyageur_details.num_passport || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* General Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="font-semibold mb-2">Informations générales</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">N° réservation:</span>
                          <span className="font-medium">{selectedBooking.reservation_number}</span>
                        </div>
                        {selectedBooking.amadeus_pnr && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Code PNR:</span>
                            <span className="font-mono">{selectedBooking.amadeus_pnr}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-500">Type de vol:</span>
                          <span>{getTripTypeLabel(selectedBooking.trip_type)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Nombre de passagers:</span>
                          <span>{selectedBooking.total_passengers || selectedBooking.passengers?.length || 1}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="font-semibold mb-2">Paiement</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Montant total:</span>
                          <span className="font-bold text-cyan-600">{parseFloat(selectedBooking.total_price).toLocaleString()} {selectedBooking.currency}</span>
                        </div>
                        {selectedBooking.payment && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Méthode:</span>
                              <span>{selectedBooking.payment.payment_method === "CARD" ? "Carte bancaire" : 
                                     selectedBooking.payment.payment_method === "DELIVERY" ? "Livraison" : 
                                     selectedBooking.payment.payment_method === "CASH" ? "Espèces" : selectedBooking.payment.payment_method}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Statut paiement:</span>
                              <span className={`px-2 py-0.5 rounded-full text-xs ${selectedBooking.payment.status === "COMPLETED" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                                {selectedBooking.payment.status === "COMPLETED" ? "Payé" : 
                                 selectedBooking.payment.status === "PENDING" ? "En attente" : 
                                 selectedBooking.payment.status === "FAILED" ? "Échoué" : selectedBooking.payment.status}
                              </span>
                            </div>
                            {selectedBooking.payment.completed_at && (
                              <div className="flex justify-between">
                                <span className="text-gray-500">Date paiement:</span>
                                <span>{new Date(selectedBooking.payment.completed_at).toLocaleString('fr-FR')}</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Flight Segments */}
                  {selectedBooking.flight_segments && selectedBooking.flight_segments.length > 0 && (
                    <div className="mb-4">
                      <h3 className="font-semibold mb-2">✈️ Détails des vols</h3>
                      {selectedBooking.flight_segments.map((segment, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-xl p-4 mb-2">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            <div>
                              <span className="text-gray-500">Vol:</span>
                              <p className="font-medium">{segment.origin} → {segment.destination}</p>
                              <p className="text-xs text-gray-400">{segment.airline_name}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Départ:</span>
                              <p>{new Date(segment.departure_datetime).toLocaleString('fr-FR')}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Arrivée:</span>
                              <p>{new Date(segment.arrival_datetime).toLocaleString('fr-FR')}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Durée:</span>
                              <p>{segment.duration}</p>
                              {segment.price && <p className="text-xs text-cyan-600">{parseFloat(segment.price).toLocaleString()} {selectedBooking.currency}</p>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Passengers */}
                  {selectedBooking.passengers && selectedBooking.passengers.length > 0 && (
                    <div className="mb-4">
                      <h3 className="font-semibold mb-2">👥 Passagers ({selectedBooking.passengers.length})</h3>
                      {selectedBooking.passengers.map((passenger, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-xl p-4 mb-2">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            <div>
                              <span className="text-gray-500">Nom:</span>
                              <p className="font-medium">{passenger.prenom} {passenger.nom}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Date naissance:</span>
                              <p>{passenger.date_naissance ? new Date(passenger.date_naissance).toLocaleDateString('fr-FR') : 'N/A'}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Passeport:</span>
                              <p className="font-mono">{passenger.num_passport || "N/A"}</p>
                              {passenger.date_exp_passport && (
                                <p className="text-xs text-gray-400">Exp: {new Date(passenger.date_exp_passport).toLocaleDateString('fr-FR')}</p>
                              )}
                            </div>
                            <div>
                              <span className="text-gray-500">Enregistrement:</span>
                              <p>{passenger.check_in_status ? "✅ Enregistré" : "⏳ Non enregistré"}</p>
                              {passenger.seat_number && <p className="text-xs">Siège: {passenger.seat_number}</p>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Cancellation Info */}
                  {selectedBooking.can_cancel && (
                    <div className="bg-blue-50 rounded-xl p-3 mt-2">
                      <p className="text-sm text-blue-700">
                        ⚠️ Annulation possible jusqu'au {new Date(selectedBooking.can_cancel).toLocaleString('fr-FR')}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-4">Aucune donnée disponible</div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t px-6 py-4 flex justify-end gap-2">
              <button onClick={() => setDialogOpen(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition">
                Fermer
              </button>
              <button onClick={() => window.print()} className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition">
                🖨️ Imprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}