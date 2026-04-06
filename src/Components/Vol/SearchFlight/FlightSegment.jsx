import { useState, useRef, useEffect } from "react";
import { FaPlaneDeparture, FaPlaneArrival, FaChevronDown, FaChevronUp, FaCheck, FaCalendarAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function FlightSegment({
  type, // "from" ou "to" ou "date"
  value,
  onChange,
  airports = [], // Default to empty array
  disabledAirports = [],
  minDate,
  maxDate,
  label,
  icon,
  placeholder = "Sélectionnez",
  showIcon = true,
  className = "",
  inputClassName = "",
  labelClassName = ""
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const datePickerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setIsDatePickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter airports based on search term
  const filteredAirports = Array.isArray(airports) 
    ? airports
        .filter((a) => a && !disabledAirports.includes(a.code))
        .filter((a) => {
          if (!searchTerm) return true;
          const searchLower = searchTerm.toLowerCase();
          return (
            (a.code && a.code.toLowerCase().includes(searchLower)) ||
            (a.city && a.city.toLowerCase().includes(searchLower)) ||
            (a.country && a.country.toLowerCase().includes(searchLower)) ||
            (a.name && a.name.toLowerCase().includes(searchLower))
          );
        })
    : [];

  const selectedAirport = Array.isArray(airports) 
    ? airports.find((a) => a && a.code === value)
    : null;

  const handleSelect = (airportCode) => {
    onChange({ target: { value: airportCode } });
    setIsOpen(false);
    setSearchTerm("");
  };

  // Date picker functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    
    // Add days of month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  const formatDisplayDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const isDateDisabled = (date) => {
    if (!date) return true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (minDate && date < new Date(minDate)) return true;
    if (maxDate && date > new Date(maxDate)) return true;
    return false;
  };

  const handleDateSelect = (date) => {
    if (!isDateDisabled(date)) {
      onChange({ target: { value: formatDate(date) } });
      setIsDatePickerOpen(false);
    }
  };

  const changeMonth = (increment) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + increment, 1));
  };

  const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  const weekDays = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];

  if (type === "date") {
    const displayValue = value ? formatDisplayDate(value) : "";
    
    return (
      <motion.div 
        className={className}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <label className={`text-gray-600 text-sm font-semibold mb-2 block ${labelClassName}`}>
          {label}
        </label>
        <div className="relative" ref={datePickerRef}>
          {/* Custom Date Picker Button */}
          <motion.div
            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
            className={`w-full border-2 rounded-xl px-4 py-3 bg-white shadow-sm cursor-pointer transition-all duration-300 flex items-center justify-between ${
              isDatePickerOpen 
                ? "border-[#00C0E8] ring-2 ring-[#00C0E8]/20" 
                : "border-gray-200 hover:border-[#00C0E8]/50"
            } ${value ? "text-gray-800" : "text-gray-500"}`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center gap-2 truncate">
              <FaCalendarAlt className={`text-[#00C0E8] ${value ? 'opacity-100' : 'opacity-60'}`} />
              <span className="truncate">
                {displayValue || "Sélectionnez une date"}
              </span>
            </div>
            <motion.div
              animate={{ rotate: isDatePickerOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <FaChevronDown className="text-gray-400" />
            </motion.div>
          </motion.div>

          {/* Custom Date Picker Dropdown */}
          <AnimatePresence>
            {isDatePickerOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-100 rounded-xl shadow-2xl overflow-hidden"
                style={{ minWidth: '320px' }}
              >
                {/* Calendar Header */}
                <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-[#00C0E8]/5 to-[#0096b8]/5">
                  <div className="flex items-center justify-between">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => changeMonth(-1)}
                      className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </motion.button>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </h3>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => changeMonth(1)}
                      className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.button>
                  </div>
                </div>

                {/* Week Days */}
                <div className="grid grid-cols-7 gap-1 p-4 pb-2">
                  {weekDays.map((day, idx) => (
                    <div key={idx} className="text-center text-xs font-semibold text-gray-500 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1 p-4 pt-0">
                  {getDaysInMonth(currentMonth).map((date, idx) => {
                    if (!date) {
                      return <div key={`empty-${idx}`} className="h-10" />;
                    }
                    
                    const isSelected = value && formatDate(date) === value;
                    const isDisabled = isDateDisabled(date);
                    const isToday = formatDate(date) === formatDate(new Date());
                    
                    return (
                      <motion.button
                        key={date.toISOString()}
                        whileHover={!isDisabled ? { scale: 1.05 } : {}}
                        whileTap={!isDisabled ? { scale: 0.95 } : {}}
                        onClick={() => handleDateSelect(date)}
                        disabled={isDisabled}
                        className={`
                          h-10 rounded-lg font-medium text-sm transition-all duration-200
                          ${isDisabled 
                            ? 'text-gray-300 cursor-not-allowed bg-gray-50' 
                            : 'hover:bg-[#00C0E8]/10 cursor-pointer'
                          }
                          ${isSelected 
                            ? 'bg-gradient-to-r from-[#00C0E8] to-[#0096b8] text-white shadow-md' 
                            : 'text-gray-700'
                          }
                          ${isToday && !isSelected && !isDisabled
                            ? 'border-2 border-[#00C0E8] bg-[#00C0E8]/5'
                            : ''
                          }
                        `}
                      >
                        {date.getDate()}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Footer with quick actions */}
                <div className="p-3 border-t border-gray-100 bg-gray-50 flex justify-between">
                  <button
                    onClick={() => {
                      const today = new Date();
                      handleDateSelect(today);
                    }}
                    className="text-xs text-[#00C0E8] hover:text-[#0096b8] font-medium transition-colors"
                  >
                    Aujourd'hui
                  </button>
                  {value && (
                    <button
                      onClick={() => {
                        onChange({ target: { value: "" } });
                        setIsDatePickerOpen(false);
                      }}
                      className="text-xs text-red-500 hover:text-red-600 font-medium transition-colors"
                    >
                      Effacer
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  }

  // Loading state when airports are not yet loaded
  if (!airports || airports.length === 0) {
    return (
      <motion.div 
        className={className}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <label className={`flex items-center text-gray-600 text-sm font-semibold mb-2 ${labelClassName}`}>
          {showIcon && icon && <span className="mr-2 text-[#00C0E8]">{icon}</span>}
          {label}
        </label>
        <div className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 bg-gray-50 animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <label className={`flex items-center text-gray-600 text-sm font-semibold mb-2 ${labelClassName}`}>
        {showIcon && icon && <span className="mr-2 text-[#00C0E8]">{icon}</span>}
        {label}
      </label>
      
      <div className="relative" ref={dropdownRef}>
        {/* Custom Select Button */}
        <motion.div
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full border-2 rounded-xl px-4 py-3 bg-white shadow-sm cursor-pointer transition-all duration-300 flex items-center justify-between ${
            isOpen 
              ? "border-[#00C0E8] ring-2 ring-[#00C0E8]/20" 
              : "border-gray-200 hover:border-[#00C0E8]/50"
          } ${value ? "text-gray-800" : "text-gray-500"}`}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="flex items-center gap-2 truncate">
            {value && selectedAirport && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00C0E8]/10 to-[#0096b8]/10 flex items-center justify-center">
                <span className="text-xs font-bold text-[#00C0E8]">{selectedAirport.code}</span>
              </div>
            )}
            <span className="truncate">
              {value && selectedAirport 
                ? `${selectedAirport.code} - ${selectedAirport.city}${selectedAirport.country ? `, ${selectedAirport.country}` : ''}`
                : placeholder}
            </span>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isOpen ? (
              <FaChevronUp className="text-[#00C0E8]" />
            ) : (
              <FaChevronDown className="text-gray-400" />
            )}
          </motion.div>
        </motion.div>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-100 rounded-xl shadow-2xl overflow-hidden"
            >
              {/* Search Input */}
              <div className="p-3 border-b border-gray-100">
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Rechercher un aéroport..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#00C0E8] focus:ring-2 focus:ring-[#00C0E8]/20 transition-all duration-300"
                    autoFocus
                  />
                  <svg
                    className="absolute right-3 top-2.5 w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Options List */}
              <div className="max-h-80 overflow-y-auto custom-scrollbar">
                {filteredAirports.length > 0 ? (
                  filteredAirports.map((airport, idx) => (
                    <motion.div
                      key={airport.code}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      onClick={() => handleSelect(airport.code)}
                      className={`px-4 py-3 cursor-pointer transition-all duration-200 hover:bg-gradient-to-r hover:from-[#00C0E8]/5 hover:to-[#0096b8]/5 group ${
                        value === airport.code ? "bg-gradient-to-r from-[#00C0E8]/10 to-[#0096b8]/10" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              value === airport.code
                                ? "bg-gradient-to-br from-[#00C0E8] to-[#0096b8]"
                                : "bg-gray-100 group-hover:bg-[#00C0E8]/20"
                            } transition-all duration-300`}>
                              <span className={`text-xs font-bold ${
                                value === airport.code ? "text-white" : "text-gray-600 group-hover:text-[#00C0E8]"
                              }`}>
                                {airport.code}
                              </span>
                            </div>
                            <div>
                              <div className="font-semibold text-gray-800 group-hover:text-[#00C0E8] transition-colors duration-300">
                                {airport.city}
                              </div>
                              <div className="text-xs text-gray-500">
                                {airport.name || `${airport.city} Airport`}
                                {airport.country && ` • ${airport.country}`}
                              </div>
                            </div>
                          </div>
                        </div>
                        {value === airport.code && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-[#00C0E8]"
                          >
                            <FaCheck />
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p className="text-sm">Aucun aéroport trouvé</p>
                    <p className="text-xs mt-1">Essayez une autre recherche</p>
                  </div>
                )}
              </div>

              {/* Footer with count */}
              {filteredAirports.length > 0 && (
                <div className="p-3 border-t border-gray-100 bg-gray-50">
                  <p className="text-xs text-gray-500 text-center">
                    {filteredAirports.length} aéroport(s) disponible(s)
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #00C0E8;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #0096b8;
        }
      `}</style>
    </motion.div>
  );
}