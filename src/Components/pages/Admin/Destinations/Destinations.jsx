import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { GiCommercialAirplane, GiEarthAmerica, GiIsland } from 'react-icons/gi';
import { FaPassport, FaPlaneDeparture, FaStar, FaMapMarkerAlt, FaCalendarAlt, FaTag, FaPercent } from 'react-icons/fa';
import { HiUsers } from 'react-icons/hi';
import axiosInstance from "../../../../api/axiosInstance";

export function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [offres, setOffres] = useState([]);
  const [activeTab, setActiveTab] = useState("destinations");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemType, setItemType] = useState("destination");
  const [isLoading, setIsLoading] = useState(true);
  
  // Form data for destinations
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    continent: "",
    imageUrl: "",
    rating: "",
    country: "",
    city: "",
    discount_percentage: 0,
    is_popular: false,
    tags: "",
  });

  // Form data for offres (special offers)
  const [offreFormData, setOffreFormData] = useState({
    title: "",
    location: "",
    description: "",
    originalPrice: "",
    offerPrice: "",
    imageUrl: "",
    duration_days: "",
    startDate: "",
    endDate: "",
    is_active: true,
    is_featured: false,
    offer_type: "SEASONAL",
    includes: "",
    excludes: "",
    destination_id: "",
  });

  // Offer types
  const offerTypes = [
    { value: "FLASH", label: "Offre Flash" },
    { value: "SEASONAL", label: "Offre Saisonnière" },
    { value: "WEEKEND", label: "Offre Week-end" },
    { value: "GROUP", label: "Offre Groupe" },
    { value: "LAST_MINUTE", label: "Dernière Minute" },
  ];

  // Fetch data
  useEffect(() => {
    fetchDestinations();
    fetchOffres();
  }, []);

  const fetchDestinations = async () => {
    try {
      const response = await axiosInstance.get('/ms-destination/api/destinations/');
      let destinationsList = [];
      if (response.data.results) {
        destinationsList = response.data.results;
      } else if (Array.isArray(response.data)) {
        destinationsList = response.data;
      } else {
        destinationsList = [];
      }
      
      const formattedDestinations = destinationsList.map(dest => ({
        id: dest.id,
        name: dest.name,
        description: dest.description,
        price: dest.display_price || `${parseFloat(dest.final_price || dest.base_price).toLocaleString()} DZD`,
        rating: parseFloat(dest.rating),
        imageUrl: dest.image_url,
        category: dest.continent,
        status: dest.status,
        bookings: dest.total_bookings || 0,
        base_price: dest.base_price,
        discount_percentage: dest.discount_percentage,
        is_popular: dest.is_popular,
        country: dest.country,
        city: dest.city,
        tags: dest.tags,
      }));
      
      setDestinations(formattedDestinations);
    } catch (error) {
      console.error('Error fetching destinations:', error);
      toast.error('Erreur lors du chargement des destinations');
    }
  };

  const fetchOffres = async () => {
    try {
      const response = await axiosInstance.get('/ms-destination/api/offers/');
      let offersList = [];
      if (response.data.results) {
        offersList = response.data.results;
      } else if (Array.isArray(response.data)) {
        offersList = response.data;
      } else {
        offersList = [];
      }
      
      const formattedOffers = offersList.map(offer => ({
        id: offer.id,
        title: offer.title,
        location: offer.location,
        description: offer.description,
        originalPrice: offer.original_price,
        offerPrice: offer.offer_price,
        discountPercentage: offer.discount_percentage,
        imageUrl: offer.image_url,
        duration_days: offer.duration_days,
        startDate: offer.start_date,
        endDate: offer.end_date,
        is_active: offer.is_active,
        is_featured: offer.is_featured,
        offer_type: offer.offer_type,
        includes: offer.includes,
        excludes: offer.excludes,
        total_bookings: offer.total_bookings,
        destination_id: offer.destination,
      }));
      
      setOffres(formattedOffers);
    } catch (error) {
      console.error('Error fetching offers:', error);
      setOffres([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Destination CRUD
  const handleDeleteDestination = async (id) => {
    try {
      await axiosInstance.delete(`/ms-destination/api/destinations/${id}/`);
      setDestinations(destinations.filter((d) => d.id !== id));
      toast.success("Destination supprimée avec succès");
    } catch (error) {
      console.error('Error deleting destination:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleEditDestination = (dest) => {
    setItemType("destination");
    setEditingItem(dest);
    setFormData({
      name: dest.name,
      price: dest.base_price || parseFloat(dest.price.replace(/[^0-9.-]+/g, "")),
      description: dest.description,
      continent: dest.category,
      imageUrl: dest.imageUrl,
      rating: dest.rating.toString(),
      country: dest.country || "",
      city: dest.city || "",
      discount_percentage: dest.discount_percentage || 0,
      is_popular: dest.is_popular || false,
      tags: dest.tags || "",
    });
    setIsModalOpen(true);
  };

  const handleSaveDestination = async () => {
    try {
      const destinationData = {
        name: formData.name,
        description: formData.description,
        country: formData.country || "France",
        city: formData.city || formData.name.split(',')[0],
        continent: formData.continent,
        image_url: formData.imageUrl,
        base_price: parseFloat(formData.price),
        discount_percentage: parseFloat(formData.discount_percentage) || 0,
        rating: parseFloat(formData.rating) || 4.5,
        status: "Actif",
        is_popular: formData.is_popular,
        tags: formData.tags,
      };

      if (editingItem) {
        await axiosInstance.put(`/ms-destination/api/destinations/${editingItem.id}/`, destinationData);
        toast.success("Destination modifiée avec succès");
      } else {
        await axiosInstance.post('/ms-destination/api/destinations/', destinationData);
        toast.success("Destination ajoutée avec succès");
      }
      
      setIsModalOpen(false);
      resetForms();
      fetchDestinations();
      
    } catch (error) {
      console.error('Error saving destination:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de la sauvegarde');
    }
  };

  // Offer CRUD
  const handleDeleteOffre = async (id) => {
    try {
      await axiosInstance.delete(`/ms-destination/api/offers/${id}/`);
      setOffres(offres.filter((o) => o.id !== id));
      toast.success("Offre supprimée avec succès");
    } catch (error) {
      console.error('Error deleting offer:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleEditOffre = (offre) => {
    setItemType("offre");
    setEditingItem(offre);
    setOffreFormData({
      title: offre.title,
      location: offre.location,
      description: offre.description,
      originalPrice: offre.originalPrice,
      offerPrice: offre.offerPrice,
      imageUrl: offre.imageUrl,
      duration_days: offre.duration_days,
      startDate: offre.startDate,
      endDate: offre.endDate,
      is_active: offre.is_active,
      is_featured: offre.is_featured,
      offer_type: offre.offer_type || "SEASONAL",
      includes: offre.includes || "",
      excludes: offre.excludes || "",
      destination_id: offre.destination_id || "",
    });
    setIsModalOpen(true);
  };

  const handleSaveOffre = async () => {
    try {
      const offreData = {
        title: offreFormData.title,
        location: offreFormData.location,
        description: offreFormData.description,
        original_price: parseFloat(offreFormData.originalPrice),
        offer_price: parseFloat(offreFormData.offerPrice),
        image_url: offreFormData.imageUrl,
        duration_days: parseInt(offreFormData.duration_days),
        start_date: offreFormData.startDate,
        end_date: offreFormData.endDate,
        is_active: offreFormData.is_active,
        is_featured: offreFormData.is_featured,
        offer_type: offreFormData.offer_type,
        includes: offreFormData.includes,
        excludes: offreFormData.excludes,
        destination_id: offreFormData.destination_id ? parseInt(offreFormData.destination_id) : null,
      };

      if (editingItem) {
        await axiosInstance.put(`/ms-destination/api/offers/${editingItem.id}/`, offreData);
        toast.success("Offre modifiée avec succès");
      } else {
        await axiosInstance.post('/ms-destination/api/offers/', offreData);
        toast.success("Offre ajoutée avec succès");
      }
      
      setIsModalOpen(false);
      resetForms();
      fetchOffres();
      
    } catch (error) {
      console.error('Error saving offer:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de la sauvegarde');
    }
  };

  const resetForms = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      price: "",
      description: "",
      continent: "",
      imageUrl: "",
      rating: "",
      country: "",
      city: "",
      discount_percentage: 0,
      is_popular: false,
      tags: "",
    });
    setOffreFormData({
      title: "",
      location: "",
      description: "",
      originalPrice: "",
      offerPrice: "",
      imageUrl: "",
      duration_days: "",
      startDate: "",
      endDate: "",
      is_active: true,
      is_featured: false,
      offer_type: "SEASONAL",
      includes: "",
      excludes: "",
      destination_id: "",
    });
  };

  const openAddModal = (type) => {
    setItemType(type);
    setEditingItem(null);
    resetForms();
    setIsModalOpen(true);
  };

  // Stats for destinations
  const stats = [
    { label: "Destinations", value: destinations.length, icon: <GiEarthAmerica className="text-[#00C0E8]" size={24} />, color: "from-cyan-50 to-blue-50" },
    { label: "Réservations", value: destinations.reduce((s, d) => s + d.bookings, 0), icon: <FaPassport className="text-[#00C0E8]" size={22} />, color: "from-indigo-50 to-blue-50" },
    { label: "Note moyenne", value: destinations.length > 0 ? (destinations.reduce((s, d) => s + d.rating, 0) / destinations.length).toFixed(1) : 0, icon: <FaStar className="text-[#00C0E8]" size={22} />, color: "from-yellow-50 to-orange-50" },
    { label: "Catégories", value: new Set(destinations.map(d => d.category)).size, icon: <GiIsland className="text-[#00C0E8]" size={24} />, color: "from-emerald-50 to-teal-50" },
  ];

  // Stats for offers
  const offerStats = [
    { label: "Total Offres", value: offres.length, icon: <FaTag className="text-[#00C0E8]" size={24} />, color: "from-cyan-50 to-blue-50" },
    { label: "Offres Actives", value: offres.filter(o => o.is_active).length, icon: <FaPercent className="text-[#00C0E8]" size={22} />, color: "from-green-50 to-emerald-50" },
    { label: "Réservations", value: offres.reduce((s, o) => s + (o.total_bookings || 0), 0), icon: <HiUsers className="text-[#00C0E8]" size={22} />, color: "from-indigo-50 to-blue-50" },
    { label: "Types", value: new Set(offres.map(o => o.offer_type)).size, icon: <FaTag className="text-[#00C0E8]" size={24} />, color: "from-purple-50 to-pink-50" },
  ];

  const currentStats = activeTab === "destinations" ? stats : offerStats;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00C0E8]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-[#00C0E8] to-[#0096b8] overflow-hidden m-4 rounded-xl">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-3  justify-center md:justify-start">
                  <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
                    <GiCommercialAirplane className="text-white text-2xl" />
                  </div>
                  <span className="text-white/80 text-sm font-medium tracking-wide">ADMINISTRATION</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  Gestion des Destinations & Offres
                </h1>
              </motion.div>
            </div>
          </div>
        </div>
        
        
        
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 -mt-8 relative z-10 mb-8">
          {currentStats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`bg-gradient-to-br ${stat.color} backdrop-blur-sm rounded-2xl p-5 shadow-md hover:shadow-lg transition-all hover:-translate-y-1`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="bg-white/50 backdrop-blur-sm p-2 rounded-xl">
                  {stat.icon}
                </div>
                <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
              </div>
              <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-gray-200">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("destinations")}
              className={`px-6 py-3 font-semibold transition-all relative ${
                activeTab === "destinations"
                  ? "text-[#00C0E8] border-b-2 border-[#00C0E8]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <GiEarthAmerica className="w-5 h-5" />
                Destinations
              </div>
            </button>
            <button
              onClick={() => setActiveTab("offres")}
              className={`px-6 py-3 font-semibold transition-all relative ${
                activeTab === "offres"
                  ? "text-[#00C0E8] border-b-2 border-[#00C0E8]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <FaPercent className="w-5 h-5" />
                Offres Spéciales
              </div>
            </button>
          </div>
        </div>

        {/* DESTINATIONS TAB */}
        {activeTab === "destinations" && (
          <>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <FaPlaneDeparture className="text-[#00C0E8]" />
                  Toutes les destinations
                </h2>
                <p className="text-gray-500 text-sm mt-1">{destinations.length} destinations disponibles</p>
              </div>
              <button
                onClick={() => openAddModal("destination")}
                className="bg-[#00C0E8] text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Ajouter une destination
              </button>
            </div>

            {/* Destinations Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {destinations.map((dest, idx) => (
                <motion.div
                  key={dest.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col h-full"
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={dest.imageUrl}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                      onError={(e) => { e.target.src = "https://via.placeholder.com/400x200?text=Image"; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    
                    <div className="absolute top-4 right-4">
                      <div className="backdrop-blur-md bg-white/90 px-3 py-1 rounded-full shadow-lg">
                        <span className="text-xs font-semibold text-gray-700">{dest.category}</span>
                      </div>
                    </div>
                    
                    <div className="absolute bottom-4 left-4">
                      <div className="backdrop-blur-md bg-black/50 px-3 py-1.5 rounded-lg">
                        <span className="text-white font-bold text-lg">{dest.price}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-gray-800 text-xl group-hover:text-[#00C0E8] transition">
                          {dest.name}
                        </h3>
                        <div className="flex items-center gap-1 mt-1">
                          <FaMapMarkerAlt className="text-[#00C0E8] text-xs" />
                          <span className="text-xs text-gray-500">{dest.country || dest.category}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                        <FaStar className="text-yellow-500 text-sm" />
                        <span className="text-sm font-semibold text-gray-700">{dest.rating}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-grow">
                      {dest.description}
                    </p>

                    <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <HiUsers className="text-[#00C0E8] text-sm" />
                        <span className="text-xs text-gray-600">{dest.bookings} réservations</span>
                      </div>
                      {dest.is_popular && (
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                          <span className="text-xs text-green-600 font-medium">Populaire</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEditDestination(dest)}
                        className="flex-1 py-2.5 rounded-xl bg-gray-50 text-gray-700 text-sm font-semibold hover:bg-[#00C0E8] hover:text-white transition-all duration-300"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDeleteDestination(dest.id)}
                        className="px-4 py-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* OFFRES TAB */}
        {activeTab === "offres" && (
          <>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <FaPercent className="text-[#00C0E8]" />
                  Offres Spéciales
                </h2>
                <p className="text-gray-500 text-sm mt-1">{offres.length} offres disponibles</p>
              </div>
              <button
                onClick={() => openAddModal("offre")}
                className="bg-[#00C0E8] text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Ajouter une offre
              </button>
            </div>

            {/* Offres Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {offres.map((offre, idx) => (
                <motion.div
                  key={offre.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col h-full"
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={offre.imageUrl}
                      alt={offre.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                      onError={(e) => { e.target.src = "https://via.placeholder.com/400x200?text=Offre"; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    
                    {/* Discount Badge */}
                    <div className="absolute top-4 left-4">
                      <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                        -{offre.discountPercentage}%
                      </div>
                    </div>
                    
                    {/* Featured Badge */}
                    {offre.is_featured && (
                      <div className="absolute top-4 right-4">
                        <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                          Vedette
                        </div>
                      </div>
                    )}
                    
                    {/* Price Tag */}
                    <div className="absolute bottom-4 left-4">
                      <div className="backdrop-blur-md bg-black/50 px-3 py-1.5 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-white line-through text-xs">{offre.originalPrice.toLocaleString()} DZD</span>
                          <span className="text-white font-bold text-lg">{offre.offerPrice.toLocaleString()} DZD</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-grow">
                    <div className="mb-2">
                      <div className="flex items-center gap-2 mb-1">
                        <FaTag className="text-[#00C0E8] text-xs" />
                        <span className="text-xs text-[#00C0E8] font-semibold uppercase">
                          {offerTypes.find(t => t.value === offre.offer_type)?.label || offre.offer_type}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-800 text-xl group-hover:text-[#00C0E8] transition">
                        {offre.title}
                      </h3>
                      <div className="flex items-center gap-1 mt-1">
                        <FaMapMarkerAlt className="text-[#00C0E8] text-xs" />
                        <span className="text-xs text-gray-500">{offre.location}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm line-clamp-2 mb-3 flex-grow">
                      {offre.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <FaCalendarAlt className="text-[#00C0E8]" />
                        <span>{offre.duration_days} jours</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <FaCalendarAlt className="text-[#00C0E8]" />
                        <span>Valable: {new Date(offre.startDate).toLocaleDateString('fr-FR')} - {new Date(offre.endDate).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <FaTag className="text-[#00C0E8]" />
                        <span>Inclus: {offre.includes?.substring(0, 50)}...</span>
                      </div>
                      <div className={`text-xs ${offre.is_active ? 'text-green-600' : 'text-red-600'}`}>
                        {offre.is_active ? '✓ Actif' : '✗ Inactif'}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEditOffre(offre)}
                        className="flex-1 py-2.5 rounded-xl bg-gray-50 text-gray-700 text-sm font-semibold hover:bg-[#00C0E8] hover:text-white transition-all duration-300"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDeleteOffre(offre.id)}
                        className="px-4 py-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setIsModalOpen(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-[#00C0E8] to-[#0096b8] p-5 sticky top-0">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {itemType === "destination" 
                      ? (editingItem ? "Modifier la destination" : "Ajouter une destination")
                      : (editingItem ? "Modifier l'offre" : "Ajouter une offre")}
                  </h2>
                  <p className="text-white/80 text-sm mt-1">
                    {editingItem ? "Modifiez les informations" : "Remplissez les informations"}
                  </p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-white hover:bg-white/20 rounded-full p-2 transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Destination Form */}
              {itemType === "destination" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Nom *</label>
                      <input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00C0E8] outline-none"
                        placeholder="Paris, France"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Prix (DZD) *</label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00C0E8] outline-none"
                        placeholder="125000"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Pays</label>
                      <input
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00C0E8] outline-none"
                        placeholder="France"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Ville</label>
                      <input
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00C0E8] outline-none"
                        placeholder="Paris"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows="3"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00C0E8] outline-none resize-none"
                      placeholder="Description..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Continent</label>
                      <input
                        value={formData.continent}
                        onChange={(e) => setFormData({ ...formData, continent: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00C0E8] outline-none"
                        placeholder="Europe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Note</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.rating}
                        onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00C0E8] outline-none"
                        placeholder="4.5"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Réduction (%)</label>
                      <input
                        type="number"
                        step="1"
                        value={formData.discount_percentage}
                        onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00C0E8] outline-none"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 mt-8">
                        <input
                          type="checkbox"
                          checked={formData.is_popular}
                          onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
                          className="w-4 h-4 text-[#00C0E8] rounded"
                        />
                        <span className="text-sm text-gray-700">Destination populaire</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tags (séparés par des virgules)</label>
                    <input
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00C0E8] outline-none"
                      placeholder="plage, culture, aventure..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">URL de l'image</label>
                    <input
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00C0E8] outline-none"
                      placeholder="https://..."
                    />
                  </div>
                </>
              )}

              {/* Offer Form */}
              {itemType === "offre" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Titre *</label>
                      <input
                        value={offreFormData.title}
                        onChange={(e) => setOffreFormData({ ...offreFormData, title: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00C0E8] outline-none"
                        placeholder="Summer Escape"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Destination *</label>
                      <input
                        value={offreFormData.location}
                        onChange={(e) => setOffreFormData({ ...offreFormData, location: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00C0E8] outline-none"
                        placeholder="Paris, France"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                    <textarea
                      value={offreFormData.description}
                      onChange={(e) => setOffreFormData({ ...offreFormData, description: e.target.value })}
                      rows="2"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00C0E8] outline-none resize-none"
                      placeholder="Description de l'offre..."
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Prix original (DZD)</label>
                      <input
                        type="number"
                        value={offreFormData.originalPrice}
                        onChange={(e) => setOffreFormData({ ...offreFormData, originalPrice: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00C0E8] outline-none"
                        placeholder="125000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Prix offre (DZD)</label>
                      <input
                        type="number"
                        value={offreFormData.offerPrice}
                        onChange={(e) => setOffreFormData({ ...offreFormData, offerPrice: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00C0E8] outline-none"
                        placeholder="99000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Durée (jours)</label>
                      <input
                        type="number"
                        value={offreFormData.duration_days}
                        onChange={(e) => setOffreFormData({ ...offreFormData, duration_days: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00C0E8] outline-none"
                        placeholder="7"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Date de début</label>
                      <input
                        type="date"
                        value={offreFormData.startDate}
                        onChange={(e) => setOffreFormData({ ...offreFormData, startDate: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00C0E8] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Date de fin</label>
                      <input
                        type="date"
                        value={offreFormData.endDate}
                        onChange={(e) => setOffreFormData({ ...offreFormData, endDate: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00C0E8] outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Type d'offre</label>
                      <select
                        value={offreFormData.offer_type}
                        onChange={(e) => setOffreFormData({ ...offreFormData, offer_type: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00C0E8] outline-none"
                      >
                        {offerTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Destination liée (optionnel)</label>
                      <select
                        value={offreFormData.destination_id}
                        onChange={(e) => setOffreFormData({ ...offreFormData, destination_id: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00C0E8] outline-none"
                      >
                        <option value="">Aucune</option>
                        {destinations.map(dest => (
                          <option key={dest.id} value={dest.id}>{dest.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Inclus (séparés par des virgules)</label>
                    <input
                      value={offreFormData.includes}
                      onChange={(e) => setOffreFormData({ ...offreFormData, includes: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00C0E8] outline-none"
                      placeholder="Vol, Hôtel, Petit déjeuner"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">URL de l'image</label>
                    <input
                      value={offreFormData.imageUrl}
                      onChange={(e) => setOffreFormData({ ...offreFormData, imageUrl: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00C0E8] outline-none"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={offreFormData.is_active}
                        onChange={(e) => setOffreFormData({ ...offreFormData, is_active: e.target.checked })}
                        className="w-4 h-4 text-[#00C0E8] rounded"
                      />
                      <span className="text-sm text-gray-700">Offre active</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={offreFormData.is_featured}
                        onChange={(e) => setOffreFormData({ ...offreFormData, is_featured: e.target.checked })}
                        className="w-4 h-4 text-[#00C0E8] rounded"
                      />
                      <span className="text-sm text-gray-700">Offre vedette</span>
                    </label>
                  </div>
                </>
              )}

              {formData.imageUrl && itemType === "destination" && (
                <img src={formData.imageUrl} alt="Preview" className="w-full h-40 object-cover rounded-xl" />
              )}
              {offreFormData.imageUrl && itemType === "offre" && (
                <img src={offreFormData.imageUrl} alt="Preview" className="w-full h-40 object-cover rounded-xl" />
              )}
            </div>

            <div className="p-6 pt-0 flex gap-3">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition">
                Annuler
              </button>
              <button onClick={itemType === "destination" ? handleSaveDestination : handleSaveOffre} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#00C0E8] to-[#0096b8] text-white rounded-xl font-semibold hover:shadow-lg transition">
                {editingItem ? "Sauvegarder" : "Ajouter"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}