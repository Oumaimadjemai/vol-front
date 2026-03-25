// hooks/useFilters.js
import { useState, useMemo } from 'react';

export default function useFilters(flights) {
  const [filters, setFilters] = useState({
    compagnies: [],
    escales: [],
    horaires: [],
    bagages: null,
    prix: { min: 0, max: 100000 }
  });

  const filteredFlights = useMemo(() => {
    if (!flights.length) return [];

    return flights.filter(flight => {
      // Filtre par compagnie
      if (filters.compagnies.length > 0) {
        if (flight.type === 'multi') {
          const compagniesVol = [flight.vol1?.airline, flight.vol2?.airline].filter(Boolean);
          if (!compagniesVol.some(c => filters.compagnies.includes(c))) return false;
        } else {
          if (!filters.compagnies.includes(flight.airline)) return false;
        }
      }

      // Filtre par escales
      if (filters.escales.length > 0) {
        const isDirect = flight.type === 'multi' 
          ? flight.vol1?.stops === 0 && flight.vol2?.stops === 0
          : flight.stops === 0;
        
        const typeEscale = isDirect ? 'Direct' : 'Avec escale(s)';
        if (!filters.escales.includes(typeEscale)) return false;
      }

      // Filtre par horaires
      if (filters.horaires.length > 0) {
        let heureValide = false;
        
        if (flight.type === 'multi') {
          [flight.vol1, flight.vol2].forEach(vol => {
            if (vol?.departure?.time) {
              const hour = new Date(vol.departure.time).getHours();
              const tranche = hour <= 11 ? 'Matin (00h-11h)' : 
                             hour <= 17 ? 'Après-midi (12h-17h)' : 
                             'Soir (18h-23h)';
              if (filters.horaires.includes(tranche)) heureValide = true;
            }
          });
        } else {
          if (flight.departure?.time) {
            const hour = new Date(flight.departure.time).getHours();
            const tranche = hour <= 11 ? 'Matin (00h-11h)' : 
                           hour <= 17 ? 'Après-midi (12h-17h)' : 
                           'Soir (18h-23h)';
            if (filters.horaires.includes(tranche)) heureValide = true;
          }
        }
        
        if (!heureValide) return false;
      }

      // Filtre par bagages
      if (filters.bagages !== null) {
        if (flight.type === 'multi') {
          const hasBagage1 = flight.vol1?.baggage?.quantity > 0;
          const hasBagage2 = flight.vol2?.baggage?.quantity > 0;
          if (filters.bagages && (!hasBagage1 || !hasBagage2)) return false;
          if (!filters.bagages && (hasBagage1 || hasBagage2)) return false;
        } else {
          const hasBagage = flight.baggage?.quantity > 0;
          if (filters.bagages !== hasBagage) return false;
        }
      }

      // Filtre par prix
      const prix = flight.type === 'multi' ? flight.prixTotal : flight.price?.total;
      if (prix && (prix < filters.prix.min || prix > filters.prix.max)) return false;

      return true;
    });
  }, [flights, filters]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      compagnies: [],
      escales: [],
      horaires: [],
      bagages: null,
      prix: { min: 0, max: 100000 }
    });
  };

  return {
    filters,
    filteredFlights,
    updateFilter,
    resetFilters
  };
}