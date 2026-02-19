import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Login from "../authentication/Login";
import Dialog from "@mui/material/Dialog";
import Signup from "../authentication/Signup";
export default function Navbar() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    false
  );
  const [initials, setInitials] = useState("");
  useEffect(() => {
  const token = localStorage.getItem("access_token");
  const voyageur = localStorage.getItem("voyageur");

  if (token) {
    setIsAuthenticated(true);
  }

  if (voyageur) {
    const user = JSON.parse(voyageur);
    const firstLetterNom = user.nom?.charAt(0).toUpperCase() || "";
    const firstLetterPrenom = user.prenom?.charAt(0).toUpperCase() || "";
    setInitials(firstLetterNom + firstLetterPrenom);
  }
}, []);
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setIsLoginOpen(false);
  };
  return (
    <>
      <nav className="bg-white shadow-md">
        <div className="flex items-center justify-between max-w-7xl mx-auto px-6 py-4">
          <div className="text-xl font-bold text-[#00C0E8]"> Traveling!</div>
          <div className=" hidden md:flex space-x-6 absolute left-1/2 transform -translate-x-1/2">
            <NavItem>Home</NavItem>
            <NavItem>Travel</NavItem>
            <NavItem>Package</NavItem>
            <NavItem>About</NavItem>
          </div>
          <div className="flex space-x-4">
            {!isAuthenticated ? (
              <>
                {" "}
                <button
                  onClick={() => setIsSignupOpen(true)}
                  className="px-4 py-2 rounded-3xl text-slate-700 font-medium hover:text-sky-500 transition"
                >
                  Sign up
                </button>
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="px-4 py-2 rounded-3xl bg-[#00C0E8] text-white hover:bg-sky-500 transition font-medium"
                >
                  Sign In
                </button>
              </>
            ) : (
             <div className="flex items-center space-x-3">
  <div
    className="w-10 h-10 rounded-full bg-[#00C0E8] text-white flex items-center justify-center font-semibold cursor-pointer"
    title="Profile"
  >
    {initials}
  </div>

  
</div>
            )}
          </div>
        </div>
      </nav>
      <Dialog
        open={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        maxWidth="sm"
        disableScrollLock
        PaperProps={{
          style: {
            boxShadow: "none",
            overflow: "hidden", // Change to hidden to prevent scroll
            margin: 0,
            width: "100%",
            maxWidth: "850px",
            maxHeight: "510px",
            backgroundColor: "white",
            borderRadius: "12px",
            position: "relative",
          },
        }}
      >
        <div className="relative">
          <Login onLoginSuccess={handleLoginSuccess} />
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
            overflow: "hidden", // Change to hidden to prevent scroll
            margin: 0,
            width: "100%",
            maxWidth: "850px",
            maxHeight: "580px",
            backgroundColor: "white",
            borderRadius: "12px",
            position: "relative",
          },
        }}
      >
        <div className="relative">
          <Signup />
        </div>
      </Dialog>
    </>
  );
}
function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `text-gray-400 hover:text-[#00C0E8] transition ${
          isActive ? "text-[#00C0E8] font-medium" : ""
        }`
      }
    >
      {children}
    </NavLink>
  );
}
