import { FiTag } from 'react-icons/fi';
import { MdFlightTakeoff } from 'react-icons/md';
import FlightCard from './FlightCard';

export default function FlightList({ flights, totalFlights, passengersCount, isMulti, onReserve }) {
  if (flights.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="text-center py-12">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 bg-cyan-500/10">
            <FiTag className="w-12 h-12 text-cyan-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Aucun vol ne correspond aux filtres</h3>
          <p className="text-gray-500">Essayez de modifier vos filtres</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      {/* En-tête */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <MdFlightTakeoff className="w-7 h-7 text-cyan-500" /> Vols trouvés
          </h2>
          <p className="text-gray-500 mt-1 flex items-center gap-2">
            <FiTag className="w-4 h-4 text-cyan-500" /> 
            {flights.length} vol{flights.length > 1 ? 's' : ''} correspondant à votre recherche
            {flights.length !== totalFlights && ` (${totalFlights} au total)`}
          </p>
        </div>
      </div>

      {/* Liste des cartes */}
      <div className="space-y-3">
        {flights.map((flight, index) => (
          <FlightCard
            key={flight.id || index}
            flight={flight}
            isMulti={flight.type === 'multi'}
            passengersCount={passengersCount}
            onReserve={onReserve}
          />
        ))}
      </div>
    </div>
  );
}