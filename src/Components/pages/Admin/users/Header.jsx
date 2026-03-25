import React from 'react';
import { Users, Download, UserPlus } from 'lucide-react';

const Header = ({ onAddUser, userCount }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
          Utilisateurs
        </h1>
        <p className="text-gray-500 mt-1 flex items-center gap-2">
          <Users className="w-4 h-4" />
          Gérez vos utilisateurs et leurs rôles • {userCount} utilisateurs
        </p>
      </div>
      
      <div className="flex gap-3 w-full sm:w-auto">
        <button className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 bg-white">
          <Download className="w-4 h-4" />
          <span>Exporter</span>
        </button>
        
        <button
          onClick={onAddUser}
          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#00C0E8] hover:bg-[#00a8d0] text-white rounded-xl transition-all duration-200 shadow-lg shadow-[#00C0E8]/20"
        >
          <UserPlus className="w-4 h-4" />
          <span>Ajouter</span>
        </button>
      </div>
    </div>
  );
};

export default Header;