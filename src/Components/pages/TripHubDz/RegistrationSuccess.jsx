// Components/pages/TripHubDz/RegistrationSuccess.jsx
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircle, Copy, ExternalLink, Download, Mail, 
  Building2, Calendar, DollarSign, Globe, ArrowRight,
  Sparkles, Rocket, Gift, Users, Settings, Layout
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function RegistrationSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { plan, billingCycle, amount, agencyId, subdomain, domain, agencyInfo } = location.state || {
    plan: { name: 'Basic' },
    billingCycle: 'month',
    amount: 9000,
    agencyId: 'DEMO123',
    subdomain: 'demo',
    domain: 'demo.triphubdz.com',
    agencyInfo: { agencyName: 'Mon Agence' }
  };
  
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Trigger confetti effect on load
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const nextSteps = [
    { icon: Mail, title: "Vérifiez vos emails", description: "Recevez vos identifiants de connexion", color: "from-blue-500 to-blue-600" },
    { icon: Layout, title: "Personnalisez votre portail", description: "Ajoutez votre logo et vos couleurs", color: "from-purple-500 to-purple-600" },
    { icon: Users, title: "Invitez votre équipe", description: "Ajoutez vos collaborateurs", color: "from-green-500 to-green-600" },
    { icon: Rocket, title: "Commencez à vendre", description: "Publiez vos premières offres", color: "from-orange-500 to-orange-600" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00c0e8]/5 via-white to-[#00c0e8]/10 py-12 px-6 relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-[#00c0e8] rounded-full"
              initial={{ y: -20, x: Math.random() * window.innerWidth, opacity: 1 }}
              animate={{ y: window.innerHeight + 100, opacity: 0, rotate: 360 }}
              transition={{ duration: Math.random() * 3 + 2, delay: Math.random() * 0.5 }}
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: ['#00c0e8', '#f2541d', '#ffd700', '#4caf50'][Math.floor(Math.random() * 4)]
              }}
            />
          ))}
        </div>
      )}

      <div className="container mx-auto max-w-4xl">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="text-center mb-8"
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-green-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
            <div className="relative w-24 h-24 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-2xl">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="p-8 md:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-[#00c0e8] to-[#0088a8] bg-clip-text text-transparent">
                Félicitations ! 🎉
              </h1>
              <p className="text-gray-600 text-lg">
                Votre agence a été créée avec succès sur TripHubDz
              </p>
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full">
                <Sparkles className="h-4 w-4 text-green-600" />
                <span className="text-xs font-medium text-green-600">Inscription validée</span>
              </div>
            </div>

            {/* Agency Details Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-r from-[#00c0e8]/5 to-[#0088a8]/5 rounded-2xl p-6 mb-8 border border-[#00c0e8]/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#00c0e8] rounded-lg">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Détails de votre agence</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Nom de l'agence</p>
                  <p className="font-semibold text-gray-800">{agencyInfo?.agencyName || 'Mon Agence'}</p>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Plan souscrit</p>
                  <p className="font-semibold text-gray-800">
                    {plan.name} - {billingCycle === 'month' ? 'Mensuel' : 'Annuel'}
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Montant payé</p>
                  <p className="font-semibold text-[#00c0e8]">{formatPrice(amount)}</p>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">ID Agence</p>
                  <p className="font-mono text-sm font-semibold text-gray-800">{agencyId}</p>
                </div>
              </div>

              {/* Domain Section */}
              <div className="mt-4 bg-white rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-2">Votre domaine personnalisé</p>
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-[#00c0e8]" />
                    <code className="text-sm font-mono font-semibold text-gray-800">{domain}</code>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(domain, 'domain')}
                      className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-300 text-sm font-medium"
                    >
                      <Copy className="h-4 w-4" />
                      {copied ? 'Copié !' : 'Copier'}
                    </button>
                    <a
                      href={`http://${subdomain}.127.0.0.1:3000`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-1.5 bg-[#00c0e8] text-white rounded-lg hover:bg-[#0088a8] transition-all duration-300 text-sm font-medium"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Accéder
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mb-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-[#00c0e8] to-[#0088a8] rounded-lg">
                  <Rocket className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Prochaines étapes</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nextSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300 group cursor-pointer"
                  >
                    <div className={`w-10 h-10 bg-gradient-to-r ${step.color} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <step.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">{step.title}</h4>
                      <p className="text-xs text-gray-500">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="space-y-3"
            >
              <a
                href={`http://${subdomain}.127.0.0.1:3000`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#00c0e8] to-[#0088a8] text-white py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 group"
              >
                Accéder à mon portail agence
                <ExternalLink className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </a>
              
              <button
                onClick={() => navigate('/TripHubDz')}
                className="flex items-center justify-center gap-2 w-full py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-600 hover:border-[#00c0e8] hover:text-[#00c0e8] transition-all duration-300"
              >
                Retour à l'accueil
                <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>

            {/* Email Notification */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-6 p-4 bg-[#00c0e8]/5 rounded-xl border border-[#00c0e8]/10 flex items-start gap-3"
            >
              <Mail className="h-5 w-5 text-[#00c0e8] flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-gray-800 mb-1">Email de confirmation envoyé</p>
                <p className="text-gray-600">
                  Un email avec vos identifiants de connexion a été envoyé à votre adresse.
                  N'oubliez pas de vérifier vos spams.
                </p>
              </div>
            </motion.div>

            {/* Support Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="mt-6 text-center"
            >
              <p className="text-xs text-gray-400">
                Besoin d'aide ?{" "}
                <a href="#" className="text-[#00c0e8] hover:underline">
                  Contactez notre support
                </a>{" "}
                - Disponible 24/7
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Gift Card / Special Offer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.6 }}
          className="mt-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-4 text-white text-center shadow-lg"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Gift className="h-5 w-5" />
            <span className="font-semibold">Offre de bienvenue</span>
          </div>
          <p className="text-sm opacity-90">
            Parrainez une autre agence et bénéficiez de 20% de réduction sur votre prochain renouvellement !
          </p>
        </motion.div>
      </div>
    </div>
  );
}