// Components/pages/TripHubDz/Landing.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  Globe,
  Users,
  Building2,
  Star,
  ArrowRight,
  CheckCircle,
  Award,
  Shield,
  Headphones,
  Plane,
  Cloud,
  Sun,
  Moon,
  TrendingUp,
  Map,
  CreditCard,
  Calendar,
  Clock,
  Coffee,
  ChevronRight,
  Rocket,
  Zap,
  Crown,
  Sparkles,
  Menu,
  X,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Quote,
  Play,
  Pause,
  Heart,
  ThumbsUp,
} from "lucide-react";
import trip from "../../../assets/images/triphub.png";

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
    coverImage:
      "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=400&h=200&fit=crop",
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
    coverImage:
      "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=400&h=200&fit=crop",
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
    coverImage:
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=200&fit=crop",
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
    coverImage:
      "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=400&h=200&fit=crop",
  },
  {
    id: 5,
    name: "Famille Voyage",
    logo: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=100&h=100&fit=crop",
    rating: 4.8,
    reviews: 987,
    description: "Voyages en famille simplifiés",
    domains: ["famille-voyage.com", "family.travel"],
    founded: 2020,
    cities: ["Orlando", "Tokyo", "Barcelona", "Rome"],
    coverImage:
      "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=400&h=200&fit=crop",
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
    coverImage:
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=200&fit=crop",
  },
];

const testimonials = [
  {
    id: 1,
    name: "Djemai oumima",
    role: "CEO, Global Voyages",
    content:
      "TripHubDz a transformé notre façon de gérer les voyages. Notre productivité a augmenté de 150%!",
    rating: 4,
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    id: 2,
    name: "Taibi Narimane",
    role: "Director, SkyHigh Travel",
    content:
      "La meilleure plateforme pour les agences de voyage. Support exceptionnel et fonctionnalités puissantes.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    id: 3,
    name: "Emma Wilson",
    role: "Owner, Luxury Escape",
    content:
      "Grâce à TripHubDz, nous avons doublé notre chiffre d'affaires en 6 mois. Hautement recommandé!",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
  },
];

// Hero background images array for rotation
const heroImages = [
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1920&h=1080&fit=crop",
  "https://i.pinimg.com/1200x/5a/5c/6f/5a5c6f66177e18233a5f6349fd72901a.jpg"
  
];

export default function TripHubDzLanding() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [activeSection, setActiveSection] = useState("home");
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Detect active section based on scroll position
      const sections = ["home", "features", "agencies", "pricing", "contact"];
      const scrollPosition = window.scrollY + 100;
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    
    window.addEventListener("scroll", handleScroll);

    // Auto-rotate testimonials
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    // Auto-rotate hero images every 5 seconds
    const heroInterval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(interval);
      clearInterval(heroInterval);
    };
  }, []);

  const features = [
    {
      icon: Building2,
      title: "Solution White-Label",
      desc: "Votre marque, votre domaine, contrôle total",
      color: "from-blue-500 to-cyan-500",
      gradient: "from-blue-600 to-blue-400",
    },
    {
      icon: CreditCard,
      title: "Paiements Intégrés",
      desc: "Chargily, paiement a la livraison, cashe",
      color: "from-purple-500 to-pink-500",
      gradient: "from-purple-600 to-purple-400",
    },
    {
      icon: Shield,
      title: "Sécurité Garantie",
      desc: "Sécurité niveau entreprise",
      color: "from-green-500 to-emerald-500",
      gradient: "from-green-600 to-green-400",
    },
    {
      icon: Headphones,
      title: "Support 24/7",
      desc: "Assistance dédiée",
      color: "from-orange-500 to-red-500",
      gradient: "from-orange-600 to-orange-400",
    },
    {
      icon: TrendingUp,
      title: "Tableaux de Bord",
      desc: "Analyses en temps réel",
      color: "from-indigo-500 to-purple-500",
      gradient: "from-indigo-600 to-indigo-400",
    },
    {
      icon: Users,
      title: "Multi-utilisateurs",
      desc: "Gestion d'équipe avec rôles",
      color: "from-rose-500 to-pink-500",
      gradient: "from-rose-600 to-rose-400",
    },
  ];

  const stats = [
    { icon: Building2, value: "500+", label: "Agences Actives", delay: 0 },
    { icon: Users, value: "50K+", label: "Clients Satisfaits", delay: 0.1 },
    { icon: Plane, value: "1M+", label: "Vols Réservés", delay: 0.2 },
    { icon: Star, value: "98%", label: "Taux de Satisfaction", delay: 0.3 },
  ];

  const navItems = [
    { name: "Accueil", id: "home" },
    { name: "Fonctionnalités", id: "features" },
    { name: "Agences", id: "agencies" },
    { name: "Tarifs", id: "pricing" },
    { name: "Contact", id: "contact" },
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-xl"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <img
                src={trip}
                alt="TripHubDz"
                className={`h-10 w-auto transition-all duration-300 ${
                  isScrolled ? "h-14" : "h-16"
                }`}
              />
            </motion.div>

            {/* Desktop Menu with active section indicator */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={`#${item.id}`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative group transition-all duration-300 font-medium ${
                    isScrolled 
                      ? activeSection === item.id 
                        ? "text-[#00C0E8]" 
                        : "text-gray-700 hover:text-[#00C0E8]"
                      : activeSection === item.id
                      ? "text-[#00C0E8]"
                      : "text-gray-400 hover:text-[#00C0E8]"
                  }`}
                >
                  {item.name}
                  {/* Underline indicator for active/hover state */}
                  <span
                    className={`absolute -bottom-1 left-0 w-full h-0.5 bg-[#00C0E8] transition-all duration-300 ${
                      activeSection === item.id
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </motion.a>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-[#00C0E8] p-2 rounded-lg hover:bg-white/10 transition"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu with active section */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white/95 backdrop-blur-md border-t"
            >
              <div className="container mx-auto px-4 py-4 space-y-3">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={`#${item.id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-2 transition-all duration-300 ${
                      activeSection === item.id
                        ? "text-[#00C0E8] font-semibold border-l-4 border-[#00C0E8] pl-3"
                        : "text-gray-800 hover:text-[#00C0E8] pl-4"
                    }`}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section with rotating background images */}
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/50 z-10"></div>
          
          {/* Rotating hero background images */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentHeroImage}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0"
            >
              <img
                src={heroImages[currentHeroImage]}
                alt="Travel Background"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>
          
          {/* Animated particles */}
          <div className="absolute inset-0 z-20">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-[#00C0E8] rounded-full"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 0.5, 0],
                  y: [0, -100],
                  x: Math.random() * window.innerWidth,
                }}
                transition={{
                  duration: Math.random() * 5 + 3,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Hero content */}
        <div className="relative container mx-auto px-6 text-center text-white z-30">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="flex justify-center mb-6"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="bg-white/20 backdrop-blur-md rounded-full px-6 py-2 inline-flex items-center shadow-lg">
                <Rocket className="h-5 w-5 mr-2 animate-pulse text-[#00C0E8]" />
                <span className="text-sm font-medium">
                  ✨ Lancez votre agence aujourd'hui
                </span>
              </div>
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
              Créez Votre Propre
              <span className="bg-gradient-to-r from-[#00C0E8] via-[#00C0E8] to-indigo-600 bg-clip-text text-transparent block mt-2 mb-6">
                Agence de Voyage
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-200 mt-8 max-w-3xl mx-auto leading-relaxed" mb-8>
              Tout ce dont vous avez besoin pour lancer, gérer et développer
              votre agence de voyage. Obtenez votre plateforme personnalisée
              avec un contrôle total.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/TripHubDz/signup"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-[#f2541d] text-white rounded-full text-lg font-semibold hover:from-orange-500 hover:to-[#f2541d] hover:text-[#00c0e8] transition-all duration-300 shadow-xl hover:shadow-2xl group"
                >
                  Créer mon agence
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-all duration-300" />
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a
                  href="#features"
                  className="inline-flex items-center px-8 py-4 bg-white/20 backdrop-blur-md text-[#f2541d] rounded-full text-lg font-semibold hover:bg-white/30 transition-all duration-300 border border-white/30"
                >
                  En savoir plus
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Image indicator dots */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentHeroImage(index)}
              className={`transition-all duration-300 rounded-full ${
                currentHeroImage === index
                  ? "w-8 h-2 bg-[#00C0E8]"
                  : "w-2 h-2 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-[#00C0E8] rounded-full mt-2 animate-bounce"></div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section with Counter Animation */}
      <section className="py-20 bg-gradient-to-br from-white to-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: stat.delay }}
                className="text-center p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                  <stat.icon className="h-14 w-14 text-[#f2541d] mx-auto mb-4 relative group-hover:scale-110 transition-transform duration-300" />
                </div>
                <motion.div
                  className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: stat.delay + 0.2 }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section with 3D Cards */}
      <section
        id="features"
        className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2  rounded-full mb-4 shadow-xl">
              <Sparkles className="h-4 w-4 text-[#00c0e8] mr-2" />
              <span className="text-[#00c0e8] text-sm font-semibold">
                Fonctionnalités Premium
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#f2541d] to-orange-400 bg-clip-text text-transparent">
              Fonctionnalités Puissantes
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Tout ce dont votre agence a besoin pour réussir dans un
              environnement compétitif
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                onHoverStart={() => setHoveredFeature(index)}
                onHoverEnd={() => setHoveredFeature(null)}
                className="bg-white rounded-2xl shadow-xl overflow-hidden group cursor-pointer relative"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                ></div>
                <div className="p-8">
                  <div
                    className={`bg-gradient-to-r ${feature.color} w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg`}
                  >
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.desc}
                  </p>
                  <motion.div
                    className="mt-4 flex items-center text-[#00c0e8] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ x: -10 }}
                    whileHover={{ x: 0 }}
                  >
                    <span className="text-sm font-medium ">En savoir plus</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-[#00c0e8] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full filter blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Ce que disent nos clients
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Découvrez les expériences des agences qui nous font confiance
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="bg-white rounded-2xl p-8 shadow-2xl"
              >
                <Quote className="h-12 w-12 text-blue-600 mb-6 opacity-50" />
                <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                  "{testimonials[activeTestimonial].content}"
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={testimonials[activeTestimonial].avatar}
                      alt={testimonials[activeTestimonial].name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-gray-800">
                        {testimonials[activeTestimonial].name}
                      </h4>
                      <p className="text-gray-500 text-sm">
                        {testimonials[activeTestimonial].role}
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    {[...Array(testimonials[activeTestimonial].rating)].map(
                      (_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 text-yellow-400 fill-current"
                        />
                      ),
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    activeTestimonial === index ? "w-8 bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Agencies Showcase with Carousel */}
      <section
        id="agencies"
        className="py-24 bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden"
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        <div className="container mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 bg-white/10 rounded-full mb-4 backdrop-blur-sm">
              <Users className="h-4 w-4 text-[#f2541d] mr-2" />
              <span className="text-[#f2541d] text-sm font-semibold">
                Nos Partenaires
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Agences Partners
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Rejoignez plus de 500 agences qui nous font confiance dans le
              monde entier
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {agencies.map((agency, idx) => (
              <motion.div
                key={agency.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={agency.coverImage}
                    alt={agency.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <img
                      src={agency.logo}
                      alt={agency.name}
                      className="w-14 h-14 rounded-full mr-4 border-2 border-blue-500 object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-white text-lg">
                        {agency.name}
                      </h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-300 ml-1">
                          {agency.rating}
                        </span>
                        <span className="text-gray-500 text-sm ml-2">
                          ({agency.reviews} avis)
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {agency.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {agency.cities.slice(0, 3).map((city, i) => (
                      <span
                        key={i}
                        className="text-xs bg-gray-700 text-gray-300 px-3 py-1 rounded-full"
                      >
                        📍 {city}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section with Cards */}
      <section
        id="pricing"
        className="py-24 bg-gradient-to-br from-white to-gray-50"
      >
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full mb-4">
              <Crown className="h-4 w-4 text-green-600 mr-2" />
              <span className="text-green-600 text-sm font-semibold">
                Tarifs Transparents
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Plans Adaptés à Vos Besoins
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Choisissez le plan qui correspond à la taille et aux objectifs de
              votre agence
            </p>
          </motion.div>

          <div className="flex justify-center mb-12">
            <motion.div whileHover={{ scale: 1.05 }} className="relative">
              <Link
                to="/TripHubDz/plans"
                className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-[#00c0e8] to-blue-600 text-white rounded-full text-lg font-semibold hover:from-sky-600 hover:to-blue-700 transition-all duration-300 shadow-xl hover:shadow-2xl group"
              >
                Voir tous nos plans
                <ChevronRight className="ml-2 group-hover:translate-x-1 transition-all duration-300" />
              </Link>
              <div className="absolute inset-0 bg-gradient-to-r from-[#00c0e8] to-blue-600 rounded-full blur-xl opacity-50 -z-10"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section with Parallax */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1920&h=600&fit=crop"
            alt="Travel"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-indigo-900/90"></div>
        </div>

        <div className="relative container mx-auto px-6 text-center text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-4">
              Prêt à Décoller ?
            </h2>
            <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Rejoignez plus de 500 agences qui ont déjà transformé leur
              activité avec TripHubDz
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/TripHubDz/signup"
                className="inline-flex items-center px-10 py-4 bg-white text-blue-600 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl group"
              >
                Commencer maintenant
                <Rocket className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-all duration-300" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer with Social Links */}
      <footer className="bg-gray-900 text-white py-16 px-6" id="Contact">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full blur"></div>
                  <Plane className="h-8 w-8 relative text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  TripHubDz
                </span>
              </div>
              <p className="text-gray-400 mb-4 leading-relaxed">
                La plateforme ultime pour les agences de voyage. Simplifiez la
                gestion et boostez votre croissance.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-blue-400 hover:text-white transition-all duration-300 hover:scale-110"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-yellow-400 hover:text-white transition-all duration-300 hover:scale-110"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-pink-400 hover:text-white transition-all duration-300 hover:scale-110"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-blue-400 hover:text-white transition-all duration-300 hover:scale-110"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-lg text-[#f2541d]">Produit</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a
                    href="#features"
                    className=" hover:text-[#f2541d] transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    Fonctionnalités
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="hover:text-[#f2541d] transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    Tarifs
                  </a>
                </li>
                <li>
                  <a
                    href="#agencies"
                    className="hover:text-[#f2541d] transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    Agences
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-[#f2541d] transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-lg text-[#f2541d]">Entreprise</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-[#f2541d] transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    À propos
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-[#f2541d] transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-[#f2541d] transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    Carrières
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-[#f2541d] transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-lg text-[#f2541d]">Contact</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>contact@TripHubDz.com</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>+213 123 456 789</span>
                </li>
                <li className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Algiers, Algeria</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-[#00c0e8]">
            <p>
              &copy; 2024 TripHubDz. Tous droits réservés. Créé avec ❤️ pour les
              agences de voyage.
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .bg-grid-pattern {
          background-image:
            linear-gradient(to right, #e5e7eb 1px, transparent 1px),
            linear-gradient(to bottom, #e5e7eb 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
    </div>
  );
}
