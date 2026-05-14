// Components/pages/TripHubDz/OTPVerification.jsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Mail, CheckCircle, AlertCircle, RefreshCw, ArrowLeft, Key, Clock } from 'lucide-react';

export default function OTPVerification() {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, agencyId } = location.state || { email: '', agencyId: '' };
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(300);
  const [canResend, setCanResend] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('pending');

  useEffect(() => {
    sendOTP();
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !canResend) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !canResend) {
      setCanResend(true);
    }
  }, [timeLeft, canResend]);

  const sendOTP = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setError('');
    } catch (err) {
      setError('Échec de l\'envoi du code. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;
    setCanResend(false);
    setTimeLeft(300);
    setOtp(['', '', '', '', '', '']);
    setError('');
    await sendOTP();
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
    
    if (error) setError('');
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerify = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Veuillez entrer le code à 6 chiffres');
      return;
    }
    
    setVerificationStatus('verifying');
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (otpValue === '000000') {
        setError('Code OTP invalide. Veuillez réessayer.');
        setVerificationStatus('pending');
      } else {
        setVerificationStatus('success');
        
        const pendingAgency = sessionStorage.getItem('pendingAgency');
        if (pendingAgency) {
          const agencyData = JSON.parse(pendingAgency);
          sessionStorage.setItem('verifiedAgency', JSON.stringify({
            ...agencyData,
            verifiedAt: new Date().toISOString(),
            status: 'verified'
          }));
        }
        
        setTimeout(() => {
          navigate('/TripHubDz/plans', { 
            state: { 
              verified: true, 
              agencyEmail: email,
              agencyId: agencyId 
            } 
          });
        }, 1500);
      }
    } catch (err) {
      setError('Échec de la vérification. Veuillez réessayer.');
      setVerificationStatus('pending');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00c0e8]/5 via-white to-[#00c0e8]/10 py-12 px-6">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#00c0e8]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#00c0e8]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto max-w-md">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/TripHubDz/signup')}
            className="group flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:bg-white"
          >
            <ArrowLeft className="h-5 w-5 text-[#00c0e8] group-hover:scale-110 transition-transform" />
            <span className="text-gray-700 font-medium">Retour</span>
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden min-w-fit"
        >
          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-20 h-20 bg-gradient-to-r from-[#00c0e8] to-[#0088a8] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
              >
                <Shield className="h-10 w-10 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Vérification par email
              </h2>
              <p className="text-gray-500">
                Nous avons envoyé un code de vérification à
              </p>
              <div className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-[#00c0e8]/10 rounded-full">
                <Mail className="h-4 w-4 text-[#00c0e8]" />
                <span className="font-medium text-gray-700">
                  {email || 'votre email'}
                </span>
              </div>
            </div>

            {verificationStatus === 'success' ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Vérification réussie !
                </h3>
                <p className="text-gray-600 mb-6">
                  Votre compte a été vérifié avec succès.
                </p>
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00c0e8]"></div>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  Redirection vers les plans...
                </p>
              </motion.div>
            ) : (
              <>
                {/* OTP Title */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
                    <Key className="h-4 w-4 text-[#00c0e8]" />
                    <span className="text-xs font-medium text-gray-600">Code à 6 chiffres</span>
                  </div>
                </div>

                {/* OTP Input Fields */}
                <div className="mb-8 ">
                  <div className="flex justify-center gap-3">
                    {otp.map((digit, index) => (
                      <motion.input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="w-14 h-14 md:w-16 md:h-16 text-center text-2xl font-bold border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00c0e8] focus:border-[#00c0e8] transition-all bg-gray-50 hover:bg-white"
                        autoFocus={index === 0}
                      />
                    ))}
                  </div>
                  
                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 flex items-center justify-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg"
                    >
                      <AlertCircle className="h-4 w-4" />
                      <span>{error}</span>
                    </motion.div>
                  )}
                </div>

                {/* Timer Section */}
                <div className="text-center mb-6">
                  {!canResend ? (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <p className="text-sm text-gray-600">
                        Renvoyer dans <span className="font-semibold text-[#00c0e8]">{formatTime(timeLeft)}</span>
                      </p>
                    </div>
                  ) : (
                    <motion.button
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleResendOTP}
                      disabled={loading}
                      className="inline-flex items-center gap-2 px-5 py-2 bg-[#00c0e8]/10 text-[#00c0e8] rounded-full hover:bg-[#00c0e8]/20 transition-all duration-300 font-medium"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Renvoyer le code
                    </motion.button>
                  )}
                </div>

                {/* Verify Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleVerify}
                  disabled={loading || verificationStatus === 'verifying'}
                  className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg ${
                    loading || verificationStatus === 'verifying'
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#00c0e8] to-[#0088a8] hover:shadow-xl'
                  }`}
                >
                  {verificationStatus === 'verifying' ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Vérification en cours...
                    </div>
                  ) : (
                    'Vérifier et continuer'
                  )}
                </motion.button>

                {/* Help Section */}
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-[#00c0e8]/5 rounded-xl border border-[#00c0e8]/10">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-[#00c0e8]/10 rounded-full flex items-center justify-center">
                        <Mail className="h-4 w-4 text-[#00c0e8]" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 text-sm mb-1">
                        Vous n'avez pas reçu le code ?
                      </p>
                      <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                        <li>Vérifiez votre dossier spam / courrier indésirable</li>
                        <li>Assurez-vous d'avoir saisi le bon email</li>
                        <li>Attendez 60 secondes avant de renvoyer un code</li>
                        <li>Contactez notre support si le problème persiste</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Contact Support */}
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-400">
                    Besoin d'aide ? <a href="#" className="text-[#00c0e8] hover:underline">Contactez le support</a>
                  </p>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}