import { useState } from "react";
import OneWayRoundTripForm from "./OneWayRoundTripForm";
import MultiDestinationForm from "./MultiDestinationForm";
import PassengersOptions from "./PassegersOptions";

export default function SearchForm({
  activeTab,
  setActiveTab,
  // OneWayRoundTrip props
  from,
  setFrom,
  to,
  setTo,
  departureDate,
  setDepartureDate,
  returnDate,
  setReturnDate,
  airports,
  today,
  // MultiDestination props
  multiFlights,
  updateMultiFlight,
  removeMultiFlight,
  addMultiFlight,
  // PassengersOptions props
  totalPassengers,
  passengers,
  changeCount,
  flightClass,
  setFlightClass,
  options,
  setOptions,
  // Search props
  handleSearch,
  isSearching,
  // Dropdown props
  showPassengers,
  setShowPassengers,

  customClasses = {}
}) {
  // États locaux
  const [localShowPassengers, setLocalShowPassengers] = useState(false);
  
  // Utilise showPassengers si fourni, sinon utilise l'état local
  const displayPassengers = showPassengers !== undefined ? showPassengers : localShowPassengers;
  const setDisplayPassengers = setShowPassengers || setLocalShowPassengers;

  // Classes par défaut
  const defaultClasses = {
    container: "bg-white w-full max-w-6xl rounded-2xl shadow-xl p-10 border border-gray-100 mb-8",
    tabs: "flex gap-10 mb-10 border-b border-gray-200",
    tabButton: "pb-3 capitalize text-gray-400 text-sm transition",
    tabActive: "text-black font-semibold border-b-2 border-[#00C0E8]",
    tabInactive: "",
    input: "w-full border border-gray-300 rounded-xl px-4 py-3 mt-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400",
    label: "text-gray-500 text-sm font-semibold",
    optionsContainer: "flex gap-6 bg-gray-100 p-3.5 rounded-xl w-full md:w-1/2 mt-5",
    optionLabel: "flex items-center gap-2 cursor-pointer text-sm",
    button: "w-full py-4 rounded-xl text-white text-lg font-semibold bg-gradient-to-r from-cyan-500 to-cyan-400 hover:scale-[1.02] hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
  };

  // Fusionner les classes
  const classes = { ...defaultClasses, ...customClasses };

  return (
    <div className={classes.container}>
      
      {/* Tabs */}
      <div className={classes.tabs}>
        {[
          { id: "aller", label: "Aller" },
          { id: "retour", label: "Aller/Retour" },
          { id: "multi", label: "Multi-Destination" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`${classes.tabButton} ${
              activeTab === tab.id ? classes.tabActive : classes.tabInactive
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Formulaire selon l'onglet */}
      {(activeTab === "aller" || activeTab === "retour") && (
        <OneWayRoundTripForm
          activeTab={activeTab}
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
          inputClass={classes.input}
          labelClass={classes.label}
        />
      )}

      {activeTab === "multi" && (
        <MultiDestinationForm
          multiFlights={multiFlights}
          updateMultiFlight={updateMultiFlight}
          removeMultiFlight={removeMultiFlight}
          addMultiFlight={addMultiFlight}
          airports={airports}
          today={today}
          inputClass={classes.input}
          labelClass={classes.label}
        />
      )}

      {/* Passagers + Classe + Options */}
      <PassengersOptions
        showPassengers={displayPassengers}
        setShowPassengers={setDisplayPassengers}
        totalPassengers={totalPassengers}
        passengers={passengers}
        changeCount={changeCount}
        flightClass={flightClass}
        setFlightClass={setFlightClass}
        options={options}
        setOptions={setOptions}
        optionsContainerClass={classes.optionsContainer}
        optionLabelClass={classes.optionLabel}
      />

      {/* Bouton Rechercher */}
      <button
        onClick={handleSearch}
        disabled={isSearching}
        className={classes.button}
      >
        {isSearching ? "Recherche en cours..." : "Rechercher"}
      </button>
    </div>
  );
}