// components/FlightDetailsCard.jsx
import { FaPlaneDeparture, FaPlaneArrival, FaClock, FaSuitcase } from 'react-icons/fa';

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return '-';
  // If it's already formatted as DD/MM/YYYY
  if (dateString.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
    return dateString;
  }
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Helper function to format time
const formatTime = (timeString) => {
  if (!timeString) return '-';
  // If it's already formatted as HH:MM
  if (timeString.match(/^\d{2}:\d{2}$/)) {
    return timeString;
  }
  // If it's a full ISO string
  if (timeString.includes('T')) {
    const date = new Date(timeString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  return timeString;
};

export const FlightDetailsCard = ({ flight, type }) => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 mb-6 hover:shadow-xl transition-all duration-300">
    <div className="bg-gradient-to-r from-[#00C0E8] to-[#0096b8] px-6 py-4">
      <h3 className="text-white font-bold text-lg flex items-center gap-2">
        {type === 'outbound' ? <FaPlaneDeparture /> : <FaPlaneArrival />}
        {type === 'outbound' ? 'Vol Aller' : 'Vol Retour'}
      </h3>
    </div>
    
    <div className="p-6">
      {/* Airline Info */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-gray-800 text-lg">{flight.airline}</span>
          </div>
          <div className="text-sm text-gray-500">Vol {flight.flightNumber}</div>
          <div className="text-xs text-gray-400">{flight.aircraft}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">Classe: {flight.class}</div>
        </div>
      </div>

      {/* Flight Route - Vertical Layout */}
      <div className="relative mb-6">
        {/* Departure */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-[#00C0E8]/10 flex items-center justify-center flex-shrink-0">
            <FaPlaneDeparture className="text-[#00C0E8] text-xl" />
          </div>
          <div className="flex-1">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-800">{formatTime(flight.departure.time)}</span>
              <span className="text-sm font-bold text-gray-600 mt-1">{formatDate(flight.departure.date)}</span>
            </div>
            <div className="text-sm font-semibold text-gray-700 mt-2">{flight.departure.airport}</div>
            <div className="text-sm text-gray-600">{flight.departure.city}</div>
          </div>
        </div>

        {/* Duration Line */}
        <div className="flex items-center gap-3 mb-4 mr-16">
          <div className="flex-1 h-px bg-gradient-to-r from-[#00C0E8] to-gray-300"></div>
          <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
            <FaClock className="text-[#00C0E8] text-xs" />
            <span className="text-xs text-gray-600">{flight.duration}</span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-[#00C0E8] to-gray-300"></div>
        </div>

        {/* Arrival */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-[#00C0E8]/10 flex items-center justify-center flex-shrink-0">
            <FaPlaneArrival className="text-[#00C0E8] text-xl" />
          </div>
          <div className="flex-1">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-800">{formatTime(flight.arrival.time)}</span>
              <span className="text-sm font-bold text-gray-600 mt-1">{formatDate(flight.arrival.date)}</span>
            </div>
            <div className="text-sm font-semibold text-gray-700 mt-2">{flight.arrival.airport}</div>
            <div className="text-sm text-gray-600">{flight.arrival.city}</div>
          </div>
        </div>
      </div>

      {/* Stopover Info */}
      {flight.stops > 0 && (
        <div className="bg-blue-50 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <FaClock className="text-[#00C0E8]" />
            <span className="font-medium">{flight.stops} escale • {flight.stopoverDuration}</span>
          </div>
          <div className="text-sm text-gray-600 mt-1">{flight.stopover}</div>
          <div className="text-xs text-gray-500 mt-1">Durée totale: {flight.totalDuration}</div>
        </div>
      )}

      {/* Baggage Info */}
      <div className="border-t border-gray-100 pt-4">
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <FaSuitcase className="text-[#00C0E8]" />
            <span className="text-gray-700">Cabine: {flight.baggage.cabin}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaSuitcase className="text-[#00C0E8]" />
            <span className="text-gray-700">Soute: {flight.baggage.checked}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);