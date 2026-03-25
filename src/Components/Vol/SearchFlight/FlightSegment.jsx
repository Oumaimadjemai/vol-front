import { FaPlaneDeparture, FaPlaneArrival } from "react-icons/fa";

export default function FlightSegment({
  type, // "from" ou "to" ou "date"
  value,
  onChange,
  airports,
  disabledAirports = [],
  minDate,
  label,
  icon,
  placeholder = "Sélectionnez",
  showIcon = true,
  className = "", //  pour les classes personnalisées
  inputClassName = "", //  pour les classes de l'input/select
  labelClassName = "" //  pour les classes du label
}) {
  if (type === "date") {
    return (
      <div className={className}> {/*  Applique la classe sur le conteneur */}
        <label className={`text-gray-500 text-sm font-semibold ${labelClassName}`}>
          {label}
        </label>
        <input
          type="date"
          min={minDate}
          value={value}
          onChange={onChange}
          className={`w-full border border-gray-300 rounded-xl px-4 py-2.5 mt-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 ${inputClassName}`} /* 👈 Classes sur l'input */
        />
      </div>
    );
  }

  return (
    <div className={className}> {/* Applique la classe sur le conteneur */}
      <label className={`flex items-center text-gray-500 text-sm font-semibold mb-1 ${labelClassName}`}>
        {showIcon && icon && <span className="mr-2 text-cyan-500">{icon}</span>}
        {label}
      </label>
      <select
        value={value}
        onChange={onChange}
        className={`w-full border border-gray-300 rounded-xl px-4 py-3 mt-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition ${
          value ? "text-cyan-500" : "text-gray-700"
        } ${inputClassName}`} /*  Classes sur le select */
      >
        <option value="">{placeholder}</option>
        {airports
          .filter((a) => !disabledAirports.includes(a.code))
          .map((a) => (
            <option key={a.code} value={a.code}>
              {a.code} - {a.city} {a.country ? `(${a.country})` : ""}
            </option>
          ))}
      </select>
    </div>
  );
}