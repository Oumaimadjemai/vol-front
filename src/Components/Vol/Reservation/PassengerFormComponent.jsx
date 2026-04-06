// src/Components/Vol/Reservation/components/PassengerFormComponent.jsx
import { memo } from 'react';
import { FaUserCircle, FaFileAlt } from 'react-icons/fa';
import { DatePicker } from './DatePicker';

export const PassengerFormComponent = memo(({ passenger, index, onUpdate }) => {
  const handleChange = (field, value) => {
    onUpdate(index, field, value);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-6 overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="bg-gradient-to-r from-[#00C0E8] to-[#0096b8] px-6 py-4">
        <h3 className="text-white font-bold flex items-center gap-2">
          <FaUserCircle />
          Passager {index + 1}
        </h3>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Civilité *</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={`title-${index}`}
                  value="Mr"
                  checked={passenger.title === 'Mr'}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-4 h-4 text-[#00C0E8] focus:ring-[#00C0E8] focus:ring-2"
                />
                <span className="text-gray-700">M.</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={`title-${index}`}
                  value="Mme"
                  checked={passenger.title === 'Mme'}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-4 h-4 text-[#00C0E8] focus:ring-[#00C0E8] focus:ring-2"
                />
                <span className="text-gray-700">Mme</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Prénom *</label>
            <input
              type="text"
              value={passenger.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              placeholder="Entrez le prénom"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:border-[#00C0E8] focus:ring-2 focus:ring-[#00C0E8]/20 transition-all outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Nom *</label>
            <input
              type="text"
              value={passenger.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              placeholder="Entrez le nom"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:border-[#00C0E8] focus:ring-2 focus:ring-[#00C0E8]/20 transition-all outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Date de naissance *</label>
            <DatePicker
              value={passenger.birthDate}
              onChange={(value) => handleChange('birthDate', value)}
              placeholder="JJ/MM/AAAA"
              maxDate={new Date().toISOString().split('T')[0]}
              position="bottom"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Numéro de passeport *</label>
            <input
              type="text"
              value={passenger.passportNumber}
              onChange={(e) => handleChange('passportNumber', e.target.value)}
              placeholder="Ex: A12345678"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:border-[#00C0E8] focus:ring-2 focus:ring-[#00C0E8]/20 transition-all outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Date d'expiration *</label>
            <DatePicker
              value={passenger.passportExpiry}
              onChange={(value) => handleChange('passportExpiry', value)}
              placeholder="JJ/MM/AAAA"
              minDate={new Date().toISOString().split('T')[0]}
              position="top"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-700 font-semibold mb-2">Photo du passeport *</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#00C0E8] transition-all cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files[0]) {
                    handleChange('passportImage', e.target.files[0]);
                  }
                }}
                className="hidden"
                id={`passport-${index}`}
              />
              <label htmlFor={`passport-${index}`} className="cursor-pointer block">
                <FaFileAlt className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Cliquez pour télécharger</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG jusqu'à 5MB</p>
                {passenger.passportImage && (
                  <p className="text-xs text-green-600 mt-2">✓ {passenger.passportImage.name}</p>
                )}
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

PassengerFormComponent.displayName = 'PassengerFormComponent';