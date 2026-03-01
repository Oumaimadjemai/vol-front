import { Search, Home, ArrowLeft, MapPin } from 'lucide-react';

export default function NotFound() {
  const handleGoHome = () => {
    // Navigate to home page
    
  };

  const handleGoBack = () => {
    // Go back in history
    
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-white via-gray-50 to-blue-50">
      <div className="w-full max-w-2xl text-center">
        {/* 404 Number with Icon */}
        <div className="mb-8 flex items-center justify-center gap-4">
          <div className="relative">
            <div className="text-[120px] font-bold text-gray-200 leading-none">
              4
            </div>
          </div>
          
          <div className="relative">
            <div className="w-28 h-28 bg-gradient-to-br from-[#00C0E8] to-[#0098d1] rounded-full flex items-center justify-center shadow-xl shadow-[#00C0E8]/30 animate-in zoom-in duration-500">
              <Search className="w-14 h-14 text-white" />
            </div>
            <div className="absolute inset-0 bg-[#00C0E8] rounded-full animate-ping opacity-20"></div>
          </div>
          
          <div className="relative">
            <div className="text-[120px] font-bold text-gray-200 leading-none">
              4
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl mb-4 text-gray-900">
            Page introuvable
          </h1>
          <p className="text-gray-600 text-lg mb-2">
            Oups ! La page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          <p className="text-gray-500">
            Il semble que cette destination ne soit pas sur notre carte...
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-[#00C0E8]/20 rounded-2xl p-6 mb-8 shadow-sm max-w-md mx-auto">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-[#00C0E8] mt-1 flex-shrink-0" />
            <div className="text-left">
              <p className="text-gray-700 leading-relaxed">
                Vérifiez l'URL ou retournez à la page d'accueil pour continuer votre navigation.
              </p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3 max-w-md mx-auto">
          <button
            onClick={handleGoHome}
            className="w-full py-4 bg-gradient-to-r from-[#00C0E8] to-[#0098d1] text-white rounded-xl hover:shadow-lg hover:shadow-[#00C0E8]/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Retour à l'accueil
          </button>
          
          <button
            onClick={handleGoBack}
            className="w-full py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-[#00C0E8] hover:text-[#00C0E8] transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Page précédente
          </button>
        </div>

        {/* Additional Links */}
        <div className="mt-10 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-4">
            Liens utiles :
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <button 
              onClick={handleGoHome}
              className="text-[#00C0E8] hover:underline"
            >
              Accueil
            </button>
            <span className="text-gray-300">|</span>
            <button 
              onClick={handleGoHome}
              className="text-[#00C0E8] hover:underline"
            >
              Destinations
            </button>
            <span className="text-gray-300">|</span>
            <button 
              onClick={handleGoHome}
              className="text-[#00C0E8] hover:underline"
            >
              Contact
            </button>
            <span className="text-gray-300">|</span>
            <button 
              onClick={handleGoHome}
              className="text-[#00C0E8] hover:underline"
            >
              Aide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
