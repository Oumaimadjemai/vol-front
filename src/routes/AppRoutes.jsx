import { Routes, Route } from "react-router-dom";
import AuthCallback from "../Components/authentication/AuthCallback";
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
