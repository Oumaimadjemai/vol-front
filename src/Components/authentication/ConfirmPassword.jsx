// ResetPassword.jsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Lock, CheckCircle } from 'lucide-react';
import msAuthInstance from "../../api/axiosInstance";

export default function ResetPassword() {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (password !== passwordConfirm) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }
    
    setLoading(true);
    try {
      // Call the password reset confirm endpoint
      const response = await msAuthInstance.post("password-reset/confirm/", {
        uid,
        token,
        password,
        password_confirm: passwordConfirm
      });
      
      console.log("Password reset successful:", response.data);
      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/");
      }, 3000);
      
    } catch (err) {
      console.error("Reset error:", err.response?.data);
      
      // Handle specific error messages
      if (err.response?.status === 400) {
        setError(err.response?.data?.message || "Lien invalide ou expiré");
      } else {
        setError("Une erreur s'est produite. Veuillez réessayer.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        {!success ? (
          <>
            <div className="mb-6 flex justify-center">
  <div className="w-16 h-16 bg-gradient-to-br from-[#00C0E8] to-[#0098d1] rounded-2xl flex items-center justify-center">
    <Lock className="w-8 h-8 text-white" />
  </div>
</div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
              Nouveau mot de passe
            </h2>
            <p className="text-gray-600 text-sm mb-8 text-center">
              Entrez votre nouveau mot de passe ci-dessous.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C0E8]"
                  placeholder="********"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C0E8]"
                  placeholder="********"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#00C0E8] text-white py-3 rounded-lg hover:bg-sky-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Chargement..." : "Réinitialiser le mot de passe"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Mot de passe modifié !
            </h3>
            <p className="text-gray-600 mb-4">
              Votre mot de passe a été réinitialisé avec succès.
            </p>
            <p className="text-sm text-gray-500">
              Redirection vers la page de connexion...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}