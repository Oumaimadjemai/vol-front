// ReservationSystem.jsx - Complete fixed version
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaEnvelope, FaPhone, FaCreditCard, FaMoneyBill, FaShieldAlt, FaCheck, FaWhatsapp, FaDownload, FaPrint, FaUserEdit, FaTimes, FaSave, FaUser, FaIdCard, FaCalendarAlt, FaPassport, FaCamera, FaUpload, FaTrash, FaImage, FaInfoCircle, FaPlane } from 'react-icons/fa';
import { DatePicker } from './DatePicker';
import { CustomSelect } from './CustomSelect';
import { FlightDetailsCard } from './FlightDetailsCard';
import { MultiFlightDetailsCard } from './MultiFlightDetailsCard';
import { StepIndicator } from './StepIndicator';
import { Sidebar } from './Sidebar';
import { PassengerFormComponent } from './PassengerFormComponent';
import { WILAYAS, getCityFromAirport } from './constants/flightConstants';
import axiosInstance from '../../../api/axiosInstance';
import { toast } from 'sonner';


export default function ReservationSystem({ reservationData }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [wilaya, setWilaya] = useState('');
  const [commune, setCommune] = useState('');
  const [pays, setPays] = useState('DZ');
  const [sexe, setSexe] = useState('');
  const [dateNaissance, setDateNaissance] = useState('');
  const [numPassport, setNumPassport] = useState('');
  const [dateExpPassport, setDateExpPassport] = useState('');
  const [passportPhoto, setPassportPhoto] = useState(null);
  const [passportPhotoPreview, setPassportPhotoPreview] = useState(null);
  const [additionalPassengersList, setAdditionalPassengersList] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [reservationComplete, setReservationComplete] = useState(false);
  const [reservationId, setReservationId] = useState(null);
  const [bookingResponse, setBookingResponse] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [cardInfo, setCardInfo] = useState({ cardNumber: '', cardHolder: '', expiryDate: '', cvv: '' });
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [voyageurId, setVoyageurId] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const flight = reservationData?.flight;
  const isMulti = reservationData?.isMulti || false;
  const passengers = reservationData?.passengers || { adult: 1, child: 0, baby: 0 };
  const searchParams = reservationData?.searchParams || {};
  const isRoundTrip = searchParams.type === 'retour';
  
  // Calculate total passengers count
  const totalPassengersCount = (passengers.adult || 0) + (passengers.child || 0) + (passengers.baby || 0);
  // Number of additional passenger cards = total - 1 (main traveler is the voyageur form)
  const additionalPassengersCount = Math.max(0, totalPassengersCount - 1);

  // Fetch authenticated user info
  const fetchAuthenticatedUser = async () => {
    setIsLoadingUser(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.log('No access token found');
        return null;
      }

      const response = await axiosInstance.get('/auth-service/auth/me/');
      console.log('User data from /me:', response.data);
      
      const currentUser = response.data;
      
      if (currentUser && currentUser.id) {
        try {
          const voyageurResponse = await axiosInstance.get(`/auth-service/auth/voyageurs/by-user/${currentUser.id}/`);
          const voyageurData = voyageurResponse.data;
          
          setAuthenticatedUser(voyageurData);
          setVoyageurId(voyageurData.id);
          
          // Auto-fill the voyageur form with user data
          setEmail(voyageurData.email || currentUser.email || '');
          setPhone(voyageurData.telephone || '');
          setWilaya(voyageurData.wilaya || '');
          setCommune(voyageurData.commune || '');
          setPays(voyageurData.pays || 'DZ');
          setSexe(voyageurData.sexe || '');
          setDateNaissance(voyageurData.date_naissance || '');
          setNumPassport(voyageurData.num_passport || '');
          setDateExpPassport(voyageurData.date_exp_passport || '');
          if (voyageurData.passport_photo) {
            setPassportPhotoPreview(voyageurData.passport_photo);
          }
          
          return voyageurData;
        } catch (err) {
          console.log('No voyageur profile found');
          setEmail(currentUser.email || '');
          return null;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching authenticated user:', error.response?.data || error.message);
      return null;
    } finally {
      setIsLoadingUser(false);
    }
  };

  // Initialize additional passengers
  useEffect(() => {
    if (!isInitialized) {
      // Create additional passenger cards (total - 1)
      const initialAdditionalPassengers = [];
      for (let i = 0; i < additionalPassengersCount; i++) {
        initialAdditionalPassengers.push({
          id: i + 1, 
          title: i < (passengers.adult - 1) ? 'Mr' : 'Mme', 
          firstName: '', 
          lastName: '',
          birthDate: '', 
          passportNumber: '', 
          passportImage: null, 
          passportExpiry: ''
        });
      }
      setAdditionalPassengersList(initialAdditionalPassengers);
      
      // Fetch authenticated user to fill voyageur form
      fetchAuthenticatedUser();
      
      setIsInitialized(true);
    }
  }, [additionalPassengersCount, passengers.adult, isInitialized]);

  const updateAdditionalPassenger = useCallback((index, field, value) => {
    setAdditionalPassengersList(prev => {
      const newList = [...prev];
      newList[index] = { ...newList[index], [field]: value };
      return newList;
    });
  }, []);

  // Handle passport photo upload with drag and drop
  const handlePhotoUpload = async (file) => {
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image (JPEG, PNG, etc.)');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      alert('La photo ne doit pas dépasser 5MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPassportPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
    
    setPassportPhoto(file);
    
    if (voyageurId) {
      await uploadPassportPhoto(file);
    }
  };

  const uploadPassportPhoto = async (file) => {
    if (!voyageurId) return;
    
    setIsUpdating(true);
    try {
      const formData = new FormData();
      formData.append('passport_photo', file);
      
      const response = await axiosInstance.patch(`/auth-service/auth/voyageurs/${voyageurId}/update/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      console.log('Photo uploaded successfully:', response.data);
      alert('Photo du passeport mise à jour avec succès!');
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Erreur lors du téléchargement de la photo');
    } finally {
      setIsUpdating(false);
    }
  };

  const removePhoto = async () => {
    setPassportPhoto(null);
    setPassportPhotoPreview(null);
    
    if (voyageurId) {
      setIsUpdating(true);
      try {
        const response = await axiosInstance.patch(`/auth-service/auth/voyageurs/${voyageurId}/update/`, {
          passport_photo: null
        });
        console.log('Photo removed:', response.data);
        alert('Photo supprimée avec succès!');
      } catch (error) {
        console.error('Error removing photo:', error);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handlePhotoUpload(files[0]);
    }
  };

  const updateField = async (field, value) => {
    if (!voyageurId) {
      if (field === 'email') setEmail(value);
      if (field === 'phone') setPhone(value);
      if (field === 'wilaya') setWilaya(value);
      if (field === 'commune') setCommune(value);
      if (field === 'sexe') setSexe(value);
      if (field === 'dateNaissance') setDateNaissance(value);
      if (field === 'numPassport') setNumPassport(value);
      if (field === 'dateExpPassport') setDateExpPassport(value);
      return;
    }
    
    setIsUpdating(true);
    try {
      const updateData = {};
      if (field === 'email') updateData.email = value;
      if (field === 'phone') updateData.telephone = value;
      if (field === 'wilaya') updateData.wilaya = value;
      if (field === 'commune') updateData.commune = value;
      if (field === 'sexe') updateData.sexe = value;
      if (field === 'dateNaissance') updateData.date_naissance = value;
      if (field === 'numPassport') updateData.num_passport = value;
      if (field === 'dateExpPassport') updateData.date_exp_passport = value;
      
      const response = await axiosInstance.patch(`/auth-service/auth/voyageurs/${voyageurId}/update/`, updateData);
      console.log(`Field ${field} updated:`, response.data);
      
      if (field === 'email') setEmail(value);
      if (field === 'phone') setPhone(value);
      if (field === 'wilaya') setWilaya(value);
      if (field === 'commune') setCommune(value);
      if (field === 'sexe') setSexe(value);
      if (field === 'dateNaissance') setDateNaissance(value);
      if (field === 'numPassport') setNumPassport(value);
      if (field === 'dateExpPassport') setDateExpPassport(value);
      
      const input = document.getElementById(`field-${field}`);
      if (input) {
        input.classList.add('border-green-500');
        setTimeout(() => {
          input.classList.remove('border-green-500');
        }, 2000);
      }
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      alert(`Erreur lors de la mise à jour: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFieldBlur = (field, value) => {
    updateField(field, value);
  };

  const handleCardInputChange = (field, value) => {
    if (field === 'cardNumber') {
      let cleaned = value.replace(/\s/g, '');
      if (cleaned.length > 16) cleaned = cleaned.slice(0, 16);
      let formatted = cleaned.replace(/(\d{4})/g, '$1 ').trim();
      setCardInfo(prev => ({ ...prev, cardNumber: formatted }));
    } else if (field === 'expiryDate') {
      let cleaned = value.replace(/\//g, '');
      if (cleaned.length > 4) cleaned = cleaned.slice(0, 4);
      let formatted = cleaned;
      if (cleaned.length >= 3) {
        formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
      }
      setCardInfo(prev => ({ ...prev, expiryDate: formatted }));
    } else if (field === 'cvv') {
      if (value.length <= 4) {
        setCardInfo(prev => ({ ...prev, cvv: value }));
      }
    } else {
      setCardInfo(prev => ({ ...prev, [field]: value }));
    }
  };

  const formatFlightDetails = () => {
    if (isMulti) {
      const segments = flight?.segments || flight?.flights || [];
      return {
        type: 'multi',
        segments: segments.map(segment => ({
          airline: segment.airline,
          flightNumber: segment.flightNumber,
          departure: {
            airport: segment.departure?.airport,
            city: getCityFromAirport(segment.departure?.airport),
            time: segment.departure?.time,
            date: segment.departure?.date
          },
          arrival: {
            airport: segment.arrival?.airport,
            city: getCityFromAirport(segment.arrival?.airport),
            time: segment.arrival?.time,
            date: segment.arrival?.date
          },
          duration: segment.duration,
          stops: segment.stops || 0
        })),
        totalPrice: flight?.totalPrice || flight?.prixTotal || 0
      };
    } else {
      return {
        type: isRoundTrip ? 'roundtrip' : 'oneway',
        outbound: {
          airline: flight?.airline,
          flightNumber: flight?.flightNumber,
          aircraft: flight?.aircraft || 'Boeing 737',
          departure: {
            airport: flight?.departure?.airport,
            city: getCityFromAirport(flight?.departure?.airport),
            time: flight?.departure?.time,
            date: flight?.departure?.date || searchParams.departureDate
          },
          arrival: {
            airport: flight?.arrival?.airport,
            city: getCityFromAirport(flight?.arrival?.airport),
            time: flight?.arrival?.time,
            date: flight?.arrival?.date || searchParams.departureDate
          },
          duration: flight?.duration,
          totalDuration: flight?.totalDuration || flight?.duration,
          stops: flight?.stops || 0,
          stopover: flight?.stopover || 'Queen Alia International Airport',
          stopoverDuration: flight?.stopoverDuration || '1h 25m',
          class: searchParams.flightClass || 'Économique',
          baggage: { cabin: flight?.baggage?.cabin || '1 PC', checked: flight?.baggage?.checked || '1 PC' }
        },
        totalPrice: flight?.price?.total || flight?.totalPrice || 0,
        return: isRoundTrip && flight?.returnFlight ? {
          airline: flight.returnFlight.airline,
          flightNumber: flight.returnFlight.flightNumber,
          aircraft: flight.returnFlight.aircraft || 'AIRBUS A321NEO',
          departure: {
            airport: flight.returnFlight.departure?.airport,
            city: getCityFromAirport(flight.returnFlight.departure?.airport),
            time: flight.returnFlight.departure?.time,
            date: flight.returnFlight.departure?.date || searchParams.returnDate
          },
          arrival: {
            airport: flight.returnFlight.arrival?.airport,
            city: getCityFromAirport(flight.returnFlight.arrival?.airport),
            time: flight.returnFlight.arrival?.time,
            date: flight.returnFlight.arrival?.date || searchParams.returnDate
          },
          duration: flight.returnFlight.duration,
          totalDuration: flight.returnFlight.totalDuration || flight.returnFlight.duration,
          stops: flight.returnFlight.stops || 0,
          stopover: flight.returnFlight.stopover || 'Queen Alia International Airport',
          stopoverDuration: flight.returnFlight.stopoverDuration || '1h 25m',
          class: searchParams.flightClass || 'Économique',
          baggage: { cabin: flight.returnFlight.baggage?.cabin || '1 PC', checked: flight.returnFlight.baggage?.checked || '1 PC' }
        } : null
      };
    }
  };

  const formattedFlight = formatFlightDetails();
  const getTotalPrice = () => formattedFlight.totalPrice.toLocaleString('fr-DZ') + ' DZD';

  // Prepare passenger data for API
  const preparePassengerData = () => {
    // If there are additional passengers (total > 1), send them
    if (additionalPassengersCount > 0) {
      return additionalPassengersList.map((passenger) => ({
        nom: passenger.lastName,
        prenom: passenger.firstName,
        date_naissance: passenger.birthDate || null,
        sexe: passenger.title === 'Mr' ? 'homme' : 'femme',
        num_passport: passenger.passportNumber || '',
        date_exp_passport: passenger.passportExpiry || null,
        email: email,
        telephone: phone,
        nationalite: 'DZ',
        lieu_naissance: commune
      }));
    }
    
    // If only one passenger, send the main traveler data
    return [{
      nom: authenticatedUser?.nom || '',
      prenom: authenticatedUser?.prenom || '',
      date_naissance: dateNaissance || null,
      sexe: sexe || 'homme',
      num_passport: numPassport || '',
      date_exp_passport: dateExpPassport || null,
      email: email,
      telephone: phone,
      nationalite: 'DZ',
      lieu_naissance: commune
    }];
  };

 // Prepare selected flights for API
const prepareSelectedFlights = () => {
  // If we have flight data
  if (flight) {
    const flightData = {
      flight_id: flight.id || '1',
      airline: flight.airline,
      flightNumber: flight.flightNumber,
      departure: {
        airport: flight.departure?.airport || searchParams?.from,
        time: flight.departure?.time,
        terminal: flight.departure?.terminal || ''
      },
      arrival: {
        airport: flight.arrival?.airport || searchParams?.to,
        time: flight.arrival?.time,
        terminal: flight.arrival?.terminal || ''
      },
      duration: flight.duration,
      price: {
        total: flight.price?.total || formattedFlight.totalPrice,
        currency: 'DZD',
        perPassenger: (flight.price?.total || formattedFlight.totalPrice) / (passengers.adult + passengers.child)
      },
      baggage: { quantity: 1, included: "1 bagage(s)" },
      refundable: { isRefundable: false, policy: "Non remboursable" },
      seatsAvailable: 9,
      segments: flight.segments || []
    };
    
    // For round trip with return flight
    if (isRoundTrip && flight.returnFlight) {
      return [
        flightData,
        {
          flight_id: flight.returnFlight.id || '2',
          airline: flight.returnFlight.airline,
          flightNumber: flight.returnFlight.flightNumber,
          departure: {
            airport: flight.returnFlight.departure?.airport || searchParams?.to,
            time: flight.returnFlight.departure?.time,
            terminal: flight.returnFlight.departure?.terminal || ''
          },
          arrival: {
            airport: flight.returnFlight.arrival?.airport || searchParams?.from,
            time: flight.returnFlight.arrival?.time,
            terminal: flight.returnFlight.arrival?.terminal || ''
          },
          duration: flight.returnFlight.duration,
          price: {
            total: flight.returnFlight.price?.total || formattedFlight.totalPrice / 2,
            currency: 'DZD',
            perPassenger: (flight.returnFlight.price?.total || formattedFlight.totalPrice / 2) / (passengers.adult + passengers.child)
          },
          baggage: { quantity: 1, included: "1 bagage(s)" },
          refundable: { isRefundable: false, policy: "Non remboursable" },
          seatsAvailable: 7,
          segments: flight.returnFlight.segments || []
        }
      ];
    }
    
    return [flightData];
  }
  
  // Fallback: return empty array if no flight data
  return [];
};

 // Prepare reservation data for API
const prepareReservationData = () => {
  const tripType = isRoundTrip ? 'ALLER_RETOUR' : 'ALLER_SIMPLE';
  
  // Get origin and destination from multiple possible sources
  let originCode = null;
  let destinationCode = null;
  
  // Try to get from searchParams (using from/to or origin/destination)
  if (searchParams) {
    originCode = searchParams.from || searchParams.origin;
    destinationCode = searchParams.to || searchParams.destination;
  }
  
  // If still undefined, try to get from flight object
  if (!originCode && flight) {
    originCode = flight?.departure?.airport;
  }
  if (!destinationCode && flight) {
    destinationCode = flight?.arrival?.airport;
  }
  
  // If still undefined, try to get from selected_flights if already prepared
  if (!originCode && flight?.segments?.length > 0) {
    originCode = flight.segments[0]?.departure?.airport;
    destinationCode = flight.segments[flight.segments.length - 1]?.arrival?.airport;
  }
  
  console.log('Origin code from searchParams:', searchParams?.from || searchParams?.origin);
  console.log('Destination code from searchParams:', searchParams?.to || searchParams?.destination);
  console.log('Final origin:', originCode);
  console.log('Final destination:', destinationCode);
  
  const searchParamsData = {
    origin: originCode,
    destination: destinationCode,
    departureDate: searchParams?.departureDate,
    adults: passengers.adult || 1,
    children: passengers.child || 0,
    infants: passengers.baby || 0,
    travelClass: searchParams?.flightClass?.toUpperCase() || "ECONOMY"
  };

  if (isRoundTrip && searchParams?.returnDate) {
    searchParamsData.returnDate = searchParams.returnDate;
  }

  // Map payment method
  let paymentMethodValue = '';
  if (paymentMethod === 'cib') {
    paymentMethodValue = 'CARD';
  } else if (paymentMethod === 'delivery') {
    paymentMethodValue = 'DELIVERY';
  } else if (paymentMethod === 'cash') {
    paymentMethodValue = 'CASH';
  }

  const reservationData = {
    trip_type: tripType,
    search_params: searchParamsData,
    selected_flights: prepareSelectedFlights(),
    passengers: preparePassengerData(),
    existing_passenger_ids: [],
    payment_method: paymentMethodValue
  };
  
  console.log('Final reservation data:', reservationData);
  
  return reservationData;
};

  // Create reservation
  const createReservation = async () => {
    try {
      const reservationData = prepareReservationData();
      console.log('Creating reservation with data:', reservationData);
      
      const response = await axiosInstance.post('/ms-reservation/reservations/', reservationData);
      console.log('Reservation created:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error creating reservation:', error.response?.data || error.message);
      throw error;
    }
  };

  // Confirm price
  const confirmPrice = async (reservationId) => {
    try {
      console.log('Confirming price for reservation:', reservationId);
      const response = await axiosInstance.post(`/ms-reservation/reservations/${reservationId}/confirm_price/`);
      console.log('Price confirmed:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error confirming price:', error.response?.data || error.message);
      throw error;
    }
  };

  // Book reservation
  const bookReservation = async (reservationId) => {
    try {
      console.log('Booking reservation:', reservationId);
      const response = await axiosInstance.post(`/ms-reservation/reservations/${reservationId}/book/`);
      console.log('Booking response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error booking reservation:', error.response?.data || error.message);
      throw error;
    }
  };

 const processPayment = async () => {
  setIsProcessing(true);
  try {
    const reservation = await createReservation();
    const newReservationId = reservation.id;
    
    await confirmPrice(newReservationId);
    const bookingResult = await bookReservation(newReservationId);
    
    const totalPriceValue = parseFloat(getTotalPrice().replace(' DZD', ''));
    
    //  PAIEMENT POUR TOUTES LES MÉTHODES
    let paymentMethodValue = '';
    
    if (paymentMethod === 'cib') paymentMethodValue = 'CIB';
    else if (paymentMethod === 'cash') paymentMethodValue = 'CASH';
    else if (paymentMethod === 'delivery') paymentMethodValue = 'DELIVERY';
    
    const paymentResponse = await axiosInstance.post('/ms-paiement/api/payments/create-payment', {
      reservationId: newReservationId,
      amount: totalPriceValue,
      customerName: authenticatedUser?.nom || 'Client',
      customerEmail: email,
      paymentMethod: paymentMethodValue
    });
    
    console.log('Payment response:', paymentResponse.data);
    
    sessionStorage.setItem('reservationId', newReservationId);
    sessionStorage.setItem('bookingResponse', JSON.stringify(bookingResult));

if (paymentMethod === 'cib' && paymentResponse.data.paymentUrl) {
  window.location.href = paymentResponse.data.paymentUrl;
  return;
}
    
    // Pour CASH et DELIVERY, afficher confirmation
    setBookingResponse(bookingResult);
    setReservationId(newReservationId);
    setReservationComplete(true);
    setCurrentStep(4);
    window.scrollTo(0, 0);
    
  } catch (error) {
    console.error('Payment process failed:', error);
    alert(`Erreur lors du traitement: ${error.response?.data?.message || error.message}`);
  } finally {
    setIsProcessing(false);
  }
};

  const validatePassengerInfo = () => {
    if (!email || !phone || !wilaya || !commune) {
      alert('Veuillez remplir toutes les coordonnées');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Veuillez entrer une adresse email valide');
      return false;
    }
    const phoneRegex = /^[0-9]{9,10}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      alert('Veuillez entrer un numéro de téléphone valide');
      return false;
    }
    
    if (!sexe) {
      alert('Veuillez sélectionner votre civilité');
      return false;
    }
    if (!dateNaissance) {
      alert('Veuillez entrer votre date de naissance');
      return false;
    }
    if (!numPassport) {
      alert('Veuillez entrer votre numéro de passeport');
      return false;
    }
    if (!dateExpPassport) {
      alert('Veuillez entrer la date d\'expiration de votre passeport');
      return false;
    }
    
    for (const passenger of additionalPassengersList) {
      if (!passenger.firstName || !passenger.lastName || !passenger.birthDate || 
          !passenger.passportNumber || !passenger.passportExpiry) {
        alert('Veuillez remplir toutes les informations des passagers supplémentaires');
        return false;
      }
    }
    
    return true;
  };

  const validatePayment = () => {
    if (!paymentMethod) { alert('Veuillez sélectionner un mode de paiement'); return false; }
    if (!acceptedTerms) { alert('Veuillez accepter les conditions d\'achat'); return false; }
    if (paymentMethod === 'cib') {
      const cardNumberClean = cardInfo.cardNumber.replace(/\s/g, '');
      if (!cardInfo.cardNumber || cardNumberClean.length < 16) { alert('Veuillez entrer un numéro de carte valide'); return false; }
      if (!cardInfo.cardHolder) { alert('Veuillez entrer le nom du titulaire'); return false; }
      if (!cardInfo.expiryDate || cardInfo.expiryDate.length < 5) { alert('Veuillez entrer une date d\'expiration valide'); return false; }
      if (!cardInfo.cvv || cardInfo.cvv.length < 3) { alert('Veuillez entrer un CVV valide'); return false; }
    }
    return true;
  };

  const nextStep = () => {
    if (currentStep === 1) { setCurrentStep(2); window.scrollTo(0, 0); }
    else if (currentStep === 2 && validatePassengerInfo()) { setCurrentStep(3); window.scrollTo(0, 0); }
    else if (currentStep === 3 && validatePayment()) { processPayment(); }
  };

  const prevStep = () => { setCurrentStep(currentStep - 1); window.scrollTo(0, 0); };

  if (reservationComplete) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4">
          <ConfirmationPage 
            reservationId={reservationId} 
            bookingResponse={bookingResponse}
            isRoundTrip={isRoundTrip}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto mb-12 px-4">
        <div className="flex justify-center items-center gap-8">
          <StepIndicator number={1} title="Vol" icon="plane" isActive={currentStep === 1} isCompleted={currentStep > 1} />
          <div className={`w-16 h-0.5 transition-all duration-300 ${currentStep > 1 ? 'bg-green-500' : 'bg-gray-200'}`} />
          <StepIndicator number={2} title="Passagers" icon="user" isActive={currentStep === 2} isCompleted={currentStep > 2} />
          <div className={`w-16 h-0.5 transition-all duration-300 ${currentStep > 2 ? 'bg-green-500' : 'bg-gray-200'}`} />
          <StepIndicator number={3} title="Paiement" icon="card" isActive={currentStep === 3} isCompleted={currentStep > 3} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-8 bg-gradient-to-r from-[#00C0E8] to-[#0096b8] rounded-full"></div>
                  <h2 className="text-2xl font-bold text-gray-800">Détails du vol</h2>
                </div>
                {isMulti ? (
                  <MultiFlightDetailsCard segments={formattedFlight.segments} />
                ) : (
                  <>
                    <FlightDetailsCard flight={formattedFlight.outbound} type="outbound" />
                    {formattedFlight.type === 'roundtrip' && formattedFlight.return && (
                      <FlightDetailsCard flight={formattedFlight.return} type="return" />
                    )}
                  </>
                )}
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-8 bg-gradient-to-r from-[#00C0E8] to-[#0096b8] rounded-full"></div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Informations voyageurs ({totalPassengersCount} passager{totalPassengersCount > 1 ? 's' : ''})
                  </h2>
                </div>
                
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                      <FaUser className="text-[#00C0E8]" />
                      Voyageur principal
                    </h3>
                    {isUpdating && (
                      <div className="flex items-center gap-2 text-sm text-blue-500">
                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        Mise à jour...
                      </div>
                    )}
                  </div>
                  
                  {isLoadingUser && (
                    <div className="mb-4 text-sm text-blue-600">Chargement de vos informations...</div>
                  )}
                  
                  {authenticatedUser && (
                    <div className="mb-4 p-3 bg-green-50 rounded-lg text-sm text-green-700">
                      ✓ Vos informations ont été automatiquement remplies
                    </div>
                  )}
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Photo du passeport</label>
                      <div
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                          isDragging 
                            ? 'border-[#00C0E8] bg-[#00C0E8]/10' 
                            : passportPhotoPreview 
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-300 hover:border-[#00C0E8] hover:bg-[#00C0E8]/5'
                        }`}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handlePhotoUpload(e.target.files?.[0])}
                          className="hidden"
                        />
                        
                        {passportPhotoPreview ? (
                          <div className="relative">
                            <img 
                              src={passportPhotoPreview} 
                              alt="Aperçu du passeport" 
                              className="max-h-32 mx-auto rounded-lg object-contain"
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removePhoto();
                              }}
                              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                            >
                              <FaTrash className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <div>
                            <FaCamera className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600">
                              Glissez-déposez une photo ou cliquez pour sélectionner
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              JPEG, PNG, GIF (max 5MB)
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">Adresse e-mail *</label>
                        <input
                          id="field-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onBlur={(e) => handleFieldBlur('email', e.target.value)}
                          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:border-[#00C0E8] focus:ring-2 focus:ring-[#00C0E8]/20 transition-all outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">Numéro de téléphone *</label>
                        <div className="flex gap-2">
                          <div className="flex items-center px-4 border border-gray-300 rounded-xl bg-gray-50">
                            <FaPhone className="text-gray-400" />
                            <span className="ml-2 text-gray-600">+213</span>
                          </div>
                          <input
                            id="field-phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            onBlur={(e) => handleFieldBlur('phone', e.target.value)}
                            placeholder="5XX XX XX XX"
                            className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 focus:border-[#00C0E8] focus:ring-2 focus:ring-[#00C0E8]/20 transition-all outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">Wilaya *</label>
                        <CustomSelect 
                          value={wilaya} 
                          onChange={(value) => {
                            setWilaya(value);
                            handleFieldBlur('wilaya', value);
                          }} 
                          options={WILAYAS} 
                          placeholder="Sélectionnez une wilaya" 
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">Commune *</label>
                        <input
                          id="field-commune"
                          type="text"
                          value={commune}
                          onChange={(e) => setCommune(e.target.value)}
                          onBlur={(e) => handleFieldBlur('commune', e.target.value)}
                          placeholder="Entrez votre commune"
                          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:border-[#00C0E8] focus:ring-2 focus:ring-[#00C0E8]/20 transition-all outline-none"
                        />
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <FaPassport className="text-[#00C0E8]" />
                        Informations personnelles
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">Civilité *</label>
                          <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input 
                                type="radio" 
                                value="homme" 
                                checked={sexe === 'homme'} 
                                onChange={(e) => {
                                  setSexe(e.target.value);
                                  handleFieldBlur('sexe', e.target.value);
                                }} 
                              />
                              <span>Homme</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input 
                                type="radio" 
                                value="femme" 
                                checked={sexe === 'femme'} 
                                onChange={(e) => {
                                  setSexe(e.target.value);
                                  handleFieldBlur('sexe', e.target.value);
                                }} 
                              />
                              <span>Femme</span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">Date de naissance *</label>
                          <DatePicker
                            value={dateNaissance}
                            onChange={(value) => {
                              setDateNaissance(value);
                              handleFieldBlur('dateNaissance', value);
                            }}
                            placeholder="JJ/MM/AAAA"
                            maxDate={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">Numéro de passeport *</label>
                          <input
                            id="field-numPassport"
                            type="text"
                            value={numPassport}
                            onChange={(e) => setNumPassport(e.target.value)}
                            onBlur={(e) => handleFieldBlur('numPassport', e.target.value)}
                            placeholder="Ex: A12345678"
                            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:border-[#00C0E8] focus:ring-2 focus:ring-[#00C0E8]/20 transition-all outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">Date d'expiration passeport *</label>
                          <DatePicker 
                            value={dateExpPassport} 
                            onChange={(value) => {
                              setDateExpPassport(value);
                              handleFieldBlur('dateExpPassport', value);
                            }}
                            placeholder="JJ/MM/AAAA" 
                            minDate={new Date().toISOString().split('T')[0]} 
                          />
                        </div>
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
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-8 bg-gradient-to-r from-[#00C0E8] to-[#0096b8] rounded-full"></div>
                  <h2 className="text-2xl font-bold text-gray-800">Paiement</h2>
                </div>
                
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <h3 className="font-semibold text-gray-800 mb-4">Mode de paiement *</h3>
                  
                  <div className="space-y-3 mb-6">
                    {[
                      { id: 'cib', label: 'Carte CIB / Edahabia', icon: FaCreditCard, description: 'Paiement sécurisé par carte bancaire' },
                      { id: 'delivery', label: 'Paiement à la livraison', icon: FaMoneyBill, description: 'Payez lors de la réception des billets' },
                      { id: 'cash', label: 'Paiement en espèces', icon: FaMoneyBill, description: 'Payez en espèces à notre agence' }
                    ].map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          paymentMethod === method.id
                            ? 'border-[#00C0E8] bg-[#00C0E8]/5 shadow-md'
                            : 'border-gray-200 hover:border-[#00C0E8]/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-4 h-4 text-[#00C0E8] focus:ring-[#00C0E8] focus:ring-2 mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <method.icon className="text-gray-600" />
                            <span className="font-semibold text-gray-700">{method.label}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{method.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                  
                  {paymentMethod === 'cib' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-50 rounded-xl p-6 mt-4"
                    >
                      <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <FaCreditCard className="text-[#00C0E8]" />
                        Informations de la carte
                      </h4>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Numéro de carte</label>
                          <input
                            type="text"
                            value={cardInfo.cardNumber}
                            onChange={(e) => handleCardInputChange('cardNumber', e.target.value)}
                            placeholder="1234 5678 9012 3456"
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-[#00C0E8] focus:ring-2 focus:ring-[#00C0E8]/20 transition-all outline-none"
                            maxLength="19"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Nom du titulaire</label>
                          <input
                            type="text"
                            value={cardInfo.cardHolder}
                            onChange={(e) => handleCardInputChange('cardHolder', e.target.value)}
                            placeholder="COMME SUR LA CARTE"
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-[#00C0E8] focus:ring-2 focus:ring-[#00C0E8]/20 transition-all outline-none uppercase"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Date d'expiration</label>
                            <input
                              type="text"
                              value={cardInfo.expiryDate}
                              onChange={(e) => handleCardInputChange('expiryDate', e.target.value)}
                              placeholder="MM/YY"
                              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-[#00C0E8] focus:ring-2 focus:ring-[#00C0E8]/20 transition-all outline-none"
                              maxLength="5"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">CVV</label>
                            <input
                              type="password"
                              value={cardInfo.cvv}
                              onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                              placeholder="123"
                              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-[#00C0E8] focus:ring-2 focus:ring-[#00C0E8]/20 transition-all outline-none"
                              maxLength="4"
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-4 p-3 bg-blue-50 rounded-lg">
                          <FaShieldAlt className="text-blue-500" />
                          <p className="text-xs text-blue-700">Paiement 100% sécurisé. Vos informations bancaires sont cryptées.</p>
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
                        className="w-4 h-4 text-[#00C0E8] focus:ring-[#00C0E8] focus:ring-2 rounded mt-0.5"
                      />
                      <div>
                        <span className="text-gray-700">J'accepte les </span>
                        <a href="#" className="text-[#00C0E8] hover:underline">conditions générales d'achat</a>
                        <span className="text-gray-700"> et la </span>
                        <a href="#" className="text-[#00C0E8] hover:underline">politique de confidentialité</a>
                      </div>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="flex justify-between mt-8">
            {currentStep > 1 && (
              <button onClick={prevStep} className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:border-[#00C0E8] hover:text-[#00C0E8] transition-all duration-300">
                <FaChevronLeft /> Retour
              </button>
            )}
            <button onClick={nextStep} disabled={isProcessing}
              className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00C0E8] to-[#0096b8] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 ${currentStep === 1 ? 'ml-auto' : ''} ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}>
              {isProcessing ? (
                <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Traitement...</>
              ) : (
                <>{currentStep === 3 ? 'Payer ' + getTotalPrice() : 'Continuer'} <FaChevronRight /></>
              )}
            </button>
          </div>
        </div>
        
        <Sidebar flight={formattedFlight} isMulti={isMulti} passengers={passengers} getTotalPrice={getTotalPrice} />
      </div>
    </div>
  );
}

// ConfirmationPage component - Updated to call the download endpoint
export const ConfirmationPage = () => {
  const [loading, setLoading] = useState(true);
  const [reservationId, setReservationId] = useState(null);
  const [pnr, setPnr] = useState('N/A');
  const [status, setStatus] = useState('CONFIRMED');
  const [paymentStatus, setPaymentStatus] = useState('COMPLETED');
  const [totalPriceValue, setTotalPriceValue] = useState('0 DZD');
  const [flightDetails, setFlightDetails] = useState(null);
  const [passengers, setPassengers] = useState([]);
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    const rid = sessionStorage.getItem('reservationId');
    const storedBooking = sessionStorage.getItem('bookingResponse');

    if (!rid) {
      setLoading(false);
      return;
    }

    setReservationId(rid);

    // 1. Utiliser les données stockées si disponibles (rapide)
    if (storedBooking) {
      const booking = JSON.parse(storedBooking);
      setPnr(booking.pnr || booking.amadeus_pnr || 'N/A');
      setStatus(booking.status || 'CONFIRMED');
      setPaymentStatus(booking.payment_status || 'COMPLETED');
      setTotalPriceValue(booking.total_price || '0 DZD');
    }

    // 2. Appel à l'API pour obtenir les détails complets (vols, passagers, etc.)
    axiosInstance.get(`/ms-reservation/reservations/${rid}/`)
      .then(response => {
        const data = response.data;

        // Mettre à jour le prix total et le PNR si plus précis
        if (data.total_price) {
          setTotalPriceValue(`${data.total_price} ${data.currency || 'DZD'}`);
        }
        if (data.amadeus_pnr) {
          setPnr(data.amadeus_pnr);
        }
        if (data.status) setStatus(data.status);
        if (data.payment_status) setPaymentStatus(data.payment_status);

        // Construire flightDetails à partir des segments
        const segments = data.flight_segments || [];
        if (segments.length > 0) {
          const outbound = segments[0];
          const returnSegment = segments[1];
          setFlightDetails({
            type: data.trip_type === 'ALLER_RETOUR' ? 'roundtrip' : 'oneway',
            outbound: {
              airline: outbound.flight_data?.airline,
              flightNumber: outbound.flight_data?.flightNumber,
              departure: {
                airport: outbound.origin,
                city: getCityFromAirport(outbound.origin),
                date: outbound.departure_date,
                time: outbound.departure_time,
              },
              arrival: {
                airport: outbound.destination,
                city: getCityFromAirport(outbound.destination),
                date: outbound.arrival_date,
                time: outbound.arrival_time,
              },
              duration: outbound.flight_data?.duration,
            },
            return: returnSegment ? {
              airline: returnSegment.flight_data?.airline,
              flightNumber: returnSegment.flight_data?.flightNumber,
              departure: {
                airport: returnSegment.origin,
                city: getCityFromAirport(returnSegment.origin),
                date: returnSegment.departure_date,
                time: returnSegment.departure_time,
              },
              arrival: {
                airport: returnSegment.destination,
                city: getCityFromAirport(returnSegment.destination),
                date: returnSegment.arrival_date,
                time: returnSegment.arrival_time,
              },
            } : null,
          });
          setIsRoundTrip(data.trip_type === 'ALLER_RETOUR');
        }

        // Récupérer les passagers
        const pass = data.passenger_reservations?.map(pr => pr.passenger) || [];
        setPassengers(pass);
      })
      .catch(error => {
        console.error('Erreur chargement réservation', error);
      })
      .finally(() => setLoading(false));
  }, []);

  // Téléchargement PDF (identique à l'original)
  const downloadTicket = async () => {
    if (!reservationId) return;
    setIsGeneratingPDF(true);
    try {
      const response = await axiosInstance.get(
        `/ms-reservation/reservations/${reservationId}/ticket/download/`,
        { responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `billet_${reservationId}_${pnr}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Billet téléchargé avec succès');
    } catch (error) {
      console.error('Error downloading ticket:', error);
      toast.error('Erreur lors du téléchargement du billet');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const shareViaWhatsApp = () => {
    const message = `*Confirmation de réservation FlyExpress* 🎫\n\n` +
      `📋 Numéro: ${reservationId}\n` +
      `🔖 Code PNR: ${pnr}\n` +
      `✅ Statut: ${status}\n` +
      `💰 Total: ${totalPriceValue}\n\n` +
      `Merci de votre confiance ! ✈️`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const printTicket = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Billet d'avion - ${reservationId}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .ticket { max-width: 800px; margin: 0 auto; border: 2px solid #00C0E8; border-radius: 10px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #00C0E8, #0096b8); color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .row { display: flex; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #eee; }
          .label { flex: 1; font-weight: bold; color: #666; }
          .value { flex: 2; color: #333; }
          .flight-info { background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .footer { background: #f9f9f9; padding: 15px; text-align: center; font-size: 12px; color: #999; }
          @media print { body { margin: 0; padding: 0; } .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="ticket">
          <div class="header">
            <h2>FlyExpress - Billet d'avion</h2>
            <p>Confirmation de réservation</p>
          </div>
          <div class="content">
            <div class="row"><div class="label">Numéro de réservation:</div><div class="value">${reservationId}</div></div>
            <div class="row"><div class="label">Code PNR:</div><div class="value"><strong>${pnr}</strong></div></div>
            <div class="row"><div class="label">Statut:</div><div class="value">${status}</div></div>
            <div class="row"><div class="label">Paiement:</div><div class="value">${paymentStatus}</div></div>
            <div class="row"><div class="label">Total payé:</div><div class="value"><strong>${totalPriceValue}</strong></div></div>
            
            <div class="flight-info">
              <h3>Détails du vol</h3>
              ${flightDetails?.type === 'multi' ? flightDetails.segments.map((seg, idx) => `
                <div><strong>Segment ${idx+1}: ${seg.departure?.city || seg.departure?.airport} → ${seg.arrival?.city || seg.arrival?.airport}</strong><br>
                Vol: ${seg.airline} ${seg.flightNumber}<br>
                Départ: ${seg.departure?.date || 'N/A'} à ${seg.departure?.time || 'N/A'}<br>
                Arrivée: ${seg.arrival?.date || 'N/A'} à ${seg.arrival?.time || 'N/A'}</div>
              `).join('') : `
                <div><strong>Aller:</strong> ${flightDetails?.outbound?.departure?.city || flightDetails?.outbound?.departure?.airport} → ${flightDetails?.outbound?.arrival?.city || flightDetails?.outbound?.arrival?.airport}</div>
                <div>Date: ${flightDetails?.outbound?.departure?.date}</div>
                <div>Départ: ${flightDetails?.outbound?.departure?.time} | Arrivée: ${flightDetails?.outbound?.arrival?.time}</div>
                <div>Vol: ${flightDetails?.outbound?.airline} ${flightDetails?.outbound?.flightNumber}</div>
                ${isRoundTrip && flightDetails?.return ? `
                  <div style="margin-top:15px"><strong>Retour:</strong> ${flightDetails.return.departure?.city || flightDetails.return.departure?.airport} → ${flightDetails.return.arrival?.city || flightDetails.return.arrival?.airport}</div>
                  <div>Date: ${flightDetails.return.departure?.date}</div>
                  <div>Départ: ${flightDetails.return.departure?.time} | Arrivée: ${flightDetails.return.arrival?.time}</div>
                  <div>Vol: ${flightDetails.return.airline} ${flightDetails.return.flightNumber}</div>
                ` : ''}
              `}
            </div>

            <div class="flight-info">
              <h3>Passagers</h3>
              ${passengers.length ? passengers.map((p, idx) => `<div>${idx+1}. ${p.prenom || p.firstName || ''} ${p.nom || p.lastName || ''}</div>`).join('') : '<div>1 passager</div>'}
            </div>
          </div>
          <div class="footer">
            <p>Merci d'avoir choisi FlyExpress! Présentez ce billet à l'embarquement.</p>
            <p>Pour toute assistance, contactez-nous au +213 555 123 456</p>
          </div>
        </div>
        <div class="no-print" style="text-align:center; margin-top:20px;">
          <button onclick="window.print()" style="padding:10px 20px; background:#00C0E8; color:white; border:none; border-radius:5px; cursor:pointer;">Imprimer</button>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (loading) {
    return <div className="text-center py-10">Chargement de votre confirmation...</div>;
  }

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
        <h2 className="text-3xl font-bold text-[#00C0E8] mb-2">Réservation Confirmée !</h2>
        <p className="text-cyan-600">Votre réservation a été effectuée avec succès</p>
      </div>

      <div className="p-8">
        {/* Résumé */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-9">
            <div><p className="text-xs text-gray-500">Code PNR</p><p className="text-xl font-bold font-mono text-[#00C0E8]">{pnr}</p></div>
            <div><p className="text-xs text-gray-500">Statut</p><span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold"><FaCheck className="w-3 h-3" /> {status}</span></div>
            <div><p className="text-xs text-gray-500">Total payé</p><p className="text-xl font-bold text-gray-800">{totalPriceValue}</p></div>
          </div>
        </div>

        {/* Détails du vol */}
        {flightDetails && (
          <div className="mb-8">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><FaPlane className="text-[#00C0E8]" /> Détails du vol</h3>
            {flightDetails.type === 'multi' ? (
              <div className="space-y-4">
                {flightDetails.segments.map((segment, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-3"><div className="font-semibold">{segment.departure?.city || segment.departure?.airport} → {segment.arrival?.city || segment.arrival?.airport}</div><div className="text-sm text-gray-500">Vol {segment.airline} {segment.flightNumber}</div></div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><p className="text-gray-500">Départ</p><p className="font-semibold">{segment.departure?.date || 'N/A'} à {segment.departure?.time || 'N/A'}</p><p className="text-xs text-gray-500">{segment.departure?.airport}</p></div>
                      <div><p className="text-gray-500">Arrivée</p><p className="font-semibold">{segment.arrival?.date || 'N/A'} à {segment.arrival?.time || 'N/A'}</p><p className="text-xs text-gray-500">{segment.arrival?.airport}</p></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-3"><div className="font-semibold">{flightDetails.outbound?.departure?.city || flightDetails.outbound?.departure?.airport} → {flightDetails.outbound?.arrival?.city || flightDetails.outbound?.arrival?.airport}</div><div className="text-sm text-gray-500">Vol {flightDetails.outbound?.airline} {flightDetails.outbound?.flightNumber}</div></div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><p className="text-gray-500">Départ</p><p className="font-semibold">{flightDetails.outbound?.departure?.date || 'N/A'} à {flightDetails.outbound?.departure?.time || 'N/A'}</p><p className="text-xs text-gray-500">{flightDetails.outbound?.departure?.airport}</p></div>
                    <div><p className="text-gray-500">Arrivée</p><p className="font-semibold">{flightDetails.outbound?.arrival?.date || 'N/A'} à {flightDetails.outbound?.arrival?.time || 'N/A'}</p><p className="text-xs text-gray-500">{flightDetails.outbound?.arrival?.airport}</p></div>
                  </div>
                </div>
                {isRoundTrip && flightDetails.return && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-3"><div className="font-semibold">{flightDetails.return.departure?.city || flightDetails.return.departure?.airport} → {flightDetails.return.arrival?.city || flightDetails.return.arrival?.airport}</div><div className="text-sm text-gray-500">Vol {flightDetails.return.airline} {flightDetails.return.flightNumber}</div></div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><p className="text-gray-500">Départ</p><p className="font-semibold">{flightDetails.return.departure?.date || 'N/A'} à {flightDetails.return.departure?.time || 'N/A'}</p><p className="text-xs text-gray-500">{flightDetails.return.departure?.airport}</p></div>
                      <div><p className="text-gray-500">Arrivée</p><p className="font-semibold">{flightDetails.return.arrival?.date || 'N/A'} à {flightDetails.return.arrival?.time || 'N/A'}</p><p className="text-xs text-gray-500">{flightDetails.return.arrival?.airport}</p></div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Passagers */}
        {passengers.length > 0 && (
          <div className="mb-8">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><FaUser className="text-[#00C0E8]" /> Passagers ({passengers.length})</h3>
            <div className="space-y-2">
              {passengers.map((p, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-3"><div className="font-semibold">{p.prenom || p.firstName || ''} {p.nom || p.lastName || ''}</div>{p.num_passport && <div className="text-sm text-gray-500">Passeport: {p.num_passport}</div>}</div>
              ))}
            </div>
          </div>
        )}

        {/* Boutons */}
        <div className="flex flex-wrap gap-4">
          <button onClick={printTicket} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:border-[#00C0E8] hover:text-[#00C0E8] transition-all"><FaPrint /> Imprimer le billet</button>
          <button onClick={downloadTicket} disabled={isGeneratingPDF} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#00C0E8] text-white rounded-xl font-semibold hover:bg-[#0096b8] transition-all disabled:opacity-50">{isGeneratingPDF ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Génération...</> : <><FaDownload /> Télécharger PDF</>}</button>
          <button onClick={shareViaWhatsApp} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-all"><FaWhatsapp /> Partager</button>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-2"><FaInfoCircle className="text-blue-500 mt-0.5" /><div className="text-sm text-blue-800"><p className="font-semibold mb-1">Informations importantes:</p><p>✓ Présentez-vous à l'aéroport 2 heures avant le départ</p><p>✓ Munissez-vous de votre pièce d'identité et de ce billet</p><p>✓ Pour toute modification, contactez notre service client</p></div></div>
        </div>
      </div>
    </motion.div>
  );
};