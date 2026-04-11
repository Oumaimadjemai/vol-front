import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Eye, Download, Calendar, CheckCircle, XCircle, Clock, Plus, Plane, Users, CreditCard, MapPin, CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import FlightSearch from "../../../Vol/SearchFlight/FlightSearchPage";
import { useUserRole } from "../../../../hooks/useUserRole";
import axiosInstance from "../../../../api/axiosInstance";
import * as XLSX from 'xlsx';
// Card Component
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl shadow-md ${className}`}>{children}</div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

// Badge Component
const Badge = ({ children, className = "" }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
    {children}
  </span>
);

// Button Component
const Button = ({ children, onClick, variant = "default", className = "", disabled = false }) => {
  const baseStyles = "inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    default: "bg-[#00C0E8] text-white hover:bg-[#00a8cc] focus:ring-[#00C0E8]",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
    destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-600",
    ghost: "text-gray-600 hover:bg-gray-100 focus:ring-gray-500",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// Input Component
const Input = ({ placeholder, value, onChange, className = "" }) => (
  <input
    type="text"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C0E8] focus:border-transparent transition-all ${className}`}
  />
);

// Dialog Component
const Dialog = ({ children, open, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {children}
        <div className="flex justify-end p-6 border-t border-gray-200 gap-2 sticky bottom-0 bg-white">
          <Button onClick={onClose} variant="outline">
            Fermer
          </Button>
        </div>
      </div>
    </div>
  );
};

const DialogHeader = ({ children }) => (
  <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">{children}</div>
);

const DialogTitle = ({ children }) => (
  <h2 className="text-xl font-semibold text-gray-900">{children}</h2>
);

const DialogDescription = ({ children }) => (
  <p className="text-sm text-gray-600 mt-1">{children}</p>
);

// Table Components
const Table = ({ children }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">{children}</table>
  </div>
);

const TableHeader = ({ children }) => (
  <thead className="bg-gray-50">{children}</thead>
);

const TableBody = ({ children }) => (
  <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>
);

const TableRow = ({ children, className = "" }) => (
  <tr className={`hover:bg-gray-50 transition-colors ${className}`}>{children}</tr>
);

const TableHead = ({ children, className = "" }) => (
  <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}>
    {children}
  </th>
);

const TableCell = ({ children, className = "" }) => (
  <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${className}`}>
    {children}
  </td>
);

export function Bookings() {
  const navigate = useNavigate();
  const { role, loading: roleLoading } = useUserRole();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("bookings");
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const isAdmin = role === "admin";

  // Fetch all bookings with pagination
  const fetchBookings = async (page = 1) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/ms-reservation/reservations/?page=${page}`);
      const data = response.data;
      
      // Transform to display format using the enriched data from backend
      const formattedBookings = data.results.map(res => ({
        id: res.id,
        reservation_number: res.reservation_number,
        voyageur_id: res.voyageur,
        status: getStatusLabel(res.status),
        original_status: res.status,
        trip_type: res.trip_type,
        total_price: `${parseFloat(res.total_price).toLocaleString()} ${res.currency}`,
        total_price_raw: parseFloat(res.total_price),
        currency: res.currency,
        created_at: res.created_at,
        amadeus_pnr: res.amadeus_pnr,
        passenger_count: res.passenger_count || 0,
        passenger_names: res.passenger_names || [],
        flight_origin: res.flight_origin,
        flight_destination: res.flight_destination,
        departure_date: res.departure_date,
        can_cancel: res.status === "CONFIRMED",
      }));
      
      setBookings(formattedBookings);
      setTotalCount(data.count);
      setTotalPages(Math.ceil(data.count / 10));
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Erreur lors du chargement des réservations");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(1);
  }, []);

  // Fetch full details including passengers and flight segments
  const fetchBookingDetails = async (bookingId) => {
    setIsLoadingDetails(true);
    try {
      const response = await axiosInstance.get(`/ms-reservation/reservations/${bookingId}/full-details/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching booking details:", error);
      toast.error("Erreur lors du chargement des détails");
      return null;
    } finally {
      setIsLoadingDetails(false);
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
    return labels[status] || status;
  };

  const getStatusColor = (originalStatus) => {
    switch (originalStatus) {
      case "CONFIRMED":
        return "bg-green-100 text-green-700";
      case "PENDING_PRICE":
      case "PRICE_CONFIRMED":
        return "bg-yellow-100 text-yellow-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      case "FAILED":
        return "bg-red-100 text-red-700";
      case "EXPIRED":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTripTypeLabel = (type) => {
    return type === 'ALLER_SIMPLE' ? 'Aller simple' : 'Aller-retour';
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.reservation_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (booking.amadeus_pnr && booking.amadeus_pnr.toLowerCase().includes(searchTerm.toLowerCase())) ||
      booking.voyageur_id?.toString().includes(searchTerm.toLowerCase()) ||
      booking.passenger_names?.some(name => name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || booking.original_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExport = () => {
    const dataToExport = filteredBookings.map(b => ({
      'Numéro réservation': b.reservation_number,
      'PNR': b.amadeus_pnr || 'N/A',
      'Passagers': b.passenger_names?.join(', ') || 'N/A',
      'Type': getTripTypeLabel(b.trip_type),
      'Vol': `${b.flight_origin || 'N/A'} → ${b.flight_destination || 'N/A'}`,
      'Date départ': b.departure_date ? new Date(b.departure_date).toLocaleDateString('fr-FR') : 'N/A',
      'Date réservation': new Date(b.created_at).toLocaleDateString('fr-FR'),
      'Montant': b.total_price,
      'Statut': b.status,
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Réservations');
    XLSX.writeFile(workbook, `reservations_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success("Export réussi !");
  };

  const handleViewDetails = async (booking) => {
    setSelectedBooking(booking);
    setDialogOpen(true);
    const details = await fetchBookingDetails(booking.id);
    setSelectedBookingDetails(details);
  };

  const handleNewReservation = () => {
    if (isAdmin) {
      navigate("/admin/search");
    } else {
      navigate("/search");
    }
  };

  // Calculate stats
  const totalBookings = totalCount;
  const confirmedCount = bookings.filter(b => b.original_status === "CONFIRMED").length;
  const pendingCount = bookings.filter(b => b.original_status === "PENDING_PRICE" || b.original_status === "PRICE_CONFIRMED").length;
  const cancelledCount = bookings.filter(b => b.original_status === "CANCELLED" || b.original_status === "FAILED" || b.original_status === "EXPIRED").length;
  const totalRevenue = bookings
    .filter(b => b.original_status === "CONFIRMED")
    .reduce((sum, b) => sum + (b.total_price_raw || 0), 0);

  if (roleLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00C0E8]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Réservations</h1>
          <p className="text-gray-600 mt-1">
            Gérez toutes les réservations de vols
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExport} variant="outline">
            <Download className="size-4 mr-2" />
            Exporter
          </Button>
          <Button onClick={handleNewReservation} variant="default">
            <Plus className="size-4 mr-2" />
            Nouvelle réservation
          </Button>
        </div>
      </div>

      {/* Simple Tabs */}
      <div className="w-full">
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("bookings")}
            className={`px-4 py-2 font-medium transition-all relative ${
              activeTab === "bookings"
                ? "text-[#00C0E8] border-b-2 border-[#00C0E8]"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Liste des réservations
          </button>
          <button
            onClick={() => setActiveTab("search")}
            className={`px-4 py-2 font-medium transition-all relative flex items-center gap-2 ${
              activeTab === "search"
                ? "text-[#00C0E8] border-b-2 border-[#00C0E8]"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Plus className="size-4" />
            Rechercher un vol
          </button>
        </div>

        {/* Bookings List Tab */}
        {activeTab === "bookings" && (
          <div className="mt-6 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border-0 shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total</p>
                      <h3 className="text-2xl font-bold mt-1">{totalBookings}</h3>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-xl">
                      <Calendar className="size-5 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Confirmées</p>
                      <h3 className="text-2xl font-bold mt-1 text-green-600">{confirmedCount}</h3>
                    </div>
                    <div className="bg-green-50 p-3 rounded-xl">
                      <CheckCircle className="size-5 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">En attente</p>
                      <h3 className="text-2xl font-bold mt-1 text-yellow-600">{pendingCount}</h3>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-xl">
                      <Clock className="size-5 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Annulées/Échouées</p>
                      <h3 className="text-2xl font-bold mt-1 text-red-600">{cancelledCount}</h3>
                    </div>
                    <div className="bg-red-50 p-3 rounded-xl">
                      <XCircle className="size-5 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Card */}
            <Card className="border-0 shadow-md bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-80">Revenu total</p>
                    <h3 className="text-3xl font-bold mt-1">{totalRevenue.toLocaleString()} DZD</h3>
                  </div>
                  <div className="bg-white/20 p-3 rounded-xl">
                    <CreditCard className="size-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par n° réservation, PNR, ID voyageur ou nom passager..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full md:w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C0E8]"
              >
                <option value="all">Tous les statuts</option>
                <option value="CONFIRMED">Confirmé</option>
                <option value="PENDING_PRICE">En attente de prix</option>
                <option value="PRICE_CONFIRMED">Prix confirmé</option>
                <option value="CANCELLED">Annulé</option>
                <option value="FAILED">Échoué</option>
                <option value="EXPIRED">Expiré</option>
              </select>
            </div>

            {/* Bookings Table */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>N° Réservation</TableHead>
                        <TableHead>PNR</TableHead>
                        <TableHead>Passagers</TableHead>
                        <TableHead>Vol</TableHead>
                        <TableHead>Date départ</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">{booking.reservation_number}</TableCell>
                          <TableCell>
                            {booking.amadeus_pnr ? (
                              <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                                {booking.amadeus_pnr.substring(0, 15)}...
                              </span>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div>
                              <span className="font-medium">{booking.passenger_count} passager(s)</span>
                              {booking.passenger_names && booking.passenger_names.length > 0 && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {booking.passenger_names.slice(0, 2).join(', ')}
                                  {booking.passenger_names.length > 2 && ` +${booking.passenger_names.length - 2}`}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Plane className="size-3 text-cyan-500" />
                              <span className="text-sm">
                                {booking.flight_origin || '?'} → {booking.flight_destination || '?'}
                              </span>
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              {getTripTypeLabel(booking.trip_type)}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            {booking.departure_date ? new Date(booking.departure_date).toLocaleDateString('fr-FR') : 'N/A'}
                          </TableCell>
                          <TableCell className="font-semibold text-cyan-600">
                            {booking.total_price}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(booking.original_status)}>
                              {booking.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              onClick={() => handleViewDetails(booking)}
                            >
                              <Eye className="size-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {filteredBookings.length === 0 && (
                  <div className="text-center py-12">
                    <Plane className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500">Aucune réservation trouvée</p>
                  </div>
                )}
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between p-4 border-t">
                    <div className="text-sm text-gray-600">
                      Affichage de {(currentPage - 1) * 10 + 1} à {Math.min(currentPage * 10, totalCount)} sur {totalCount} réservations
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        disabled={currentPage === 1}
                        onClick={() => fetchBookings(currentPage - 1)}
                      >
                        <ChevronLeft className="size-4" />
                        Précédent
                      </Button>
                      <Button
                        variant="outline"
                        disabled={currentPage === totalPages}
                        onClick={() => fetchBookings(currentPage + 1)}
                      >
                        Suivant
                        <ChevronRight className="size-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Flight Search Tab */}
        {activeTab === "search" && (
          <div className="mt-6">
            <FlightSearch />
          </div>
        )}
      </div>

      {/* Booking Details Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogHeader>
          <DialogTitle>
            Détails de la réservation {selectedBooking?.reservation_number}
          </DialogTitle>
          <DialogDescription>
            Informations complètes sur la réservation
          </DialogDescription>
        </DialogHeader>
        {isLoadingDetails ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00C0E8]"></div>
          </div>
        ) : selectedBookingDetails ? (
          <div className="p-6 space-y-6">
            {/* Status Banner */}
            <div className={`p-4 rounded-xl ${selectedBookingDetails.status === "CONFIRMED" ? "bg-green-50 border border-green-200" : "bg-yellow-50 border border-yellow-200"}`}>
              <div className="flex items-center gap-2">
                {selectedBookingDetails.status === "CONFIRMED" ? (
                  <CheckCircle className="size-5 text-green-600" />
                ) : (
                  <Clock className="size-5 text-yellow-600" />
                )}
                <span className="font-semibold">Statut: {getStatusLabel(selectedBookingDetails.status)}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Créée le {new Date(selectedBookingDetails.created_at).toLocaleString('fr-FR')}
                {selectedBookingDetails.confirmation_date && ` • Confirmée le ${new Date(selectedBookingDetails.confirmation_date).toLocaleString('fr-FR')}`}
              </p>
            </div>

            {/* Flight Segments */}
            {selectedBookingDetails.flight_segments && selectedBookingDetails.flight_segments.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Plane className="size-4 text-cyan-500" />
                  Détails du vol
                </h3>
                {selectedBookingDetails.flight_segments.map((segment, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-xl p-4 mb-3">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-lg">{segment.origin}</span>
                        <span className="text-gray-400">→</span>
                        <span className="font-bold text-lg">{segment.destination}</span>
                      </div>
                      <Badge className="bg-gray-200 text-gray-700">
                        Vol {segment.airline_name} {segment.flight_data?.flightNumber}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Départ</p>
                        <p className="font-medium">{new Date(segment.departure_datetime).toLocaleString('fr-FR')}</p>
                        <p className="text-xs text-gray-400">{segment.origin}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Arrivée</p>
                        <p className="font-medium">{new Date(segment.arrival_datetime).toLocaleString('fr-FR')}</p>
                        <p className="text-xs text-gray-400">{segment.destination}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Durée</p>
                        <p className="font-medium">{segment.duration}</p>
                        <p className="text-xs text-gray-400">{segment.price ? `${parseFloat(segment.price).toLocaleString()} ${selectedBookingDetails.currency}` : ''}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Passengers */}
            {selectedBookingDetails.passengers && selectedBookingDetails.passengers.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Users className="size-4 text-cyan-500" />
                  Passagers ({selectedBookingDetails.passengers.length})
                </h3>
                {selectedBookingDetails.passengers.map((passenger, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-xl p-4 mb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{passenger.prenom} {passenger.nom}</p>
                        <p className="text-sm text-gray-500">{passenger.sexe === 'homme' ? 'Homme' : 'Femme'}</p>
                      </div>
                      <Badge className={passenger.check_in_status ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"}>
                        {passenger.check_in_status ? "Enregistré" : "Non enregistré"}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
                      <div>
                        <p className="text-gray-500">Date de naissance</p>
                        <p>{passenger.date_naissance ? new Date(passenger.date_naissance).toLocaleDateString('fr-FR') : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Passeport</p>
                        <p className="font-mono">{passenger.num_passport || 'N/A'}</p>
                      </div>
                      {passenger.seat_number && (
                        <div>
                          <p className="text-gray-500">Siège</p>
                          <p>{passenger.seat_number}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-gray-500">Bagages</p>
                        <p>{passenger.baggage_quantity || 0} bagage(s)</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Payment Info */}
            {selectedBookingDetails.payment && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CreditCard className="size-4 text-cyan-500" />
                  Informations de paiement
                </h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-500">Montant total</p>
                      <p className="font-bold text-lg text-cyan-600">
                        {parseFloat(selectedBookingDetails.total_price).toLocaleString()} {selectedBookingDetails.currency}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Méthode</p>
                      <p>
                        {selectedBookingDetails.payment.payment_method === "CARD" ? "Carte bancaire" :
                         selectedBookingDetails.payment.payment_method === "DELIVERY" ? "Paiement à la livraison" :
                         selectedBookingDetails.payment.payment_method === "CASH" ? "Espèces" : selectedBookingDetails.payment.payment_method}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Statut</p>
                      <Badge className={selectedBookingDetails.payment.status === "COMPLETED" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                        {selectedBookingDetails.payment.status === "COMPLETED" ? "Payé" : "En attente"}
                      </Badge>
                    </div>
                    {selectedBookingDetails.payment.completed_at && (
                      <div>
                        <p className="text-gray-500">Date de paiement</p>
                        <p>{new Date(selectedBookingDetails.payment.completed_at).toLocaleString('fr-FR')}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* PNR Info */}
            {selectedBookingDetails.amadeus_pnr && (
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-sm text-gray-600">Code PNR (Amadeus)</p>
                <p className="font-mono font-bold text-lg">{selectedBookingDetails.amadeus_pnr}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            Aucune information disponible
          </div>
        )}
      </Dialog>
    </div>
  );
}