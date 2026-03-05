
import { Outlet } from "react-router-dom";
import Navbar from "../Components/Menu/Navbar";
import Footer from "../Components/Menu/Footer";

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}