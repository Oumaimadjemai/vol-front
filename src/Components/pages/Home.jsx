import DestinationAlbum from "./DestinationAlbum";
import home from "../../assets/images/home.png";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import OffreSpecial from "./OffreSpecial";
import { useTranslation } from "react-i18next";
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
  className="relative w-full h-screen overflow-hidden"
>
  {/* Background Image */}
  <img
    src={home}
    alt="Travel World"
    className="absolute inset-0 w-full h-full object-cover sm:object-contain sm:ml-40"
  />

  {/* Text Overlay */}
  <div className="relative z-10 h-full flex items-center">
    <div className="max-w-7xl mx-auto w-full px-4 text-center sm:text-left">
      <h2 className="text-[#00C0E8] text-5xl sm:text-6xl font-bold leading-tight font-playfair whitespace-pre-line">
        {t("hero_title")}
      </h2>
    </div>
  </div>
</section>

      <DestinationAlbum />
      <OffreSpecial/>
    </>
  );
}
