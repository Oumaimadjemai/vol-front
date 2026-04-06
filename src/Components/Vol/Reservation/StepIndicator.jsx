// components/StepIndicator.jsx
import { FaCheck, FaPlane, FaUser, FaCreditCard } from 'react-icons/fa';

export const StepIndicator = ({ number, title, icon, isActive, isCompleted }) => {
  const getIcon = () => {
    if (icon === 'plane') return <FaPlane className="w-5 h-5" />;
    if (icon === 'user') return <FaUser className="w-5 h-5" />;
    if (icon === 'card') return <FaCreditCard className="w-5 h-5" />;
    return null;
  };

  return (
    <div className="flex flex-col items-center">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
        isActive ? 'bg-gradient-to-r from-[#00C0E8] to-[#0096b8] text-white shadow-lg scale-110' : 
        isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
      }`}>
        {isCompleted ? <FaCheck className="w-5 h-5" /> : getIcon()}
      </div>
      <span className={`text-xs font-semibold mt-2 ${isActive ? 'text-[#00C0E8]' : 'text-gray-500'}`}>
        {title}
      </span>
    </div>
  );
};