import React, { useState} from "react";
import {
  TrendingUp,
  DollarSign,
  Users,
  CreditCard,
  Wallet,
  BarChart3,
  Award,
  Star,
  AlertCircle,
  Download,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Ticket,
  UserPlus,
} from "lucide-react";
import {
  
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
 
} from "recharts";
import { motion } from "framer-motion";

const analyticsData = {
  revenueData: [
    { month: "Jan", revenue: 145000, bookings: 85, profit: 43500 },
    { month: "Fév", revenue: 168000, bookings: 98, profit: 50400 },
    { month: "Mar", revenue: 192000, bookings: 112, profit: 57600 },
    { month: "Avr", revenue: 185000, bookings: 108, profit: 55500 },
    { month: "Mai", revenue: 210000, bookings: 125, profit: 63000 },
    { month: "Juin", revenue: 245000, bookings: 145, profit: 73500 },
    { month: "Juil", revenue: 280000, bookings: 168, profit: 84000 },
    { month: "Aoû", revenue: 265000, bookings: 158, profit: 79500 },
    { month: "Sep", revenue: 220000, bookings: 132, profit: 66000 },
    { month: "Oct", revenue: 198000, bookings: 118, profit: 59400 },
    { month: "Nov", revenue: 175000, bookings: 105, profit: 52500 },
    { month: "Déc", revenue: 235000, bookings: 142, profit: 70500 }
  ],
  destinationData: [
    { name: "Paris", value: 245, revenue: 245000, color: "#00C0E8" },
    { name: "Tokyo", value: 189, revenue: 189000, color: "#3b82f6" },
    { name: "New York", value: 156, revenue: 156000, color: "#8b5cf6" },
    { name: "Dubai", value: 134, revenue: 134000, color: "#f59e0b" },
    { name: "Rome", value: 98, revenue: 98000, color: "#10b981" },
    { name: "Bali", value: 87, revenue: 87000, color: "#ef4444" },
    { name: "London", value: 76, revenue: 76000, color: "#06b6d4" },
    { name: "Barcelone", value: 65, revenue: 65000, color: "#8b5cf6" }
  ],
  travelTypes: [
    { name: "Vols", value: 45, color: "#00C0E8", revenue: 450000 },
    { name: "Hôtels", value: 30, color: "#8b5cf6", revenue: 300000 },
    { name: "Forfaits", value: 15, color: "#10b981", revenue: 150000 },
    { name: "Activités", value: 10, color: "#f59e0b", revenue: 100000 }
  ],
  customerData: {
    total: 12450,
    new: 1250,
    active: 9870,
    churned: 580,
    retention: 78.5,
    averageSpend: 12500,
    lifetimeValue: 87500
  },
  bookingMetrics: {
    total: 1896,
    completed: 1720,
    pending: 120,
    cancelled: 56,
    conversionRate: 72.5,
    averageValue: 12500,
    averageDuration: 7.5
  },
  performanceData: [
    { metric: "Taux d'occupation", value: 85, target: 90, color: "#00C0E8" },
    { metric: "Satisfaction client", value: 92, target: 95, color: "#10b981" },
    { metric: "Taux de retour", value: 45, target: 50, color: "#8b5cf6" },
    { metric: "Note moyenne", value: 4.7, target: 4.9, color: "#f59e0b" },
    { metric: "Temps de réponse", value: 2.5, target: 2, color: "#ef4444" },
    { metric: "Marge bénéficiaire", value: 30, target: 35, color: "#06b6d4" }
  ],
  seasonalData: [
    { season: "Printemps", bookings: 320, revenue: 385000 },
    { season: "Été", bookings: 450, revenue: 540000 },
    { season: "Automne", bookings: 310, revenue: 372000 },
    { season: "Hiver", bookings: 280, revenue: 336000 }
  ],
  agentPerformance: [
    { name: "Sophie Martin", sales: 234, revenue: 292500, rating: 4.9 },
    { name: "Thomas Dubois", sales: 198, revenue: 247500, rating: 4.8 },
    { name: "Julie Lambert", sales: 187, revenue: 233750, rating: 4.9 },
    { name: "Nicolas Petit", sales: 165, revenue: 206250, rating: 4.7 },
    { name: "Camille Rousseau", sales: 156, revenue: 195000, rating: 4.8 }
  ],
  recentActivities: [
    { id: 1, type: "booking", user: "Jean Dupont", action: "a réservé", destination: "Paris", amount: 12500, date: "2026-04-28T10:30:00" },
    { id: 2, type: "payment", user: "Marie Martin", action: "a payé", destination: "Tokyo", amount: 28500, date: "2026-04-28T09:15:00" },
    { id: 3, type: "review", user: "Pierre Bernard", action: "a laissé un avis", destination: "New York", rating: 5, date: "2026-04-27T16:45:00" },
    { id: 4, type: "booking", user: "Sophie Laurent", action: "a réservé", destination: "Dubai", amount: 41000, date: "2026-04-27T14:20:00" },
    { id: 5, type: "cancellation", user: "Luc Moreau", action: "a annulé", destination: "Rome", amount: 14500, date: "2026-04-26T11:00:00" }
  ],
  topCustomers: [
    { name: "Jean Dupont", bookings: 12, spent: 187500, type: "Fidèle" },
    { name: "Marie Martin", bookings: 8, spent: 142000, type: "Premium" },
    { name: "Pierre Bernard", bookings: 6, spent: 98500, type: "Régulier" },
    { name: "Sophie Laurent", bookings: 5, spent: 87500, type: "Premium" }
  ]
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-3 border border-gray-100">
        <p className="text-sm font-semibold text-gray-900">{label}</p>
        {payload.map((p, idx) => (
          <p key={idx} className="text-sm" style={{ color: p.color }}>
            {p.name}: {p.value.toLocaleString()} {p.unit || ""}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function Analytics() {
  const [timeRange, setTimeRange] = useState("year");
  const [selectedMetric, setSelectedMetric] = useState("revenue");

  const totalRevenue = analyticsData.revenueData.reduce((sum, m) => sum + m.revenue, 0);
  const totalProfit = analyticsData.revenueData.reduce((sum, m) => sum + m.profit, 0);
  const totalBookings = analyticsData.revenueData.reduce((sum, m) => sum + m.bookings, 0);
  const averageBookingValue = totalRevenue / totalBookings;

  const statsCards = [
    {
      title: "Chiffre d'affaires",
      value: `${(totalRevenue / 1000000).toFixed(1)} M DA`,
      change: "+23.5%",
      trend: "up",
      icon: DollarSign,
      color: "from-cyan-50 to-blue-50",
      gradient: "from-[#00C0E8] to-[#0099cc]"
    },
    {
      title: "Bénéfice net",
      value: `${(totalProfit / 1000000).toFixed(1)} M DA`,
      change: "+18.2%",
      trend: "up",
      icon: Wallet,
      color: "from-green-50 to-emerald-50",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      title: "Réservations",
      value: totalBookings.toLocaleString(),
      change: "+12.5%",
      trend: "up",
      icon: Ticket,
      color: "from-blue-50 to-indigo-50",
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      title: "Valeur moyenne",
      value: `${Math.round(averageBookingValue).toLocaleString()} DA`,
      change: "+5.2%",
      trend: "up",
      icon: CreditCard,
      color: "from-purple-50 to-pink-50",
      gradient: "from-purple-500 to-pink-600"
    },
    {
      title: "Clients actifs",
      value: analyticsData.customerData.active.toLocaleString(),
      change: "+8.7%",
      trend: "up",
      icon: Users,
      color: "from-orange-50 to-amber-50",
      gradient: "from-orange-500 to-amber-600"
    },
    {
      title: "Satisfaction",
      value: `${analyticsData.performanceData.find(p => p.metric === "Satisfaction client")?.value}%`,
      change: "+3.2%",
      trend: "up",
      icon: Star,
      color: "from-yellow-50 to-orange-50",
      gradient: "from-yellow-500 to-orange-600"
    }
  ];

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-[#00C0E8] to-[#0096b8] overflow-hidden rounded-2xl">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="relative px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-3 mb-3 justify-center md:justify-start">
                  <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
                    <TrendingUp className="text-white text-2xl" />
                  </div>
                  <span className="text-white/80 text-sm font-medium tracking-wide">ANALYTIQUE & STATISTIQUES</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Tableau de bord
                </h1>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex gap-3"
            >
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2.5 bg-white/20 backdrop-blur-sm text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-white/20 border border-white/30"
              >
                <option value="week" className="text-gray-900">Cette semaine</option>
                <option value="month" className="text-gray-900">Ce mois</option>
                <option value="quarter" className="text-gray-900">Ce trimestre</option>
                <option value="year" className="text-gray-900">Cette année</option>
              </select>
              <button className="bg-white/20 backdrop-blur-sm text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-white/30 transition-all">
                <Download className="w-4 h-4" />
                Exporter
              </button>
              <button className="bg-white text-[#00C0E8] px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all hover:scale-105">
                <RefreshCw className="w-4 h-4" />
                Actualiser
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Stats Cards - Style unifié */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-gradient-to-br ${stat.color} backdrop-blur-sm rounded-2xl p-4 shadow-md hover:shadow-lg transition-all hover:-translate-y-1`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="bg-white/50 backdrop-blur-sm p-2 rounded-xl">
                    <Icon className="w-4 h-4 text-[#00C0E8]" />
                  </div>
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="w-4 h-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                  )}
                </div>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-600 mt-1">{stat.title}</p>
                <p className="text-xs text-green-600 mt-1">{stat.change}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Revenue Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-[#00C0E8] to-[#0096b8] rounded-2xl p-6 shadow-lg mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Performance globale</p>
              <h3 className="text-3xl font-bold text-white mt-1">{(totalRevenue / 1000000).toFixed(1)} M DA</h3>
              <p className="text-white/70 text-xs mt-1">+23.5% vs année précédente</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <BarChart3 className="size-6 text-white" />
            </div>
          </div>
        </motion.div>

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Évolution des revenus</h3>
                <p className="text-sm text-gray-500">Revenus et bénéfices mensuels</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedMetric("revenue")}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                    selectedMetric === "revenue"
                      ? "bg-[#00C0E8] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Revenus
                </button>
                <button
                  onClick={() => setSelectedMetric("profit")}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                    selectedMetric === "profit"
                      ? "bg-[#00C0E8] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Bénéfices
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={analyticsData.revenueData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00C0E8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00C0E8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {selectedMetric === "revenue" && (
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#00C0E8"
                    strokeWidth={3}
                    fill="url(#revenueGradient)"
                    name="Revenus (k DA)"
                  />
                )}
                {selectedMetric === "profit" && (
                  <Area
                    type="monotone"
                    dataKey="profit"
                    stroke="#10b981"
                    strokeWidth={3}
                    fill="url(#profitGradient)"
                    name="Bénéfices (k DA)"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Destination Popularity Pie Chart */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Destinations populaires</h3>
            <ResponsiveContainer width="100%" height={350}>
              <RePieChart>
                <Pie
                  data={analyticsData.destinationData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  innerRadius={60}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {analyticsData.destinationData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} stroke="white" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </RePieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {analyticsData.destinationData.slice(0, 4).map((dest, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dest.color }} />
                  <span className="text-sm text-gray-600">{dest.name}</span>
                  <span className="text-sm font-semibold text-gray-900 ml-auto">{dest.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bar Chart - Bookings per month */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Réservations mensuelles</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={analyticsData.revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="bookings" fill="#8b5cf6" radius={[10, 10, 0, 0]} name="Réservations" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Travel Types Donut Chart */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par type de voyage</h3>
            <ResponsiveContainer width="100%" height={350}>
              <RePieChart>
                <Pie
                  data={analyticsData.travelTypes}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  innerRadius={80}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {analyticsData.travelTypes.map((entry, index) => (
                    <Cell key={index} fill={entry.color} stroke="white" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </RePieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {analyticsData.travelTypes.map((type, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }} />
                  <span className="text-sm text-gray-600">{type.name}</span>
                  <span className="text-sm font-semibold text-gray-900 ml-auto">
                    {type.revenue.toLocaleString()} DA
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Indicateurs de performance</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {analyticsData.performanceData.map((metric, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-4 bg-gray-50 rounded-xl hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm text-gray-600">{metric.metric}</p>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: metric.color }} />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {metric.metric.includes("Note") ? metric.value : `${metric.value}${metric.metric.includes("Taux") || metric.metric.includes("Marge") ? "%" : ""}`}
                </p>
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Actuel</span>
                    <span>Objectif: {metric.target}{metric.metric.includes("Taux") || metric.metric.includes("Marge") ? "%" : ""}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="rounded-full h-2 transition-all"
                      style={{
                        width: `${(metric.value / metric.target) * 100}%`,
                        backgroundColor: metric.color
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Customer & Booking Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Customer Metrics */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Métriques clients</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
                <Users className="w-5 h-5 text-blue-600 mb-2" />
                <p className="text-2xl font-bold text-gray-900">{analyticsData.customerData.total.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Clients totaux</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                <UserPlus className="w-5 h-5 text-green-600 mb-2" />
                <p className="text-2xl font-bold text-gray-900">+{analyticsData.customerData.new.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Nouveaux clients</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                <Wallet className="w-5 h-5 text-purple-600 mb-2" />
                <p className="text-2xl font-bold text-gray-900">{analyticsData.customerData.averageSpend.toLocaleString()} DA</p>
                <p className="text-sm text-gray-600">Dépense moyenne</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl">
                <Award className="w-5 h-5 text-orange-600 mb-2" />
                <p className="text-2xl font-bold text-gray-900">{analyticsData.customerData.retention}%</p>
                <p className="text-sm text-gray-600">Taux de rétention</p>
              </div>
            </div>
          </div>

          {/* Agent Performance */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance des agents</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 rounded-lg">
                  <tr>
                    <th className="text-left py-3 px-3 text-xs font-medium text-gray-500">Agent</th>
                    <th className="text-left py-3 px-3 text-xs font-medium text-gray-500">Ventes</th>
                    <th className="text-left py-3 px-3 text-xs font-medium text-gray-500">CA</th>
                    <th className="text-left py-3 px-3 text-xs font-medium text-gray-500">Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {analyticsData.agentPerformance.map((agent, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-3 font-medium text-gray-900">{agent.name}</td>
                      <td className="py-3 px-3 text-gray-600">{agent.sales}</td>
                      <td className="py-3 px-3 text-gray-600">{agent.revenue.toLocaleString()} DA</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="font-semibold">{agent.rating}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Activities & Top Customers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Activités récentes</h3>
            <div className="space-y-3">
              {analyticsData.recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === "booking" ? "bg-green-100" :
                    activity.type === "payment" ? "bg-blue-100" :
                    activity.type === "review" ? "bg-yellow-100" : "bg-red-100"
                  }`}>
                    {activity.type === "booking" && <Ticket className="w-5 h-5 text-green-600" />}
                    {activity.type === "payment" && <CreditCard className="w-5 h-5 text-blue-600" />}
                    {activity.type === "review" && <Star className="w-5 h-5 text-yellow-600" />}
                    {activity.type === "cancellation" && <AlertCircle className="w-5 h-5 text-red-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-semibold">{activity.user}</span> {activity.action}
                      {activity.destination && <span> {activity.destination}</span>}
                    </p>
                    {activity.amount && (
                      <p className="text-xs text-gray-500">{activity.amount.toLocaleString()} DA</p>
                    )}
                    {activity.rating && (
                      <div className="flex items-center gap-0.5 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < activity.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">
                    {new Date(activity.date).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Top Customers */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Meilleurs clients</h3>
            <div className="space-y-3">
              {analyticsData.topCustomers.map((customer, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50 to-transparent rounded-xl border border-amber-100 hover:shadow-md transition-all">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold">
                    {customer.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{customer.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-500">{customer.bookings} réservations</span>
                      <span className="text-xs font-semibold text-amber-600">{customer.spent.toLocaleString()} DA</span>
                    </div>
                  </div>
                  <div className="px-2 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-semibold">
                    {customer.type}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Seasonal Trends */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendances saisonnières</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {analyticsData.seasonalData.map((season, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-4 rounded-xl text-center transition-all hover:scale-105 cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${idx === 0 ? '#00C0E8' : idx === 1 ? '#f59e0b' : idx === 2 ? '#8b5cf6' : '#10b981'}10, white)`,
                  border: `1px solid ${idx === 0 ? '#00C0E8' : idx === 1 ? '#f59e0b' : idx === 2 ? '#8b5cf6' : '#10b981'}20`
                }}
              >
                <p className="text-lg font-semibold text-gray-900">{season.season}</p>
                <p className="text-2xl font-bold mt-2" style={{ color: idx === 0 ? '#00C0E8' : idx === 1 ? '#f59e0b' : idx === 2 ? '#8b5cf6' : '#10b981' }}>
                  {season.bookings}
                </p>
                <p className="text-sm text-gray-600">réservations</p>
                <p className="text-sm font-semibold mt-2 text-gray-700">
                  {season.revenue.toLocaleString()} DA
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}