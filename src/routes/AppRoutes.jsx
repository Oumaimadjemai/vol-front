// routes/AppRoutes.js
import { Routes, Route } from "react-router-dom";

import AuthCallback from "../Components/authentication/AuthCallback";
import Login from "../Components/authentication/Login";
import Signup from "../Components/authentication/Signup";
import ForgotPassword from "../Components/authentication/ResetPassword";
import ResetPassword from "../Components/authentication/ConfirmPassword";
import NotFound from "../Components/pages/NotFound";
import Home from "../Components/pages/Voyageur/Home/Home";
import LoginAdmin from "../Components/authentication/LoginAdmin";

// New TravelHub Imports
import TravelHubLanding from "../Components/pages/TravelHub/Landing";
import Plans from "../Components/pages/TravelHub/Plans";
import PaymentPage from "../Components/pages/TravelHub/PaymentPage";
import RegistrationSuccess from "../Components/pages/TravelHub/RegistrationSuccess";
import SuperAdminLogin from "../Components/pages/TravelHub/SuperAdminLogin";
import SuperAdminDashboard from "../Components/pages/TravelHub/SuperAdminDashboard";

import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedAdmin from "./ProtectedAdmin";
import Dashboard from "../Components/pages/Admin/Dashboard/Dashboard";

import UsersBoard from "../Components/pages/Admin/users/users";
import FlightSearch from "../Components/Vol/SearchFlight/FlightSearchPage";
import ResultatSearch from "../Components/Vol/ResultatSearchePage/ResultatSearch";
import Reservation from "../Components/Vol/Reservation/Reservation";
import Profile from "../Components/pages/Voyageur/Home/Profile";
import { Bookings } from "../Components/pages/Admin/Booking/Booking";
import { Destinations } from "../Components/pages/Admin/Destinations/Destinations";
import { Settings } from "../Components/pages/Admin/Settings/Settings";
import { Newsletter } from "../Components/pages/Admin/Newsletter/Newsletter";
import { Messages } from "../Components/pages/Admin/Messages/Messages";
import { Reports } from "../Components/pages/Admin/Reports/Reports";
import { Analytics } from "../Components/pages/Admin/Analytics/Analytics";

import PaymentSuccess from "../Components/pages/PaymentSuccess";
import PaymentCancel from "../Components/pages/PaymentCancel";
import { ConfirmationPage } from '../Components/Vol/Reservation/ReservationSystem';
export default function AppRoutes() {
  return (
    <Routes>
      {/* TRAVELHUB ENTERPRISE ROUTES */}
      <Route path="/travelhub" element={<TravelHubLanding />} />
      <Route path="/travelhub/plans" element={<Plans />} />
      <Route path="/travelhub/payment" element={<PaymentPage />} />
      <Route path="/travelhub/success" element={<RegistrationSuccess />} />
      <Route path="/travelhub/admin/login" element={<SuperAdminLogin />} />
      <Route path="/travelhub/admin/dashboard" element={<SuperAdminDashboard />} />
      
      {/* SITE NORMAL - Agency Portal Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/results" element={<ResultatSearch />} />
        <Route path="/vol" element={<FlightSearch />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:uid/:token/" element={<ResetPassword />} />
        <Route path="/profile" element={<Profile />} />
         <Route path="/payment/success" element={<PaymentSuccess />} />
   <Route path="/payment/cancel" element={<PaymentCancel />} />
     <Route path="/reservation-confirmation" element={<ConfirmationPage />} />
      </Route>
      <Route path="/admin/login" element={<LoginAdmin />} />
      <Route element={<ProtectedAdmin />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/users" element={<UsersBoard />} />
          <Route path="/admin/reservations" element={<Bookings />} />
          <Route path="/admin/reservation" element={<Reservation />} />
          <Route path="/admin/results" element={<ResultatSearch />} />
          <Route path="/admin/destinations" element={<Destinations/>}/>
          <Route path="/admin/settings" element={<Settings/>}/>
          <Route path="/admin/vol" element={<FlightSearch />} />
          <Route path="/admin/newsletter" element={<Newsletter/>}/>
          <Route path="/admin/messages" element={<Messages/>}/>
          <Route path="/admin/reports" element={<Reports/>}/>
          <Route path="/admin/analytics" element={<Analytics />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}