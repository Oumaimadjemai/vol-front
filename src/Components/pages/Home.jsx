import DestinationAlbum from "./DestinationAlbum";
import home from "../../assets/images/home.png";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import OffreSpecial from "./OffreSpecial";

export default function Home() {
  const location = useLocation();

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
      className="relative w-full h-screen overflow-hidden">
       
        <img
          src={home}
          alt="Travel World"
          className="hidden sm:flex absolute inset-0 w-full h-full object-contain object-center ml-40"
        />

        
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto w-full pl-20">
            <h2 className="text-[#00C0E8] text-6xl md:text-6xl font-bold leading-tight font-playfair">
              Pilotez votre <br/>
              activité<br/>
               en toute<br/>
                simplicité
            </h2>
          </div>
        </div>
      </section>

      <DestinationAlbum />
      <OffreSpecial/>
    </>
  );
}
