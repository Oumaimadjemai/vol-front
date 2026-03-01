import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Login from "../authentication/Login";
import Dialog from "@mui/material/Dialog";
import Signup from "../authentication/Signup";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import ForgotPassword from "../authentication/ResetPassword";

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false); // State for forgot password
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initials, setInitials] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  
  const open = Boolean(anchorEl);

  // Function to update auth state from localStorage
  const updateAuthState = () => {
    const token = localStorage.getItem("access_token");
    const voyageur = localStorage.getItem("voyageur");
    
    console.log("Navbar - Checking auth state:", { 
      hasToken: !!token, 
      hasVoyageur: !!voyageur,
      token: token ? token.substring(0, 10) + "..." : null
    });
    
    // Force check localStorage directly
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
    
    // Listen for storage events (in case of multiple tabs)
    const handleStorageChange = (e) => {
      console.log("Navbar - Storage changed:", e.key, e.newValue);
      if (e.key === "access_token" || e.key === "voyageur") {
        updateAuthState();
      }
    };
    
    // Listen for custom auth-change event
    const handleAuthChange = () => {
      console.log("Navbar - Auth change event received");
      updateAuthState();
    };
    
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("auth-change", handleAuthChange);
    
    // Also check immediately after mount
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
  
  // Handler to open forgot password dialog
  const handleForgotPassword = () => {
    setIsLoginOpen(false); // Close login dialog
    setIsResetOpen(true); // Open forgot password dialog
  };

  // Handler to go back to login from forgot password
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
  };

  console.log("Navbar - Rendering, isAuthenticated:", isAuthenticated);

  return (
    <>
      <nav className="bg-white shadow-md">
        <div className="flex items-center justify-between max-w-7xl mx-auto px-6 py-4">
          <div 
            className="text-xl font-bold text-[#00C0E8] cursor-pointer"
            onClick={() => navigate("/")}
          >
            Traveling!
          </div>
          
          <div className="hidden md:flex space-x-6 absolute left-1/2 transform -translate-x-1/2">
            <NavItem to="/">Home</NavItem>
            <NavItem to="/travel">Travel</NavItem>
            <NavItem to="/package">Package</NavItem>
            <NavItem to="/about">About</NavItem>
          </div>
          
          <div className="flex space-x-4">
            {!isAuthenticated ? (
              <>
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
                >
                  <MenuItem onClick={handleProfileClick}>
                    Mon Profil
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    Déconnexion
                  </MenuItem>
                </Menu>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Login Dialog */}
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
          <Login 
            onLoginSuccess={handleLoginSuccess} 
            onSwitchToSignup={handleSwitchToSignup}
            onSwitchToReset={handleForgotPassword} // Pass the handler
          />
        </div>
      </Dialog>
      
      {/* Signup Dialog */}
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
          <Signup 
            onSwitchToSignin={handleSwitchToSignIn} 
            onSignupSuccess={handleSignupSuccess}
          />
        </div>
      </Dialog>

      {/* Forgot Password Dialog */}
      <Dialog
        open={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        maxWidth="sm"
        disableScrollLock
        PaperProps={{
          style: {
            boxShadow: "none",
            overflow: "hidden",
            margin: 0,
            width: "100%",
            maxWidth: "450px",
            backgroundColor: "white",
            borderRadius: "16px",
            position: "relative",
          },
        }}
      >
        <ForgotPassword
          onBackToLogin={handleBackToLogin}
          onSwitchToLogin={handleBackToLogin}
          handleBackToLogin={handleBackToLogin}
        />
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