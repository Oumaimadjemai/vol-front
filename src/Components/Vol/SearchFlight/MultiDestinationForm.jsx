// MultiDestinationForm.jsx
import FlightSegment from "./FlightSegment";
import { FaPlaneDeparture, FaPlaneArrival } from "react-icons/fa";
export default function MultiDestinationForm({
  multiFlights,
  updateMultiFlight,
  removeMultiFlight,
  addMultiFlight,
  airports,
  today
}) {
  return (
    <>
      {multiFlights.map((flight, index) => (
        <div
          key={index}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6   items-end"
        >
          {/* FROM */}
          <FlightSegment
            type="from"
            value={flight.from}
            onChange={(e) => updateMultiFlight(index, "from", e.target.value)}
            airports={airports}
            disabledAirports={flight.to ? [flight.to] : []}
            label="D'où partez-vous ?"
            icon={<FaPlaneDeparture />}
             placeholder="Sélectionnez un aéroport"
           
          />

          {/* TO */}
          <FlightSegment
            type="to"
            value={flight.to}
            onChange={(e) => updateMultiFlight(index, "to", e.target.value)}
            airports={airports}
            disabledAirports={flight.from ? [flight.from] : []}
            label="Où allez-vous ?"
            icon={<FaPlaneArrival />}
           placeholder="Sélectionnez un aéroport"
           
          />

          {/* DATE */}
          <FlightSegment
            type="date"
            value={flight.date}
            onChange={(e) => updateMultiFlight(index, "date", e.target.value)}
            minDate={index === 0 ? today : multiFlights[index - 1].date || today}
            label="Date Aller"
          />
          {/* SUPPRIMER */}
          {multiFlights.length > 1 && (
            <button
              onClick={() => removeMultiFlight(index)}
              className="bg-red-500 text-white rounded-xl px-3 py-2 h-12 hover:bg-red-600 transition self-start mt-8"
            >
              Supprimer
            </button>
          )}
        </div>
      ))}

      {multiFlights.length < 5 && (
        <button
          onClick={addMultiFlight}
          className="mb-4 px-5 py-2 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 transition shadow-sm"
        >
          + Ajouter un vol
        </button>
      )}
    </>
  );
}