// src/pages/PaymentCancel.jsx
import { useNavigate } from 'react-router-dom';
import { FaTimesCircle } from 'react-icons/fa';

export default function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
        <FaTimesCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Paiement annulé</h1>
        <p className="text-gray-600 mb-6">
          Le paiement a été annulé. Vous pouvez réessayer ou contacter notre support.
        </p>
        
        <div className="flex gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 px-4 py-2 bg-[#00C0E8] text-white rounded-xl font-semibold hover:bg-[#0096b8]"
          >
            Réessayer
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:border-[#00C0E8]"
          >
            Accueil
          </button>
        </div>
      </div>
    </div>
  );
}