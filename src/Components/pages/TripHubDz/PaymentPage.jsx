// Components/pages/TripHubDz/PaymentPage.jsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, Lock, ArrowLeft, CheckCircle, AlertCircle, 
  Smartphone, Building, Shield, Clock, Receipt, 
  ChevronRight, Wallet, Banknote, CreditCard as CardIcon
} from 'lucide-react';

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const state = location.state || {};
  const plan = state.plan || { name: 'Basic', price: 9000 };
  const billingCycle = state.billingCycle || 'month';
  const agencyInfo = state.agencyInfo || {};
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvc: ''
  });
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState('');

  const price = billingCycle === 'year' ? Math.round(plan.price * 12 * 0.8) : plan.price;
  
  // Format price in DA (Algerian Dinar)
  const formattedPrice = new Intl.NumberFormat('fr-DZ', {
    style: 'currency',
    currency: 'DZD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      let formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setFormData({ ...formData, [name]: formatted });
    } 
    // Format expiry date (MM/YY)
    else if (name === 'expiry') {
      let formatted = value.replace(/\//g, '');
      if (formatted.length >= 2) {
        formatted = formatted.slice(0, 2) + '/' + formatted.slice(2, 4);
      }
      setFormData({ ...formData, [name]: formatted });
    }
    else {
      setFormData({ ...formData, [name]: value });
    }
    
    if (error) setError('');
  };

  const validateForm = () => {
    if (paymentMethod === 'card') {
      if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
        setError('Numéro de carte invalide (16 chiffres)');
        return false;
      }
      if (formData.cardName.length < 3) {
        setError('Nom du titulaire invalide');
        return false;
      }
      if (formData.expiry.replace('/', '').length !== 4) {
        setError('Date d\'expiration invalide (MM/YY)');
        return false;
      }
      if (formData.cvc.length < 3) {
        setError('Code CVC invalide (3 chiffres)');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setProcessing(true);
    setError('');
    
    // Simulate Chargily payment processing
    setTimeout(() => {
      setProcessing(false);
      setPaymentSuccess(true);
      
      // Generate agency credentials
      const agencyId = 'AG' + Math.random().toString(36).substring(2, 10).toUpperCase();
      const subdomain = agencyId.toLowerCase();
      
      // Navigate to success page after showing success animation
      setTimeout(() => {
        navigate('/TripHubDz/success', {
          state: {
            plan: {
              id: plan.id,
              name: plan.name,
              price: plan.price
            },
            billingCycle: billingCycle,
            amount: price,
            agencyId: agencyId,
            subdomain: subdomain,
            domain: `${subdomain}.triphubdz.com`,
            agencyInfo: agencyInfo
          }
        });
      }, 2000);
    }, 2500);
  };

  // Payment methods
  const paymentMethods = [
    { id: 'card', name: 'Carte Bancaire', icon: CardIcon, color: 'from-blue-500 to-blue-600' },
    { id: 'ciB', name: 'CIB / EDAHABIA', icon: CreditCard, color: 'from-green-500 to-green-600' },
    { id: 'edahabia', name: 'Edahabia', icon: Wallet, color: 'from-purple-500 to-purple-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00c0e8]/5 via-white to-[#00c0e8]/10 py-12 px-6">
      <div className="container mx-auto max-w-6xl">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/TripHubDz/plans')}
            className="group flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:bg-white"
          >
            <ArrowLeft className="h-5 w-5 text-[#00c0e8] group-hover:scale-110 transition-transform" />
            <span className="text-gray-700 font-medium">Retour aux plans</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-[#00c0e8] rounded-lg">
                    <CreditCard className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Paiement sécurisé</h2>
                </div>

                {/* Payment Methods */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold mb-3 text-gray-700">
                    Mode de paiement
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id)}
                        className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                          paymentMethod === method.id
                            ? `border-[#00c0e8] bg-[#00c0e8]/5 shadow-md`
                            : 'border-gray-200 hover:border-[#00c0e8]/50'
                        }`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <method.icon className={`h-6 w-6 ${
                            paymentMethod === method.id ? 'text-[#00c0e8]' : 'text-gray-400'
                          }`} />
                          <span className={`text-xs font-medium ${
                            paymentMethod === method.id ? 'text-[#00c0e8]' : 'text-gray-600'
                          }`}>
                            {method.name}
                          </span>
                        </div>
                        {paymentMethod === method.id && (
                          <motion.div
                            layoutId="activePayment"
                            className="absolute -top-2 -right-2 w-5 h-5 bg-[#00c0e8] rounded-full flex items-center justify-center"
                          >
                            <CheckCircle className="h-3 w-3 text-white" />
                          </motion.div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <AnimatePresence mode="wait">
                    {paymentMethod === 'card' && (
                      <motion.div
                        key="card-form"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        <div>
                          <label className="block text-sm font-semibold mb-2 text-gray-700">
                            Numéro de carte
                          </label>
                          <div className="relative">
                            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              type="text"
                              name="cardNumber"
                              placeholder="1234 5678 9012 3456"
                              value={formData.cardNumber}
                              onChange={handleCardInputChange}
                              maxLength="19"
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00c0e8] transition-all"
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold mb-2 text-gray-700">
                            Nom du titulaire
                          </label>
                          <input
                            type="text"
                            name="cardName"
                            placeholder="JEAN DUPONT"
                            value={formData.cardName}
                            onChange={handleCardInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00c0e8] transition-all uppercase"
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold mb-2 text-gray-700">
                              Date d'expiration
                            </label>
                            <input
                              type="text"
                              name="expiry"
                              placeholder="MM/YY"
                              value={formData.expiry}
                              onChange={handleCardInputChange}
                              maxLength="5"
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00c0e8] transition-all"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold mb-2 text-gray-700">
                              CVC
                            </label>
                            <input
                              type="text"
                              name="cvc"
                              placeholder="123"
                              value={formData.cvc}
                              onChange={handleCardInputChange}
                              maxLength="3"
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00c0e8] transition-all"
                              required
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {paymentMethod === 'ciB' && (
                      <motion.div
                        key="cib-form"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="text-center py-8"
                      >
                        <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CreditCard className="h-10 w-10 text-white" />
                        </div>
                        <p className="text-gray-600 mb-4">
                          Vous allez être redirigé vers votre application bancaire
                        </p>
                        <div className="bg-gray-50 p-4 rounded-lg text-left">
                          <p className="text-sm text-gray-500 mb-2">Détails du paiement CIB :</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Banque : CPA / BNA / BDL / AGB</li>
                            <li>• Paiement sécurisé 3D Secure</li>
                            <li>• Accepte les cartes CIB et Edahabia</li>
                          </ul>
                        </div>
                      </motion.div>
                    )}

                    {paymentMethod === 'edahabia' && (
                      <motion.div
                        key="edahabia-form"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="text-center py-8"
                      >
                        <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Wallet className="h-10 w-10 text-white" />
                        </div>
                        <p className="text-gray-600 mb-4">
                          Paiement via carte Edahabia
                        </p>
                        <div className="bg-gray-50 p-4 rounded-lg text-left">
                          <p className="text-sm text-gray-500 mb-2">Instructions :</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>1. Saisissez votre numéro Edahabia</li>
                            <li>2. Validez avec votre code secret</li>
                            <li>3. Confirmez le montant de {formattedPrice}</li>
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm"
                    >
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </motion.div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={processing || paymentSuccess}
                    className={`w-full mt-6 py-4 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg ${
                      processing || paymentSuccess
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#00c0e8] to-[#0088a8] hover:shadow-xl hover:scale-105'
                    }`}
                  >
                    {processing ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Traitement en cours...
                      </div>
                    ) : paymentSuccess ? (
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        Paiement réussi !
                      </div>
                    ) : (
                      `Payer ${formattedPrice}`
                    )}
                  </button>
                  
                  <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">
                    <Lock className="h-3 w-3" />
                    <span>Paiement 100% sécurisé - Chiffrement SSL</span>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
          
          {/* Order Summary */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-8 sticky top-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-[#00c0e8] to-[#0088a8] rounded-lg">
                  <Receipt className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Récapitulatif</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-gray-600">Plan choisi</span>
                  <span className="font-semibold text-gray-800">{plan.name}</span>
                </div>
                
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-gray-600">Période</span>
                  <span className="font-semibold text-gray-800">
                    {billingCycle === 'month' ? 'Mensuel' : 'Annuel'}
                    {billingCycle === 'year' && (
                      <span className="text-green-600 text-xs ml-1">(-20%)</span>
                    )}
                  </span>
                </div>
                
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-gray-600">Prix unitaire</span>
                  <span className="text-gray-800">
                    {new Intl.NumberFormat('fr-DZ', { style: 'currency', currency: 'DZD' }).format(plan.price)}/mois
                  </span>
                </div>
                
                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-bold text-gray-800">Total à payer</span>
                  <span className="text-2xl font-bold text-[#00c0e8]">{formattedPrice}</span>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="bg-gradient-to-r from-[#00c0e8]/5 to-[#0088a8]/5 p-4 rounded-xl">
                  <div className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-[#00c0e8] mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-gray-600">
                      <p className="font-semibold text-gray-700 mb-1">Garantie satisfait ou remboursé</p>
                      <p>30 jours pour tester notre service. Remboursement intégral si vous n'êtes pas satisfait.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>Accès immédiat après paiement</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>Facture envoyée par email</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>Support technique inclus</span>
                </div>
              </div>
            </motion.div>

            {/* Trust Badges */}
            <div className="mt-6 flex justify-center gap-4">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="h-3 w-3 text-[#00c0e8]" />
                <span>Paiement sécurisé</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Shield className="h-3 w-3 text-[#00c0e8]" />
                <span>Données cryptées</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}