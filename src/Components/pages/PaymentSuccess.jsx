// src/pages/PaymentSuccess.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import axiosInstance from '../../api/axiosInstance';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('loading');
  const [reservationId, setReservationId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const checkoutId = params.get('checkout_id');
    const reservationIdFromUrl = params.get('reservation_id');
    
    if (reservationIdFromUrl) {
      setReservationId(reservationIdFromUrl);
    }
    
    // Vérifier le statut du paiement
    const checkPaymentStatus = async () => {
      try {
        // Appeler ton backend pour vérifier le statut
        const response = await axiosInstance.get(`/ms-reservation/reservations/${reservationIdFromUrl}/`);
        
        if (response.data.status === 'CONFIRMED') {
          setStatus('success');
        } else {
          setStatus('pending');
        }
      } catch (error) {
        console.error('Error checking payment:', error);
        setStatus('error');
      }
    };
    
    if (reservationIdFromUrl) {
      checkPaymentStatus();
    } else {
      setStatus('success');
    }
  }, [location]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00C0E8] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Vérification de votre paiement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
        <FaCheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Paiement réussi !</h1>
        <p className="text-gray-600 mb-6">
          Votre paiement a été confirmé. Votre réservation est maintenant validée.
        </p>
        
        <div className="bg-green-50 rounded-xl p-4 mb-6">
          <p className="text-sm text-green-700">
            Un email de confirmation vous a été envoyé avec les détails de votre vol.
          </p>
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={() => navigate(`/reservation/confirmation/${reservationId}`)}
            className="flex-1 px-4 py-2 bg-[#00C0E8] text-white rounded-xl font-semibold hover:bg-[#0096b8]"
          >
            Voir ma réservation
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:border-[#00C0E8]"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
}