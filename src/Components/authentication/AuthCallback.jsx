// src/components/AuthCallback.jsx
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extraire les tokens de l'URL
    const params = new URLSearchParams(location.search);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const error = params.get('error');

    if (accessToken && refreshToken) {
      // Stocker les tokens (dans localStorage, context, etc.)
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
      
      // Rediriger vers la page d'accueil ou dashboard
      navigate('/');
    } else if (error) {
      // Gérer l'erreur
      console.error('Auth error:', error);
      navigate('/signin?error=auth_failed');
    }
  }, [location, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00C0E8] mx-auto"></div>
        <p className="mt-4 text-gray-600">Traitement de l'authentification...</p>
      </div>
    </div>
  );
}