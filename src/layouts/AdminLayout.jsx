import { Outlet } from "react-router-dom";
import AdminNavbar from "../Components/Menu/AdminNavbar";


export default function AdminLayout() {
  return (
    <>
      <AdminNavbar />
      <Outlet />
    </>
  );
}