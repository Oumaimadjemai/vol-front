// Components/pages/TripHubDz/Admin/Dashboard.jsx
import { useState } from 'react';
import { Building2, CheckCircle, DollarSign, Star, Users, Calendar, AlertCircle, Info } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock data
const agencies = [
  { id: 1, name: "Global Voyages", plan: "Professional", status: "active", revenue: 29900, agents: 12, voyageurs: 456, rating: 4.8, registered: "2024-01-15" },
  { id: 2, name: "SkyHigh Travel", plan: "Enterprise", status: "active", revenue: 39900, agents: 8, voyageurs: 234, rating: 4.9, registered: "2024-02-20" },
  { id: 3, name: "Aventure Monde", plan: "Basic", status: "pending", revenue: 19900, agents: 3, voyageurs: 89, rating: 4.7, registered: "2024-03-10" }
];

const recentActivities = [
  { id: 1, action: "Nouvelle agence inscrite", agency: "Global Voyages", date: "2024-01-15 10:30", type: "success" },
  { id: 2, action: "Paiement reçu", agency: "SkyHigh Travel", amount: 39900, date: "2024-02-20 14:15", type: "success" },
  { id: 3, action: "Agence en attente", agency: "Aventure Monde", date: "2024-03-10 09:00", type: "warning" }
];

export default function SuperAdminDashboard () {
  const [dateRange, setDateRange] = useState('month');

  const stats = {
    total: agencies.length,
    active: agencies.filter(a => a.status === 'active').length,
    pending: agencies.filter(a => a.status === 'pending').length,
    totalRevenue: agencies.reduce((sum, a) => sum + a.revenue, 0),
    averageRating: (agencies.reduce((sum, a) => sum + a.rating, 0) / agencies.length).toFixed(1)
  };

  const getActivityIcon = (type) => {
    switch(type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default: return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const getActivityBg = (type) => {
    switch(type) {
      case 'success': return 'bg-green-100';
      case 'warning': return 'bg-yellow-100';
      default: return 'bg-blue-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { icon: Building2, label: "Agences totales", value: stats.total, color: "bg-blue-500", change: "+12%" },
          { icon: CheckCircle, label: "Agences actives", value: stats.active, color: "bg-green-500", change: "+5%" },
          { icon: DollarSign, label: "Revenus mensuels", value: `${stats.totalRevenue.toLocaleString()} DA`, color: "bg-yellow-500", change: "+18%" },
          { icon: Star, label: "Note moyenne", value: stats.averageRating, color: "bg-purple-500", change: "+0.2" }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition border border-gray-100"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`${stat.color} p-3 rounded-xl`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm text-green-600 font-medium bg-green-50 px-2 py-1 rounded-lg">{stat.change}</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
            <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">Croissance des agences</h3>
            <select value={dateRange} className="text-sm border rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#00c0e8]">
              <option value="month">Mois</option>
              <option value="year">Année</option>
            </select>
          </div>
          <div className="h-64 flex items-end space-x-2">
            {agencies.map((agency, i) => (
              <div key={i} className="flex-1 flex flex-col items-center group">
                <div className="w-full bg-gradient-to-t from-[#00c0e8] to-[#00c0e8]/70 rounded-t-lg transition-all" style={{ height: `${30 + i * 15}px` }}></div>
                <span className="text-xs text-gray-500 mt-2 truncate max-w-full">{agency.name.substring(0, 3)}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <h3 className="font-semibold mb-4 text-gray-800">Répartition des plans</h3>
          <div className="space-y-4">
            {[
              { name: 'Basic', count: agencies.filter(a => a.plan === 'Basic').length, color: 'bg-blue-500' },
              { name: 'Professional', count: agencies.filter(a => a.plan === 'Professional').length, color: 'bg-purple-500' },
              { name: 'Enterprise', count: agencies.filter(a => a.plan === 'Enterprise').length, color: 'bg-orange-500' }
            ].map((plan) => (
              <div key={plan.name}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">{plan.name}</span>
                  <span className="text-sm font-medium">{plan.count} agences</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className={`${plan.color} h-2 rounded-full`} style={{ width: `${(plan.count / stats.total) * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <h3 className="font-semibold mb-4 text-gray-800">Activités récentes</h3>
        <div className="space-y-3">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getActivityBg(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-sm">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.agency}</p>
                </div>
              </div>
              <div className="text-xs text-gray-400">{activity.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}