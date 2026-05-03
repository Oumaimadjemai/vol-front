// Components/pages/TravelHub/SuperAdminLogin.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Lock, Mail, Shield, Sparkles } from 'lucide-react';

export default function SuperAdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Demo credentials
    if (email === 'admin@travelhub.com' && password === 'admin123') {
      localStorage.setItem('super_admin_token', 'demo_token_123');
      localStorage.setItem('super_admin_email', email);
      navigate('/travelhub/admin/dashboard');
    } else {
      setError('Email ou mot de passe incorrect');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-sky-900 via-blue-900 to-indigo-900">
      {/* Animated background */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=1920&h=1080&fit=crop"
          className="w-full h-full object-cover opacity-20"
          alt="Sky"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-sky-900/80 via-blue-900/80 to-indigo-900/80"></div>
      </div>
      
      {/* Floating plane animation */}
      <div className="absolute top-20 left-10 animate-float">
        <Plane className="h-16 w-16 text-white/20" />
      </div>
      <div className="absolute bottom-20 right-10 animate-float-delayed">
        <Sparkles className="h-12 w-12 text-yellow-400/20" />
      </div>
      
      <div className="relative min-h-screen flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-fadeIn">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-sky-500 to-blue-500 rounded-2xl mb-4 shadow-lg">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
              TravelHub Admin
            </h1>
            <p className="text-gray-500 mt-2">Plateforme de gestion des agences</p>
          </div>
          
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="admin@travelhub.com"
                  required
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-sky-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-sky-600 hover:to-blue-600 transition shadow-lg"
            >
              Connexion
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Compte de démo: admin@travelhub.com / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
}