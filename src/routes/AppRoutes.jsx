import { Routes, Route } from "react-router-dom";
import Login from "../Components/authentication/Login";
import Signup from "../Components/authentication/Signup";


export default function AppRoutes() {
  return (
    <Routes>
 
      <Route path="/Signup" element={<Signup />} />
    
    </Routes>
  );
}
