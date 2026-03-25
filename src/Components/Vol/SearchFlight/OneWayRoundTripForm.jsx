// OneWayRoundTripForm.jsx
import { FaPlaneDeparture, FaPlaneArrival } from "react-icons/fa";
import FlightSegment from "./FlightSegment";

export default function OneWayRoundTripForm({
  activeTab,
  from,
  setFrom,
  to,
  setTo,
  departureDate,
  setDepartureDate,
  returnDate,
  setReturnDate,
  airports,
  today
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      {/* DEPART */}
      <FlightSegment
        type="from"
        value={from}
        onChange={(e) => {
          const selected = e.target.value;
          setFrom(selected);
          if (selected === to) setTo("");
        }}
        airports={airports}
        disabledAirports={to ? [to] : []}
        label="D'où partez-vous ?"
        icon={<FaPlaneDeparture />}
        placeholder="Sélectionnez un aéroport"
      />

      {/* ARRIVEE */}
      <FlightSegment
        type="to"
        value={to}
        onChange={(e) => {
          const selected = e.target.value;
          setTo(selected);
          if (selected === from) setFrom("");
        }}
        airports={airports}
        disabledAirports={from ? [from] : []}
        label="Où allez-vous ?"
        icon={<FaPlaneArrival />}
        placeholder="Sélectionnez un aéroport"
      />

      {/* DATE ALLER */}
      <FlightSegment
        type="date"
        value={departureDate}
        onChange={(e) => setDepartureDate(e.target.value)}
        minDate={today}
        label="Date Aller"
      />

      {/* DATE RETOUR -*/}
      {activeTab === "retour" && (
        <FlightSegment
          type="date"
          value={returnDate}
          onChange={(e) => setReturnDate(e.target.value)}
          minDate={departureDate || today}
          label="Date Retour"
        />
      )}
    </div>
  );
}