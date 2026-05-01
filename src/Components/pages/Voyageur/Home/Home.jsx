import DestinationAlbum from "./DestinationAlbum";
import home from "../../../../assets/images/home.png";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import WhyTravling from "./WhyTravling";
import OffreSpecial from "./OffreSpecial";
import FlightSearch from "../../../Vol/SearchFlight/FlightSearchPage";
import Login from "../../../authentication/Login";
import Dialog from "@mui/material/Dialog";
import Signup from "../../../authentication/Signup";

export default function Home() {
  const location = useLocation();
  const { t } = useTranslation();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);
   const checkAuth = () => {
    return !!localStorage.getItem("access_token");
  };

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
            {!checkAuth() && (
              <div className="mt-6 lg:hidden flex  space-y-3">
                <button
                  onClick={() => setIsSignupOpen(true)}
                  className="w-full px-4 rounded-3xl text-slate-700 font-medium  hover:text-[#00c0e8] transition bg-white/90">
                  {t("inscription")}
                </button>
               <button
                  onClick={() => setIsLoginOpen(true)}
                  className="w-full px-4 py-2 rounded-3xl bg-[#00C0E8] text-white hover:bg-sky-500 transition font-medium"
                >
                  {t("connexion")}
                </button>
              </div>
            )}
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
      <Dialog
        open={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        maxWidth="sm"
        disableScrollLock
        PaperProps={{
          style: {
            boxShadow: "none",
            overflow: "hidden",
            margin: 0,
            
            maxWidth: "850px",
            backgroundColor: "white",
            borderRadius: "12px",
          },
        }}
      >
        <div className="relative">
          <Login 
            onLoginSuccess={() => setIsLoginOpen(false)}
            onSwitchToSignup={() => {
              setIsLoginOpen(false);
              setIsSignupOpen(true);
            }}
            onSwitchToReset={() => {
              // Handle reset password if needed
              setIsLoginOpen(false);
            }}
          />
        </div>
      </Dialog>

      <Dialog
        open={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        maxWidth="sm"
        disableScrollLock
        PaperProps={{
          style: {
            boxShadow: "none",
            overflow: "hidden",
            margin: 0,
            
            maxWidth: "850px",
            backgroundColor: "white",
            borderRadius: "12px",
          },
        }}
      >
        <div className="relative ">
          <Signup
            onSwitchToSignin={() => {
              setIsSignupOpen(false);
              setIsLoginOpen(true);
            }}
            onSignupSuccess={() => setIsSignupOpen(false)}
          />
        </div>
      </Dialog>
      
      <FlightSearch/>
      <DestinationAlbum />
      <OffreSpecial/>
      <WhyTravling/>
    </>
  );
}