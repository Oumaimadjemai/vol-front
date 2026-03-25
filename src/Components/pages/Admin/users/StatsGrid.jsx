import React from 'react';
import { Paper } from '@mui/material';
import { TrendingUp } from 'lucide-react';

const StatsGrid = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const colorMap = {
          'blue': '#3b82f6',
          'green': '#10b981',
          'purple': '#8b5cf6',
          'orange': '#f97316'
        };
        const iconColor = colorMap[stat.color.split('-')[1]] || '#3b82f6';
        
        return (
          <Paper
            key={index}
            elevation={0}
            sx={{ 
              p: 3,
              borderRadius: 3,
              border: '1px solid #f0f0f0',
              transition: 'all 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 24px -8px rgba(0,0,0,0.1)',
              }
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-xl`}>
                <Icon className="w-5 h-5" style={{ color: iconColor }} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-sm">
              <span className="text-green-600 font-medium flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                {stat.change}
              </span>
              <span className="text-gray-400">vs mois dernier</span>
            </div>
          </Paper>
        );
      })}
    </div>
  );
};

export default StatsGrid;