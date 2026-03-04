import { useState, useEffect, useRef } from "react";
import italy from "../../../../assets/images/italy.png";
import london from "../../../../assets/images/london.jpg";
import europe from "../../../../assets/images/europe.png";
import tombyrom from "../../../../assets/images/tom-byrom.jpg";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

const offres = [
  {
    id: 1,
    location: "Rome, Italy",
    image: italy,
    price: "52000 DA",
    duration: "10 Days Trip",
  },
  {
    id: 2,
    location: "London, UK",
    image: london,
    price: "68000 DA",
    duration: "12 Days Trip",
  },
  {
    id: 3,
    location: "Full Europe",
    image: europe,
    price: "10900 DA",
    duration: "28 Days Trip",
  },
  {
    id: 4,
    location: "Paris, France",
    image: tombyrom,
    price: "7,500 DA",
    duration: "14 Days Trip",
  },
  {
    id: 5,
    location: "Paris, France",
    image: tombyrom,
    price: "7,500 DA",
    duration: "14 Days Trip",
  },
];

export default function OffreSpecial() {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(3);
  const containerRef = useRef(null);
  const [slideWidth, setSlideWidth] = useState(0);
  const gapSize = 32; // 8 * 4 = 32px (gap-8 from className)

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
      // Calculate slide width including the gap
      const totalGapWidth = gapSize * (cardsToShow - 1);
      const availableWidth = containerWidth - totalGapWidth;
      setSlideWidth(availableWidth / cardsToShow);
    }
  }, [cardsToShow]);

  const maxIndex = Math.max(0, offres.length - cardsToShow);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  return (
    <div id="offres" className="w-full px-4 py-16">
      {/* TITLE */}
      <div className="mb-12 max-w-7xl mx-auto">
        <h2 className="text-4xl font-semibold text-gray-900 mb-3 font-playfair">
          {t("offres_title")}
        </h2>
        <div className="w-20 h-1 bg-[#00C0E8]"></div>
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
          {offres.map((dest) => (
            <div
              key={dest.id}
              className="flex-shrink-0"
              style={{ width: `${slideWidth}px` }}
            >
              <div className="rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-300 bg-white h-full">
                
                {/* IMAGE */}
                <div className="h-[300px] overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.location}
                    className="w-full h-full object-cover hover:scale-110 transition duration-500"
                  />
                </div>

                {/* DETAILS */}
                <div className="p-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {dest.location}
                    </h3>

                    <span className="text-[#00C0E8] font-bold text-lg">
                      {dest.price}
                    </span>
                  </div>

                  <div className="flex items-center text-gray-500 text-sm mt-2">
                    <MapPin size={16} className="mr-2" />
                    <span>
                      {dest.duration.replace("Days Trip", t("days_trip"))}
                    </span>
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
          hover:scale-110 hover:bg-[#00C0E8] hover:text-white
          disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentIndex === 0}
        >
          <ChevronLeft strokeWidth={2.5} />
        </button>

        {/* RIGHT BUTTON - REMOVED THE DISABLED PROP */}
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