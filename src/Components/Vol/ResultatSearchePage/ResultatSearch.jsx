import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CgChevronLeft } from "react-icons/cg";
import { GiCommercialAirplane } from 'react-icons/gi';
import FiltersSidebar from './FiltreSidebar';
import SearchHeader from './SearchHeader';
import FlightList from './FlightList';
import useAirports from '../../../hooks/useAirports';
import axios from 'axios';

export default function ResultatSearch() {
  const location = useLocation();
  const navigate = useNavigate();
  const { airports } = useAirports();
  
  // ========== ÉTATS RÉSULTATS ==========
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [passengersCount, setPassengersCount] = useState(1);
  const [isMulti, setIsMulti] = useState(false);
  
  // ========== ÉTATS FORMULAIRE ==========
  const [activeTab, setActiveTab] = useState("aller");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [flightClass, setFlightClass] = useState("ECONOMY");
  const [options, setOptions] = useState({ direct: false, baggage: false, refundable: false });
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [multiFlights, setMultiFlights] = useState([{ from: "", to: "", date: "" }]);
  const [passengers, setPassengers] = useState({ adult: 1, child: 0, baby: 0 });
  const [isSearching, setIsSearching] = useState(false);
  const [showPassengers, setShowPassengers] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  
  const searchHeaderRef = useRef(null);

  // ========== CHARGEMENT INITIAL ==========
  useEffect(() => {
    const data = location.state;
    if (!data?.flights) {
      setLoading(false);
      return;
    }
    
    if (data.params) initSearchForm(data);
    processFlightData(data.flights);
  }, [location.state]);

  // ========== FERMETURE OPTIONS AU CLIC EXTÉRIEUR ==========
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchHeaderRef.current && !searchHeaderRef.current.contains(event.target) && showAdvancedOptions) {
        setShowAdvancedOptions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showAdvancedOptions]);

  // ========== INITIALISATION FORMULAIRE ==========
  const initSearchForm = (data) => {
    if (data.type === 'multi') {
      setActiveTab('multi');
      setMultiFlights(data.params.flights || [{ from: "", to: "", date: "" }]);
      setPassengers(data.params.passengers || { adult: 1, child: 0, baby: 0 });
      setFlightClass(data.params.travelClass || 'ECONOMY');
      setOptions(data.params.options || { direct: false, baggage: false, refundable: false });
    } else {
      setActiveTab(data.type === 'roundtrip' ? 'retour' : 'aller');
      setFrom(data.params.from || '');
      setTo(data.params.to || '');
      setDepartureDate(data.params.departureDate || '');
      setReturnDate(data.params.returnDate || '');
      setPassengers(data.params.passengers || { adult: 1, child: 0, baby: 0 });
      setFlightClass(data.params.travelClass || 'ECONOMY');
      setOptions(data.params.options || { direct: false, baggage: false, refundable: false });
    }
  };

  // ========== TRAITEMENT DES DONNÉES ==========
  const processFlightData = (flightsData) => {
    if (flightsData.data?.flights) {
      setFlights(flightsData.data.flights);
      setFilteredFlights(flightsData.data.flights);
      setPassengersCount(flightsData.data?.searchParams?.adults || 1);
      setIsMulti(false);
    } else if (flightsData.data?.combinations) {
      const formattedFlights = formatMultiFlights(flightsData.data.combinations);
      setFlights(formattedFlights);
      setFilteredFlights(formattedFlights);
      setPassengersCount(flightsData.data?.searchParams?.passengers?.adults || 1);
      setIsMulti(true);
    }
    setLoading(false);
  };

  // ========== FORMATAGE MULTI-DESTINATION ==========
  const formatMultiFlights = (combinations) => {
    return combinations.map((combo, index) => {
      const segments = combo.segments.map((segment, segIndex) => ({
        ...segment,
        airline: segment.airline || `Vol ${segIndex + 1}`,
        flightNumber: segment.flightNumber || '---'
      }));
      
      return {
        id: `combo-${index}`,
        type: 'multi',
        segments: segments,
        flights: segments,
        prixTotal: combo.totalPrice,
        totalPrice: combo.totalPrice,
        duree: combo.totalDuration,
        duration: combo.totalDuration,
        numberOfFlights: segments.length
      };
    });
  };

  // ========== GESTION PASSAGERS ==========
  const changeCount = (type, value) => {
    setPassengers(prev => {
      const newValue = prev[type] + value;
      if (type === "adult" && newValue < 1) return prev;
      if (newValue < 0) return prev;
      return { ...prev, [type]: newValue };
    });
  };

  // ========== GESTION MULTI-DESTINATION ==========
  const addMultiFlight = () => {
    if (multiFlights.length < 5) {
      setMultiFlights([...multiFlights, { from: "", to: "", date: "" }]);
    }
  };

  const removeMultiFlight = (index) => {
    if (multiFlights.length === 1) return;
    setMultiFlights(multiFlights.filter((_, i) => i !== index));
  };

  const updateMultiFlight = (index, field, value) => {
    const updated = [...multiFlights];
    
    if (field === "date" && index > 0) {
      const prevDate = updated[index - 1].date;
      if (prevDate && value < prevDate) {
        alert("La date doit être postérieure à celle du vol précédent");
        return;
      }
    }
    
    updated[index][field] = value;
    setMultiFlights(updated);
  };

  // ========== FILTRAGE DES VOLS (CORRIGÉ) ==========
  const handleFilterChange = (filters) => {
    let filtered = [...flights];
    
    // 1. Filtrer par compagnies
    if (filters.airlines && filters.airlines.length > 0) {
      filtered = filtered.filter(flight => {
        if (isMulti) {
          const segments = flight.segments || flight.flights || [];
          return segments.some(seg => filters.airlines.includes(seg.airline));
        } else {
          return filters.airlines.includes(flight.airline);
        }
      });
    }
    
    // 2. Filtrer par nombre d'escales
    if (isMulti) {
      // Multi-destination: chaque vol a son propre filtre d'escales
      if (filters.stops && typeof filters.stops === 'object' && Object.keys(filters.stops).length > 0) {
        filtered = filtered.filter(flight => {
          const segments = flight.segments || flight.flights || [];
          let valid = true;
          
          for (let i = 0; i < segments.length; i++) {
            const volKey = `vol${i + 1}`;
            const stopFilter = filters.stops[volKey];
            
            if (stopFilter && stopFilter !== 'all') {
              const stops = segments[i]?.stops || 0;
              
              if (stopFilter === '0' && stops !== 0) valid = false;
              if (stopFilter === '1' && stops !== 1) valid = false;
              if (stopFilter === '2+' && stops < 2) valid = false;
            }
            if (!valid) break;
          }
          return valid;
        });
      }
    } else {
      // Vol simple
      if (filters.stops && filters.stops !== 'all') {
        filtered = filtered.filter(flight => {
          const stops = flight.stops || 0;
          if (filters.stops === '0') return stops === 0;
          if (filters.stops === '1') return stops === 1;
          if (filters.stops === '2+') return stops >= 2;
          return true;
        });
      }
    }
    
    // 3. Filtrer par heure de départ
    if (filters.departureTime && filters.departureTime !== 'all') {
      filtered = filtered.filter(flight => {
        let departureTime;
        if (isMulti) {
          departureTime = flight.segments?.[0]?.departure?.time;
        } else {
          departureTime = flight.departure?.time;
        }
        if (!departureTime) return true;
        
        const hour = new Date(departureTime).getHours();
        const [start, end] = filters.departureTime.split('-').map(Number);
        return hour >= start && hour < end;
      });
    }
    
    // 4. Filtrer par heure d'arrivée
    if (filters.arrivalTime && filters.arrivalTime !== 'all') {
      filtered = filtered.filter(flight => {
        let arrivalTime;
        if (isMulti) {
          const lastSegment = flight.segments?.[flight.segments.length - 1];
          arrivalTime = lastSegment?.arrival?.time;
        } else {
          arrivalTime = flight.arrival?.time;
        }
        if (!arrivalTime) return true;
        
        const hour = new Date(arrivalTime).getHours();
        const [start, end] = filters.arrivalTime.split('-').map(Number);
        return hour >= start && hour < end;
      });
    }
    
    // 5. Filtrer par bagages
    if (filters.baggage) {
      filtered = filtered.filter(flight => {
        if (isMulti) {
          const segments = flight.segments || flight.flights || [];
          return segments.some(seg => seg.baggage?.quantity > 0);
        } else {
          return flight.baggage?.quantity > 0;
        }
      });
    }
    
    // 6. Filtrer par remboursable
    if (filters.refundable) {
      filtered = filtered.filter(flight => {
        if (isMulti) {
          const segments = flight.segments || flight.flights || [];
          return segments.some(seg => seg.refundable?.isRefundable === true);
        } else {
          return flight.refundable?.isRefundable === true;
        }
      });
    }
    
    setFilteredFlights(filtered);
  };

  // ========== NOUVELLE RECHERCHE ==========
  const handleNewSearch = async () => {
    try {
      setIsSearching(true);
      let response;
      let searchData;

      if (activeTab === "multi") {
        const requestData = {
          flights: multiFlights,
          adults: passengers.adult,
          children: passengers.child,
          infants: passengers.baby,
          travelClass: flightClass,
          nonStop: options.direct,
          refundable: options.refundable,
          baggage: options.baggage,
          currency: 'DZD'
        };

        response = await axios.post(
          "http://localhost:3002/api/flights/multi-destination",
          requestData
        );
        
        searchData = { 
          flights: response.data, 
          type: "multi", 
          params: { flights: multiFlights, passengers, travelClass: flightClass, options } 
        };
      } else {
        response = await axios.get("http://localhost:3002/api/flights/search", {
          params: {
            origin: from,
            destination: to,
            departureDate,
            returnDate: returnDate || undefined,
            adults: passengers.adult,
            children: passengers.child,
            infants: passengers.baby,
            travelClass: flightClass,
            nonStop: options.direct,
            refundable: options.refundable,
            baggage: options.baggage,
          },
        });
        
        searchData = {
          flights: response.data,
          type: activeTab === "retour" ? "roundtrip" : "oneway",
          params: { from, to, departureDate, returnDate, passengers, travelClass: flightClass, options }
        };
      }
      
      navigate("/results", { state: searchData });
    } catch (error) {
      console.error("Erreur:", error);
      alert(error.response?.data?.message || "Erreur recherche vols");
    } finally {
      setIsSearching(false);
    }
  };

  // ========== GESTION UI ==========
  const handleFormClick = () => setShowAdvancedOptions(true);
  const handleSearchComplete = () => setShowAdvancedOptions(false);
  const totalPassengers = passengers.adult + passengers.child + passengers.baby;
  const hasFlights = flights.length > 0;

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto p-6">

        {/* Bouton retour */}
        <button 
          onClick={() => navigate('/')} 
          className="mb-4 flex items-center gap-2 text-gray-600 hover:text-cyan-500 transition"
        >
          <CgChevronLeft /> Retour à l'accueil
        </button>

        {/* Formulaire de recherche */}
        <div ref={searchHeaderRef}>
          <SearchHeader
            airports={airports}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            from={from}
            setFrom={setFrom}
            to={to}
            setTo={setTo}
            departureDate={departureDate}
            setDepartureDate={setDepartureDate}
            returnDate={returnDate}
            setReturnDate={setReturnDate}
            multiFlights={multiFlights}
            updateMultiFlight={updateMultiFlight}
            removeMultiFlight={removeMultiFlight}
            addMultiFlight={addMultiFlight}
            totalPassengers={totalPassengers}
            passengers={passengers}
            changeCount={changeCount}
            flightClass={flightClass}
            setFlightClass={setFlightClass}
            options={options}
            setOptions={setOptions}
            handleSearch={handleNewSearch}
            isSearching={isSearching}
            showPassengers={showPassengers}
            setShowPassengers={setShowPassengers}
            isMulti={isMulti}
            showExtraOptions={showAdvancedOptions}
            onFormClick={handleFormClick}
            onSearchComplete={handleSearchComplete}
          />
        </div>

        {/* Résultats et filtres */}
        <div className={`flex gap-6 transition-all duration-300 ${showAdvancedOptions ? 'opacity-30 pointer-events-none' : ''}`}>
          
          {/* Sidebar des filtres */}
          {hasFlights && (
            <div className="w-1/4">
              <FiltersSidebar 
                flights={flights}
                filteredCount={filteredFlights.length}
                onFilterChange={handleFilterChange}
                isMulti={isMulti}
              />
            </div>
          )}
          
          {/* Liste des vols */}
          <div className={hasFlights ? "w-3/4" : "w-full"}>
            <FlightList 
              flights={filteredFlights}
              totalFlights={flights.length}
              passengersCount={passengersCount}
              isMulti={isMulti}
              onReserve={handleReserver}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ========== SPINNER DE CHARGEMENT ==========
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <div className="bg-white rounded-2xl shadow-xl p-10 text-center">
      <GiCommercialAirplane className="w-16 h-16 text-cyan-500 mx-auto animate-bounce" />
      <div className="mt-4 w-20 h-20 border-4 border-blue-200 rounded-full animate-spin border-t-cyan-500 mx-auto" />
      <p className="mt-6 text-gray-600">Chargement des résultats...</p>
    </div>
  </div>
);

// ========== FONCTION RÉSERVATION ==========
const handleReserver = (vol) => {
  console.log('Réservation:', vol);
  alert('Fonctionnalité de réservation à implémenter');
};