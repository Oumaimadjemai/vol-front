// ReservationSystem.jsx - With passport verification added
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaChevronLeft,
  FaChevronRight,
  FaEnvelope,
  FaPhone,
  FaCreditCard,
  FaMoneyBill,
  FaShieldAlt,
  FaCheck,
  FaWhatsapp,
  FaDownload,
  FaPrint,
  FaUser,
  FaPassport,
  FaCamera,
  FaTrash,
  FaInfoCircle,
  FaPlane,
  FaUsers,
  FaExclamationTriangle,
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
  FaUpload,
} from "react-icons/fa";
import { DatePicker } from "./DatePicker";
import { CustomSelect } from "./CustomSelect";
import { FlightDetailsCard } from "./FlightDetailsCard";
import { MultiFlightDetailsCard } from "./MultiFlightDetailsCard";
import { StepIndicator } from "./StepIndicator";
import { Sidebar } from "./Sidebar";
import { PassengerFormComponent } from "./PassengerFormComponent";
import { WILAYAS, getCityFromAirport } from "./constants/flightConstants";
import axiosInstance from "../../../api/axiosInstance";
import { toast } from "sonner";
import { PassportUploader } from "./PassportUploader";

export default function ReservationSystem({ reservationData }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [wilaya, setWilaya] = useState("");
  const [commune, setCommune] = useState("");
  const [pays, setPays] = useState("DZ");
  const [sexe, setSexe] = useState("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [numPassport, setNumPassport] = useState("");
  const [dateExpPassport, setDateExpPassport] = useState("");
  const [passportPhoto, setPassportPhoto] = useState(null);
  const [passportPhotoPreview, setPassportPhotoPreview] = useState(null);
  const [passportVerified, setPassportVerified] = useState(false);

  const [additionalPassengersList, setAdditionalPassengersList] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [reservationComplete, setReservationComplete] = useState(false);
  const [reservationId, setReservationId] = useState(null);
  const [bookingResponse, setBookingResponse] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [voyageurId, setVoyageurId] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fileInputRef = useRef(null);
  const [userRole, setUserRole] = useState(null);
  const [allVoyageurs, setAllVoyageurs] = useState([]);
  const [selectedVoyageurId, setSelectedVoyageurId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const flight = reservationData?.flight;
  const isMulti = reservationData?.isMulti || false;
  const passengers = reservationData?.passengers || {
    adult: 1,
    child: 0,
    baby: 0,
  };
  const searchParams = reservationData?.searchParams || {};
  const isRoundTrip = searchParams.type === "retour";

  const totalPassengersCount =
    (passengers.adult || 0) + (passengers.child || 0) + (passengers.baby || 0);
  const additionalPassengersCount = Math.max(0, totalPassengersCount - 1);

  // ==================== PASSPORT VERIFICATION ====================

  // Fetch authenticated user info
  const fetchAuthenticatedUser = async () => {
    setIsLoadingUser(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setUserRole("guest");
        setIsLoadingUser(false);
        return null;
      }

      const response = await axiosInstance.get("/auth-service/auth/me/");
      const currentUser = response.data;
      const roleData = currentUser.role;
      setUserRole(roleData);
      setIsAdmin(roleData === "admin");

      if (roleData === "admin") {
        const voyageursResp = await axiosInstance.get(
          "/auth-service/auth/voyageurs/",
        );
        setAllVoyageurs(voyageursResp.data.results || voyageursResp.data || []);
      } else if (roleData === "voyageur") {
        if (currentUser && currentUser.id) {
          const voyageurResponse = await axiosInstance.get(
            `/auth-service/auth/voyageurs/by-user/${currentUser.id}/`,
          );
          const voyageurData = voyageurResponse.data;
          setAuthenticatedUser(voyageurData);
          setVoyageurId(voyageurData.id);
          setSelectedVoyageurId(voyageurData.id);

          setEmail(voyageurData.email || currentUser.email || "");
          setPhone(voyageurData.telephone || "");
          setWilaya(voyageurData.wilaya || "");
          setCommune(voyageurData.commune || "");
          setPays(voyageurData.pays || "DZ");
          setSexe(voyageurData.sexe || "");
          setDateNaissance(voyageurData.date_naissance || "");
          setNumPassport(voyageurData.num_passport || "");
          setDateExpPassport(voyageurData.date_exp_passport || "");

          // Load passport if exists
          if (voyageurData.passport_image) {
            setPassportPhotoPreview(voyageurData.passport_image);
            setPassportPhoto(voyageurData.passport_image);
            setPassportVerified(voyageurData.passport_verified || false);
          }
        }
      }
      return null;
    } catch (error) {
      console.error("Error fetching authenticated user:", error);
      setUserRole("guest");
      return null;
    } finally {
      setIsLoadingUser(false);
    }
  };

  const handleAdminVoyageurChange = async (voyageurId) => {
    setSelectedVoyageurId(voyageurId);
    if (!voyageurId) {
      setEmail("");
      setPhone("");
      setWilaya("");
      setCommune("");
      setSexe("");
      setDateNaissance("");
      setNumPassport("");
      setDateExpPassport("");
      setPassportPhotoPreview(null);
      setPassportPhoto(null);
      setPassportVerified(false);
      setAuthenticatedUser(null);
      setVoyageurId(null);
      return;
    }
    const selected = allVoyageurs.find((v) => v.id === parseInt(voyageurId));
    if (selected) {
      setAuthenticatedUser(selected);
      setVoyageurId(selected.id);
      setEmail(selected.email || "");
      setPhone(selected.telephone || "");
      setWilaya(selected.wilaya || "");
      setCommune(selected.commune || "");
      setSexe(selected.sexe || "");
      setDateNaissance(selected.date_naissance || "");
      setNumPassport(selected.num_passport || "");
      setDateExpPassport(selected.date_exp_passport || "");
      if (selected.passport_image) {
        setPassportPhotoPreview(selected.passport_image);
        setPassportPhoto(selected.passport_image);
        setPassportVerified(selected.passport_verified || false);
      }
    }
  };

  // Initialize
  useEffect(() => {
    if (!isInitialized) {
      const initialAdditionalPassengers = [];
      for (let i = 0; i < additionalPassengersCount; i++) {
        initialAdditionalPassengers.push({
          id: i + 1,
          title: i < passengers.adult - 1 ? "Mr" : "Mme",
          firstName: "",
          lastName: "",
          birthDate: "",
          passportNumber: "",
          passportImage: null,
          passportExpiry: "",
        });
      }
      setAdditionalPassengersList(initialAdditionalPassengers);
      fetchAuthenticatedUser();
      setIsInitialized(true);
    }
  }, [additionalPassengersCount, passengers.adult, isInitialized]);

  const updateAdditionalPassenger = useCallback((index, field, value) => {
    setAdditionalPassengersList((prev) => {
      const newList = [...prev];
      newList[index] = { ...newList[index], [field]: value };
      return newList;
    });
  }, []);

  const updateField = async (field, value) => {
    if (!voyageurId) {
      if (field === "email") setEmail(value);
      if (field === "phone") setPhone(value);
      if (field === "wilaya") setWilaya(value);
      if (field === "commune") setCommune(value);
      if (field === "sexe") setSexe(value);
      if (field === "dateNaissance") setDateNaissance(value);
      if (field === "numPassport") setNumPassport(value);
      if (field === "dateExpPassport") setDateExpPassport(value);
      return;
    }
    setIsUpdating(true);
    try {
      const updateData = {};
      if (field === "email") updateData.email = value;
      if (field === "phone") updateData.telephone = value;
      if (field === "wilaya") updateData.wilaya = value;
      if (field === "commune") updateData.commune = value;
      if (field === "sexe") updateData.sexe = value;
      if (field === "dateNaissance") updateData.date_naissance = value;
      if (field === "numPassport") updateData.num_passport = value;
      if (field === "dateExpPassport") updateData.date_exp_passport = value;
      await axiosInstance.patch(
        `/auth-service/auth/voyageurs/${voyageurId}/update/`,
        updateData,
      );
      if (field === "email") setEmail(value);
      if (field === "phone") setPhone(value);
      if (field === "wilaya") setWilaya(value);
      if (field === "commune") setCommune(value);
      if (field === "sexe") setSexe(value);
      if (field === "dateNaissance") setDateNaissance(value);
      if (field === "numPassport") setNumPassport(value);
      if (field === "dateExpPassport") setDateExpPassport(value);
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCardInputChange = (field, value) => {
    if (field === "cardNumber") {
      let cleaned = value.replace(/\s/g, "");
      if (cleaned.length > 16) cleaned = cleaned.slice(0, 16);
      let formatted = cleaned.replace(/(\d{4})/g, "$1 ").trim();
      setCardInfo((prev) => ({ ...prev, cardNumber: formatted }));
    } else if (field === "expiryDate") {
      let cleaned = value.replace(/\//g, "");
      if (cleaned.length > 4) cleaned = cleaned.slice(0, 4);
      let formatted = cleaned;
      if (cleaned.length >= 3) {
        formatted = cleaned.slice(0, 2) + "/" + cleaned.slice(2);
      }
      setCardInfo((prev) => ({ ...prev, expiryDate: formatted }));
    } else if (field === "cvv") {
      if (value.length <= 4) {
        setCardInfo((prev) => ({ ...prev, cvv: value }));
      }
    } else {
      setCardInfo((prev) => ({ ...prev, [field]: value }));
    }
  };

  const formatFlightDetails = () => {
    if (isMulti) {
      const segments = flight?.segments || flight?.flights || [];
      return {
        type: "multi",
        segments: segments.map((segment) => ({
          airline: segment.airline,
          flightNumber: segment.flightNumber,
          departure: {
            airport: segment.departure?.airport,
            city: getCityFromAirport(segment.departure?.airport),
            time: segment.departure?.time,
            date: segment.departure?.date,
          },
          arrival: {
            airport: segment.arrival?.airport,
            city: getCityFromAirport(segment.arrival?.airport),
            time: segment.arrival?.time,
            date: segment.arrival?.date,
          },
          duration: segment.duration,
          stops: segment.stops || 0,
        })),
        totalPrice: flight?.totalPrice || flight?.prixTotal || 0,
      };
    } else {
      return {
        type: isRoundTrip ? "roundtrip" : "oneway",
        outbound: {
          airline: flight?.airline,
          flightNumber: flight?.flightNumber,
          aircraft: flight?.aircraft || "Boeing 737",
          departure: {
            airport: flight?.departure?.airport,
            city: getCityFromAirport(flight?.departure?.airport),
            time: flight?.departure?.time,
            date: flight?.departure?.date || searchParams.departureDate,
          },
          arrival: {
            airport: flight?.arrival?.airport,
            city: getCityFromAirport(flight?.arrival?.airport),
            time: flight?.arrival?.time,
            date: flight?.arrival?.date || searchParams.departureDate,
          },
          duration: flight?.duration,
          totalDuration: flight?.totalDuration || flight?.duration,
          stops: flight?.stops || 0,
          stopover: flight?.stopover || "Queen Alia International Airport",
          stopoverDuration: flight?.stopoverDuration || "1h 25m",
          class: searchParams.flightClass || "Économique",
          baggage: {
            cabin: flight?.baggage?.cabin || "1 PC",
            checked: flight?.baggage?.checked || "1 PC",
          },
        },
        totalPrice: flight?.price?.total || flight?.totalPrice || 0,
        return:
          isRoundTrip && flight?.returnFlight
            ? {
                airline: flight.returnFlight.airline,
                flightNumber: flight.returnFlight.flightNumber,
                aircraft: flight.returnFlight.aircraft || "AIRBUS A321NEO",
                departure: {
                  airport: flight.returnFlight.departure?.airport,
                  city: getCityFromAirport(
                    flight.returnFlight.departure?.airport,
                  ),
                  time: flight.returnFlight.departure?.time,
                  date:
                    flight.returnFlight.departure?.date ||
                    searchParams.returnDate,
                },
                arrival: {
                  airport: flight.returnFlight.arrival?.airport,
                  city: getCityFromAirport(
                    flight.returnFlight.arrival?.airport,
                  ),
                  time: flight.returnFlight.arrival?.time,
                  date:
                    flight.returnFlight.arrival?.date ||
                    searchParams.returnDate,
                },
                duration: flight.returnFlight.duration,
                totalDuration:
                  flight.returnFlight.totalDuration ||
                  flight.returnFlight.duration,
                stops: flight.returnFlight.stops || 0,
                stopover:
                  flight.returnFlight.stopover ||
                  "Queen Alia International Airport",
                stopoverDuration:
                  flight.returnFlight.stopoverDuration || "1h 25m",
                class: searchParams.flightClass || "Économique",
                baggage: {
                  cabin: flight.returnFlight?.baggage?.cabin || "1 PC",
                  checked: flight.returnFlight?.baggage?.checked || "1 PC",
                },
              }
            : null,
      };
    }
  };

  const formattedFlight = formatFlightDetails();
  const getTotalPrice = () =>
    formattedFlight.totalPrice.toLocaleString("fr-DZ") + " DZD";

  const preparePassengerData = () => {
    let mainPassenger = {};
    if (isAdmin && selectedVoyageurId && authenticatedUser) {
      mainPassenger = {
        nom: authenticatedUser.nom,
        prenom: authenticatedUser.prenom,
        date_naissance: dateNaissance,
        sexe: sexe,
        num_passport: numPassport,
        date_exp_passport: dateExpPassport,
        email: email,
        telephone: phone,
        nationalite: "DZ",
        lieu_naissance: commune,
      };
    } else if (!isAdmin && authenticatedUser) {
      mainPassenger = {
        nom: authenticatedUser.nom,
        prenom: authenticatedUser.prenom,
        date_naissance: dateNaissance,
        sexe: sexe,
        num_passport: numPassport,
        date_exp_passport: dateExpPassport,
        email: email,
        telephone: phone,
        nationalite: "DZ",
        lieu_naissance: commune,
      };
    } else {
      mainPassenger = {
        nom: "",
        prenom: "",
        date_naissance: dateNaissance,
        sexe: sexe,
        num_passport: numPassport,
        date_exp_passport: dateExpPassport,
        email: email,
        telephone: phone,
        nationalite: "DZ",
        lieu_naissance: commune,
      };
    }

    if (additionalPassengersCount > 0) {
      const additional = additionalPassengersList.map((p) => ({
        nom: p.lastName,
        prenom: p.firstName,
        date_naissance: p.birthDate || null,
        sexe: p.title === "Mr" ? "homme" : "femme",
        num_passport: p.passportNumber || "",
        date_exp_passport: p.passportExpiry || null,
        email: email,
        telephone: phone,
        nationalite: "DZ",
        lieu_naissance: commune,
      }));
      return [mainPassenger, ...additional];
    }
    return [mainPassenger];
  };

  const prepareSelectedFlights = () => {
    if (flight) {
      const flightData = {
        flight_id: flight.id || "1",
        airline: flight.airline,
        flightNumber: flight.flightNumber,
        departure: {
          airport: flight.departure?.airport || searchParams?.from,
          time: flight.departure?.time,
          terminal: flight.departure?.terminal || "",
        },
        arrival: {
          airport: flight.arrival?.airport || searchParams?.to,
          time: flight.arrival?.time,
          terminal: flight.arrival?.terminal || "",
        },
        duration: flight.duration,
        price: {
          total: flight.price?.total || formattedFlight.totalPrice,
          currency: "DZD",
          perPassenger:
            (flight.price?.total || formattedFlight.totalPrice) /
            (passengers.adult + passengers.child),
        },
        baggage: { quantity: 1, included: "1 bagage(s)" },
        refundable: { isRefundable: false, policy: "Non remboursable" },
        seatsAvailable: 9,
        segments: flight.segments || [],
      };

      if (isRoundTrip && flight.returnFlight) {
        return [
          flightData,
          {
            flight_id: flight.returnFlight.id || "2",
            airline: flight.returnFlight.airline,
            flightNumber: flight.returnFlight.flightNumber,
            departure: {
              airport:
                flight.returnFlight.departure?.airport || searchParams?.to,
              time: flight.returnFlight.departure?.time,
              terminal: flight.returnFlight.departure?.terminal || "",
            },
            arrival: {
              airport:
                flight.returnFlight.arrival?.airport || searchParams?.from,
              time: flight.returnFlight.arrival?.time,
              terminal: flight.returnFlight.arrival?.terminal || "",
            },
            duration: flight.returnFlight.duration,
            price: {
              total:
                flight.returnFlight.price?.total ||
                formattedFlight.totalPrice / 2,
              currency: "DZD",
              perPassenger:
                (flight.returnFlight.price?.total ||
                  formattedFlight.totalPrice / 2) /
                (passengers.adult + passengers.child),
            },
            baggage: { quantity: 1, included: "1 bagage(s)" },
            refundable: { isRefundable: false, policy: "Non remboursable" },
            seatsAvailable: 7,
            segments: flight.returnFlight.segments || [],
          },
        ];
      }
      return [flightData];
    }
    return [];
  };

  const prepareReservationData = () => {
    const tripType = isRoundTrip ? "ALLER_RETOUR" : "ALLER_SIMPLE";
    let originCode = null;
    let destinationCode = null;
    if (searchParams) {
      originCode = searchParams.from || searchParams.origin;
      destinationCode = searchParams.to || searchParams.destination;
    }
    if (!originCode && flight) originCode = flight?.departure?.airport;
    if (!destinationCode && flight) destinationCode = flight?.arrival?.airport;
    if (!originCode && flight?.segments?.length > 0) {
      originCode = flight.segments[0]?.departure?.airport;
      destinationCode =
        flight.segments[flight.segments.length - 1]?.arrival?.airport;
    }

    const searchParamsData = {
      origin: originCode,
      destination: destinationCode,
      departureDate: searchParams?.departureDate,
      adults: passengers.adult || 1,
      children: passengers.child || 0,
      infants: passengers.baby || 0,
      travelClass: searchParams?.flightClass?.toUpperCase() || "ECONOMY",
    };
    if (isRoundTrip && searchParams?.returnDate)
      searchParamsData.returnDate = searchParams.returnDate;

    let paymentMethodValue = "";
    if (paymentMethod === "cib") paymentMethodValue = "CARD";
    else if (paymentMethod === "delivery") paymentMethodValue = "DELIVERY";
    else if (paymentMethod === "cash") paymentMethodValue = "CASH";

    return {
      trip_type: tripType,
      search_params: searchParamsData,
      selected_flights: prepareSelectedFlights(),
      passengers: preparePassengerData(),
      existing_passenger_ids: [],
      payment_method: paymentMethodValue,
    };
  };

  const createReservation = async () => {
    try {
      const reservationData = prepareReservationData();
      const response = await axiosInstance.post(
        "/ms-reservation/reservations/",
        reservationData,
      );
      return response.data;
    } catch (error) {
      console.error("Create reservation error:", error);
      throw error;
    }
  };

  const confirmPrice = async (reservationId) => {
    const response = await axiosInstance.post(
      `/ms-reservation/reservations/${reservationId}/confirm_price/`,
    );
    return response.data;
  };

  const bookReservation = async (reservationId) => {
    const response = await axiosInstance.post(
      `/ms-reservation/reservations/${reservationId}/book/`,
    );
    return response.data;
  };

  const processPayment = async () => {
    setIsProcessing(true);
    try {
      const reservation = await createReservation();
      await confirmPrice(reservation.id);
      const bookingResult = await bookReservation(reservation.id);
      setBookingResponse(bookingResult);
      setReservationId(reservation.id);
      setReservationComplete(true);
      setCurrentStep(4);
      window.scrollTo(0, 0);
    } catch (error) {
      toast.error(`Erreur: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const validatePassengerInfo = () => {
    if (!email || !phone || !wilaya || !commune) {
      toast.error("Veuillez remplir toutes les coordonnées");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Email invalide");
      return false;
    }
    if (!/^[0-9]{9,10}$/.test(phone.replace(/\s/g, ""))) {
      toast.error("Téléphone invalide");
      return false;
    }
    if (!sexe) {
      toast.error("Choisissez votre civilité");
      return false;
    }
    if (!dateNaissance) {
      toast.error("Date de naissance requise");
      return false;
    }
    if (!numPassport) {
      toast.error("Numéro de passeport requis");
      return false;
    }
    if (!dateExpPassport) {
      toast.error("Date expiration passeport requise");
      return false;
    }
    if (!passportVerified) {
      toast.error("Le passeport doit être vérifié");
      return false;
    }
    for (const p of additionalPassengersList) {
      if (
        !p.firstName ||
        !p.lastName ||
        !p.birthDate ||
        !p.passportNumber ||
        !p.passportExpiry
      ) {
        toast.error("Remplissez tous les passagers supplémentaires");
        return false;
      }
    }
    return true;
  };

  const validatePayment = () => {
    if (!paymentMethod) {
      toast.error("Choisissez un mode de paiement");
      return false;
    }
    if (!acceptedTerms) {
      toast.error("Acceptez les conditions");
      return false;
    }
    if (paymentMethod === "cib") {
      const cardNumberClean = cardInfo.cardNumber.replace(/\s/g, "");
      if (cardNumberClean.length < 16) {
        toast.error("Numéro de carte invalide");
        return false;
      }
      if (!cardInfo.cardHolder) {
        toast.error("Nom du titulaire requis");
        return false;
      }
      if (!cardInfo.expiryDate || cardInfo.expiryDate.length < 5) {
        toast.error("Date expiration invalide");
        return false;
      }
      if (!cardInfo.cvv || cardInfo.cvv.length < 3) {
        toast.error("CVV invalide");
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
      window.scrollTo(0, 0);
    } else if (currentStep === 2 && validatePassengerInfo()) {
      setCurrentStep(3);
      window.scrollTo(0, 0);
    } else if (currentStep === 3 && validatePayment()) {
      processPayment();
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  const renderPaymentMethods = () => {
    const methods = [
      {
        id: "cib",
        label: "Carte CIB / Edahabia",
        icon: FaCreditCard,
        description: "Paiement sécurisé par carte bancaire",
      },
      {
        id: "delivery",
        label: "Paiement à la livraison",
        icon: FaMoneyBill,
        description: "Payez lors de la réception des billets",
      },
    ];
    if (isAdmin)
      methods.push({
        id: "cash",
        label: "Paiement en espèces",
        icon: FaMoneyBill,
        description: "Payez en espèces à notre agence",
      });
    return methods.map((method) => (
      <label
        key={method.id}
        className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === method.id ? "border-[#00C0E8] bg-[#00C0E8]/5 shadow-md" : "border-gray-200 hover:border-[#00C0E8]/50"}`}
      >
        <input
          type="radio"
          name="payment"
          value={method.id}
          checked={paymentMethod === method.id}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-4 h-4 text-[#00C0E8] mt-1"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <method.icon className="text-gray-600" />
            <span className="font-semibold text-gray-700">{method.label}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">{method.description}</p>
        </div>
      </label>
    ));
  };

  if (reservationComplete) {
    return (
      <ConfirmationPage
        reservationId={reservationId}
        bookingResponse={bookingResponse}
        isRoundTrip={isRoundTrip}
      />
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto mb-12 px-4">
        <div className="flex justify-center items-center gap-8">
          <StepIndicator
            number={1}
            title="Vol"
            icon="plane"
            isActive={currentStep === 1}
            isCompleted={currentStep > 1}
          />
          <div
            className={`w-16 h-0.5 transition-all duration-300 ${currentStep > 1 ? "bg-green-500" : "bg-gray-200"}`}
          />
          <StepIndicator
            number={2}
            title="Passagers"
            icon="user"
            isActive={currentStep === 2}
            isCompleted={currentStep > 2}
          />
          <div
            className={`w-16 h-0.5 transition-all duration-300 ${currentStep > 2 ? "bg-green-500" : "bg-gray-200"}`}
          />
          <StepIndicator
            number={3}
            title="Paiement"
            icon="card"
            isActive={currentStep === 3}
            isCompleted={currentStep > 3}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-8 bg-gradient-to-r from-[#00C0E8] to-[#0096b8] rounded-full"></div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Détails du vol
                  </h2>
                </div>
                {isMulti ? (
                  <MultiFlightDetailsCard segments={formattedFlight.segments} />
                ) : (
                  <>
                    <FlightDetailsCard
                      flight={formattedFlight.outbound}
                      type="outbound"
                    />
                    {formattedFlight.type === "roundtrip" &&
                      formattedFlight.return && (
                        <FlightDetailsCard
                          flight={formattedFlight.return}
                          type="return"
                        />
                      )}
                  </>
                )}
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-8 bg-gradient-to-r from-[#00C0E8] to-[#0096b8] rounded-full"></div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Informations voyageurs ({totalPassengersCount} passager
                    {totalPassengersCount > 1 ? "s" : ""})
                  </h2>
                </div>

                {isAdmin && (
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-6">
                    <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                      <FaUsers className="text-[#00C0E8]" /> Réserver pour :
                    </label>
                    <select
                      value={selectedVoyageurId || ""}
                      onChange={(e) =>
                        handleAdminVoyageurChange(e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:border-[#00C0E8] focus:ring-2 focus:ring-[#00C0E8]/20"
                    >
                      <option value="">-- Choisir un voyageur --</option>
                      {allVoyageurs.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.prenom} {v.nom} ({v.email})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                      <FaUser className="text-[#00C0E8]" /> Voyageur principal
                    </h3>
                    {isUpdating && (
                      <div className="flex items-center gap-2 text-sm text-blue-500">
                        <FaSpinner className="animate-spin" /> Mise à jour...
                      </div>
                    )}
                  </div>
                  {isLoadingUser && (
                    <div className="mb-4 text-sm text-blue-600">
                      Chargement de vos informations...
                    </div>
                  )}
                  {authenticatedUser && (
                    <div className="mb-4 p-3 bg-green-50 rounded-lg text-sm text-green-700">
                      ✓ Vos informations ont été automatiquement remplies
                    </div>
                  )}

                  <PassportUploader
  voyageurId={voyageurId}
  initialPreview={passportPhotoPreview}
  initialVerified={passportVerified}
  onVerified={(v) => setPassportVerified(v)}
  onRemove={() => {
    setPassportPhoto(null);
    setPassportPhotoPreview(null);
    setPassportVerified(false);
  }}
/>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Email *
                      </label>
                      <input
                        id="field-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={(e) => updateField("email", e.target.value)}
                        className="w-full border rounded-xl px-4 py-2.5"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Téléphone *
                      </label>
                      <div className="flex gap-2">
                        <div className="flex items-center px-4 border rounded-xl bg-gray-50">
                          <FaPhone className="text-gray-400" />
                          <span className="ml-2 text-gray-600">+213</span>
                        </div>
                        <input
                          id="field-phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          onBlur={(e) => updateField("phone", e.target.value)}
                          className="flex-1 border rounded-xl px-4 py-2.5"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Wilaya *
                      </label>
                      <CustomSelect
                        value={wilaya}
                        onChange={(value) => {
                          setWilaya(value);
                          updateField("wilaya", value);
                        }}
                        options={WILAYAS}
                        placeholder="Sélectionnez une wilaya"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Commune *
                      </label>
                      <input
                        id="field-commune"
                        type="text"
                        value={commune}
                        onChange={(e) => setCommune(e.target.value)}
                        onBlur={(e) => updateField("commune", e.target.value)}
                        className="w-full border rounded-xl px-4 py-2.5"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 mt-4">
                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <FaPassport className="text-[#00C0E8]" /> Informations
                      personnelles
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Civilité *
                        </label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              value="homme"
                              checked={sexe === "homme"}
                              onChange={(e) => {
                                setSexe(e.target.value);
                                updateField("sexe", e.target.value);
                              }}
                            />
                            <span>Homme</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              value="femme"
                              checked={sexe === "femme"}
                              onChange={(e) => {
                                setSexe(e.target.value);
                                updateField("sexe", e.target.value);
                              }}
                            />
                            <span>Femme</span>
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Date de naissance *
                        </label>
                        <DatePicker
                          value={dateNaissance}
                          onChange={(value) => {
                            setDateNaissance(value);
                            updateField("dateNaissance", value);
                          }}
                          placeholder="JJ/MM/AAAA"
                          maxDate={new Date().toISOString().split("T")[0]}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Numéro de passeport *
                        </label>
                        <input
                          id="field-numPassport"
                          type="text"
                          value={numPassport}
                          onChange={(e) => setNumPassport(e.target.value)}
                          onBlur={(e) =>
                            updateField("numPassport", e.target.value)
                          }
                          className="w-full border rounded-xl px-4 py-2.5"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Date d'expiration *
                        </label>
                        <DatePicker
                          value={dateExpPassport}
                          onChange={(value) => {
                            setDateExpPassport(value);
                            updateField("dateExpPassport", value);
                          }}
                          placeholder="JJ/MM/AAAA"
                          minDate={new Date().toISOString().split("T")[0]}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {additionalPassengersCount > 0 && (
                  <>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1 h-6 bg-gradient-to-r from-[#00C0E8] to-[#0096b8] rounded-full"></div>
                      <h3 className="font-semibold text-gray-800">
                        Passagers supplémentaires ({additionalPassengersCount})
                      </h3>
                    </div>
                    {additionalPassengersList.map((passenger, index) => (
                      <PassengerFormComponent
                        key={passenger.id}
                        passenger={passenger}
                        index={index}
                        onUpdate={updateAdditionalPassenger}
                      />
                    ))}
                  </>
                )}
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-8 bg-gradient-to-r from-[#00C0E8] to-[#0096b8] rounded-full"></div>
                  <h2 className="text-2xl font-bold text-gray-800">Paiement</h2>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <h3 className="font-semibold text-gray-800 mb-4">
                    Mode de paiement *
                  </h3>
                  <div className="space-y-3 mb-6">{renderPaymentMethods()}</div>
                  {paymentMethod === "cib" && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-50 rounded-xl p-6 mt-4"
                    >
                      <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <FaCreditCard className="text-[#00C0E8]" /> Informations
                        de la carte
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Numéro de carte
                          </label>
                          <input
                            type="text"
                            value={cardInfo.cardNumber}
                            onChange={(e) =>
                              handleCardInputChange(
                                "cardNumber",
                                e.target.value,
                              )
                            }
                            placeholder="1234 5678 9012 3456"
                            className="w-full border border-gray-300 rounded-xl px-4 py-3"
                            maxLength="19"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Nom du titulaire
                          </label>
                          <input
                            type="text"
                            value={cardInfo.cardHolder}
                            onChange={(e) =>
                              handleCardInputChange(
                                "cardHolder",
                                e.target.value,
                              )
                            }
                            placeholder="COMME SUR LA CARTE"
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 uppercase"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Date d'expiration
                            </label>
                            <input
                              type="text"
                              value={cardInfo.expiryDate}
                              onChange={(e) =>
                                handleCardInputChange(
                                  "expiryDate",
                                  e.target.value,
                                )
                              }
                              placeholder="MM/YY"
                              className="w-full border border-gray-300 rounded-xl px-4 py-3"
                              maxLength="5"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              CVV
                            </label>
                            <input
                              type="password"
                              value={cardInfo.cvv}
                              onChange={(e) =>
                                handleCardInputChange("cvv", e.target.value)
                              }
                              placeholder="123"
                              className="w-full border border-gray-300 rounded-xl px-4 py-3"
                              maxLength="4"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-4 p-3 bg-blue-50 rounded-lg">
                          <FaShieldAlt className="text-blue-500" />
                          <p className="text-xs text-blue-700">
                            Paiement 100% sécurisé. Vos informations bancaires
                            sont cryptées.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div className="border-t border-gray-200 pt-6 mt-6">
                    <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-all">
                      <input
                        type="checkbox"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        className="w-4 h-4 text-[#00C0E8] rounded mt-0.5"
                      />
                      <div>
                        <span className="text-gray-700">J'accepte les </span>
                        <a href="#" className="text-[#00C0E8] hover:underline">
                          conditions générales d'achat
                        </a>
                        <span className="text-gray-700"> et la </span>
                        <a href="#" className="text-[#00C0E8] hover:underline">
                          politique de confidentialité
                        </a>
                      </div>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between mt-8">
            {currentStep > 1 && (
              <button
                onClick={prevStep}
                className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:border-[#00C0E8] hover:text-[#00C0E8] transition-all duration-300"
              >
                <FaChevronLeft /> Retour
              </button>
            )}
            <button
              onClick={nextStep}
              disabled={isProcessing}
              className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00C0E8] to-[#0096b8] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 ${currentStep === 1 ? "ml-auto" : ""} ${isProcessing ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {isProcessing ? (
                <>
                  <FaSpinner className="animate-spin" /> Traitement...
                </>
              ) : (
                <>
                  {currentStep === 3 ? "Payer " + getTotalPrice() : "Continuer"}{" "}
                  <FaChevronRight />
                </>
              )}
            </button>
          </div>
        </div>
        <Sidebar
          flight={formattedFlight}
          isMulti={isMulti}
          passengers={passengers}
          getTotalPrice={getTotalPrice}
        />
      </div>
    </div>
  );
}

const ConfirmationPage = ({
  reservationId,
  bookingResponse,
  flightDetails,
  isRoundTrip,
  passengers,
  totalPrice,
}) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const pnr =
    bookingResponse?.pnr ||
    bookingResponse?.amadeus_pnr ||
    bookingResponse?.bookingCode ||
    "N/A";
  const status = bookingResponse?.status || "CONFIRMED";
  const paymentStatus = bookingResponse?.payment_status || "COMPLETED";
  const totalPriceValue = bookingResponse?.total_price || totalPrice || "0 DZD";

  const downloadTicket = async () => {
    setIsGeneratingPDF(true);
    try {
      const response = await axiosInstance.get(
        `/ms-reservation/reservations/${reservationId}/ticket/download/`,
        { responseType: "blob" },
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `billet_${reservationId}_${pnr}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Billet téléchargé avec succès");
    } catch (error) {
      toast.error("Erreur lors du téléchargement du billet");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const shareViaWhatsApp = () => {
    const message = `*Confirmation de réservation* 🎫\n\n📋 Numéro: ${reservationId}\n🔖 Code PNR: ${pnr}\n✅ Statut: ${status}\n💰 Total: ${totalPriceValue}\n\nMerci de votre confiance ! ✈️`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-8 py-12 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6">
          <FaCheck className="w-10 h-10 text-[#00C0E8]" />
        </div>
        <h2 className="text-3xl font-bold text-[#00C0E8] mb-2">
          Réservation Confirmée !
        </h2>
        <p className="text-cyan-600">
          Votre réservation a été effectuée avec succès
        </p>
      </div>
      <div className="p-8">
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-xs text-gray-500">Code PNR</p>
              <p className="text-xl font-bold font-mono text-[#00C0E8]">
                {pnr}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Statut</p>
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                <FaCheck className="w-3 h-3" /> {status}
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-500">Total payé</p>
              <p className="text-xl font-bold text-gray-800">
                {totalPriceValue}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={downloadTicket}
            disabled={isGeneratingPDF}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#00C0E8] text-white rounded-xl font-semibold hover:bg-[#0096b8] transition-all disabled:opacity-50"
          >
            {isGeneratingPDF ? (
              <>
                <FaSpinner className="animate-spin" /> Génération...
              </>
            ) : (
              <>
                <FaDownload /> Télécharger PDF
              </>
            )}
          </button>
          <button
            onClick={shareViaWhatsApp}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-all"
          >
            <FaWhatsapp /> Partager
          </button>
        </div>
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-2">
            <FaInfoCircle className="text-blue-500 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Informations importantes:</p>
              <p>✓ Présentez-vous à l'aéroport 2 heures avant le départ</p>
              <p>✓ Munissez-vous de votre pièce d'identité et de ce billet</p>
              <p>✓ Pour toute modification, contactez notre service client</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
