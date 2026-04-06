import DestinationAlbum from "./DestinationAlbum";
import home from "../../../../assets/images/home.png";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import WhyTravling from "./WhyTravling";
import OffreSpecial from "./OffreSpecial";
import FlightSearch from "../../../Vol/SearchFlight/FlightSearchPage";

export default function Home() {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <>
      <section
        id="hero"
        className="relative w-full min-h-[350px] flex items-center px-6 sm:px-12 overflow-hidden"
      >
        {/* Background Image for mobile/tablet - Clear but behind text */}
        <div className="absolute inset-0 md:hidden">
          <motion.img
            src={home}
            alt="Travel World"
            className="w-full h-full object-contain"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 0.4,
              transition: { duration: 0.5 }
            }}
          />
        </div>

        {/* Text with semi-transparent background for better readability on mobile */}
        <div className="relative z-10 w-full md:max-w-xl">
          <div className="bg-white/80 md:bg-transparent p-4 md:p-0 rounded-lg">
            <h2 className="text-[#00C0E8] text-5xl sm:text-6xl font-bold leading-tight font-playfair whitespace-pre-line">
              {t("hero_title")}
            </h2>
          </div>
        </div>

        {/* Animated Image - Only visible on desktop */}
        <div className="hidden md:flex h-full items-center mt-20 ml-auto">
          <motion.img
            src={home}
            alt="Travel World"
            className="h-full object-contain"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: [0, -10, 0],
              transition: { 
                opacity: { duration: 0.5 },
                y: { 
                  duration: 3, 
                  repeat: Infinity, 
                  repeatType: "reverse",
                  ease: "easeInOut"
                }
              }
            }}
            whileHover={{ scale: 1.05 }}
          />
        </div>
      </section>
      <FlightSearch/>
      <DestinationAlbum />
      <OffreSpecial/>
      <WhyTravling/>
    </>
  );
}