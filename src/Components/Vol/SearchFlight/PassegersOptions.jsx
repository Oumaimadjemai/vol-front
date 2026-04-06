import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [isClassOpen, setIsClassOpen] = useState(false);

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

  const passengerTypes = [
    { type: "adult", label: "Adultes", description: "12 ans et plus", min: 1, max: 9 },
    { type: "child", label: "Enfants", description: "2-11 ans", min: 0, max: 8 },
    { type: "baby", label: "Bébés", description: "Moins de 2 ans", min: 0, max: 5 }
  ];

  const classOptions = [
    { value: "ECONOMY", label: "Economique", description: "Confort standard" },
    { value: "BUSINESS", label: "Business", description: "Confort supérieur" },
    { value: "FIRST", label: "Première", description: "Luxe absolu" }
  ];

  const getClassLabel = () => {
    const selected = classOptions.find(c => c.value === flightClass);
    return selected ? selected.label : "Economique";
  };

  return (
    <div className="flex flex-col lg:flex-row justify-between gap-6 mb-8">
      
      {/* PASSAGERS */}
      <div className="relative w-full lg:w-1/3" ref={dropdownRef}>
        <label className="flex items-center text-gray-600 text-sm font-semibold mb-2">
          Passagers
        </label>
        
        <motion.div
          onClick={() => setShowPassengers(!showPassengers)}
          className={`w-full border-2 rounded-xl px-4 py-3 bg-white shadow-sm cursor-pointer transition-all duration-300 flex items-center justify-between ${
            showPassengers 
              ? "border-[#00C0E8] ring-2 ring-[#00C0E8]/20" 
              : "border-gray-200 hover:border-[#00C0E8]/50"
          }`}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00C0E8]/10 to-[#0096b8]/10 flex items-center justify-center">
              <span className="text-sm font-bold text-[#00C0E8]">{totalPassengers}</span>
            </div>
            <span className="text-gray-700">
              {totalPassengers} Passager{totalPassengers > 1 ? 's' : ''}
            </span>
          </div>
          <motion.div
            animate={{ rotate: showPassengers ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {showPassengers ? (
              <svg className="w-4 h-4 text-[#00C0E8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {showPassengers && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-100 rounded-xl shadow-2xl overflow-hidden"
            >
              <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-[#00C0E8]/5 to-[#0096b8]/5">
                <h3 className="font-semibold text-gray-800">Nombre de passagers</h3>
                <p className="text-xs text-gray-500 mt-1">Sélectionnez le nombre de passagers</p>
              </div>
              
              <div className="p-4 space-y-4">
                {passengerTypes.map((item) => (
                  <div key={item.type} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-gray-800">{item.label}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => changeCount(item.type, -1)}
                        disabled={passengers[item.type] <= item.min}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                          passengers[item.type] <= item.min
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-[#00C0E8] to-[#0096b8] text-white hover:shadow-md"
                        }`}
                      >
                        -
                      </motion.button>
                      <span className="w-8 text-center font-semibold text-gray-800">
                        {passengers[item.type]}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => changeCount(item.type, 1)}
                        disabled={passengers[item.type] >= item.max}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                          passengers[item.type] >= item.max
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-[#00C0E8] to-[#0096b8] text-white hover:shadow-md"
                        }`}
                      >
                        +
                      </motion.button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-3 border-t border-gray-100 bg-gray-50">
                <p className="text-xs text-gray-500 text-center">
                  Total: {totalPassengers} passager{totalPassengers > 1 ? 's' : ''}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CLASSE */}
      <div className="relative w-full lg:w-1/3">
        <label className="flex items-center text-gray-600 text-sm font-semibold mb-2">
          Classe de voyage
        </label>
        
        <motion.div
          onClick={() => setIsClassOpen(!isClassOpen)}
          className={`w-full border-2 rounded-xl px-4 py-3 bg-white shadow-sm cursor-pointer transition-all duration-300 flex items-center justify-between ${
            isClassOpen 
              ? "border-[#00C0E8] ring-2 ring-[#00C0E8]/20" 
              : "border-gray-200 hover:border-[#00C0E8]/50"
          }`}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <span className="text-gray-700">{getClassLabel()}</span>
          <motion.div
            animate={{ rotate: isClassOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isClassOpen ? (
              <svg className="w-4 h-4 text-[#00C0E8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {isClassOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-100 rounded-xl shadow-2xl overflow-hidden"
            >
              <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-[#00C0E8]/5 to-[#0096b8]/5">
                <h3 className="font-semibold text-gray-800">Classe de voyage</h3>
                <p className="text-xs text-gray-500 mt-1">Choisissez votre confort</p>
              </div>
              
              <div className="p-2">
                {classOptions.map((option) => (
                  <motion.div
                    key={option.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setFlightClass(option.value);
                      setIsClassOpen(false);
                    }}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 mb-1 last:mb-0 ${
                      flightClass === option.value
                        ? "bg-gradient-to-r from-[#00C0E8]/10 to-[#0096b8]/10 border-2 border-[#00C0E8]"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-gray-800">{option.label}</div>
                        <div className="text-xs text-gray-500">{option.description}</div>
                      </div>
                      {flightClass === option.value && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-6 h-6 rounded-full bg-gradient-to-r from-[#00C0E8] to-[#0096b8] flex items-center justify-center"
                        >
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* OPTIONS */}
      <div className="w-full lg:w-1/3">
        <label className="flex items-center text-gray-600 text-sm font-semibold mb-2">
          Options supplémentaires
        </label>
        
        <div className="border-2 border-gray-200 rounded-xl p-4 bg-white shadow-sm hover:border-[#00C0E8]/50 transition-all duration-300">
          <div className="space-y-3">
            {[
              { key: "direct", label: "Vol direct", description: "Sans escale" },
              { key: "baggage", label: "Bagages inclus", description: "23kg par passager" },
              { key: "refundable", label: "Remboursable", description: "Annulation gratuite" }
            ].map((item) => (
              <motion.label
                key={item.key}
                whileHover={{ x: 5 }}
                className="flex items-center justify-between cursor-pointer group"
              >
                <div>
                  <div className="text-sm font-medium text-gray-700">{item.label}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={options[item.key]}
                    onChange={(e) => setOptions({ ...options, [item.key]: e.target.checked })}
                    className="w-5 h-5 rounded-lg border-2 border-gray-300 checked:bg-[#00C0E8] checked:border-[#00C0E8] focus:ring-2 focus:ring-[#00C0E8]/20 transition-all duration-200 cursor-pointer"
                  />
                </div>
              </motion.label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}