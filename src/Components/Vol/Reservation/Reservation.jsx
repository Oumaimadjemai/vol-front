import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CgChevronLeft } from "react-icons/cg";
import { GiCommercialAirplane } from 'react-icons/gi';
import ReservationSystem from './ReservationSystem';

export default function Reservation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [reservationData, setReservationData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = location.state?.reservationData;
    if (data) {
      setReservationData(data);
      setLoading(false);
    } else {
      // Redirect back to search if no data
      navigate('/');
    }
  }, [location.state, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-10 text-center">
          <GiCommercialAirplane className="w-16 h-16 text-cyan-500 mx-auto animate-bounce" />
          <div className="mt-4 w-20 h-20 border-4 border-blue-200 rounded-full animate-spin border-t-cyan-500 mx-auto" />
          <p className="mt-6 text-gray-600">Chargement de la réservation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto p-6">
        {/* Back button */}
        <button 
          onClick={() => navigate(-1)} 
          className="mb-4 flex items-center gap-2 text-cyan-400 hover:text-cyan-500 transition font-bold"
        >
          <CgChevronLeft size="20"/> Retour aux résultats
        </button>

        {/* Reservation System */}
        <ReservationSystem reservationData={reservationData} />
      </div>
    </div>
  );
}