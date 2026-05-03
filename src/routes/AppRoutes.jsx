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
import Reservation from "../Components/Vol/Reservation/Reservation";
import Profile from "../Components/pages/Voyageur/Home/Profile";
import { Bookings } from "../Components/pages/Admin/Booking/Booking";
import PaymentSuccess from "../Components/pages/PaymentSuccess";
import PaymentCancel from "../Components/pages/PaymentCancel";
import { ConfirmationPage } from '../Components/Vol/Reservation/ReservationSystem';
export default function AppRoutes() {
  return (
    <Routes>
      {/* SITE NORMAL */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/results" element={<ResultatSearch />} />
        <Route path="/vol" element={<FlightSearch />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/admin/login" element={<LoginAdmin />} />

        <Route
          path="/reset-password/:uid/:token/"
          element={<ResetPassword />}
        />
        <Route path="/profile" element={<Profile />} />
                  <Route path="/payment/success" element={<PaymentSuccess />} />
   <Route path="/payment/cancel" element={<PaymentCancel />} />
     <Route path="/reservation-confirmation" element={<ConfirmationPage />} />

      </Route>

      {/* ADMIN PROTECTED - COMMENTED OUT FOR NOW */}
      <Route element={<ProtectedAdmin />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Dashboard />}/>
            <Route path="/admin/users" element={<UsersBoard />} />
            <Route path="/admin/reservations" element={<Bookings />} />
            <Route path="/admin/reservation" element={<Reservation />} />
            <Route path="/admin/results" element={<ResultatSearch />} />
  
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
