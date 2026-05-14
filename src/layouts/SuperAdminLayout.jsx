// Components/pages/TripHubDz/Admin/Layout.jsx
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Components/pages/TripHubDz/Admin/Sidebar';
import Navbar from '../Components/pages/TripHubDz/Admin/Navbar';


export default function SuperAdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <Navbar />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}