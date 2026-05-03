import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../../api/axiosInstance";

export default function DestinationAlbum() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(3);
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [slideWidth, setSlideWidth] = useState(0);
  const containerRef = useRef(null);

  // Fetch popular destinations from API
  useEffect(() => {
    fetchPopularDestinations();
  }, []);

  const fetchPopularDestinations = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get('/ms-destination/api/destinations/popular/');
      console.log('Popular Destinations API Response:', response.data);
      
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
        location: `${dest.city}, ${dest.country}`,
        image: dest.image_url,
        city: dest.city,
        country: dest.country,
        price: dest.final_price || `${parseFloat(dest.final_price || dest.base_price)} DZD`,
        rating: dest.rating,
        airportCode: getAirportCode(dest.city),
      }));
      
      setDestinations(formattedDestinations);
    } catch (error) {
      console.error('Error fetching popular destinations:', error);
      setDestinations([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Map city to airport code
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

  // Calculate date one week from now
  const getDate = (daysFromNow) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString().split('T')[0];
  };

  const handleDestinationClick = async (destination) => {
    const departureDate = getDate(7);
    const originAirport = "ALG"; // Algiers airport code
    const destinationAirport = destination.airportCode;
    
    // Prepare search data for results page
    const searchData = {
      flights: null,
      type: "oneway", // Aller simple
      params: {
        from: originAirport,
        to: destinationAirport,
        departureDate: departureDate,
        returnDate: null,
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

      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        setSlideWidth(containerWidth / cardsToShow);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [cardsToShow]);

  const maxIndex = destinations.length - cardsToShow;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  if (isLoading) {
    return (
      <div id="destinations" className="max-w-7xl mx-auto px-4 mb-10">
        <div className="mb-12">
          <h2 className="text-4xl font-semibold text-gray-900 mb-3 font-playfair">
            {t("destinations_title") || "Destinations Populaires"}
          </h2>
          <div className="w-20 h-1 bg-[#00C0E8] mb-4"></div>
          <p className="text-gray-500">{t("destinations_desc") || "Découvrez nos destinations les plus prisées"}</p>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00C0E8]"></div>
        </div>
      </div>
    );
  }

  if (destinations.length === 0) {
    return (
      <>
      <div className="mb-12 ml-5">
        <h2 className="text-4xl font-semibold text-gray-900 mb-3 font-playfair ">
          {t("destinations_title") || "Destinations Populaires"}
        </h2>
        <div className="w-20 h-1 bg-[#00C0E8] mb-4"></div>
             </div>
      <div className="text-center py-12 bg-gray-50  rounded-2xl mx-4">
      <p className="text-gray-500">Aucune distination disponible pour le moment</p>
      </div>
      </>
    );
  }

  return (
    <div id="destinations" className="max-w-7xl mx-auto px-4 mb-10">
      
      {/* TITLE */}
      <div className="mb-12">
        <h2 className="text-4xl font-semibold text-gray-900 mb-3 font-playfair">
          {t("destinations_title") || "Destinations Populaires"}
        </h2>
        <div className="w-20 h-1 bg-[#00C0E8] mb-4"></div>
        <p className="text-gray-500">{t("destinations_desc") || "Découvrez nos destinations les plus prisées"}</p>
      </div>

      {/* SLIDER */}
      <div
        ref={containerRef}
        className="relative overflow-hidden py-6"
      >
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * slideWidth}px)`,
          }}
        >
          {destinations.map((dest) => (
            <div
              key={dest.id}
              className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 px-4 cursor-pointer group"
              onClick={() => handleDestinationClick(dest)}
            >
              <div className="h-[480px] rounded-3xl overflow-hidden shadow-xl relative group">
                
                <img
                  src={dest.image || "https://via.placeholder.com/400x480?text=Destination"}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400x480?text=Image+non+trouvée";
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

                <div className="absolute bottom-6 left-6 text-zinc-300">
                  <h3 className="text-xl font-playfair group-hover:text-[#00C0E8] transition">
                    {dest.name}
                  </h3>

                  <div className="flex items-center space-x-2 mt-1">
                    <MapPin size={18} />
                    <p className="text-sm opacity-90 font-playfair">
                      {dest.location}
                    </p>
                  </div>
                  
                  {dest.price && (
                    <p className="text-sm font-semibold text-[#00C0E8] mt-2">
                      À partir de {dest.price}
                    </p>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* LEFT BUTTON */}
        {destinations.length > cardsToShow && (
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-4 -translate-y-1/2
            w-12 h-12 rounded-full
            bg-white/40 backdrop-blur-md
            text-[#00C0E8]
            flex items-center justify-center
            shadow-lg
            transition-all duration-300
            hover:scale-110 hover:bg-[#00C0E8] hover:text-white"
          >
            <ChevronLeft strokeWidth={2.5} />
          </button>
        )}

        {/* RIGHT BUTTON */}
        {destinations.length > cardsToShow && (
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