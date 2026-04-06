import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Plane, AlertCircle, Shield, UserCog, ArrowRight, Sparkles, X } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function LoginAdmin() {
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [resetError, setResetError] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!identifier.trim() || !password.trim()) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axiosInstance.post("auth-service/auth/login/", {
        identifier,
        password,
      });
      
      console.log("Login success", response);
      
      // Store tokens in sessionStorage only (no remember me)
      sessionStorage.setItem("access_token", response.data.access);
      sessionStorage.setItem("refresh_token", response.data.refresh);
      
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("user_id", response.data.user_id);
      localStorage.setItem("username", response.data.username || identifier);
      
      const userRole = response.data.role;
      
      if (userRole === "admin" || userRole === "agent") {
        // Success animation before redirect
        setTimeout(() => {
          navigate("/admin", { replace: true });
        }, 500);
      } else {
        setError("Accès non autorisé. Cette page est réservée aux administrateurs et agents.");
        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("refresh_token");
        localStorage.removeItem("role");
      }
      
    } catch (err) {
      console.error("Login error:", err);
      
      if (err.response) {
        if (err.response.status === 401) {
          setError("Email ou mot de passe incorrect");
        } else if (err.response.status === 403) {
          setError("Accès refusé. Vérifiez vos permissions.");
        } else if (err.response.data && err.response.data.non_field_errors) {
          setError(err.response.data.non_field_errors[0] || "Email ou mot de passe incorrect");
        } else if (err.response.data && err.response.data.detail) {
          setError(err.response.data.detail);
        } else if (err.response.data && err.response.data.error) {
          setError(err.response.data.error);
        } else {
          setError("Une erreur est survenue lors de la connexion");
        }
      } else if (err.request) {
        setError("Impossible de contacter le serveur. Vérifiez votre connexion.");
      } else {
        setError("Une erreur inattendue s'est produite");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!resetEmail.trim()) {
      setResetError("Veuillez entrer votre adresse email");
      return;
    }

    setIsResetting(true);
    setResetError("");
    setResetMessage("");

    try {
      // Adjust this endpoint according to your API
      const response = await axiosInstance.post("auth-service/auth/password-reset/", {
        email: resetEmail,
      });
      
      setResetMessage("Un email de réinitialisation a été envoyé à votre adresse email.");
      
      // Close dialog after 3 seconds
      setTimeout(() => {
        setIsForgotPasswordOpen(false);
        setResetEmail("");
        setResetMessage("");
      }, 3000);
      
    } catch (err) {
      console.error("Password reset error:", err);
      if (err.response && err.response.data) {
        setResetError(err.response.data.detail || "Une erreur est survenue. Veuillez réessayer.");
      } else {
        setResetError("Impossible d'envoyer l'email. Vérifiez votre connexion.");
      }
    } finally {
      setIsResetting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const leftSideVariants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 20,
        duration: 0.8,
      },
    },
  };

  const rightSideVariants = {
    hidden: { x: "100%", opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 20,
        duration: 0.8,
      },
    },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2,
      },
    },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const floatingIconsVariants = {
    animate: {
      y: [0, -20, 0],
      rotate: [0, 10, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      
      {/* LEFT SIDE - Animated with Framer Motion */}
      <motion.div
        variants={leftSideVariants}
        initial="hidden"
        animate="visible"
        className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#00C0E8] to-[#0096b8] text-white flex-col justify-between p-12 relative overflow-hidden"
      >
        {/* Animated decorative elements */}
        <motion.div
          className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full -ml-48 -mb-48"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/5 rounded-full"
          variants={floatingIconsVariants}
          animate="animate"
          style={{ x: "-50%", y: "-50%" }}
        />
        
        <div className="relative z-10">
          <motion.div
            className="flex items-center gap-3"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="bg-white/20 backdrop-blur-sm p-3 rounded-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Plane size={28} className="text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold tracking-tight">Traveling!</h1>
          </motion.div>
        </div>

        <div className="relative z-10 max-w-md">
          <motion.div
            className="mb-6"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Shield size={16} className="text-white" />
              </motion.div>
              <span className="text-sm font-medium">Accès Sécurisé</span>
            </motion.div>
          </motion.div>
          
          <motion.h2
            className="text-4xl font-bold mb-4 leading-tight"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            Administration<br />Dashboard
          </motion.h2>

          <motion.p
            className="text-white/90 text-lg leading-relaxed"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            Gérez vos offres de voyage, utilisateurs et réservations 
            facilement depuis votre espace administrateur.
          </motion.p>
          
          <motion.div
            className="mt-8 flex gap-4"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5 }}
          >
            {['Gestion des vols', 'Utilisateurs', 'Réservations'].map((feature, index) => (
              <motion.div
                key={feature}
                className="flex items-center gap-2 group cursor-pointer"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <motion.div
                  className="w-2 h-2 bg-white/60 rounded-full"
                  whileHover={{ scale: 1.5, backgroundColor: "#ffffff" }}
                />
                <span className="text-sm text-white/80 group-hover:text-white transition-colors duration-300">{feature}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.p
          className="relative z-10 text-sm text-white/70"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.6 }}
        >
          © 2026 Traveling Agency. Tous droits réservés.
        </motion.p>
      </motion.div>

      {/* RIGHT SIDE - Animated with Framer Motion */}
      <motion.div
        variants={rightSideVariants}
        initial="hidden"
        animate="visible"
        className="flex w-full md:w-1/2 items-center justify-center p-6 md:p-8"
      >
        <motion.div
          className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 md:p-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}
        >
          <div className="text-center mb-8">
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#00C0E8]/10 to-[#0096b8]/10 rounded-2xl mb-4"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <UserCog className="w-8 h-8 text-[#00C0E8]" />
            </motion.div>
            <motion.h2
              className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Connexion Administrateur
            </motion.h2>
            <motion.p
              className="text-gray-500 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Accédez à votre espace de gestion
            </motion.p>
          </div>

          {/* Error message with animation */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: "auto" }}
                exit={{ opacity: 0, x: -20, height: 0 }}
                className="mb-6 p-4 bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 rounded-lg shadow-md overflow-hidden"
              >
                <div className="flex items-start gap-3">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <AlertCircle className="text-red-500 w-5 h-5 mt-0.5" />
                  </motion.div>
                  <div>
                    <p className="text-sm font-medium text-red-800">Erreur d'authentification</p>
                    <p className="text-sm text-red-600 mt-1">{error}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* EMAIL / IDENTIFIER */}
          <motion.div
            className="mb-5 group"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5 }}
          >
            <motion.label
              className="block text-sm font-medium text-gray-700 mb-2 transition-all duration-300"
              animate={{ color: focusedField === 'identifier' ? '#00C0E8' : '#374151' }}
            >
              Adresse email ou nom d'utilisateur
            </motion.label>

            <motion.div
              className={`flex items-center border rounded-lg px-4 py-2.5 transition-all duration-300 ${
                focusedField === 'identifier' 
                  ? 'border-[#00C0E8] ring-2 ring-[#00C0E8]/20 shadow-md' 
                  : 'border-gray-300'
              }`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <motion.div
                animate={{ scale: focusedField === 'identifier' ? 1.1 : 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Mail className={`text-gray-400 mr-3 flex-shrink-0 transition-all duration-300 ${
                  focusedField === 'identifier' ? 'text-[#00C0E8]' : ''
                }`} size={18} />
              </motion.div>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                onFocus={() => setFocusedField('identifier')}
                onBlur={() => setFocusedField(null)}
                onKeyPress={handleKeyPress}
                placeholder="admin@traveling.com"
                className="w-full outline-none bg-transparent text-gray-700 placeholder-gray-400"
                disabled={isLoading}
                autoComplete="username"
              />
            </motion.div>
          </motion.div>

          {/* PASSWORD */}
          <motion.div
            className="mb-5 group"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.6 }}
          >
            <motion.label
              className="block text-sm font-medium text-gray-700 mb-2 transition-all duration-300"
              animate={{ color: focusedField === 'password' ? '#00C0E8' : '#374151' }}
            >
              Mot de passe
            </motion.label>

            <motion.div
              className={`flex items-center border rounded-lg px-4 py-2.5 transition-all duration-300 ${
                focusedField === 'password' 
                  ? 'border-[#00C0E8] ring-2 ring-[#00C0E8]/20 shadow-md' 
                  : 'border-gray-300'
              }`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <motion.div
                animate={{ scale: focusedField === 'password' ? 1.1 : 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Lock className={`text-gray-400 mr-3 flex-shrink-0 transition-all duration-300 ${
                  focusedField === 'password' ? 'text-[#00C0E8]' : ''
                }`} size={18} />
              </motion.div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                onKeyPress={handleKeyPress}
                placeholder="Entrez votre mot de passe"
                className="w-full outline-none bg-transparent text-gray-700 placeholder-gray-400"
                disabled={isLoading}
                autoComplete="current-password"
              />
              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 p-1 hover:bg-gray-100 rounded-full transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="text-gray-400" size={18} />
                ) : (
                  <Eye className="text-gray-400" size={18} />
                )}
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Forgot Password Link */}
          <motion.div
            className="flex justify-end mb-8 text-sm"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.7 }}
          >
            <motion.button
              onClick={() => setIsForgotPasswordOpen(true)}
              className="text-[#00C0E8] hover:text-[#0096b8] transition-all duration-300"
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              Mot de passe oublié ?
            </motion.button>
          </motion.div>

          {/* BUTTON */}
          <motion.button
            onClick={handleLogin}
            disabled={isLoading}
            className="login-button w-full bg-gradient-to-r from-[#00C0E8] to-[#00a8cc] hover:from-[#00a8cc] hover:to-[#0096b8] text-white py-3 rounded-lg font-semibold transition-all duration-300 relative overflow-hidden group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.8 }}
          >
            <motion.span
              className="relative z-10 flex items-center justify-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              {isLoading ? (
                <>
                  <motion.div
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <span>Connexion en cours...</span>
                </>
              ) : (
                <>
                  <span>Se connecter</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </>
              )}
            </motion.span>
            {!isLoading && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.5 }}
              />
            )}
          </motion.button>

          {/* Additional Info */}
          <motion.div
            className="mt-8 pt-6 border-t border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="text-center">
              <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3 text-yellow-500" />
                Accès réservé aux administrateurs et agents autorisés
              </p>
              <div className="mt-3 flex justify-center gap-4">
                <span className="text-xs text-gray-400 hover:text-gray-600 transition-colors duration-300">🔒 Connexion sécurisée</span>
                <span className="text-xs text-gray-400 hover:text-gray-600 transition-colors duration-300">🛡️ Protection des données</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {isForgotPasswordOpen && (
          <>
            {/* Overlay */}
            <motion.div
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setIsForgotPasswordOpen(false)}
            />

            {/* Modal */}
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 mx-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">Mot de passe oublié</h3>
                  <motion.button
                    onClick={() => setIsForgotPasswordOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={24} />
                  </motion.button>
                </div>

                <p className="text-gray-600 mb-6">
                  Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                </p>

                {/* Reset success message */}
                <AnimatePresence>
                  {resetMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <p className="text-sm text-green-700">{resetMessage}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Reset error message */}
                <AnimatePresence>
                  {resetError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg"
                    >
                      <p className="text-sm text-red-700">{resetError}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse email
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2.5 focus-within:border-[#00C0E8] focus-within:ring-2 focus-within:ring-[#00C0E8]/20 transition-all duration-300">
                    <Mail className="text-gray-400 mr-3 flex-shrink-0" size={18} />
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="votre@email.com"
                      className="w-full outline-none bg-transparent text-gray-700"
                      disabled={isResetting}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleForgotPassword();
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    onClick={() => setIsForgotPasswordOpen(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Annuler
                  </motion.button>
                  <motion.button
                    onClick={handleForgotPassword}
                    disabled={isResetting}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-[#00C0E8] to-[#00a8cc] text-white rounded-lg font-medium hover:from-[#00a8cc] hover:to-[#0096b8] transition-all duration-300 disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isResetting ? (
                      <div className="flex items-center justify-center gap-2">
                        <motion.div
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <span>Envoi...</span>
                      </div>
                    ) : (
                      "Envoyer"
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}