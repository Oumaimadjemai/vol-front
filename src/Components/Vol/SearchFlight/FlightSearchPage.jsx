import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAirports from "../../../hooks/useAirports";
import SearchForm from "./SearchForm";
import axiosInstance from "../../../api/axiosInstance";

export default function FlightSearch() {
  const navigate = useNavigate();
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
  const [passengers, setPassengers] = useState({ adult: 1, child: 0, baby: 0 });
  const [isSearching, setIsSearching] = useState(false);

  const totalPassengers = passengers.adult + passengers.child + passengers.baby;
  const changeCount = (type, value) => {
    setPassengers((prev) => {
      const newValue = prev[type] + value;
      if (type === "adult" && newValue < 1) return prev;
      if (newValue < 0) return prev;
      return { ...prev, [type]: newValue };
    });
  };

  const addMultiFlight = () => {
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
    setMultiFlights(updated);
  };

  const handleSearch = async () => {
    if (activeTab !== "multi" && (!from || !to || !departureDate)) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (activeTab === "retour" && !returnDate) {
      alert("Veuillez sélectionner une date de retour");
      return;
    }

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

        searchData = {
          flights: response.data,
          type: "multi",
          params: {
            flights: multiFlights,
            passengers,
            travelClass: flightClass,
            options,
          },
        };
      } else {
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
        };
      }

      navigate("/results", {
        state: searchData,
      });
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Erreur recherche vols");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen  w-full p-6">
      <div className="w-full ">
        <h3 className="text-4xl text-gray-800 mb-2 text-left font-playfair font-bold">
          Réservez maintenant
        </h3>
        <div className="w-40 h-1 bg-[#00C0E8] mb-8 rounded"></div>
      </div>
      <div className="flex justify-center">
        <div className="w-full max-w-6xl">
          {" "}
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
