// Components/pages/TripHubDz/Admin/Analytics.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Target, BarChart3, PieChart as PieChartIcon, Download, Calendar, Filter } from 'lucide-react';

// Mock data
const agencies = [
  { id: 1, name: "Global Voyages", voyageurs: 1250, revenue: 29900, rating: 4.8, growth: 23, region: "Centre" },
  { id: 2, name: "SkyHigh Travel", voyageurs: 890, revenue: 39900, rating: 4.9, growth: 18, region: "Est" },
  { id: 3, name: "Aventure Monde", voyageurs: 450, revenue: 19900, rating: 4.7, growth: 32, region: "Ouest" },
  { id: 4, name: "Sahara Tours", voyageurs: 2340, revenue: 24900, rating: 4.6, growth: 45, region: "Sud" },
  { id: 5, name: "Desert Travel", voyageurs: 678, revenue: 29900, rating: 4.8, growth: 12, region: "Centre" }
];

const topDestinations = [
  { name: "Paris", bookings: 2340, growth: 23 },
  { name: "Dubai", bookings: 1890, growth: 18 },
  { name: "Istanbul", bookings: 1560, growth: 32 },
  { name: "Tunis", bookings: 1230, growth: 15 },
  { name: "Rome", bookings: 980, growth: 8 }
];

const monthlyGrowth = [
  { month: "Jan", value: 12 },
  { month: "Fév", value: 15 },
  { month: "Mar", value: 18 },
  { month: "Avr", value: 22 },
  { month: "Mai", value: 25 },
  { month: "Jun", value: 28 }
];

export default function SuperAnalytics() {
  const [period, setPeriod] = useState('month');
  const [selectedRegion, setSelectedRegion] = useState('all');

  const totalVoyageurs = agencies.reduce((sum, a) => sum + a.voyageurs, 0);
  const avgGrowth = (agencies.reduce((sum, a) => sum + a.growth, 0) / agencies.length).toFixed(1);
  const totalRevenue = agencies.reduce((sum, a) => sum + a.revenue, 0);
  const conversionRate = ((totalVoyageurs / 5000) * 100).toFixed(1);

  const regions = [
    { name: "Toutes", value: "all", count: agencies.length },
    { name: "Centre", value: "Centre", count: agencies.filter(a => a.region === "Centre").length },
    { name: "Est", value: "Est", count: agencies.filter(a => a.region === "Est").length },
    { name: "Ouest", value: "Ouest", count: agencies.filter(a => a.region === "Ouest").length },
    { name: "Sud", value: "Sud", count: agencies.filter(a => a.region === "Sud").length }
  ];

  const filteredAgencies = selectedRegion === 'all' ? agencies : agencies.filter(a => a.region === selectedRegion);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Analyses & Performances</h2>
          <p className="text-sm text-gray-500 mt-1">Indicateurs clés de performance</p>
        </div>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition"><Download className="h-5 w-5 text-gray-600" /></button>
          <select value={period} onChange={(e) => setPeriod(e.target.value)} className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#00c0e8]">
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
            <option value="year">Cette année</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {[
          { icon: TrendingUp, label: "Croissance moyenne", value: `+${avgGrowth}%`, color: "bg-green-500", detail: "vs mois dernier" },
          { icon: Users, label: "Voyageurs totaux", value: totalVoyageurs.toLocaleString(), color: "bg-blue-500", detail: "+234 ce mois" },
          { icon: Target, label: "Taux de conversion", value: `${conversionRate}%`, color: "bg-purple-500", detail: "+5% vs cible" },
          { icon: BarChart3, label: "Revenu moyen", value: `${(totalRevenue / agencies.length).toLocaleString()} DA`, color: "bg-orange-500", detail: "par agence" }
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className={`${stat.color} w-10 h-10 rounded-xl flex items-center justify-center`}><stat.icon className="h-5 w-5 text-white" /></div>
              <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-lg">{stat.detail}</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
            <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agency Performance */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-semibold text-gray-800">Performance des agences</h3>
              <p className="text-xs text-gray-500 mt-0.5">Top 5 par nombre de voyageurs</p>
            </div>
            <select value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)} className="text-sm border rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#00c0e8]">
              {regions.map(r => <option key={r.value} value={r.value}>{r.name} ({r.count})</option>)}
            </select>
          </div>
          <div className="space-y-4">
            {filteredAgencies.sort((a, b) => b.voyageurs - a.voyageurs).slice(0, 5).map((agency, index) => (
              <div key={agency.id}>
                <div className="flex justify-between mb-1">
                  <div className="flex items-center gap-2"><span className="text-xs font-medium text-gray-400">#{index + 1}</span><span className="text-sm font-medium text-gray-700">{agency.name}</span></div>
                  <span className="text-sm text-gray-500">{agency.voyageurs.toLocaleString()} voyageurs</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-gradient-to-r from-[#00c0e8] to-[#00c0e8]/70 h-2 rounded-full" style={{ width: `${(agency.voyageurs / 2500) * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Destinations */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <h3 className="font-semibold mb-4 text-gray-800">Destinations populaires</h3>
          <div className="space-y-3">
            {topDestinations.map((dest, i) => (
              <div key={i} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg transition">
                <div className="flex items-center gap-3"><span className="text-sm font-medium text-gray-700">{dest.name}</span><span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded">+{dest.growth}%</span></div>
                <div className="flex items-center gap-4"><span className="text-sm text-gray-500">{dest.bookings.toLocaleString()} réservations</span><div className="w-24 bg-gray-100 rounded-full h-1.5"><div className="bg-[#00c0e8] h-1.5 rounded-full" style={{ width: `${(dest.bookings / 2500) * 100}%` }}></div></div></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Growth Chart */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <h3 className="font-semibold mb-4 text-gray-800">Croissance mensuelle</h3>
        <div className="h-64 flex items-end space-x-4">
          {monthlyGrowth.map((item, i) => (
            <div key={i} className="flex-1 flex flex-col items-center group">
              <div className="relative w-full"><div className="w-full bg-gradient-to-t from-[#00c0e8] to-[#00c0e8]/70 rounded-t-lg transition-all group-hover:opacity-80" style={{ height: `${item.value * 4}px` }}><div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-gray-800 text-white text-xs px-2 py-1 rounded">+{item.value}%</div></div></div>
              <span className="text-xs text-gray-500 mt-2">{item.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}