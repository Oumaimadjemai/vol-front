import { Routes, Route } from "react-router-dom";
import AuthCallback from "../Components/authentication/AuthCallback";


export default function AppRoutes() {
  return (
    <Routes>
 
     
      <Route path="/auth/callback" element={<AuthCallback />} />
    </Routes>
  );
}
