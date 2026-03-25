import { FiClock } from 'react-icons/fi';
import { FaSuitcase, FaUndoAlt, FaPlane } from 'react-icons/fa';
import { MdFlightTakeoff, MdFlightLand, MdEventSeat } from 'react-icons/md';
import { GiCommercialAirplane } from 'react-icons/gi';

export default function FlightCard({ flight, isMulti, passengersCount, onReserve }) {
  const formatPrix = (prix) => prix ? new Intl.NumberFormat('fr-DZ').format(prix) + ' DZD' : 'Prix N/A';
  const formatHeure = (date) => date ? new Date(date).toLocaleTimeString('fr-FR', {hour:'2-digit', minute:'2-digit'}) : '--:--';
  const formatDate = (date) => date ? new Date(date).toLocaleDateString('fr-FR', {day:'2-digit', month:'2-digit', year:'numeric'}) : '';
  const formatDuree = (duree) => duree || '';

  if (!isMulti) {
    return <SimpleFlightCard flight={flight} passengersCount={passengersCount} onReserve={onReserve} 
             formatPrix={formatPrix} formatHeure={formatHeure} formatDate={formatDate} formatDuree={formatDuree} />;
  }
  return <MultiFlightCard flight={flight} passengersCount={passengersCount} onReserve={onReserve}
           formatPrix={formatPrix} formatHeure={formatHeure} formatDate={formatDate} formatDuree={formatDuree} />;
}
// pour vol simple
const SimpleFlightCard = ({ flight, passengersCount, onReserve, formatPrix, formatHeure, formatDate, formatDuree }) => (
  <div className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition">
    <div className="bg-gradient-to-r from-cyan-500 to-cyan-400 text-white px-4 py-2 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="bg-white/20 p-1.5 rounded-lg">
          <GiCommercialAirplane className="w-5 h-5" />
        </div>
        <span className="font-semibold text-sm">{flight.airline} {flight.flightNumber}</span>
      </div>
      <div className="text-right">
        <div className="text-xl font-bold">{formatPrix(flight.price?.total)}</div>
        <div className="text-xs text-white/80">
          {flight.price?.perPassenger ? `(${formatPrix(flight.price.perPassenger)}/personne)` : 'par personne'}
        </div>
      </div>
    </div>

    <div className="p-3 bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Départ */}
          <div className="text-center min-w-[80px]">
            <div className="text-xl font-bold text-gray-800">{formatHeure(flight.departure?.time)}</div>
            <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
              <MdFlightTakeoff className="w-4 h-4 text-cyan-500" /> {flight.departure?.airport}
            </div>
            <div className="text-xs text-gray-400">{formatDate(flight.departure?.time)}</div>
          </div>

          {/* Trajet */}
          <div className="flex flex-col items-center min-w-[100px]">
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <FiClock /> {formatDuree(flight.duration)}
            </div>
            <div className="border-t border-dashed border-gray-300 w-full my-1"></div>
            <div className="text-xs font-medium text-gray-600">
              {flight.stops === 0 ? 'Direct' : `${flight.stops} escale${flight.stops > 1 ? 's' : ''}`}
            </div>
          </div>

          {/* Arrivée */}
          <div className="text-center min-w-[80px]">
            <div className="text-xl font-bold text-gray-800">{formatHeure(flight.arrival?.time)}</div>
            <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
              <MdFlightLand className="w-4 h-4 text-cyan-500" /> {flight.arrival?.airport}
            </div>
            <div className="text-xs text-gray-400">{formatDate(flight.arrival?.time)}</div>
          </div>

          {/* Infos */}
          <FlightInfo flight={flight} />
        </div>

        <ReserveButton onClick={() => onReserve(flight)} />
      </div>
    </div>
  </div>
);

// pour vol multi-destination 
const MultiFlightCard = ({ flight, passengersCount, onReserve, formatPrix, formatHeure, formatDate, formatDuree }) => {
  const segments = flight.segments || flight.flights || [];
  const hasMultipleVols = !segments.length && (flight.vol1 || flight.vol2 || flight.vol3);
  let allSegments = [...segments];
  if (hasMultipleVols) {
    // Récupérer tous les vols (vol1, vol2, vol3, ...)
    const vols = [];
    let i = 1;
    while (flight[`vol${i}`]) {
      vols.push(flight[`vol${i}`]);
      i++;
    }
    allSegments = vols;
  }
  if (allSegments.length === 0) {
    return ( <div className="border border-gray-200 rounded-xl p-4 text-center text-gray-500">  Aucun segment disponible </div>
    );
  }
  
  const prixTotal = flight.prixTotal || flight.totalPrice;
  
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition">
      <div className="bg-gradient-to-r from-cyan-500 to-cyan-400 text-white px-4 py-2 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-white/20 p-1.5 rounded-lg">
            <GiCommercialAirplane className="w-5 h-5" />
          </div>
          <span className="font-semibold text-sm">
            Multi-destination 
          </span>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold">{formatPrix(prixTotal)}</div>
          <div className="text-xs text-white/80">Total pour {passengersCount} passagers</div>
        </div>
      </div>

      <div className="p-3 bg-white">
        {allSegments.map((segment, index) => (
          <div 
            key={index} 
            className={`${index < allSegments.length - 1 ? 'mb-3 pb-2 border-b border-gray-100' : 'mb-0'}`}
          >
            {/* En-tête du segment */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-cyan-600 bg-cyan-50 px-2 py-1 rounded-md">
                Vol {index + 1}
              </span>
              <span className="text-sm font-medium text-gray-700">
                {segment.airline} {segment.flightNumber}
              </span>
              {segment.stops > 0 && (
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                </span>
              )}
            </div>
            
            {/* Contenu du segment */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <FlightSegmentDisplay 
                  departure={segment.departure}
                  arrival={segment.arrival}
                  duration={segment.duration}
                  stops={segment.stops}
                  baggage={segment.baggage}
                  seats={segment.seatsAvailable}
                  formatHeure={formatHeure}
                  formatDate={formatDate}
                  formatDuree={formatDuree}
                />
              </div>
              {index === allSegments.length - 1 && (
                <ReserveButton onClick={() => onReserve(flight)} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
// Affichage d'un segment de vol (réutilisable)
const FlightSegmentDisplay = ({ departure, arrival, duration, stops, baggage, seats, formatHeure, formatDate, formatDuree }) => (
  <>
    <div className="text-center min-w-[80px]">
      <div className="text-lg font-bold text-gray-800">{formatHeure(departure?.time)}</div>
      <div className="text-sm text-gray-600">{departure?.airport}</div>
      <div className="text-xs text-gray-400">{formatDate(departure?.time)}</div>
    </div>

    <div className="flex flex-col items-center min-w-[80px]">
      <div className="text-xs text-gray-500 flex items-center gap-1">
        <FiClock className="w-3 h-3" /> {formatDuree(duration)}
      </div>
      <div className="border-t border-dashed border-gray-300 w-full my-1"></div>
      <div className="text-xs text-gray-600">{stops === 0 ? 'Direct' : `${stops} esc`}</div>
    </div>

    <div className="text-center min-w-[80px]">
      <div className="text-lg font-bold text-gray-800">{formatHeure(arrival?.time)}</div>
      <div className="text-sm text-gray-600">{arrival?.airport}</div>
      <div className="text-xs text-gray-400">{formatDate(arrival?.time)}</div>
    </div>

    <div className="flex gap-3 ml-2">
      <div className="flex items-center gap-1">
        <FaSuitcase className={`w-3 h-3 ${baggage?.quantity > 0 ? 'text-cyan-500' : 'text-gray-400'}`} />
        <span className="text-xs">{baggage?.quantity > 0 ? `${baggage.quantity} bag` : 'sans bag'}</span>
      </div>
      <div className="flex items-center gap-1">
        <MdEventSeat className={`w-3 h-3 ${seats <= 3 ? 'text-orange-500' : 'text-cyan-500'}`} />
        <span className="text-xs">{seats} pl.</span>
      </div>
    </div>
  </>
);
// Infos supplément pour vol simple
const FlightInfo = ({ flight }) => (
  <div className="flex gap-4 ml-4">
    <div className="flex items-center gap-1">
      <FaSuitcase className={`w-4 h-4 ${flight.baggage?.quantity > 0 ? 'text-cyan-500' : 'text-gray-400'}`} />
      <span className="text-sm">{flight.baggage?.quantity > 0 ? `${flight.baggage.quantity} bagage(s)` : 'Sans bagage'}</span>
    </div>
    <div className="flex items-center gap-1">
      <MdEventSeat className={`w-4 h-4 ${flight.seatsAvailable <= 3 ? 'text-orange-500' : 'text-cyan-500'}`} />
      <span className="text-sm">{flight.seatsAvailable} place{flight.seatsAvailable > 1 ? 's' : ''}</span>
    </div>
    {flight.refundable?.isRefundable && (
      <div className="flex items-center gap-1">
        <FaUndoAlt className="w-4 h-4 text-cyan-500" />
        <span className="text-sm">Remboursable</span>
      </div>
    )}
  </div>
);
const ReserveButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="bg-gradient-to-r from-cyan-500 to-cyan-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium text-sm shadow-sm hover:scale-[1.02] transition ml-4" >
    <FaPlane className="w-4 h-4" />  Réserver
  </button>
);