// Components/pages/TripHubDz/AgencySignup.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Building2, User, Mail, Phone, Calendar, Clock, 
  FileText, Upload, AlertCircle, CheckCircle, 
  ArrowRight, ArrowLeft, Briefcase, Home, MapPin,
  CreditCard, Globe, Users, Award, Shield, Heart,
  X, Plus, ChevronDown
} from 'lucide-react';

// Liste des wilayas algériennes
const wilayas = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", "Béchar", "Blida", "Bouira",
  "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Alger", "Djelfa", "Jijel", "Sétif", "Saïda",
  "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma", "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara",
  "Ouargla", "Oran", "El Bayadh", "Illizi", "Bordj Bou Arréridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt",
  "El Oued", "Khenchela", "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent", "Ghardaïa",
  "Relizane", "Timimoun", "Bordj Badji Mokhtar", "Ouled Djellal", "Béni Abbès", "In Salah", "In Guezzam", "Touggourt",
  "Djanet", "El M'Ghair", "El Menia"
];

export default function AgencySignup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isWilayaOpen, setIsWilayaOpen] = useState(false);
  const [wilayaSearch, setWilayaSearch] = useState('');
  
  const [formData, setFormData] = useState({
    // Agency Information
    agencyName: '',
    registrationNumber: '',
    foundedYear: '',
    description: '',
    openingHours: {
      monday: { open: '09:00', close: '18:00', closed: false },
      tuesday: { open: '09:00', close: '18:00', closed: false },
      wednesday: { open: '09:00', close: '18:00', closed: false },
      thursday: { open: '09:00', close: '18:00', closed: false },
      friday: { open: '09:00', close: '18:00', closed: false },
      saturday: { open: '10:00', close: '16:00', closed: false },
      sunday: { open: '09:00', close: '18:00', closed: true }
    },
    phone: '',
    email: '',
    website: '',
    address: '',
    wilaya: '',
    
    // Owner Information
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    ownerPosition: '',
    
    // Documents
    registrationDoc: null,
    taxDoc: null,
    logo: null
  });
  
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleOpeningHoursChange = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: { ...prev.openingHours[day], [field]: value }
      }
    }));
  };

  const handleClosedToggle = (day) => {
    setFormData(prev => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: { ...prev.openingHours[day], closed: !prev.openingHours[day].closed }
      }
    }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
        setFormData(prev => ({ ...prev, [type]: file }));
        setErrors(prev => ({ ...prev, [type]: '' }));
      } else {
        setErrors(prev => ({ ...prev, [type]: 'Veuillez uploader un fichier PDF ou image' }));
      }
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.agencyName) newErrors.agencyName = 'Le nom de l\'agence est requis';
    if (!formData.registrationNumber) newErrors.registrationNumber = 'Le numéro d\'enregistrement est requis';
    if (!formData.email) newErrors.email = 'L\'email est requis';
    if (!formData.phone) newErrors.phone = 'Le numéro de téléphone est requis';
    if (!formData.address) newErrors.address = 'L\'adresse est requise';
    if (!formData.wilaya) newErrors.wilaya = 'La wilaya est requise';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.ownerName) newErrors.ownerName = 'Le nom du propriétaire est requis';
    if (!formData.ownerEmail) newErrors.ownerEmail = 'L\'email du propriétaire est requis';
    if (!formData.ownerPhone) newErrors.ownerPhone = 'Le téléphone du propriétaire est requis';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};
    if (!formData.registrationDoc) newErrors.registrationDoc = 'Le document d\'enregistrement est requis';
    if (!formData.logo) newErrors.logo = 'Le logo de l\'agence est requis';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'openingHours') {
        submitData.append(key, JSON.stringify(formData[key]));
      } else if (formData[key] instanceof File) {
        submitData.append(key, formData[key]);
      } else if (formData[key] !== null && typeof formData[key] !== 'object') {
        submitData.append(key, formData[key]);
      }
    });
    
    try {
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true, agencyId: 'AG' + Math.random().toString(36).substring(2, 10).toUpperCase() });
        }, 2000);
      });
      
      if (response.success) {
        sessionStorage.setItem('pendingAgency', JSON.stringify({
          ...formData,
          agencyId: response.agencyId,
          registrationDate: new Date().toISOString()
        }));
        
        navigate('/TripHubDz/verify-otp', { 
          state: { email: formData.ownerEmail, agencyId: response.agencyId }
        });
      }
    } catch (error) {
      console.error('Submission error:', error);
      setErrors({ submit: 'Échec de l\'envoi. Veuillez réessayer.' });
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
    else if (step === 3 && validateStep3()) handleSubmit();
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  // Filtrer les wilayas
  const filteredWilayas = wilayas.filter(w => 
    w.toLowerCase().includes(wilayaSearch.toLowerCase())
  );

  const dayNames = {
    monday: 'Lundi', tuesday: 'Mardi', wednesday: 'Mercredi',
    thursday: 'Jeudi', friday: 'Vendredi', saturday: 'Samedi', sunday: 'Dimanche'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00c0e8]/5 via-white to-[#00c0e8]/10 py-12 px-6">
      <div className="container mx-auto max-w-5xl">
        {/* Return to Home Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/TripHubDz')}
            className="group flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:bg-white"
          >
            <Home className="h-5 w-5 text-[#00c0e8] group-hover:scale-110 transition-transform" />
            <span className="text-gray-700 font-medium">Retour à l'accueil</span>
          </button>
        </div>

        {/* Header avec logo et titre */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-[#00c0e8] to-[#0088a8] rounded-full mb-4 shadow-lg"
          >
            <Building2 className="h-10 w-10 text-white" />
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#00c0e8]">
            Créer votre agence
          </h1>
          <p className="text-gray-600 mt-2">Rejoignez la plus grande plateforme de voyages en Algérie</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2 px-4">
            {['Informations', 'Propriétaire', 'Documents'].map((label, index) => (
              <div key={index} className="text-center flex-1">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center font-semibold transition-all duration-300 ${
                    step > index + 1 ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg' :
                    step === index + 1 ? 'bg-[#00c0e8] text-white shadow-lg ring-4 ring-[#00c0e8]/20' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step > index + 1 ? <CheckCircle className="h-5 w-5" /> : index + 1}
                </motion.div>
                <span className={`text-sm hidden md:inline ${
                  step === index + 1 ? 'text-[#00c0e8] font-semibold' : 'text-gray-500'
                }`}>
                  {label}
                </span>
              </div>
            ))}
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[#00c0e8]"
              initial={{ width: 0 }}
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Form Content */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="p-8">
            {step === 1 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-[#00c0e8] rounded-lg">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Informations de l'agence</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700">
                        Nom de l'agence <span className="text-[#f2541d]">*</span>
                      </label>
                      <input
                        type="text"
                        name="agencyName"
                        value={formData.agencyName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00c0e8] transition-all ${
                          errors.agencyName ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-[#00c0e8]'
                        }`}
                        placeholder="Ex: Global Voyages Algérie"
                      />
                      {errors.agencyName && <p className="text-red-500 text-sm mt-1">{errors.agencyName}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700">
                        Numéro d'enregistrement <span className="text-[#f2541d]">*</span>
                      </label>
                      <input
                        type="text"
                        name="registrationNumber"
                        value={formData.registrationNumber}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00c0e8] transition-all ${
                          errors.registrationNumber ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-[#00c0e8]'
                        }`}
                        placeholder="Ex: RC-2024-001"
                      />
                      {errors.registrationNumber && <p className="text-red-500 text-sm mt-1">{errors.registrationNumber}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700">
                        Email de l'agence <span className="text-[#f2541d]">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00c0e8] transition-all ${
                          errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-[#00c0e8]'
                        }`}
                        placeholder="contact@agence.dz"
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700">
                        Téléphone <span className="text-[#f2541d]">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00c0e8] transition-all ${
                          errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-[#00c0e8]'
                        }`}
                        placeholder="+213 5XX XX XX XX"
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00c0e8] transition-all hover:border-[#00c0e8]"
                      placeholder="Décrivez votre agence..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700">
                        Adresse <span className="text-[#f2541d]">*</span>
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00c0e8] transition-all ${
                          errors.address ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-[#00c0e8]'
                        }`}
                        placeholder="Ex: 05 Rue Didouche Mourad"
                      />
                      {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700">
                        Wilaya <span className="text-[#f2541d]">*</span>
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setIsWilayaOpen(!isWilayaOpen)}
                          className={`w-full px-4 py-3 text-left border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00c0e8] transition-all flex items-center justify-between ${
                            errors.wilaya ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-[#00c0e8]'
                          }`}
                        >
                          <span className={formData.wilaya ? 'text-gray-800' : 'text-gray-400'}>
                            {formData.wilaya || 'Sélectionnez une wilaya'}
                          </span>
                          <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${isWilayaOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {isWilayaOpen && (
                          <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                            <div className="p-2 border-b border-gray-100">
                              <input
                                type="text"
                                placeholder="Rechercher une wilaya..."
                                value={wilayaSearch}
                                onChange={(e) => setWilayaSearch(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00c0e8]"
                              />
                            </div>
                            <div className="max-h-60 overflow-y-auto">
                              {filteredWilayas.map((wilaya) => (
                                <button
                                  key={wilaya}
                                  type="button"
                                  onClick={() => {
                                    setFormData(prev => ({ ...prev, wilaya }));
                                    setIsWilayaOpen(false);
                                    setWilayaSearch('');
                                    if (errors.wilaya) {
                                      setErrors(prev => ({ ...prev, wilaya: '' }));
                                    }
                                  }}
                                  className="w-full px-4 py-2 text-left hover:bg-[#00c0e8]/10 transition-colors"
                                >
                                  {wilaya}
                                </button>
                              ))}
                              {filteredWilayas.length === 0 && (
                                <div className="px-4 py-2 text-gray-500 text-center">
                                  Aucune wilaya trouvée
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      {errors.wilaya && <p className="text-red-500 text-sm mt-1">{errors.wilaya}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Site web</label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00c0e8] transition-all hover:border-[#00c0e8]"
                      placeholder="https://www.agence.dz"
                    />
                  </div>

                  {/* Opening Hours with Closed Toggle */}
                  <div>
                    <label className="block text-sm font-semibold mb-3 text-gray-700">Horaires d'ouverture</label>
                    <div className="space-y-3 bg-gray-50 p-4 rounded-xl">
                      {Object.entries(dayNames).map(([day, dayName]) => (
                        <div key={day} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between sm:w-32">
                            <span className="text-sm font-medium text-gray-700">{dayName}</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.openingHours[day].closed}
                                onChange={() => handleClosedToggle(day)}
                                className="sr-only peer"
                              />
                              <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#00c0e8]"></div>
                              <span className="ml-2 text-xs text-gray-500">
                                {formData.openingHours[day].closed ? 'Fermé' : 'Ouvert'}
                              </span>
                            </label>
                          </div>
                          {!formData.openingHours[day].closed && (
                            <>
                              <div className="flex-1 flex gap-3">
                                <div className="flex-1">
                                  <label className="block text-xs text-gray-500 mb-1">Ouverture</label>
                                  <input
                                    type="time"
                                    value={formData.openingHours[day].open}
                                    onChange={(e) => handleOpeningHoursChange(day, 'open', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00c0e8]"
                                  />
                                </div>
                                <div className="flex-1">
                                  <label className="block text-xs text-gray-500 mb-1">Fermeture</label>
                                  <input
                                    type="time"
                                    value={formData.openingHours[day].close}
                                    onChange={(e) => handleOpeningHoursChange(day, 'close', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00c0e8]"
                                  />
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-[#00c0e8] rounded-lg">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Informations du propriétaire</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700">
                        Nom complet <span className="text-[#f2541d]">*</span>
                      </label>
                      <input
                        type="text"
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00c0e8] transition-all ${
                          errors.ownerName ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-[#00c0e8]'
                        }`}
                        placeholder="Ahmed Benali"
                      />
                      {errors.ownerName && <p className="text-red-500 text-sm mt-1">{errors.ownerName}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700">Poste</label>
                      <input
                        type="text"
                        name="ownerPosition"
                        value={formData.ownerPosition}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00c0e8] transition-all hover:border-[#00c0e8]"
                        placeholder="Ex: CEO, Directeur Général"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700">
                        Email <span className="text-[#f2541d]">*</span>
                      </label>
                      <input
                        type="email"
                        name="ownerEmail"
                        value={formData.ownerEmail}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00c0e8] transition-all ${
                          errors.ownerEmail ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-[#00c0e8]'
                        }`}
                        placeholder="ahmed@agence.dz"
                      />
                      {errors.ownerEmail && <p className="text-red-500 text-sm mt-1">{errors.ownerEmail}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700">
                        Téléphone <span className="text-[#f2541d]">*</span>
                      </label>
                      <input
                        type="tel"
                        name="ownerPhone"
                        value={formData.ownerPhone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00c0e8] transition-all ${
                          errors.ownerPhone ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-[#00c0e8]'
                        }`}
                        placeholder="+213 5XX XX XX XX"
                      />
                      {errors.ownerPhone && <p className="text-red-500 text-sm mt-1">{errors.ownerPhone}</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-[#00c0e8] rounded-lg">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Vérification des documents</h2>
                </div>
                
                <div className="space-y-8">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Document d'enregistrement commercial <span className="text-[#f2541d]">*</span>
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-xl transition-all hover:border-[#00c0e8] hover:bg-gray-50 cursor-pointer"
                         style={{ borderColor: errors.registrationDoc ? '#ef4444' : '#d1d5db' }}>
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer rounded-md font-medium text-[#00c0e8] hover:text-[#0088a8]">
                            <span>Télécharger un fichier</span>
                            <input
                              type="file"
                              className="sr-only"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => handleFileChange(e, 'registrationDoc')}
                            />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">PDF, PNG, JPG jusqu'à 10MB</p>
                      </div>
                    </div>
                    {formData.registrationDoc && (
                      <p className="mt-2 text-sm text-green-600">✓ {formData.registrationDoc.name}</p>
                    )}
                    {errors.registrationDoc && <p className="text-red-500 text-sm mt-1">{errors.registrationDoc}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Document d'enregistrement fiscal
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl transition-all hover:border-[#00c0e8] hover:bg-gray-50 cursor-pointer">
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer rounded-md font-medium text-[#00c0e8] hover:text-[#0088a8]">
                            <span>Télécharger un fichier</span>
                            <input
                              type="file"
                              className="sr-only"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => handleFileChange(e, 'taxDoc')}
                            />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">PDF, PNG, JPG jusqu'à 10MB (Optionnel)</p>
                      </div>
                    </div>
                    {formData.taxDoc && <p className="mt-2 text-sm text-green-600">✓ {formData.taxDoc.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Logo de l'agence <span className="text-[#f2541d]">*</span>
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-xl transition-all hover:border-[#00c0e8] hover:bg-gray-50 cursor-pointer"
                         style={{ borderColor: errors.logo ? '#ef4444' : '#d1d5db' }}>
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer rounded-md font-medium text-[#00c0e8] hover:text-[#0088a8]">
                            <span>Télécharger un fichier</span>
                            <input
                              type="file"
                              className="sr-only"
                              accept=".jpg,.jpeg,.png"
                              onChange={(e) => handleFileChange(e, 'logo')}
                            />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG jusqu'à 5MB</p>
                      </div>
                    </div>
                    {formData.logo && <p className="mt-2 text-sm text-green-600">✓ {formData.logo.name}</p>}
                    {errors.logo && <p className="text-red-500 text-sm mt-1">{errors.logo}</p>}
                  </div>

                  <div className="bg-[#00c0e8]/10 p-5 rounded-xl border border-[#00c0e8]/20">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-[#00c0e8] mr-2 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <p className="font-semibold text-gray-800">Important :</p>
                        <p className="text-gray-600">Votre demande sera examinée sous 24-48 heures. Vous recevrez un code OTP par email pour vérifier votre propriété avant de procéder au paiement.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              {step > 1 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={prevStep}
                  className="flex items-center px-6 py-3 border-2 border-gray-300 rounded-xl hover:border-[#00c0e8] hover:text-[#00c0e8] transition-all duration-300 font-medium"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Précédent
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={nextStep}
                disabled={loading}
                className={`flex items-center ml-auto px-8 py-3 bg-[#00c0e8] text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:bg-[#0088a8] ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Envoi en cours...
                  </div>
                ) : step === 3 ? (
                  'Soumettre la demande'
                ) : (
                  <>
                    Continuer
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Trust Badges */}
        <div className="mt-8 flex justify-center gap-6 flex-wrap">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Shield className="h-4 w-4 text-[#00c0e8]" />
            <span>Données sécurisées</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4 text-[#00c0e8]" />
            <span>Vérification rapide</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Heart className="h-4 w-4 text-[#00c0e8]" />
            <span>Support dédié</span>
          </div>
        </div>
      </div>
    </div>
  );
}