import { useRef, useEffect } from 'react';

export default function PassengersOptions({
  showPassengers,
  setShowPassengers,
  totalPassengers,
  passengers,
  changeCount,
  flightClass,
  setFlightClass,
  options,
  setOptions
}) {
  const dropdownRef = useRef(null);

  // Fermer le dropdown quand on clique en dehors
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowPassengers(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowPassengers]);

  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
      
      {/* PASSAGERS */}
      <div className="relative w-full md:w-1/4" ref={dropdownRef}>
        <label className="text-gray-500 text-sm">Passagers</label>
        <div
          onClick={() => setShowPassengers(!showPassengers)}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mt-2 cursor-pointer bg-white shadow-sm flex justify-between items-center hover:border-cyan-400 transition"
        >
          <span>{totalPassengers} Passager(s)</span>
          <svg
            className={`w-4 h-4 ml-2 transform transition-transform duration-200 ${showPassengers ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {showPassengers && (
          <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl p-5 z-20">
            {[
              { type: "adult", label: "Adultes" },
              { type: "child", label: "Enfants" },
              { type: "baby", label: "Bébés" }
            ].map((item) => (
              <div key={item.type} className="flex justify-between items-center mb-3 last:mb-0">
                <span className="capitalize text-gray-700">{item.label}</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => changeCount(item.type, -1)}
                    className="bg-cyan-500 text-white w-7 h-7 rounded-lg hover:bg-cyan-600 transition flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="w-5 text-center font-medium">{passengers[item.type]}</span>
                  <button
                    onClick={() => changeCount(item.type, 1)}
                    className="bg-cyan-500 text-white w-7 h-7 rounded-lg hover:bg-cyan-600 transition flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CLASSE */}
      <div className="w-full md:w-1/4">
        <label className="text-gray-500 text-sm">Classe</label>
        <select
          value={flightClass}
          onChange={(e) => setFlightClass(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mt-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition"
        >
          <option value="ECONOMY">Economique</option>
          <option value="BUSINESS">Business</option>
          <option value="FIRST">Première</option>
        </select>
      </div>

      {/* OPTIONS */}
      <div className="flex flex-wrap gap-4 md:gap-6 bg-gray-100 p-3.5 rounded-xl w-full md:w-1/2 mt-6">
        {[
          { key: "direct", label: "Vol direct" },
          { key: "baggage", label: "Avec bagages" },
          { key: "refundable", label: "Remboursable" }
        ].map((item) => (
          <label key={item.key} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={options[item.key]}
              onChange={(e) => setOptions({ ...options, [item.key]: e.target.checked })}
              className="w-4 h-4 text-cyan-500 rounded border-gray-300 focus:ring-cyan-500"
            />
            <span className="text-sm text-gray-700">{item.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}