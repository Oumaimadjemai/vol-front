// Components/pages/TravelHub/Landing.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Globe, Users, Building2, Star, ArrowRight, CheckCircle,
  Award, Shield, Headphones, Plane, Cloud, Sun, Moon,
  TrendingUp, Map, CreditCard, Calendar, Clock, Coffee,
  ChevronRight, Rocket, Zap, Crown, Sparkles
} from 'lucide-react';

const agencies = [
  {
    id: 1,
    name: "Global Voyages",
    logo: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=100&h=100&fit=crop",
    rating: 4.8,
    reviews: 1234,
    description: "Expert en voyages internationaux depuis 2010",
    domains: ["global-voyages.com", "voyages.travel"],
    founded: 2010,
    cities: ["Paris", "London", "New York", "Tokyo"],
    coverImage: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=400&h=200&fit=crop"
  },
  {
    id: 2,
    name: "SkyHigh Travel",
    logo: "https://images.unsplash.com/photo-1542296332-2e4473faf563?w=100&h=100&fit=crop",
    rating: 4.9,
    reviews: 2345,
    description: "Voyages de luxe et expériences uniques",
    domains: ["skyhigh.com", "luxe.voyages"],
    founded: 2015,
    cities: ["Dubai", "Singapore", "Zurich", "Maldives"],
    coverImage: "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=400&h=200&fit=crop"
  },
  {
    id: 3,
    name: "Aventure Monde",
    logo: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=100&h=100&fit=crop",
    rating: 4.7,
    reviews: 876,
    description: "Spécialiste des voyages d'aventure",
    domains: ["aventure-monde.com", "wild.travel"],
    founded: 2018,
    cities: ["Bangkok", "Bali", "Costa Rica", "Peru"],
    coverImage: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=200&fit=crop"
  },
  {
    id: 4,
    name: "Business Travel Pro",
    logo: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=100&h=100&fit=crop",
    rating: 4.9,
    reviews: 3456,
    description: "Solutions de voyage d'affaires",
    domains: ["businesstravelpro.com", "corporate.travel"],
    founded: 2012,
    cities: ["Frankfurt", "Chicago", "Shanghai", "Sydney"],
    coverImage: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=400&h=200&fit=crop"
  },
  {
    id: 5,
    name: "Famille Voyage",
    logo: "https://images.unsplash.com/photo-1523914091968-9b038ff91234?w=100&h=100&fit=crop",
    rating: 4.8,
    reviews: 987,
    description: "Voyages en famille simplifiés",
    domains: ["famille-voyage.com", "family.travel"],
    founded: 2020,
    cities: ["Orlando", "Tokyo", "Barcelona", "Rome"],
    coverImage: "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=400&h=200&fit=crop"
  },
  {
    id: 6,
    name: "Luxury Escape",
    logo: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=100&h=100&fit=crop",
    rating: 5.0,
    reviews: 543,
    description: "Expériences de luxe exclusives",
    domains: ["luxury-escape.com", "elite.travel"],
    founded: 2008,
    cities: ["Monaco", "St. Moritz", "Bora Bora", "Milan"],
    coverImage: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=200&fit=crop"
  }
];

export default function TravelHubLanding() {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-900 via-blue-900 to-indigo-900">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Plane className={`h-8 w-8 ${isScrolled ? 'text-blue-600' : 'text-white'}`} />
              <span className={`text-2xl font-bold ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
                TravelHub
              </span>
            </div>
            <div className="hidden md:flex space-x-8">
              {[
                { name: 'Accueil', href: '#home' },
                { name: 'Fonctionnalités', href: '#features' },
                { name: 'Agences', href: '#agencies' },
                { name: 'Tarifs', href: '#pricing' },
                { name: 'Contact', href: '#contact' }
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`${isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white/90 hover:text-white'} transition`}
                >
                  {item.name}
                </a>
              ))}
            </div>
            <Link
              to="/travelhub/admin/login"
              className={`px-6 py-2 rounded-lg transition ${
                isScrolled 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
              }`}
            >
              Administration
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=1920&h=1080&fit=crop"
            alt="Sky"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/50 to-indigo-900"></div>
        </div>
        
        <div className="relative container mx-auto px-6 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 inline-flex items-center">
                <Rocket className="h-5 w-5 mr-2" />
                <span className="text-sm">Lancez votre agence aujourd'hui</span>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Créez Votre Propre
              <span className="bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent">
                {" "}Agence de Voyage
              </span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Tout ce dont vous avez besoin pour lancer, gérer et développer votre agence de voyage.
              Obtenez votre plateforme personnalisée avec un contrôle total.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/travelhub/plans"
                className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg text-lg font-semibold hover:from-sky-600 hover:to-blue-700 transition group"
              >
                Commencer
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center px-8 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg text-lg font-semibold hover:bg-white/30 transition"
              >
                En savoir plus
              </a>
            </div>
          </motion.div>
        </div>
        
        {/* Floating clouds animation */}
        <div className="absolute bottom-20 left-0 right-0">
          <div className="flex justify-center space-x-4 animate-bounce">
            <Cloud className="h-8 w-8 text-white/30" />
            <Cloud className="h-12 w-12 text-white/20" />
            <Cloud className="h-6 w-6 text-white/40" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Building2, value: "500+", label: "Agences Actives" },
              { icon: Users, value: "50K+", label: "Clients Satisfaits" },
              { icon: Plane, value: "1M+", label: "Vols Réservés" },
              { icon: Star, value: "98%", label: "Taux de Satisfaction" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-800">{stat.value}</div>
                <div className="text-gray-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Fonctionnalités Puissantes</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Tout ce dont votre agence a besoin pour réussir
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Building2, title: "Solution White-Label", desc: "Votre marque, votre domaine, contrôle total", color: "from-blue-500 to-cyan-500" },
              { icon: CreditCard, title: "Paiements Intégrés", desc: "Stripe, PayPal et plus", color: "from-purple-500 to-pink-500" },
              { icon: Shield, title: "Sécurité Garantie", desc: "Sécurité niveau entreprise", color: "from-green-500 to-emerald-500" },
              { icon: Headphones, title: "Support 24/7", desc: "Assistance dédiée", color: "from-orange-500 to-red-500" },
              { icon: TrendingUp, title: "Tableaux de Bord", desc: "Analyses en temps réel", color: "from-indigo-500 to-purple-500" },
              { icon: Users, title: "Multi-utilisateurs", desc: "Gestion d'équipe avec rôles", color: "from-rose-500 to-pink-500" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition group"
              >
                <div className={`bg-gradient-to-r ${feature.color} w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Agencies Showcase */}
      <section id="agencies" className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Agences Partners</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Rejoignez plus de 500 agences qui nous font confiance
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agencies.map((agency, idx) => (
              <motion.div
                key={agency.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gray-800 rounded-xl overflow-hidden hover:shadow-2xl transition-all hover:scale-105"
              >
                <img src={agency.coverImage} alt={agency.name} className="w-full h-32 object-cover" />
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <img src={agency.logo} alt={agency.name} className="w-12 h-12 rounded-full mr-3 border-2 border-blue-500" />
                    <div>
                      <h3 className="font-semibold text-white">{agency.name}</h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-400 ml-1">{agency.rating}</span>
                        <span className="text-gray-500 text-sm ml-2">({agency.reviews})</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">{agency.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {agency.cities.slice(0, 3).map((city, i) => (
                      <span key={i} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">📍 {city}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tarifs Transparents</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choisissez le plan qui correspond à vos besoins
            </p>
          </div>
          <div className="flex justify-center mb-12">
            <Link
              to="/travelhub/plans"
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg text-lg font-semibold hover:from-sky-600 hover:to-blue-700 transition"
            >
              Voir nos offres
              <ChevronRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-sky-600 to-blue-700">
        <div className="container mx-auto px-6 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Prêt à Décoller ?</h2>
          <p className="text-xl mb-8 opacity-90">Rejoignez TravelHub aujourd'hui et lancez votre agence</p>
          <Link
            to="/travelhub/plans"
            className="inline-flex items-center px-8 py-3 bg-white text-blue-600 rounded-lg text-lg font-semibold hover:bg-gray-100 transition"
          >
            Commencer maintenant
            <Rocket className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Plane className="h-6 w-6 text-sky-400" />
                <span className="text-xl font-bold">TravelHub</span>
              </div>
              <p className="text-gray-400">La plateforme ultime pour les agences de voyage</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produit</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition">Fonctionnalités</a></li>
                <li><a href="#pricing" className="hover:text-white transition">Tarifs</a></li>
                <li><a href="#agencies" className="hover:text-white transition">Agences</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Entreprise</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">À propos</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Confidentialité</a></li>
                <li><a href="#" className="hover:text-white transition">Conditions</a></li>
                <li><a href="#" className="hover:text-white transition">Sécurité</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TravelHub. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}