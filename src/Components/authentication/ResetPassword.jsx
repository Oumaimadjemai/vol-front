import { useState } from "react";
import { Mail, CheckCircle, ArrowLeft } from "lucide-react";
import msAuthInstance from "../../api/axiosInstance";

export default function ForgotPassword({
  onBackToLogin,
  onSwitchToLogin,
  handleBackToLogin,
}) {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

   const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError("Veuillez entrer votre adresse e-mail");
      return;
    }
    
    setLoading(true);
    try {
      // Call the password reset endpoint
      const response = await msAuthInstance.post("password-reset/", { email });
      console.log("Reset email sent:", response.data);
      setIsSubmitted(true);
      setError("");
    } catch (err) {
      console.error("Reset error:", err.response?.data);
      
      // Handle different error responses
      if (err.response?.status === 400) {
        setError(err.response?.data?.email?.[0] || "Email invalide");
      } else if (err.response?.status === 404) {
        setError("Aucun compte trouvé avec cet email");
      } else {
        setError("Une erreur s'est produite. Veuillez réessayer.");
      }
    } finally {
      setLoading(false);
    }
  };
  const handleResend = async () => {
    setLoading(true);
    try {
      await msAuthInstance.post("password-reset/", { email });
      // Show success message (you can use a toast notification here)
      alert("Email renvoyé avec succès!");
    } catch (err) {
      setError("Impossible de renvoyer l'email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Back to login link */}
        <button
          onClick={onBackToLogin || onSwitchToLogin}
          className="flex items-center text-gray-500 hover:text-[#00C0E8] transition-colors mb-2 group"
        >
          <ArrowLeft className="mr-2 text-sm group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Retour à la connexion</span>
        </button>

        {!isSubmitted ? (
          <>
            {/* Header */}
            <div className="text-center">
              {" "}
              <div className="mt-4 flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#00C0E8] to-[#0098d1] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-[#00C0E8]/20">
                  <Mail className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 font-playfair">
                Mot de passe oublié ?
              </h2>
              <p className="text-gray-600 text-sm">
                Pas de souci ! Entrez votre adresse e-mail et nous vous
                enverrons un lien de réinitialisation.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Adresse e-mail
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-[#00C0E8]" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    placeholder="exemple@email.com"
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      error ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C0E8] focus:border-transparent transition`}
                  />
                </div>
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
              </div>

              {/* Submit button */}
               <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#00C0E8] text-white py-3 px-4 rounded-lg hover:bg-sky-500 transition font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00C0E8] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-[#00C0E8] to-[#0098d1] rounded-full flex items-center justify-center shadow-md shadow-[#00C0E8]/30 animate-in zoom-in duration-300">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <div className="absolute inset-0 bg-[#00C0E8] rounded-full animate-ping opacity-20"></div>
              </div>
            </div>

            <h1 className="text-4xl mb-4 text-gray-900">E-mail envoyé !</h1>

            <p className="text-gray-600 mb-2 text-lg">
              Nous avons envoyé un lien de réinitialisation à :
            </p>

            <p className="text-[#00C0E8] mb-8 text-lg">{email}</p>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-[#00C0E8]/20 rounded-2xl p-4 mb-6 shadow-sm">
              <p className="text-gray-700 leading-relaxed">
                Vérifiez votre boîte de réception et cliquez sur le lien pour
                créer un nouveau mot de passe.
              </p>
              <p className="text-sm text-gray-600 mt-3">
                Le lien expirera dans{" "}
                <span className="text-[#00C0E8]">24 heures</span>
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleBackToLogin}
                className="w-full py-3 bg-gradient-to-r from-[#00C0E8] to-[#0098d1] text-white rounded-xl hover:shadow-lg hover:shadow-[#00C0E8]/30 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Retour à la connexion
              </button>

              <button
                onClick={handleResend}
                disabled={loading}
                className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-[#00C0E8] hover:text-[#00C0E8] transition-all disabled:opacity-50"
              >
                {loading ? "Envoi..." : "Renvoyer l'e-mail"}
              </button>
            </div>
          </div>
        )}

        {/* Remember password link */}
        {!isSubmitted && (
          <p className="mt-6 text-center text-sm text-gray-600">
            Vous vous souvenez de votre mot de passe ?{" "}
            <button
              onClick={onSwitchToLogin}
              className="text-[#00C0E8] hover:text-sky-600 font-medium"
            >
              Connectez-vous
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
