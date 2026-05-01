import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, MapPin, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../../api/axiosInstance";

export default function OffreSpecial() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(3);
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef(null);
  const [slideWidth, setSlideWidth] = useState(0);
  const gapSize = 32;

  // Fetch offers from API
  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get('/ms-destination/api/offers/active/');
      console.log('Offers API Response:', response.data);
      
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
        image: offer.image_url,
        original_price: offer.original_price,
        offer_price: offer.offer_price,
        display_original_price: offer.display_original_price || `${offer.original_price} DZD`,
        display_offer_price: offer.display_offer_price || `${offer.offer_price} DZD`,
        discount_percentage: offer.discount_percentage,
        duration_days: offer.duration_days,
        start_date: offer.start_date,
        end_date: offer.end_date,
        is_active: offer.is_active,
        is_featured: offer.is_featured,
        offer_type: offer.offer_type,
        includes: offer.includes,
        total_bookings: offer.total_bookings,
      }));
      
      setOffers(formattedOffers);
    } catch (error) {
      console.error('Error fetching offers:', error);
      setOffers([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Get airport code from city
  const getAirportCode = (city) => {
    const airportMap = {
      'Paris': 'CDG',
      'Tokyo': 'NRT',
      'New York': 'JFK',
      'Bali': 'DPS',
      'Dubai': 'DXB',
      'Rome': 'FCO',
      'London': 'LHR',
      'Barcelona': 'BCN',
      'Berlin': 'BER',
      'Madrid': 'MAD',
      'Istanbul': 'IST',
      'Marrakech': 'RAK',
      'Cairo': 'CAI',
      'Dakar': 'DSS',
      'Johannesburg': 'JNB',
    };
    return airportMap[city] || city.toUpperCase().substring(0, 3);
  };

  // Calculate date based on days from now
  const getDate = (daysFromNow) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString().split('T')[0];
  };

  // Handle offer click - navigate to results with roundtrip based on duration
  const handleOfferClick = async (offer) => {
    // Extract city from location
    const locationParts = offer.location.split(',');
    const city = locationParts[0].trim();
    const country = locationParts[1]?.trim() || "";
    
    const originAirport = "ALG"; // Algiers airport code
    const destinationAirport = getAirportCode(city);
    
    // Departure date: 7 days from now
    const departureDate = getDate(7);
    // Return date: departure date + offer duration days
    const returnDate = getDate(7 + offer.duration_days);
    
    // Prepare search data for results page - ROUNDTRIP
    const searchData = {
      flights: null,
      type: "roundtrip", // Aller-retour
      params: {
        from: originAirport,
        to: destinationAirport,
        departureDate: departureDate,
        returnDate: returnDate,
        passengers: {
          adult: 1,
          child: 0,
          baby: 0
        },
        travelClass: "ECONOMY",
        options: {
          direct: false,
          baggage: false,
          refundable: false
        }
      }
    };

    setIsLoading(true);
    
    try {
      // Perform the flight search
      const response = await axiosInstance.get("/service-vols/api/flights/search", {
        params: {
          origin: originAirport,
          destination: destinationAirport,
          departureDate: departureDate,
          returnDate: returnDate,
          adults: 1,
          children: 0,
          infants: 0,
          travelClass: "ECONOMY",
          nonStop: false,
          refundable: false,
          baggage: false,
        },
      });

      searchData.flights = response.data;
      
      // Navigate directly to results page
      navigate("/results", { state: searchData });
      
    } catch (error) {
      console.error("Error searching flights:", error);
      searchData.flights = { data: { flights: [] } };
      navigate("/results", { state: searchData });
      
      // Show error toast if available
      if (window.toast) {
        window.toast.error("Erreur lors de la recherche des vols. Veuillez réessayer.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCardsToShow(1);
      } else if (window.innerWidth < 1024) {
        setCardsToShow(2);
      } else {
        setCardsToShow(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const totalGapWidth = gapSize * (cardsToShow - 1);
      const availableWidth = containerWidth - totalGapWidth;
      setSlideWidth(availableWidth / cardsToShow);
    }
  }, [cardsToShow, offers]);

  const maxIndex = Math.max(0, offers.length - cardsToShow);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  if (isLoading) {
    return (
      <div id="offres" className="w-full px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-4xl font-semibold text-gray-900 mb-3 font-playfair">
              {t("offres_title") || "Offres Spéciales"}
            </h2>
            <div className="w-20 h-1 bg-[#00C0E8]"></div>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00C0E8]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (offers.length === 0) {
    return (
      <div id="offres" className="w-full px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-4xl font-semibold text-gray-900 mb-3 font-playfair">
              {t("offres_title") || "Offres Spéciales"}
            </h2>
            <div className="w-20 h-1 bg-[#00C0E8]"></div>
          </div>
          <div className="text-center py-12 bg-gray-50 rounded-2xl">
            <p className="text-gray-500">Aucune offre spéciale disponible pour le moment</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="offres" className="w-full px-4 py-16">
      {/* TITLE */}
      <div className="mb-12 max-w-7xl mx-auto">
        <h2 className="text-4xl font-semibold text-gray-900 mb-3 font-playfair">
          {t("offres_title") || "Offres Spéciales"}
        </h2>
        <div className="w-20 h-1 bg-[#00C0E8]"></div>
        <p className="text-gray-600 mt-2">
          Profitez de nos promotions exclusives et économisez sur votre prochain voyage
        </p>
      </div>

      {/* SLIDER */}
      <div 
        ref={containerRef}
        className="relative max-w-7xl mx-auto overflow-hidden py-6"
      >
        <div
          className="flex gap-8 transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (slideWidth + gapSize)}px)`,
          }}
        >
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="flex-shrink-0 cursor-pointer group"
              style={{ width: `${slideWidth}px` }}
              onClick={() => handleOfferClick(offer)}
            >
              <div className="rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-300 bg-white h-full transform hover:-translate-y-2 transition-all duration-300">
                
                {/* IMAGE */}
                <div className="h-[300px] overflow-hidden relative">
                  <img
                    src={offer.image || "https://via.placeholder.com/400x300?text=Offre+Spéciale"}
                    alt={offer.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400x300?text=Offre+Spéciale";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  
                  {/* Discount Badge */}
                  {offer.discount_percentage > 0 && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      -{offer.discount_percentage}%
                    </div>
                  )}
                  
                  {/* Featured Badge */}
                  {offer.is_featured && (
                    <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      Vedette
                    </div>
                  )}
                  
                  {/* Price Tag */}
                  <div className="absolute bottom-4 left-4">
                    <div className="backdrop-blur-md bg-black/50 px-3 py-1.5 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-white line-through text-xs">{offer.display_original_price}</span>
                        <span className="text-white font-bold text-lg">{offer.display_offer_price}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* DETAILS */}
                <div className="p-5">
                  <div className="mb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-[#00C0E8] font-semibold uppercase">
                        {offer.offer_type?.replace('_', ' ') || "Offre Spéciale"}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-800 text-xl group-hover:text-[#00C0E8] transition">
                      {offer.title}
                    </h3>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin size={14} className="text-[#00C0E8]" />
                      <span className="text-xs text-gray-500">{offer.location}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    {offer.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar size={14} className="text-[#00C0E8]" />
                      <span>Séjour de {offer.duration_days} jours</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar size={14} className="text-[#00C0E8]" />
                      <span>Départ: {getDate(7)} → Retour: {getDate(7 + offer.duration_days)}</span>
                    </div>
                    {offer.includes && (
                      <div className="text-xs text-gray-500 line-clamp-1">
                        ✓ Inclus: {offer.includes.substring(0, 60)}...
                      </div>
                    )}
                  </div>

                  {/* Flight info hint - Now showing roundtrip */}
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-600">ALG</span>
                      </div>
                      <span className="text-gray-400">↔</span>
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-600">
                          {offer.location.split(',')[0].substring(0, 3).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">Aller-retour</span>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* LEFT BUTTON */}
        {offers.length > cardsToShow && (
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-4 -translate-y-1/2
            w-12 h-12 rounded-full
            bg-white/40 backdrop-blur-md
            text-[#00C0E8]
            flex items-center justify-center
            shadow-lg
            transition-all duration-300
            hover:scale-110 hover:bg-[#00C0E8] hover:text-white
            disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentIndex === 0}
          >
            <ChevronLeft strokeWidth={2.5} />
          </button>
        )}

        {/* RIGHT BUTTON */}
        {offers.length > cardsToShow && (
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-4 -translate-y-1/2
            w-12 h-12 rounded-full
            bg-white/40 backdrop-blur-md
            text-[#00C0E8]
            flex items-center justify-center
            shadow-lg
            transition-all duration-300
            hover:scale-110 hover:bg-[#00C0E8] hover:text-white"
          >
            <ChevronRight strokeWidth={2.5} />
          </button>
        )}
      </div>

     
    </div>
  );
}