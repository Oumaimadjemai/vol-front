import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import loginImage from "../../assets/images/login.png";
import { FcGoogle } from "react-icons/fc";
import msAuthInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
export default function Login({ onLoginSuccess, onSwitchToSignup, onSwitchToReset }) {
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
const {t}=useTranslation();
  const handleLogin = async () => {
    // Basic validation
    if (!identifier.trim() || !password.trim()) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await msAuthInstance.post("auth-service/auth/login/", {
        identifier,
        password,
      });
      
      console.log("login success", response);
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("voyageur", JSON.stringify(response.data.voyageur));
      onLoginSuccess();
    } catch (err) {
      console.error("Login error:", err);
      
      // Handle different error scenarios
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (err.response.status === 401) {
          setError("Email ou mot de passe incorrect");
        } else if (err.response.data && err.response.data.non_field_errors) {
          // Handle the specific error format from your backend
          setError(err.response.data.non_field_errors[0] || "Email ou mot de passe incorrect");
        } else if (err.response.data && err.response.data.detail) {
          setError(err.response.data.detail);
        } else {
          setError("Une erreur est survenue lors de la connexion");
        }
      } else if (err.request) {
        // The request was made but no response was received
        setError("Impossible de contacter le serveur. Vérifiez votre connexion.");
      } else {
        // Something happened in setting up the request that triggered an Error
        setError("Une erreur inattendue s'est produite");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href =
      "http://localhost:8000/auth/accounts/google/login/?process=signup";
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="h-auto flex ">
      <div className="hidden md:flex md:w-1/2">
        <img
          src={loginImage}
          alt="Login"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-sm self-start mt-0">
          <p className="text-sm text-gray-600 mb-1">{t("login_welcome")}</p>

          <h2 className="text-2xl font-bold mb-3 font-playfair">
            {t("login_subtitle")}
          </h2>

          {/* Error message display */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="mb-2">
            <label className="block text-sm mb-1">E-mail ou nom d'utilisateur</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="exemple@gmail.com"
              className={`w-full border ${error ? 'border-red-300' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00C0E8]`}
              disabled={isLoading}
            />
          </div>

          <div className="mb-2 relative">
            <label className="block text-sm mb-1">Mot de passe</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="**********"
              className={`w-full border ${error ? 'border-red-300' : 'border-gray-300'} rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#00C0E8]`}
              disabled={isLoading}
            />
            <span
              className="absolute right-3 top-9 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="text-right mb-2">
            <button
              onClick={() => {
                if (onSwitchToReset) {
                  onSwitchToReset();
                } else {
                  navigate("/forgot-password");
                }
              }}
              className="text-sm text-[#00C0E8] hover:underline"
              disabled={isLoading}
            >
              Mot de passe oublié ?
            </button>
          </div>

          <button
            onClick={handleLogin}
            disabled={isLoading}
            className={`w-full bg-[#00C0E8] text-white py-2 rounded-3xl transition font-medium ${
              isLoading 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-sky-500'
            }`}
          >
            {isLoading ? 'Connexion en cours...' : 'Connexion'}
          </button>

          {/* Divider */}
          <div className="my-4 flex items-center">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="px-3 text-sm text-gray-400">ou</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full border border-gray-300 py-2 rounded-3xl bg-gray-100 hover:bg-gray-200 transition flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FcGoogle className="w-5 h-5" />
            <span>Continuer avec Google</span>
          </button>

          <p className="text-sm text-center mt-6">
            Vous n'avez pas un compte ?{" "}
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="text-[#00C0E8] font-medium hover:underline"
              disabled={isLoading}
            >
              Inscrivez-vous
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}