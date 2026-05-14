// Components/pages/TripHubDz/SuperAdminLogin.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, Lock, Mail, Sparkles, Plane, Building2, 
  Eye, EyeOff, ArrowRight, CheckCircle, AlertCircle
} from 'lucide-react';

export default function SuperAdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      if (email === 'admin@triphubdz.com' && password === 'admin123') {
        localStorage.setItem('super_admin_token', 'demo_token_' + Date.now());
        localStorage.setItem('super_admin_email', email);
        localStorage.setItem('super_admin_login_time', new Date().toISOString());
        navigate('/TripHubDz/admin/dashboard');
      } else {
        setError('Email ou mot de passe incorrect');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#00c0e8]/20 via-white to-[#f2541d]/10">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#00c0e8]/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#f2541d]/20 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00c0e8]/5 rounded-full blur-3xl"></div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute top-32 left-20 animate-float hidden lg:block">
        <div className="relative">
          <div className="absolute inset-0 bg-[#00c0e8] rounded-full blur-lg opacity-30"></div>
          <Plane className="h-16 w-16 text-[#00c0e8]/30 relative" />
        </div>
      </div>
      
      <div className="absolute bottom-32 right-20 animate-float-delayed hidden lg:block">
        <div className="relative">
          <div className="absolute inset-0 bg-[#f2541d] rounded-full blur-lg opacity-30"></div>
          <Building2 className="h-14 w-14 text-[#f2541d]/30 relative" />
        </div>
      </div>
      
      <div className="absolute top-1/3 right-40 animate-pulse hidden xl:block">
        <Sparkles className="h-8 w-8 text-yellow-400/20" />
      </div>

      {/* Main Content */}
      <div className="relative min-h-screen flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#00c0e8] to-[#0088a8] rounded-2xl mb-6 shadow-2xl relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#00c0e8] to-[#0088a8] rounded-2xl blur-lg opacity-50"></div>
              <Shield className="h-12 w-12 text-white relative" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold bg-gradient-to-r from-[#00c0e8] to-[#f2541d] bg-clip-text text-transparent"
            >
              Administration
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-500 mt-2"
            >
              Plateforme de gestion des agences de voyage
            </motion.p>
          </div>

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
          >
            <div className="p-8">
              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
                >
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                    <p className="text-red-600 text-xs mt-1">Compte démo: admin@triphubdz.com / admin123</p>
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Email Field */}
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-[#00c0e8] transition-colors" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00c0e8] focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                      placeholder="admin@triphubdz.com"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mot de passe
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-[#00c0e8] transition-colors" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00c0e8] focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#00c0e8] transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between mb-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-[#00c0e8] border-gray-300 rounded focus:ring-[#00c0e8]"
                    />
                    <span className="text-sm text-gray-600">Se souvenir de moi</span>
                  </label>
                  <a href="#" className="text-sm text-[#00c0e8] hover:text-[#0088a8] transition-colors">
                    Mot de passe oublié ?
                  </a>
                </div>

                {/* Login Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg flex items-center justify-center gap-2 ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#00c0e8] to-[#0088a8] hover:shadow-xl'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Connexion...
                    </>
                  ) : (
                    <>
                      Se connecter
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </motion.button>

                {/* Demo Credentials */}
                {/* <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-[#00c0e8]/5 rounded-xl border border-[#00c0e8]/10">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                    <div className="text-xs">
                      <p className="font-semibold text-gray-700 mb-1">Compte de démonstration</p>
                      <p className="text-gray-600">Email: <code className="text-[#00c0e8]">admin@triphubdz.com</code></p>
                      <p className="text-gray-600">Mot de passe: <code className="text-[#00c0e8]">admin123</code></p>
                    </div>
                  </div>
                </div> */}
              </form>
            </div>
          </motion.div>

         
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(20px) rotate(-5deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 7s ease-in-out infinite;
        }
        
        .bg-grid-pattern {
          background-image: linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                            linear-gradient(to bottom, #e5e7eb 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
    </div>
  );
}