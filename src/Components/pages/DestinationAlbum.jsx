import { useState, useEffect } from "react";
import Berlin from "../../assets/images/Berlin.jpg";
import Meillinuim from "../../assets/images/Milennium.jpg";
import damiano from "../../assets/images/damiano.jpg";
import tombyrom from "../../assets/images/tom-byrom.jpg";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";

const destinations = [
  { id: 1, name: "Monument of Berlin", location: "Berlin, Germany", image: Berlin },
  { id: 2, name: "Millennium Bridge", location: "London, United Kingdom", image: Meillinuim },
  { id: 3, name: "Rialto Bridge", location: "Venice, Italy", image: damiano },
  { id: 4, name: "Eiffel Tower", location: "Paris, France", image: tombyrom },
];

export default function DestinationAlbum() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(3);

  
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

  const cardWidth = 340;
  const gap = 32;

  const maxIndex = destinations.length - cardsToShow;

  const nextSlide = () => {
    if (currentIndex >= maxIndex) {
      setCurrentIndex(0); 
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex === 0) {
      setCurrentIndex(maxIndex); 
    } else {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div 
    id="destinations"
    className="max-w-7xl mx-auto px-4 mb-10">

     
      <div className="mb-12">
        <h2 className="text-4xl font-semibold text-gray-900 mb-3 font-playfair">
          Populaire Destinations
        </h2>
        <div className="w-20 h-1 bg-[#00C0E8] mb-4"></div>
        <p className="text-gray-500">
          Destinations les plus populaires à travers le monde, des lieux historiques aux merveilles naturelles.
        </p>
      </div>

      
      <div className="relative overflow-hidden">

       
        <div
          className="flex gap-8 transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (cardWidth + gap)}px)`
          }}
        >
          {destinations.map((dest) => (
            <div
              key={dest.id}
              className="min-w-[340px] h-[480px] rounded-3xl overflow-hidden shadow-lg relative group"
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

              <div className="absolute bottom-6 left-6 text-zinc-300">
                <h3 className="text-xl font-playfair ">
                  {dest.name}
                </h3>
                <div className="flex space-x-1"> 
                    <MapPin/>
                    <p className="text-sm opacity-90 mt-1 font-playfair ">
                   {dest.location}
                </p></div>
               
              </div>
            </div>
          ))}
        </div>

        
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
          <ChevronRight strokeWidth={2.5}/>
        </button>

      </div>
    </div>
  );
}