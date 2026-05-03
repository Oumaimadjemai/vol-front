import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAirports from "../../../hooks/useAirports";
import SearchForm from "./SearchForm";
import axiosInstance from "../../../api/axiosInstance";
import { useUserRole } from "../../../hooks/useUserRole";
import axiosInstance from "../../../api/axiosInstance";
import { useUserRole } from "../../../hooks/useUserRole";

export default function FlightSearch() {
  const navigate = useNavigate();
  const { role, loading: roleLoading, isAuthenticated } = useUserRole();
  const today = new Date().toISOString().split("T")[0];
  const [activeTab, setActiveTab] = useState("aller");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [flightClass, setFlightClass] = useState("ECONOMY");
  const [options, setOptions] = useState({
    direct: false,
    baggage: false,
    refundable: false,
  });
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const { airports } = useAirports();
  const [multiFlights, setMultiFlights] = useState([
    { from: "", to: "", date: "" },
  ]);
  const [multiFlights, setMultiFlights] = useState([
    { from: "", to: "", date: "" },
  ]);
  const [passengers, setPassengers] = useState({ adult: 1, child: 0, baby: 0 });
  const [isSearching, setIsSearching] = useState(false);

  const isAdmin = role === "admin";
  const isAgent = role === "agent";
  const isVoyageur = role === "voyageur";
  const totalPassengers = passengers.adult + passengers.child + passengers.baby;
  
  const changeCount = (type, value) => {
  
  const changeCount = (type, value) => {
    setPassengers((prev) => {
      const newValue = prev[type] + value;
      if (type === "adult" && newValue < 1) return prev;
      if (newValue < 0) return prev;
      return { ...prev, [type]: newValue };
    });
  };

  const addMultiFlight = () => {
    if (multiFlights.length >= 5) {
      alert("Maximum 5 escales autorisées");
      return;
    }
    setMultiFlights([...multiFlights, { from: "", to: "", date: "" }]);
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
        alert("La date doit être supérieure ou égale à celle du vol précédent");
        return;
      }
    }
    updated[index][field] = value;
    if (field === "from" && updated[index].to === value) updated[index].to = "";
    if (field === "to" && updated[index].from === value)
      updated[index].from = "";
    if (field === "to" && updated[index].from === value)
      updated[index].from = "";
    setMultiFlights(updated);
  };

  const validateSearch = () => {
    if (activeTab !== "multi" && (!from || !to || !departureDate)) {
      alert("Veuillez remplir tous les champs obligatoires");
      return false;
    }

    if (activeTab === "retour" && !returnDate) {
      alert("Veuillez sélectionner une date de retour");
      return false;
    }

    if (activeTab === "multi") {
      for (let i = 0; i < multiFlights.length; i++) {
        const flight = multiFlights[i];
        if (!flight.from || !flight.to || !flight.date) {
          alert(`Veuillez remplir tous les champs pour le vol ${i + 1}`);
          return false;
        }
        if (flight.from === flight.to) {
          alert(`L'origine et la destination ne peuvent pas être identiques pour le vol ${i + 1}`);
          return false;
        }
      }
    }

    if (from && to && from === to) {
      alert("L'origine et la destination ne peuvent pas être identiques");
      return false;
    }

    return true;
  };

  const handleSearch = async () => {
    if (!validateSearch()) return;

    try {
      setIsSearching(true);


      let response;
      let searchData;

      if (activeTab === "multi") {
        response = await axiosInstance.post(
          "/service-vols/api/flights/multi-destination",
          {
            flights: multiFlights,
            passengers,
            travelClass: flightClass,
            options,
          },
        );

        response = await axiosInstance.post(
          "/service-vols/api/flights/multi-destination",
          {
            flights: multiFlights,
            passengers,
            travelClass: flightClass,
            options,
          },
        );

        searchData = {
          flights: response.data,
          type: "multi",
          params: {
            flights: multiFlights,
            passengers,
            travelClass: flightClass,
            options,
          },
            options,
          },
        };
      } else {
        response = await axiosInstance.get("/service-vols/api/flights/search", {
        response = await axiosInstance.get("/service-vols/api/flights/search", {
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
          params: {
            from,
            to,
            departureDate,
            returnDate,
            passengers,
            travelClass: flightClass,
            options,
          },
            options,
          },
        };
      }

      // Role-based navigation (search works for everyone)
      if (isAuthenticated && isAdmin) {
        navigate("/admin/results", { state: searchData });
      } else if (isAuthenticated && isAgent) {
        navigate("/agent/results", { state: searchData });
      } else {
        // Guests and voyageurs go to same results page
        navigate("/results", { state: searchData });
      }
    } catch (error) {
      console.error("Search error:", error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "Erreur lors de la recherche des vols";
      alert(errorMessage);
    } finally {
      setIsSearching(false);
    }
  };

  // Show loading state
  if (roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00C0E8]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full p-6">
      <div className="w-full">
        {/* Show different titles based on user role */}
        {!isAuthenticated && (
          <>
            <h3 className="text-4xl text-gray-800 mb-2 text-left font-playfair font-bold">
              Réservez maintenant
            </h3>
            <div className="w-40 h-1 bg-[#00C0E8] mb-8 rounded"></div>
            <p className="text-gray-600 mb-6">
              Connectez-vous pour bénéficier de tarifs exclusifs et suivre vos réservations
            </p>
          </>
        )}
        
        {isAuthenticated && isVoyageur && (
          <>
            <h3 className="text-4xl text-gray-800 mb-2 text-left font-playfair font-bold">
              Bonjour {localStorage.getItem("userName") || "Voyageur"}
            </h3>
            <div className="w-40 h-1 bg-[#00C0E8] mb-8 rounded"></div>
            <p className="text-gray-600 mb-6">
              Trouvez votre prochaine destination et économisez avec nos offres exclusives
            </p>
          </>
        )}
        
        {isAuthenticated && isAgent && (
          <>
            <h3 className="text-4xl text-gray-800 mb-2 text-left font-playfair font-bold">
              Espace Agent
            </h3>
            <div className="w-40 h-1 bg-[#00C0E8] mb-8 rounded"></div>
            <p className="text-gray-600 mb-6">
              Gérez les réservations de vos clients et trouvez les meilleurs vols
            </p>
          </>
        )}
        
        {isAuthenticated && isAdmin && (
          <>
            <h3 className="text-4xl text-gray-800 mb-2 text-left font-playfair font-bold">
              Administration
            </h3>
            <div className="w-40 h-1 bg-[#00C0E8] mb-8 rounded"></div>
            <p className="text-gray-600 mb-6">
              Gérez les vols, les réservations et les utilisateurs
            </p>
          </>
        )}
      </div>
      
      <div className="flex justify-center">
        <div className="w-full max-w-6xl">
          <SearchForm
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            // OneWayRoundTrip props
            from={from}
            setFrom={setFrom}
            to={to}
            setTo={setTo}
            departureDate={departureDate}
            setDepartureDate={setDepartureDate}
            returnDate={returnDate}
            setReturnDate={setReturnDate}
            airports={airports}
            today={today}
            // MultiDestination props
            multiFlights={multiFlights}
            updateMultiFlight={updateMultiFlight}
            removeMultiFlight={removeMultiFlight}
            addMultiFlight={addMultiFlight}
            // PassengersOptions props
            totalPassengers={totalPassengers}
            passengers={passengers}
            changeCount={changeCount}
            flightClass={flightClass}
            setFlightClass={setFlightClass}
            options={options}
            setOptions={setOptions}
            // Search props
            handleSearch={handleSearch}
            isSearching={isSearching}
          />
        </div>
      </div>
    </div>
  );
}