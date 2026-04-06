// components/MultiFlightDetailsCard.jsx
import { FaPlane, FaClock } from 'react-icons/fa';
import { getFullAirportInfo } from './constants/flightConstants';

// Helper function to get airport display name
const getAirportDisplay = (airportCode) => {
  if (!airportCode) return { name: '-', city: '-' };
  const airportInfo = getFullAirportInfo(airportCode);
  return {
    name: airportInfo.name || airportCode,
    city: airportInfo.city || airportCode
  };
};

export const MultiFlightDetailsCard = ({ segments }) => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 mb-6 hover:shadow-xl transition-all duration-300">
    <div className="bg-gradient-to-r from-[#00C0E8] to-[#0096b8] px-6 py-4">
      <h3 className="text-white font-bold text-lg flex items-center gap-2">
        <FaPlane />
        Vol Multi-Destinations
      </h3>
    </div>
    
    <div className="p-6">
      {segments.map((segment, index) => {
        const departureAirport = getAirportDisplay(segment.departure?.airport);
        const arrivalAirport = getAirportDisplay(segment.arrival?.airport);
        
        return (
          <div key={index} className={`${index < segments.length - 1 ? 'mb-6 pb-6 border-b border-gray-200' : ''}`}>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-[#00C0E8]/10 px-3 py-1 rounded-full">
                <span className="text-sm font-semibold text-[#00C0E8]">Segment {index + 1}</span>
              </div>
              <span className="font-semibold text-gray-800">{segment.airline} {segment.flightNumber}</span>
            </div>
            
            {/* Departure */}
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <div className="w-3 h-3 rounded-full bg-[#00C0E8]"></div>
              </div>
              <div className="flex-1">
                <div className="text-xl font-bold text-gray-800">{segment.departure.time}</div>
                <div className="text-sm font-semibold text-gray-700">{departureAirport.name} ({segment.departure.airport})</div>
                <div className="text-xs text-gray-500">{departureAirport.city}</div>
                <div className="text-xs text-gray-400 mt-1">{segment.departure.date}</div>
              </div>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-3 mb-4 mr-14">
              <div className="flex-1 h-px bg-gray-300"></div>
              <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
                <FaClock className="text-[#00C0E8] text-xs" />
                <span className="text-xs text-gray-600">{segment.duration}</span>
              </div>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* Arrival */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
              </div>
              <div className="flex-1">
                <div className="text-xl font-bold text-gray-800">{segment.arrival.time}</div>
                <div className="text-sm font-semibold text-gray-700">{arrivalAirport.name} ({segment.arrival.airport})</div>
                <div className="text-xs text-gray-500">{arrivalAirport.city}</div>
                <div className="text-xs text-gray-400 mt-1">{segment.arrival.date}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);