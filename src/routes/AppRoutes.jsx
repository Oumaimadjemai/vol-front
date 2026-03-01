import { Routes, Route } from "react-router-dom";
import AuthCallback from "../Components/authentication/AuthCallback";
import Login from "../Components/authentication/Login";
import Signup from "../Components/authentication/Signup";
import Home from "../Components/pages/Home";
import ForgotPassword from "../Components/authentication/ResetPassword";
import ResetPassword from "../Components/authentication/ConfirmPassword";


export default function AppRoutes() {
  return (
    <Routes> 
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/forgot-password" element={<ForgotPassword/>}/>
      <Route path='/reset-password/:uid/:token/' element={<ResetPassword/>}/>
    </Routes>
  );
}
