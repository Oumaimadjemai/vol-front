import { useState, useEffect } from 'react';
import { FiFilter, FiChevronDown, FiChevronUp, FiX, FiMenu } from 'react-icons/fi';
import { FaSuitcase, FaUndoAlt } from 'react-icons/fa';

export default function FiltersSidebar({ flights, filteredCount, onFilterChange, isMulti }) {
  const [filters, setFilters] = useState({
    airlines: [],
    stops: {},  
    departureTime: 'all',
    arrivalTime: 'all',
    baggage: false,
    refundable: false
  });

  const [expandedSections, setExpandedSections] = useState({
    airlines: false,
    stops: true,
    times: false,
    services: false
  });

  const [selectedAirlines, setSelectedAirlines] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Initialiser les stops pour multi-destination
  useEffect(() => {
    if (isMulti && flights.length > 0) {
      const firstFlight = flights[0];
      let numberOfFlights = 0;
      
      if (firstFlight?.segments) {
        numberOfFlights = firstFlight.segments.length;
      } else if (firstFlight?.flights) {
        numberOfFlights = firstFlight.flights.length;
      } else {
        let i = 1;
        while (firstFlight?.[`vol${i}`]) {
          numberOfFlights++;
          i++;
        }
      }
      
      const initialStops = {};
      for (let i = 1; i <= numberOfFlights; i++) {
        initialStops[`vol${i}`] = 'all';
      }
      
      setFilters(prev => ({ ...prev, stops: initialStops }));
    } else if (!isMulti) {
      setFilters(prev => ({ ...prev, stops: 'all' }));
    }
  }, [isMulti, flights]);

  // Extraire les compagnies
  const getAllAirlines = () => {
    const airlinesSet = new Set();
    
    flights.forEach(flight => {
      if (isMulti) {
        const segments = flight.segments || flight.flights || [];
        if (segments.length > 0) {
          segments.forEach(segment => {
            if (segment.airline) airlinesSet.add(segment.airline);
          });
        } else {
          let i = 1;
          while (flight[`vol${i}`]) {
            if (flight[`vol${i}`].airline) airlinesSet.add(flight[`vol${i}`].airline);
            i++;
          }
        }
      } else {
        if (flight.airline) airlinesSet.add(flight.airline);
      }
    });
    
    return Array.from(airlinesSet).map(airline => ({
      name: airline,
      count: flights.filter(f => {
        if (isMulti) {
          const segments = f.segments || f.flights || [];
          if (segments.length > 0) {
            return segments.some(seg => seg.airline === airline);
          } else {
            let i = 1;
            while (f[`vol${i}`]) {
              if (f[`vol${i}`].airline === airline) return true;
              i++;
            }
            return false;
          }
        } else {
          return f.airline === airline;
        }
      }).length
    }));
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleAirlineChange = (airline) => {
    setSelectedAirlines(prev => {
      const newSelection = prev.includes(airline)
        ? prev.filter(a => a !== airline)
        : [...prev, airline];
      
      const newFilters = { ...filters, airlines: newSelection };
      setFilters(newFilters);
      onFilterChange(newFilters);
      return newSelection;
    });
  };

  const handleStopsChange = (volKey, value) => {
    if (isMulti) {
      const newStops = { ...filters.stops, [volKey]: value };
      const newFilters = { ...filters, stops: newStops };
      setFilters(newFilters);
      onFilterChange(newFilters);
    } else {
      const newFilters = { ...filters, stops: value };
      setFilters(newFilters);
      onFilterChange(newFilters);
    }
  };

  const handleTimeFilter = (type, value) => {
    const newFilters = { ...filters, [type]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleBaggageChange = (checked) => {
    const newFilters = { ...filters, baggage: checked };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleRefundableChange = (checked) => {
    const newFilters = { ...filters, refundable: checked };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    let resetStops = 'all';
    
    if (isMulti && flights.length > 0) {
      const firstFlight = flights[0];
      let numberOfFlights = 0;
      
      if (firstFlight?.segments) {
        numberOfFlights = firstFlight.segments.length;
      } else if (firstFlight?.flights) {
        numberOfFlights = firstFlight.flights.length;
      } else {
        let i = 1;
        while (firstFlight?.[`vol${i}`]) {
          numberOfFlights++;
          i++;
        }
      }
      
      resetStops = {};
      for (let i = 1; i <= numberOfFlights; i++) {
        resetStops[`vol${i}`] = 'all';
      }
    }
    
    const resetFilters = {
      airlines: [],
      stops: resetStops,
      departureTime: 'all',
      arrivalTime: 'all',
      baggage: false,
      refundable: false
    };
    setFilters(resetFilters);
    setSelectedAirlines([]);
    onFilterChange(resetFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.airlines.length > 0) count++;
    
    if (isMulti) {
      if (Object.values(filters.stops).some(v => v !== 'all')) count++;
    } else {
      if (filters.stops !== 'all') count++;
    }
    
    if (filters.departureTime !== 'all') count++;
    if (filters.arrivalTime !== 'all') count++;
    if (filters.baggage) count++;
    if (filters.refundable) count++;
    return count;
  };

  const airlines = getAllAirlines();
  const activeFiltersCount = getActiveFiltersCount();

  const stopOptions = [
    { value: 'all', label: 'Tous' },
    { value: '0', label: 'Direct' },
    { value: '1', label: '1 escale' },
    { value: '2+', label: '2+ escales' }
  ];

  const timeOptions = [
    { value: 'all', label: 'Toutes les heures' },
    { value: '00-06', label: ' Nuit (00:00-06:00)' },
    { value: '06-12', label: ' Matin (06:00-12:00)' },
    { value: '12-18', label: ' Après-midi (12:00-18:00)' },
    { value: '18-24', label: ' Soir (18:00-00:00)' }
  ];

  // Calculer le nombre de vols
  const getNumberOfFlights = () => {
    if (!isMulti || flights.length === 0) return 0;
    const firstFlight = flights[0];
    if (firstFlight?.segments) return firstFlight.segments.length;
    if (firstFlight?.flights) return firstFlight.flights.length;
    let i = 1;
    while (firstFlight?.[`vol${i}`]) i++;
    return i - 1;
  };

  const numberOfFlights = getNumberOfFlights();

  // Contenu des filtres
  const FiltersContent = () => (
    <div className="space-y-4">
      {/* COMPAGNIES */}
      <div className="border-b border-gray-100 pb-3">
        <button 
          onClick={() => toggleSection('airlines')}
          className="flex justify-between items-center w-full py-1"
        >
          <span className="font-medium text-gray-700 text-sm">Compagnies</span>
          {expandedSections.airlines ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
        </button>
        
        {expandedSections.airlines && (
          <div className="mt-2 grid  gap-1 max-h-40 overflow-y-auto">
            {airlines.length > 0 ? (
              airlines.map(airline => (
                <label key={airline.name} className="flex items-center gap-2 cursor-pointer py-1.5 px-1 hover:bg-gray-50 rounded">
                  <input
                    type="checkbox"
                    checked={selectedAirlines.includes(airline.name)}
                    onChange={() => handleAirlineChange(airline.name)}
                    className="w-3.5 h-3.5 text-cyan-500 rounded"
                  />
                  <span className="text-xs text-gray-600 truncate flex-1">{airline.name}</span>
                  <span className="text-xs text-gray-400">{airline.count}</span>
                </label>
              ))
            ) : (
              <p className="text-xs text-gray-400 text-center py-2 col-span-2">Aucune compagnie</p>
            )}
          </div>
        )}
      </div>

      {/* ESCALES */}
      <div className="border-b border-gray-100 pb-3">
        <button 
          onClick={() => toggleSection('stops')}
          className="flex justify-between items-center w-full py-1"
        >
          <span className="font-medium text-gray-700 text-sm">
            {isMulti ? 'Escales par vol' : 'Escales'}
          </span>
          {expandedSections.stops ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
        </button>
        
        {expandedSections.stops && (
          <div className="mt-2">
            {!isMulti ? (
              <div className="space-y-1">
                {stopOptions.map(option => (
                  <label key={option.value} className="flex items-center gap-2 cursor-pointer py-1.5">
                    <input
                      type="radio"
                      name="stops"
                      value={option.value}
                      checked={filters.stops === option.value}
                      onChange={(e) => handleStopsChange(null, e.target.value)}
                      className="w-3.5 h-3.5 text-cyan-500"
                    />
                    <span className="text-xs text-gray-600">{option.label}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {Array.from({ length: numberOfFlights }, (_, i) => i + 1).map(volNum => {
                  const volKey = `vol${volNum}`;
                  const stopValue = filters.stops?.[volKey] || 'all';
                  
                  return (
                    <div key={volNum} className="bg-gray-50 p-2 rounded-lg">
                      <h4 className="text-xs font-medium text-cyan-600 mb-2">Vol {volNum}</h4>
                      <div className="space-y-1">
                        {stopOptions.map(option => (
                          <label key={option.value} className="flex items-center gap-2 cursor-pointer py-1">
                            <input
                              type="radio"
                              name={`stops_${volKey}`}
                              value={option.value}
                              checked={stopValue === option.value}
                              onChange={() => handleStopsChange(volKey, option.value)}
                              className="w-3.5 h-3.5 text-cyan-500"
                            />
                            <span className="text-xs text-gray-600">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* HORAIRES */}
      <div className="border-b border-gray-100 pb-3">
        <button 
          onClick={() => toggleSection('times')}
          className="flex justify-between items-center w-full py-1"
        >
          <span className="font-medium text-gray-700 text-sm">Horaires</span>
          {expandedSections.times ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
        </button>
        
        {expandedSections.times && (
          <div className="mt-2 space-y-2">
            <select
              value={filters.departureTime}
              onChange={(e) => handleTimeFilter('departureTime', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs bg-white"
            >
              {timeOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <select
              value={filters.arrivalTime}
              onChange={(e) => handleTimeFilter('arrivalTime', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs bg-white"
            >
              {timeOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* SERVICES */}
      <div className="pb-2">
        <button 
          onClick={() => toggleSection('services')}
          className="flex justify-between items-center w-full py-1"
        >
          <span className="font-medium text-gray-700 text-sm">Services</span>
          {expandedSections.services ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
        </button>
        
        {expandedSections.services && (
          <div className="mt-2 space-y-2">
            <label className="flex items-center justify-between cursor-pointer py-1.5">
              <div className="flex items-center gap-2">
                <FaSuitcase className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-xs text-gray-600">Bagages inclus</span>
              </div>
              <input
                type="checkbox"
                checked={filters.baggage}
                onChange={(e) => handleBaggageChange(e.target.checked)}
                className="w-3.5 h-3.5 text-cyan-500 rounded"
              />
            </label>
            
            <label className="flex items-center justify-between cursor-pointer py-1.5">
              <div className="flex items-center gap-2">
                <FaUndoAlt className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-xs text-gray-600">Remboursable</span>
              </div>
              <input
                type="checkbox"
                checked={filters.refundable}
                onChange={(e) => handleRefundableChange(e.target.checked)}
                className="w-3.5 h-3.5 text-cyan-500 rounded"
              />
            </label>
            {isMulti && (
              <p className="text-xs text-gray-400 mt-1"> Appliqué si au moins un vol</p>
            )}
          </div>
        )}
      </div>

      {/* RÉSULTATS */}
      <div className="pt-3 border-t border-gray-100">
        <div className="bg-cyan-50 rounded-lg p-2 text-center">
          <p className="text-lg font-bold text-cyan-600">{filteredCount}</p>
          <p className="text-xs text-gray-500">vol{filteredCount > 1 ? 's' : ''}</p>
          {filteredCount !== flights.length && (
            <p className="text-xs text-gray-400">sur {flights.length}</p>
          )}
        </div>
      </div>
    </div>
  );

  // Version Desktop
  return (
    <>
      {/* Desktop Sidebar - avec scroll */}
      <div className="hidden md:block bg-white rounded-xl shadow-lg p-3 sticky top-6 max-h-[calc(100vh-2rem)] overflow-y-auto">
        <div className="flex justify-between items-center mb-3 sticky top-0 bg-white z-10 pb-2">
          <div className="flex items-center gap-1.5">
            <FiFilter className="text-cyan-500 text-sm" />
            <h3 className="font-semibold text-gray-800 text-sm">Filtres</h3>
            {activeFiltersCount > 0 && (
              <span className="bg-cyan-100 text-cyan-600 text-xs px-1.5 py-0.5 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </div>
          <button onClick={resetFilters} className="text-xs text-cyan-500 hover:underline">
            Réinitialiser
          </button>
        </div>
        <FiltersContent />
      </div>

      {/* Mobile: Menu Hamburger */}
      <div className="md:hidden">
        {/* Bouton Menu Hamburger */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-2 shadow-sm hover:shadow-md transition"
        >
          <FiMenu size={18} className="text-gray-600" />
          <span className="text-sm text-gray-700">Filtres</span>
          {activeFiltersCount > 0 && (
            <span className="bg-cyan-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {/* Menu Modal */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-2xl w-[90%] max-w-md max-h-[85vh] overflow-y-auto">
              {/* En-tête */}
              <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FiFilter className="text-cyan-500" />
                  <h3 className="font-semibold text-gray-800">Filtres</h3>
                  {activeFiltersCount > 0 && (
                    <span className="bg-cyan-100 text-cyan-600 text-xs px-2 py-0.5 rounded-full">
                      {activeFiltersCount}
                    </span>
                  )}
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                >
                  <FiX size={20} className="text-gray-500" />
                </button>
              </div>
              
              {/* Contenu */}
              <div className="p-4">
                <FiltersContent />
              </div>
              
              {/* Bouton Appliquer */}
              <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full bg-gradient-to-r from-cyan-500 to-cyan-400 text-white py-3 rounded-xl font-medium hover:opacity-90 transition"
                >
                  Appliquer les filtres
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}