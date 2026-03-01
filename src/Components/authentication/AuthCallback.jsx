import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");

  useEffect(() => {
    // Get parameters from URL
    const params = new URLSearchParams(location.search);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const voyageurParam = params.get("voyageur");

    console.log("AuthCallback - URL params:", {
      accessToken: accessToken ? "present" : "missing",
      refreshToken: refreshToken ? "present" : "missing",
      voyageurParam: voyageurParam ? "present" : "missing"
    });

    if (accessToken && refreshToken && voyageurParam) {
      try {
        // Decode and parse the user data
        const voyageur = JSON.parse(decodeURIComponent(voyageurParam));
        console.log("AuthCallback - User data received:", voyageur);
        
        // Store everything in localStorage
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("refresh_token", refreshToken);
        localStorage.setItem("voyageur", JSON.stringify(voyageur));
        localStorage.setItem("role", voyageur.role || "voyageur");
        
        // Verify they were stored
        console.log("AuthCallback - localStorage after set:", {
          token: localStorage.getItem("access_token") ? "✓" : "✗",
          voyageur: localStorage.getItem("voyageur") ? "✓" : "✗"
        });
        
        // Dispatch event for Navbar to update
        window.dispatchEvent(new Event('auth-change'));
        
        // Redirect to home page
        navigate("/");
      } catch (err) {
        console.error("Error parsing user data:", err);
        setError("Erreur lors de la connexion");
        setTimeout(() => navigate("/login"), 3000);
      }
    } else {
      console.error("Missing parameters in URL");
      setError("Paramètres de connexion manquants");
      setTimeout(() => navigate("/login"), 3000);
    }
  }, [location, navigate]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <>
          <CircularProgress sx={{ color: "#00C0E8" }} />
          <p style={{ marginTop: "20px" }}>Connexion en cours...</p>
        </>
      )}
    </Box>
  );
}