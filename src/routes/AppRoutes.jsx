import { Routes, Route } from "react-router-dom";
import AuthCallback from "../Components/authentication/AuthCallback";
import FlightSearch from "../Components/Vol/SearchFlight/FlightSearchPage";
import ResultatSearch from "../Components/Vol/ResultatSearchePage/ResultatSearch";
export default function AppRoutes() {
  return (
    <Routes>
     <Route path="/results" element={<ResultatSearch />} />
     <Route path="/vol" element={<FlightSearch/>} />
     <Route path="/auth/callback" element={<AuthCallback />} />
    </Routes>
  );
}
