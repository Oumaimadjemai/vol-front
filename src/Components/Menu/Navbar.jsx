import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Login from "../authentication/Login";
import Dialog from "@mui/material/Dialog";
import Signup from "../authentication/Signup";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import ForgotPassword from "../authentication/ResetPassword";
import en from "../../assets/images/English.jpg";
import fr from "../../assets/images/francais.jpg";
import alg from "../../assets/images/algerie.jpg";
import {useTranslation} from "react-i18next";
export default function Navbar() {
  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initials, setInitials] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [language, setLanguage] = useState("FR");
  const [langAnchorEl, setLangAnchorEl] = useState(null);
  const langOpen = Boolean(langAnchorEl);
  const { t, i18n } = useTranslation();
  const open = Boolean(anchorEl);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Function to update auth state from localStorage
  const updateAuthState = () => {
    const token = localStorage.getItem("access_token");
    const voyageur = localStorage.getItem("voyageur");
    
    console.log("Navbar - Checking auth state:", { 
      hasToken: !!token, 
      hasVoyageur: !!voyageur,
      token: token ? token.substring(0, 10) + "..." : null
    });
    
    const hasToken = !!localStorage.getItem("access_token");
    setIsAuthenticated(hasToken);
    
    if (voyageur) {
      try {
        const user = JSON.parse(voyageur);
        console.log("Navbar - User data:", user);
        const firstLetterNom = user.nom?.charAt(0).toUpperCase() || "";
        const firstLetterPrenom = user.prenom?.charAt(0).toUpperCase() || "";
        setInitials(firstLetterNom + firstLetterPrenom);
      } catch (e) {
        console.error("Error parsing voyageur:", e);
        setInitials("");
      }
    } else {
      setInitials("");
    }
  };

  useEffect(() => {
    console.log("Navbar - Initial mount, checking auth");
    updateAuthState();
    
    const handleStorageChange = (e) => {
      console.log("Navbar - Storage changed:", e.key, e.newValue);
      if (e.key === "access_token" || e.key === "voyageur") {
        updateAuthState();
      }
    };
    
    const handleAuthChange = () => {
      console.log("Navbar - Auth change event received");
      updateAuthState();
    };
    
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("auth-change", handleAuthChange);
    
    setTimeout(() => {
      console.log("Navbar - Delayed check");
      updateAuthState();
    }, 500);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, []);

  const handleLoginSuccess = () => {
    console.log("Navbar - Login success");
    updateAuthState();
    setIsLoginOpen(false);
  };

  const handleSignupSuccess = () => {
    console.log("Navbar - Signup success");
    updateAuthState();
    setIsSignupOpen(false);
  };
  
  const handleForgotPassword = () => {
    setIsLoginOpen(false);
    setIsResetOpen(true);
  };

  const handleBackToLogin = () => {
    setIsResetOpen(false);
    setIsLoginOpen(true);
  };

  const handleSwitchToSignup = () => {
    setIsLoginOpen(false);
    setIsSignupOpen(true);
  };

  const handleSwitchToSignIn = () => {
    setIsSignupOpen(false);
    setIsLoginOpen(true);
  };

  const handleLogout = () => {
    console.log("Navbar - Logout");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("voyageur");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
    setInitials("");
    setAnchorEl(null);
    navigate("/");
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleClose();
    // Add navigation to profile page if needed
    // navigate("/profile");
  };

  console.log("Navbar - Rendering, isAuthenticated:", isAuthenticated);

  const handleLangClick = (event) => {
    setLangAnchorEl(event.currentTarget);
  };

  const handleLangClose = () => {
    setLangAnchorEl(null);
  };

  const handleLanguageChange = (lang) => {
  setLanguage(lang);
  setLangAnchorEl(null);

  i18n.changeLanguage(lang.toLowerCase());
  localStorage.setItem("lang", lang.toLowerCase());
  if (lang === "AR") {
  document.body.dir = "rtl";
} else {
  document.body.dir = "ltr";
}
};

  // Function to get flag image based on language
  const getFlagImage = (lang) => {
    switch(lang) {
      case "FR":
        return fr;
      case "EN":
        return en;
      case "AR":
        return alg;
      default:
        return fr;
    }
  };

  return (
    <>
      <nav className="bg-white shadow-md">
        <div className="flex items-center justify-between max-w-7xl mx-auto px-6 py-4">
          <div 
            className="text-xl font-bold text-[#00C0E8] cursor-pointer font-playfair"
            onClick={() => navigate("/")}
          >
            Traveling!
          </div>
          
          <div className="hidden md:flex space-x-6 absolute left-1/2 transform -translate-x-1/2">
            <NavItem to="/#hero">{t("accueil")}</NavItem>
            <NavItem to="/#destinations">{t("voyage")}</NavItem>
            <NavItem to="/#offres">{t("offres")}</NavItem>
            <NavItem to="/about">{t("apropos")}</NavItem>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Language Selector - Cercle avec drapeau et texte à côté */}
            

            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => setIsSignupOpen(true)}
                  className="px-4 py-2 rounded-3xl text-slate-700 font-medium hover:text-sky-500 transition"
                >
                  {t("inscription")}
                </button>
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="px-4 py-2 rounded-3xl bg-[#00C0E8] text-white hover:bg-sky-500 transition font-medium"
                >
                  {t("connexion")}
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <IconButton
                  onClick={handleAvatarClick}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls={open ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                >
                  <Avatar 
                    sx={{ 
                      bgcolor: "#00C0E8", 
                      width: 40, 
                      height: 40,
                      cursor: "pointer"
                    }}
                  >
                    {initials || "U"}
                  </Avatar>
                </IconButton>
                <Menu
                  id="account-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  onClick={handleClose}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      minWidth: 150,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      borderRadius: '12px',
                    }
                  }}
                >
                  <MenuItem onClick={handleProfileClick} sx={{ py: 1.5 }}>
                    {t("monProfil")}
                  </MenuItem>
                  <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
                    {t("deconnexion")}
                  </MenuItem>
                </Menu>
              </div>
            )}
            <div 
              className="flex items-center space-x-2 cursor-pointer group"
              onClick={handleLangClick}
              aria-expanded={langOpen}
              aria-haspopup="true"
            >
              {/* Cercle avec le drapeau */}
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-[#00C0E8] transition-all duration-300">
                <img 
                  src={getFlagImage(language)} 
                  alt={`${language} flag`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Texte à côté du cercle */}
              <div className="flex items-center space-x-1">
                <span className="text-sm font-medium text-gray-700 group-hover:text-[#00C0E8] transition-colors">
                  {language}
                </span>
                <svg 
                  className={`w-4 h-4 text-gray-500 group-hover:text-[#00C0E8] transition-all ${langOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <Menu
              anchorEl={langAnchorEl}
              open={langOpen}
              onClose={handleLangClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 180,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  borderRadius: '12px',
                }
              }}
            >
              <MenuItem 
                onClick={() => handleLanguageChange("FR")}
                selected={language === "FR"}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1.5,
                  py: 1.5,
                  bgcolor: language === "FR" ? 'rgba(0, 192, 232, 0.1)' : 'transparent',
                  '&:hover': { bgcolor: 'rgba(0, 192, 232, 0.05)' },
                  '&.Mui-selected': {
                    bgcolor: 'rgba(0, 192, 232, 0.1)',
                    '&:hover': {
                      bgcolor: 'rgba(0, 192, 232, 0.15)',
                    }
                  }
                }}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img 
                    src={fr} 
                    alt="French flag"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="flex-1">Français</span>
                {language === "FR" && (
                  <svg className="w-4 h-4 text-[#00C0E8]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </MenuItem>
              
              <MenuItem 
                onClick={() => handleLanguageChange("EN")}
                selected={language === "EN"}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1.5,
                  py: 1.5,
                  bgcolor: language === "EN" ? 'rgba(0, 192, 232, 0.1)' : 'transparent',
                  '&:hover': { bgcolor: 'rgba(0, 192, 232, 0.05)' },
                  '&.Mui-selected': {
                    bgcolor: 'rgba(0, 192, 232, 0.1)',
                    '&:hover': {
                      bgcolor: 'rgba(0, 192, 232, 0.15)',
                    }
                  }
                }}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img 
                    src={en} 
                    alt="English flag"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="flex-1">English</span>
                {language === "EN" && (
                  <svg className="w-4 h-4 text-[#00C0E8]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </MenuItem>
              
              <MenuItem 
                onClick={() => handleLanguageChange("AR")}
                selected={language === "AR"}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1.5,
                  py: 1.5,
                  bgcolor: language === "AR" ? 'rgba(0, 192, 232, 0.1)' : 'transparent',
                  '&:hover': { bgcolor: 'rgba(0, 192, 232, 0.05)' },
                  '&.Mui-selected': {
                    bgcolor: 'rgba(0, 192, 232, 0.1)',
                    '&:hover': {
                      bgcolor: 'rgba(0, 192, 232, 0.15)',
                    }
                  }
                }}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img 
                    src={alg} 
                    alt="Algeria flag"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="flex-1">العربية</span>
                {language === "AR" && (
                  <svg className="w-4 h-4 text-[#00C0E8]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </MenuItem>
            </Menu>
            {/* Hamburger Button (Mobile Only) */}
<button
  className="md:hidden flex flex-col justify-center items-center w-10 h-10 space-y-1"
  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
>
  <span
    className={`h-0.5 w-6 bg-[#00C0E8] transition-all duration-300 ${
      isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
    }`}
  />
  <span
    className={`h-0.5 w-6 bg-[#00C0E8] transition-all duration-300 ${
      isMobileMenuOpen ? "opacity-0" : ""
    }`}
  />
  <span
    className={`h-0.5 w-6 bg-[#00C0E8] transition-all duration-300 ${
      isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
    }`}
  />
</button>
          </div>
        </div>
      </nav>

      {/* Dialogs - unchanged */}
      <Dialog
        open={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        maxWidth="sm"
        disableScrollLock
        PaperProps={{
          style: {
            boxShadow: "none",
            overflow: "visible", 
            margin: 0,
            width: "100%",
            maxWidth: "850px",
            backgroundColor: "white",
            borderRadius: "12px",
            position: "relative",
          },
        }}
      >
        <div className="relative max-h-[80vh] overflow-y-auto"> 
          <Login 
            onLoginSuccess={handleLoginSuccess} 
            onSwitchToSignup={handleSwitchToSignup}
            onSwitchToReset={handleForgotPassword}
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
            overflow: "visible", 
            margin: 0,
            width: "100%",
            maxWidth: "850px",
            backgroundColor: "white",
            borderRadius: "12px",
            position: "relative",
          },
        }}
      >
        <div className="relative max-h-[80vh] overflow-y-auto">
          <Signup 
            onSwitchToSignin={handleSwitchToSignIn} 
            onSignupSuccess={handleSignupSuccess}
          />
        </div>
      </Dialog>

      <Dialog
        open={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        maxWidth="sm"
        disableScrollLock
        PaperProps={{
          style: {
            boxShadow: "none",
            overflow: "visible", 
            margin: 0,
            width: "100%",
            maxWidth: "450px",
            backgroundColor: "white",
            borderRadius: "16px",
            position: "relative",
          },
        }}
      >
        <div className="relative max-h-[80vh] overflow-y-auto"> 
          <ForgotPassword
            onBackToLogin={handleBackToLogin}
            onSwitchToLogin={handleBackToLogin}
            handleBackToLogin={handleBackToLogin}
          />
        </div>
      </Dialog>
      {/* Mobile Menu */}
<div
  className={`md:hidden overflow-hidden transition-all duration-500 ${
    isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
  }`}
>
  <div className="bg-white shadow-md px-6 py-6 space-y-6">
    <MobileNavItem to="/#hero" onClick={() => setIsMobileMenuOpen(false)}>
      {t("accueil")}
    </MobileNavItem>
    <MobileNavItem to="/#destinations" onClick={() => setIsMobileMenuOpen(false)}>
      {t("voyage")}
    </MobileNavItem>
    <MobileNavItem to="/#offres" onClick={() => setIsMobileMenuOpen(false)}>
      {t("offres")}
    </MobileNavItem>
    <MobileNavItem to="/about" onClick={() => setIsMobileMenuOpen(false)}>
      {t("apropos")}
    </MobileNavItem>
  </div>
</div>
    </>
  );
}

function NavItem({ to, children }) {
  const location = useLocation();

  const isActive =
    to === "/#hero"
      ? location.pathname === "/" && !location.hash
      : location.hash === to.replace("/", "");

  return (
    <NavLink
      to={to}
      className={`relative pb-2 transition ${
        isActive
          ? "text-[#00C0E8] font-medium"
          : "text-gray-400 hover:text-[#00C0E8]"
      }`}
    >
      {children}
      <span
        className={`absolute left-0 -bottom-1 h-[2px] bg-[#00C0E8] transition-all duration-300 ${
          isActive ? "w-full" : "w-0"
        }`}
      />
    </NavLink>
  );
  
}
function MobileNavItem({ to, children, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className="block text-lg text-gray-700 hover:text-[#00C0E8] transition"
    >
      {children}
    </NavLink>
  );
}