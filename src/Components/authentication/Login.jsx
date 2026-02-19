import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import loginImage from "../../assets/images/login.png"
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="h-auto flex ">

      
      <div className="hidden md:flex md:w-1/2">
        <img
          src={loginImage}
          alt="Login"
          className="w-full h-full object-cover"
        />
      </div>

     
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8  ">
        <div className="w-full max-w-sm  self-start mt-0">

          <p className="text-sm text-gray-600  mb-1">Bienvenue</p>

          <h2 className="text-2xl font-bold mb-3 font-playfair">
            Connectez-vous à votre compte
          </h2>

          
          <div className="mb-2">
            <label className="block text-sm mb-1">E-mail</label>
            <input
              type="email"
              placeholder="exemple@gmail.com"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00C0E8]"
            />
          </div>

          
          <div className="mb-2 relative">
            <label className="block text-sm mb-1">
              Mot de passe
            </label>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="**********"
              className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#00C0E8]"
            />

            <span
              className="absolute right-3 top-9 cursor-pointer text-gray-500 "
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="text-right mb-2">
            <a href="#" className="text-sm text-[#00C0E8] hover:underline">
              Mot de passe oublié ?
            </a>
          </div>

          <button className="w-full bg-[#00C0E8] text-white py-2 rounded-3xl hover:bg-sky-500 transition font-medium ">
            Connexion
          </button>

          {/* Divider */}
          <div className="my-4 flex items-center">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="px-3 text-sm text-gray-400">ou</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          <button className="w-full border border-gray-300 py-2 rounded-3xl bg-gray-100 hover:bg-gray-200 transition flex items-center justify-center space-x-2">
            <FcGoogle className="w-5 h-5" />
  <span>Continuer avec Google</span>
          </button>

          <p className="text-sm text-center mt-6 ">
            Vous n'avez pas un compte ?{" "}
            <a
              href="/signup"
              className="text-[#00C0E8] font-medium hover:underline"
            >
              Inscrivez-vous
            </a>
          </p>

        </div>
      </div>

    </div>
  );
}
