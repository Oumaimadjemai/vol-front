import { useState, useEffect } from "react";
import axios from "axios";

export default function useAirports() {
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAirports = async () => {
      try {
        console.log(" Chargement des aéroports...");
        const response = await axios.get("http://localhost:3002/api/airports");
        
        if (response.data?.data) {
          setAirports(response.data.data);
          console.log(` ${response.data.data.length} aéroports chargés`);
        }
      } catch (err) {
        console.error(" Erreur chargement aéroports:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAirports();
  }, []);

  return { airports, loading, error };
}