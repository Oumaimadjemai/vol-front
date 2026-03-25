import { useState, useRef, useEffect } from 'react';
import { FaPlaneArrival, FaPlaneDeparture } from 'react-icons/fa';

export default function SearchHeader({
  airports,
  activeTab,
  setActiveTab,
  from,
  setFrom,
  to,
  setTo,
  departureDate,
  setDepartureDate,
  returnDate,
  setReturnDate,
  multiFlights,
  updateMultiFlight,
  removeMultiFlight,
  addMultiFlight,
  totalPassengers,
  passengers,
  changeCount,
  flightClass,
  setFlightClass,
  options,
  setOptions,
  handleSearch,
  isSearching,
  showPassengers,
  setShowPassengers,
  isMulti,
  showExtraOptions = false,
  onFormClick,
  onSearchComplete
}) {
  const today = new Date().toISOString().split("T")[0];
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowPassengers(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowPassengers]);

 
  const handleFormFieldClick = () => {
    if (onFormClick) {
      onFormClick();
    }
  };
  const handleSearchClick = async () => {
    await handleSearch();
    if (onSearchComplete) {
      onSearchComplete();
        }
  };

  return (
    <div className="bg-white w-full rounded-xl shadow-md p-4 border border-gray-100 mb-3">
      
      {/* Tabs */}
      <div className="flex gap-6 mb-3 border-b border-gray-200">
        {[
          { id: "aller", label: "Aller" },
          { id: "retour", label: "Aller/Retour" },
          { id: "multi", label: "Multi-Destination" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              handleFormFieldClick(); 
            }}
            className={`pb-2 text-sm capitalize transition ${
              activeTab === tab.id 
                ? "text-black font-semibold border-b-2 border-[#00C0E8]" 
                : "text-gray-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ALLER / RETOUR */}
      {(activeTab === "aller" || activeTab === "retour") && (
        <div className="flex flex-wrap items-center gap-3 mb-3">
          
          {/* D'où partez-vous ? */}
          <div className="flex-1 min-w-[160px]" onClick={handleFormFieldClick}>
            <label className="flex items-center text-xs text-gray-500 mb-1">
              <FaPlaneDeparture className="mr-1 text-cyan-500 text-xs" /> D'où partez-vous ?
            </label>
            <select
              value={from}
              onChange={(e) => {
                const selected = e.target.value;
                setFrom(selected);
                if (selected === to) setTo("");
              }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
            >
              <option value="">Sélectionnez un aéroport</option>
              {airports.map((a) => (
                <option key={a.code} value={a.code} disabled={a.code === to}>
                  {a.code} - {a.city}
                </option>
              ))}
            </select>
          </div>

          {/* Où allez-vous ? */}
          <div className="flex-1 min-w-[160px]" onClick={handleFormFieldClick}>
            <label className="flex items-center text-xs text-gray-500 mb-1">
              <FaPlaneArrival className="mr-1 text-cyan-500 text-xs" /> Où allez-vous ?
            </label>
            <select
              value={to}
              onChange={(e) => {
                const selected = e.target.value;
                setTo(selected);
                if (selected === from) setFrom("");
              }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
            >
              <option value="">Sélectionnez un aéroport</option>
              {airports.map((a) => (
                <option key={a.code} value={a.code} disabled={a.code === from}>
                  {a.code} - {a.city}
                </option>
              ))}
            </select>
          </div>

          {/* Date Aller */}
          <div className="w-36" onClick={handleFormFieldClick}>
            <label className="text-xs text-gray-500 mb-1 block">Date Aller</label>
            <input
              type="date"
              min={today}
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
            />
          </div>

          {/* Date Retour */}
          {activeTab === "retour" && (
            <div className="w-36" onClick={handleFormFieldClick}>
              <label className="text-xs text-gray-500 mb-1 block">Date Retour</label>
              <input
                type="date"
                min={departureDate || today}
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
              />
            </div>
          )}
        </div>
      )}

      {/* MULTI DESTINATION */}
      {activeTab === "multi" && (
        <>
          {multiFlights.map((flight, index) => (
            <div
              key={index}
              className="flex flex-wrap items-center gap-3 mb-3 p-3 "
              onClick={handleFormFieldClick}
            >
              {/* D'où partez-vous ? */}
              <div className="flex-1 min-w-[160px]">
                <label className="flex items-center text-xs text-gray-500 mb-1">
                  <FaPlaneDeparture className="mr-1 text-cyan-500 text-xs" /> D'où partez-vous ?
                </label>
                <select
                  value={flight.from}
                  onChange={(e) => updateMultiFlight(index, "from", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                >
                  <option value="">Sélectionnez un aéroport</option>
                  {airports.map((a) => (
                    <option key={a.code} value={a.code}>
                      {a.code} - {a.city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Où allez-vous ? */}
              <div className="flex-1 min-w-[160px]">
                <label className="flex items-center text-xs text-gray-500 mb-1">
                  <FaPlaneArrival className="mr-1 text-cyan-500 text-xs" /> Où allez-vous ?
                </label>
                <select
                  value={flight.to}
                  onChange={(e) => updateMultiFlight(index, "to", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                >
                  <option value="">Sélectionnez un aéroport</option>
                  {airports.filter((a) => a.code !== flight.from).map((a) => (
                    <option key={a.code} value={a.code}>
                      {a.code} - {a.city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div className="w-36">
                <label className="text-xs text-gray-500 mb-1 block">Date</label>
                <input
                  type="date"
                  min={index === 0 ? today : multiFlights[index - 1].date || today}
                  value={flight.date}
                  onChange={(e) => updateMultiFlight(index, "date", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                />
              </div>

              {/* Bouton Supprimer */}
              {multiFlights.length > 1 && (
                <button
                  onClick={() => removeMultiFlight(index)}
                  className="bg-red-500 text-white rounded-lg px-4 py-2 text-sm hover:bg-red-600 transition self-end"
                >
                  Supprimer
                </button>
              )}
            </div>
          ))}

          {/* Bouton Ajouter */}
          {multiFlights.length < 5 && (
            <button
              onClick={() => {
                addMultiFlight();
                handleFormFieldClick();
              }}
              className="mb-3 px-4 py-2 bg-cyan-500 text-white rounded-lg text-sm hover:bg-cyan-600 transition"
            >
              + Ajouter un vol
            </button>
          )}
        </>
      )}

      {/*  SECTION PASSAGERS + CLASSE + OPTIONS + BOUTON  */}
      {showExtraOptions && (
        <div className="flex items-center gap-3 mt-3 border-t border-gray-100 pt-3">
          
          {/* Classe */}
          <div className="w-28">
            <label className="text-xs text-gray-500 mb-1 block">Classe</label>
            <select
              value={flightClass}
              onChange={(e) => setFlightClass(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
            >
              <option value="ECONOMY">Economique</option>
              <option value="BUSINESS">Business</option>
              <option value="FIRST">Première</option>
            </select>
          </div>

          {/* Passagers - Dropdown */}
          <div className="relative w-36" ref={dropdownRef}>
            <label className="text-xs text-gray-500 mb-1 block">Passagers</label>
            <div
              onClick={() => setShowPassengers(!showPassengers)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm cursor-pointer bg-white flex justify-between items-center hover:border-cyan-400"
            >
              <span>{totalPassengers}</span>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${showPassengers ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {showPassengers && (
              <div className="absolute right-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-20">
                {[
                  { type: "adult", label: "Adultes" },
                  { type: "child", label: "Enfants" },
                  { type: "baby", label: "Bébés" }
                ].map((item) => (
                  <div key={item.type} className="flex justify-between items-center mb-2 last:mb-0">
                    <span className="text-sm">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => changeCount(item.type, -1)}
                        className="w-6 h-6 bg-cyan-500 text-white rounded hover:bg-cyan-600 flex items-center justify-center text-sm"
                      >
                        -
                      </button>
                      <span className="w-5 text-center text-sm">{passengers[item.type]}</span>
                      <button
                        onClick={() => changeCount(item.type, 1)}
                        className="w-6 h-6 bg-cyan-500 text-white rounded hover:bg-cyan-600 flex items-center justify-center text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Options */}
          <div className="flex gap-4 bg-gray-100 p-3 mt-4 rounded-lg">
            {[
              { key: "direct", label: "Vol direct" },
              { key: "baggage", label: "Avec bagages" },
              { key: "refundable", label: "Remboursable" }
            ].map((item) => (
              <label key={item.key} className="flex items-center gap-1 cursor-pointer text-xs">
                <input type="checkbox" checked={options[item.key]} onChange={(e) => setOptions({ ...options, [item.key]: e.target.checked })} className="w-3 h-3" />
                <span className="text-gray-700">{item.label}</span>
              </label>
            ))}
          </div>

          {/* Bouton Rechercher */}
          <button
            onClick={handleSearchClick}
            disabled={isSearching}
            className="bg-gradient-to-r from-cyan-500 to-cyan-400 text-white px-5 py-2 rounded-lg text-sm font-medium hover:scale-[1.02] hover:shadow transition disabled:opacity-50 ml-auto"
          >
            {isSearching ? "Recherche..." : "Rechercher"}
          </button>
        </div>
      )}
    </div>
  );
} 