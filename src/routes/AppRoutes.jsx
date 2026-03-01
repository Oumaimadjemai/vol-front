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
import Login from "../Components/authentication/Login";
import Signup from "../Components/authentication/Signup";
import Home from "../Components/pages/Home";


export default function AppRoutes() {
  return (
    <Routes> 
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path="/auth/callback" element={<AuthCallback />} />
    </Routes>
  );
}
