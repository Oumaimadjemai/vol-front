import DestinationAlbum from "./DestinationAlbum";
import home from "../../../../assets/images/home.png";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  className="w-full h-[350px] flex items-center justify-between px-6 sm:px-12"
>
  {/* LEFT: Text */}
  <div className="max-w-xl">
    <h2 className="text-[#00C0E8] text-5xl sm:text-6xl font-bold leading-tight font-playfair whitespace-pre-line">
      {t("hero_title")}
    </h2>
  </div>

  {/* RIGHT: Image */}
  <div className="h-full flex items-center mt-10">
    <img
      src={home}
      alt="Travel World"
      className="h-full object-contain"
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
