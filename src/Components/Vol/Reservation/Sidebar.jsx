// components/Sidebar.jsx
import { FaReceipt } from 'react-icons/fa';
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

export const Sidebar = ({ flight, isMulti, passengers, getTotalPrice }) => (
  <div className="lg:col-span-1 mt-14">
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-8">
      <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
        <FaReceipt className="text-[#00C0E8]" />
        Récapitulatif
      </h3>
      
      <div className="space-y-4">
        {isMulti ? (
          flight.segments?.map((segment, index) => {
            const departureAirport = getAirportDisplay(segment.departure?.airport);
            const arrivalAirport = getAirportDisplay(segment.arrival?.airport);
            
            return (
              <div key={index} className="pb-3 border-b border-gray-100 last:border-0">
                <div className="text-xs font-semibold text-[#00C0E8] mb-1">Vol {index + 1}</div>
                <div className="text-sm text-gray-700">
                  {departureAirport.name} ({segment.departure?.airport}) → {arrivalAirport.name} ({segment.arrival?.airport})
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {segment.departure?.time} - {segment.arrival?.time}
                </div>
                <div className="text-xs text-gray-400">
                  {segment.departure?.date}
                </div>
              </div>
            );
          })
        ) : (
          <>
            <div>
              <div className="text-sm font-semibold text-gray-700 mb-1">Vol Aller</div>
              <div className="text-sm text-gray-600">
                {getAirportDisplay(flight.outbound?.departure?.airport).name} ({flight.outbound?.departure?.airport}) → {getAirportDisplay(flight.outbound?.arrival?.airport).name} ({flight.outbound?.arrival?.airport})
              </div>
              <div className="text-xs text-gray-400">
                {flight.outbound?.departure?.date} - {flight.outbound?.departure?.time}
              </div>
            </div>
            
            {flight.return && (
              <div>
                <div className="text-sm font-semibold text-gray-700 mb-1">Vol Retour</div>
                <div className="text-sm text-gray-600">
                  {getAirportDisplay(flight.return?.departure?.airport).name} ({flight.return?.departure?.airport}) → {getAirportDisplay(flight.return?.arrival?.airport).name} ({flight.return?.arrival?.airport})
                </div>
                <div className="text-xs text-gray-400">
                  {flight.return?.departure?.date} - {flight.return?.departure?.time}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      <div className="border-t border-gray-200 pt-4 mt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Passagers</span>
          <span className="font-semibold text-gray-800">
            {(passengers.adult || 0) + (passengers.child || 0) + (passengers.baby || 0)} personne(s)
          </span>
        </div>
        <div className="flex justify-between items-center pt-3 mt-2 border-t border-gray-200">
          <span className="text-gray-800 font-bold">Total</span>
          <span className="text-2xl font-bold text-[#00C0E8]">{getTotalPrice()}</span>
        </div>
        <p className="text-xs text-gray-500 mt-3 text-center">
          Toutes les taxes incluses
        </p>
      </div>
    </div>
  </div>
);