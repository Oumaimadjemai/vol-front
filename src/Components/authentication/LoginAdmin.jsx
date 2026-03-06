import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Plane } from "lucide-react";

export default function LoginAdmin() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-100">
      
      {/* LEFT SIDE */}
      <div className="hidden md:flex w-1/2 bg-[#00C0E8] text-white flex-col justify-between p-12">
        
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-3 rounded-xl">
            <Plane size={28} />
          </div>
          <h1 className="text-2xl font-bold">Traveling!</h1>
        </div>

        <div className="max-w-md">
          <h2 className="text-4xl font-bold mb-4">
            Admin Dashboard
          </h2>

          <p className="text-white/80">
            Gérez vos offres de voyage, utilisateurs et réservations 
            facilement depuis votre espace administrateur.
          </p>
        </div>

        <p className="text-sm text-white/70">
          © 2026 Traveling Agency
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-8">
        
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          
          <h2 className="text-2xl font-bold mb-2 text-gray-800">
            Connexion
          </h2>

          <p className="text-gray-500 mb-6">
            Accédez à votre espace administrateur
          </p>

          {/* EMAIL */}
          <div className="mb-4">
            <label className="text-sm text-gray-600">
              Adresse email
            </label>

            <div className="flex items-center border rounded-lg px-3 py-2 mt-1">
              <Mail className="text-gray-400 mr-2" size={18} />
              <input
                type="email"
                placeholder="admin@agence.com"
                className="w-full outline-none"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="mb-4">
            <label className="text-sm text-gray-600">
              Mot de passe
            </label>

            <div className="flex items-center border rounded-lg px-3 py-2 mt-1">
              <Lock className="text-gray-400 mr-2" size={18} />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="********"
                className="w-full outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="text-gray-400" size={18} />
                ) : (
                  <Eye className="text-gray-400" size={18} />
                )}
              </button>
            </div>
          </div>

          {/* OPTIONS */}
          <div className="flex justify-between items-center mb-6 text-sm">
            <label className="flex items-center gap-2 text-gray-600">
              <input type="checkbox" />
              Se souvenir
            </label>

            <a
              href="/#"
              className="text-[#00C0E8] hover:underline"
            >
              Mot de passe oublié ?
            </a>
          </div>

          {/* BUTTON */}
          <button className="w-full bg-[#00C0E8] hover:bg-[#00a8cc] text-white py-3 rounded-lg font-semibold transition">
            Se connecter
          </button>

        </div>
      </div>
    </div>
  );
}