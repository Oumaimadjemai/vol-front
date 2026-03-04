import { useState, useEffect, useRef } from "react";
import Berlin from "../../../../assets/images/Berlin.jpg";
import Meillinuim from "../../../../assets/images/Milennium.jpg";
import damiano from "../../../../assets/images/damiano.jpg";
import tombyrom from "../../../../assets/images/tom-byrom.jpg";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

const destinations = [
  { id: 1, name: "Monument of Berlin", location: "Berlin, Germany", image: Berlin },
  { id: 2, name: "Millennium Bridge", location: "London, United Kingdom", image: Meillinuim },
  { id: 3, name: "Rialto Bridge", location: "Venice, Italy", image: damiano },
  { id: 4, name: "Eiffel Tower", location: "Paris, France", image: tombyrom },
];

export default function DestinationAlbum() {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(3);
  const [slideWidth, setSlideWidth] = useState(0);
  const containerRef = useRef(null);

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

  return (
    <div id="destinations" className="max-w-7xl mx-auto px-4 mb-10">
      
      {/* TITLE */}
      <div className="mb-12">
        <h2 className="text-4xl font-semibold text-gray-900 mb-3 font-playfair">
          {t("destinations_title")}
        </h2>
        <div className="w-20 h-1 bg-[#00C0E8] mb-4"></div>
        <p className="text-gray-500">{t("destinations_desc")}</p>
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
              className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 px-4"
            >
              <div className="h-[480px] rounded-3xl overflow-hidden shadow-xl relative group">
                
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

                <div className="absolute bottom-6 left-6 text-zinc-300">
                  <h3 className="text-xl font-playfair">
                    {dest.name}
                  </h3>

                  <div className="flex items-center space-x-2 mt-1">
                    <MapPin size={18} />
                    <p className="text-sm opacity-90 font-playfair">
                      {dest.location}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* LEFT BUTTON */}
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

        {/* RIGHT BUTTON */}
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
      </div>
    </div>
  );
}