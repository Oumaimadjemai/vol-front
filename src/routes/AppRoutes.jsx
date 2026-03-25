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
import ForgotPassword from "../Components/authentication/ResetPassword";
import ResetPassword from "../Components/authentication/ConfirmPassword";
import NotFound from "../Components/pages/NotFound";
import Home from "../Components/pages/Voyageur/Home/Home";
import LoginAdmin from "../Components/authentication/LoginAdmin";

import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedAdmin from "./ProtectedAdmin";
import Dashboard from "../Components/pages/Admin/Dashboard/Dashboard";

import UsersBoard from "../Components/pages/Admin/users/users";
import FlightSearch from "../Components/Vol/SearchFlight/FlightSearchPage";
import ResultatSearch from "../Components/Vol/ResultatSearchePage/ResultatSearch";

export default function AppRoutes() {
  return (
    <Routes>

      {/* SITE NORMAL */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
         <Route path="/results" element={<ResultatSearch />} />
     <Route path="/vol" element={<FlightSearch/>} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:uid/:token/" element={<ResetPassword />} />
      </Route>

      {/* ADMIN LOGIN */}
      <Route path="/admin/login" element={<LoginAdmin />} />
      <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Dashboard/>} />
          <Route path="/admin/users" element={<UsersBoard/>}/>
        </Route>
      

      {/* ADMIN PROTECTED */}
      <Route element={<ProtectedAdmin />}>
        <Route element={<AdminLayout />}>
          
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}