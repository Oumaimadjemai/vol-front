import React from 'react';
import { Paper } from '@mui/material';
import { Search, XCircle, RefreshCw } from 'lucide-react';

const Filters = ({ 
  searchTerm, 
  onSearchChange, 
  roleFilter, 
  onRoleFilterChange,
  statusFilter,
  onStatusFilterChange,
  onClearFilters,
  showRoleFilter = true // Nouvelle prop pour contrôler l'affichage du filtre rôle
}) => {
  return (
    <Paper
      elevation={0}
      sx={{ 
        p: 2.5,
        mb: 4,
        borderRadius: 3,
        border: '1px solid #f0f0f0'
      }}
    >
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher par nom, email ou téléphone..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C0E8]/20 focus:border-[#00C0E8] transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filtre Rôle - conditionnel */}
        {showRoleFilter && (
          <select
            value={roleFilter}
            onChange={(e) => onRoleFilterChange(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C0E8]/20 focus:border-[#00C0E8] bg-white min-w-[150px]"
          >
            <option value="all">Tous les rôles</option>
            <option value="Admin">Admin</option>
            <option value="Agent">Agent</option>
            <option value="Voyageur">Voyageur</option>
          </select>
        )}

        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C0E8]/20 focus:border-[#00C0E8] bg-white min-w-[150px]"
        >
          <option value="all">Tous les statuts</option>
          <option value="Actif">Actif</option>
          <option value="Inactif">Inactif</option>
          <option value="Suspendu">Suspendu</option>
        </select>

        <button
          onClick={onClearFilters}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Réinitialiser</span>
        </button>
      </div>
    </Paper>
  );
};

export default Filters;