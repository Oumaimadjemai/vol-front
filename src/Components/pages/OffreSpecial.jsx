import { useState, useEffect } from "react";
import italy from "../../assets/images/italy.png";
import london from "../../assets/images/london.jpg";
import europe from "../../assets/images/europe.png";
import tombyrom from "../../assets/images/tom-byrom.jpg";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";

const destinations = [
   {
    id: 1,
    name: "Monument of Berlin",
    location: "Rome,italy",
    image: italy,
    price: "52000 DA",
    duration: "10 Days Trip",
  },
  {
    id: 2,
    name: "Millennium Bridge",
    location: "London, UK",
    image: london,
    price: "68000 DA",
    duration: "12 Days Trip",
  },
  {
    id: 3,
    name: "Rialto Bridge",
    location: "Full Europe",
    image: europe,
    price: "10900 DA",
    duration: "28 Days Trip",
  },
  {
    id: 4,
    name: "Eiffel Tower",
    location: "Paris, France",
    image: tombyrom,
    price: "7,500 DA",
    duration: "14 Days Trip",
  },
];
export default function OffreSpecial() {
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
    id="offres"
    className="max-w-7xl mx-auto px-4 ">

     
      <div className="mb-12">
        <h2 className="text-4xl font-semibold text-gray-900 mb-3 font-playfair">
          Offres Speciales
        </h2>
        <div className="w-20 h-1 bg-[#00C0E8] mb-4"></div>
        
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
    className="min-w-[340px] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-300 bg-white"
  >
    {/* IMAGE */}
    <div className="h-[320px] overflow-hidden">
      <img
        src={dest.image}
        alt={dest.name}
        className="w-full h-full object-cover hover:scale-110 transition duration-500"
      />
    </div>

    {/* WHITE DETAILS SECTION */}
    <div className="p-6">
      {/* Location + Price */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {dest.location}
        </h3>

        <span className="text-[#00C0E8] font-bold text-lg">
          {dest.price}
        </span>
      </div>

      {/* Trip Duration */}
      <div className="flex items-center text-gray-500 text-sm">
        <MapPin size={16} className="mr-2" />
        <span>{dest.duration}</span>
      </div>
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