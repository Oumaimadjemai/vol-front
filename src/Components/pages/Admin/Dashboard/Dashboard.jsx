import { Card, CardContent, Typography, Chip } from "@mui/material";
import { LocationOn, Add, Visibility } from "@mui/icons-material";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { Link, Outlet } from "react-router-dom";
import {
  ArrowUpRight,
  Calendar,
  DollarSign,
  MapPin,
  Users,
  TrendingUp,
  Activity,
  Globe,
  CreditCard,
} from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  {
    title: "Réservations",
    value: "1,234",
    change: "+12.5%",
    changeValue: "+142",
    icon: Calendar,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    iconBg: "bg-blue-500",
    trending: "up",
  },
  {
    title: "Revenus du Mois",
    value: "€145,680",
    change: "+8.3%",
    changeValue: "+€11,200",
    icon: DollarSign,
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50",
    iconBg: "bg-green-500",
    trending: "up",
  },
  {
    title: "Utilisateurs Actifs",
    value: "8,456",
    change: "+15.2%",
    changeValue: "+1,115",
    icon: Users,
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    iconBg: "bg-purple-500",
    trending: "up",
  },
  {
    title: "Destinations",
    value: "124",
    change: "+3.2%",
    changeValue: "+4",
    icon: MapPin,
    color: "from-cyan-500 to-cyan-600",
    bgColor: "bg-cyan-50",
    iconBg: "bg-cyan-500",
    trending: "up",
  },
];

const bookingsData = [
  { month: "Jan", bookings: 65, revenue: 45000 },
  { month: "Fév", bookings: 78, revenue: 52000 },
  { month: "Mar", bookings: 90, revenue: 61000 },
  { month: "Avr", bookings: 81, revenue: 58000 },
  { month: "Mai", bookings: 95, revenue: 67000 },
  { month: "Juin", bookings: 110, revenue: 78000 },
  { month: "Juil", bookings: 125, revenue: 85000 },
  { month: "Aoû", bookings: 118, revenue: 82000 },
  { month: "Sep", bookings: 105, revenue: 75000 },
  { month: "Oct", bookings: 98, revenue: 72000 },
  { month: "Nov", bookings: 112, revenue: 79000 },
  { month: "Déc", bookings: 135, revenue: 92000 },
];

const destinationsData = [
  { name: "Europe", value: 45, color: "#00C0E8" },
  { name: "Asie", value: 30, color: "#3b82f6" },
  { name: "Amérique", value: 15, color: "#8b5cf6" },
  { name: "Afrique", value: 10, color: "#10b981" },
];

const performanceData = [
  { subject: "Jan", A: 65, B: 45, fullMark: 150 },
  { subject: "Fév", A: 78, B: 52, fullMark: 150 },
  { subject: "Mar", A: 90, B: 61, fullMark: 150 },
  { subject: "Avr", A: 81, B: 58, fullMark: 150 },
  { subject: "Mai", A: 95, B: 67, fullMark: 150 },
  { subject: "Juin", A: 110, B: 78, fullMark: 150 },
];

const quickActions = [
  {
    label: "Nouvelle réservation",
    icon: <Add className="w-5 h-5" />,
    color: "from-[#00C0E8] to-[#0096b8]",
    link: "/admin/reservations",
    description: "Créer une nouvelle réservation",
  },
  {
    label: "Ajouter destination",
    icon: <LocationOn className="w-5 h-5" />,
    color: "from-purple-500 to-purple-600",
    link: "/admin/destinations",
    description: "Ajouter une nouvelle destination",
  },
  {
    label: "Voir messages",
    icon: <Visibility className="w-5 h-5" />,
    color: "from-blue-500 to-blue-600",
    link: "/admin/messages",
    description: "Consulter les messages",
  },
  
];

const recentReservations = [
  {
    name: "Jean Dupont",
    location: "Paris, France",
    status: "Confirmé",
    price: "€1,250",
    date: "2026-03-15",
    pnr: "SKY-ABC123",
  },
  {
    name: "Marie Martin",
    location: "Tokyo, Japan",
    status: "En attente",
    price: "€2,850",
    date: "2026-03-18",
    pnr: "SKY-DEF456",
  },
  {
    name: "Pierre Bernard",
    location: "New York, USA",
    status: "Confirmé",
    price: "€1,890",
    date: "2026-03-20",
    pnr: "SKY-GHI789",
  },
  {
    name: "Sophie Laurent",
    location: "Bali, Indonesia",
    status: "Confirmé",
    price: "€3,200",
    date: "2026-03-22",
    pnr: "SKY-JKL012",
  },
  {
    name: "Luc Moreau",
    location: "Dubai, UAE",
    status: "En attente",
    price: "€4,100",
    date: "2026-03-25",
    pnr: "SKY-MNO345",
  },
];

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

export default function Dashboard() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Hero Header */}
        <div className="relative bg-gradient-to-r from-[#00C0E8] to-[#0096b8] overflow-hidden m-4 rounded-xl">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 py-8">
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
                    <span className="text-white/80 text-sm font-medium tracking-wide">
                      TABLEAU DE BORD
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white">
                    Dashboard
                  </h1>
                
                </motion.div>
              </div>

             
            </div>
          </div>

         
          
        </div>
         <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-4 gap-2 ml-4 mt-4"
              >
                {quickActions.map((action) => (
                  <Link key={action.label} to={action.link}>
                    <div
                      className={`bg-gradient-to-r ${action.color} text-white px-4 py-3 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg group cursor-pointer`}
                    >
                      <div className="flex items-center gap-2">
                        {action.icon}
                        <span className="text-sm">{action.label}</span>
                      </div>
                     
                    </div>
                  </Link>
                ))}
              </motion.div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Stats Cards - 2 columns grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="!rounded-3xl !shadow-md hover:!shadow-xl transition-all duration-300 overflow-hidden group">
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <Typography className=" !text-sm !font-semibold uppercase tracking-wide" >
                            {stat.title}
                          </Typography>
                          <Typography className="!text-4xl !font-bold !mt-2 !text-gray-900">
                            {stat.value}
                          </Typography>
                          <div className="flex items-center gap-2 mt-3">
                            <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full">
                              <ArrowUpRight
                                size={12}
                                className="text-green-600"
                              />
                              <span className="text-xs font-semibold text-green-600">
                                {stat.change}
                              </span>
                            </div>
                            <span className="text-xs text-gray-400">
                              vs mois dernier
                            </span>
                          </div>
                        </div>
                        {/* <div
                          className={`bg-gradient-to-br ${stat.color} p-2 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
                        >
                          <Icon className="text-white w-4 h-4" />
                        </div> */}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Charts Grid - 2 columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Line Chart with Area - 3D effect */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="!rounded-3xl !shadow-md hover:!shadow-xl transition-all">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <Typography className="!font-semibold !text-lg !text-gray-900">
                        Évolution des Réservations
                      </Typography>
                      <Typography className="!text-sm !text-gray-500 mt-1">
                        Tendances mensuelles
                      </Typography>
                    </div>
                    <div className="bg-[#00C0E8]/10 p-2 rounded-xl">
                      <TrendingUp className="w-5 h-5 text-[#00C0E8]" />
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart
                      data={bookingsData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00C0E8" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#00C0E8" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="bookings"
                        stroke="#00C0E8"
                        strokeWidth={3}
                        fill="url(#colorBookings)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Bar Chart with 3D effect */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="!rounded-3xl !shadow-md hover:!shadow-xl transition-all">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <Typography className="!font-semibold !text-lg !text-gray-900">
                        Revenus Mensuels
                      </Typography>
                      <Typography className="!text-sm !text-gray-500 mt-1">
                        Performances financières
                      </Typography>
                    </div>
                    <div className="bg-green-500/10 p-2 rounded-xl">
                      <CreditCard className="w-5 h-5 text-green-500" />
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart
                      data={bookingsData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar
                        dataKey="revenue"
                        fill="#10b981"
                        radius={[10, 10, 0, 0]}
                      >
                        {bookingsData.map((entry, index) => (
                          <Cell key={index} fill="#10b981" />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Radar Chart for Performance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="!rounded-3xl !shadow-md hover:!shadow-xl transition-all">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <Typography className="!font-semibold !text-lg !text-gray-900">
                        Performance Globale
                      </Typography>
                      <Typography className="!text-sm !text-gray-500 mt-1">
                        Comparaison mensuelle
                      </Typography>
                    </div>
                    <div className="bg-purple-500/10 p-2 rounded-xl">
                      <Activity className="w-5 h-5 text-purple-500" />
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={350}>
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={performanceData}>
                      <PolarGrid stroke="#e5e7eb" />
                      <PolarAngleAxis dataKey="subject" stroke="#9ca3af" />
                      <PolarRadiusAxis stroke="#9ca3af" />
                      <Radar
                        name="Réservations"
                        dataKey="A"
                        stroke="#00C0E8"
                        fill="#00C0E8"
                        fillOpacity={0.3}
                      />
                      <Radar
                        name="Revenus (k€)"
                        dataKey="B"
                        stroke="#8b5cf6"
                        fill="#8b5cf6"
                        fillOpacity={0.3}
                      />
                      <Tooltip content={<CustomTooltip />} />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Pie Chart with 3D-like styling */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="!rounded-3xl !shadow-md hover:!shadow-xl transition-all">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <Typography className="!font-semibold !text-lg !text-gray-900">
                        Destinations Populaires
                      </Typography>
                      <Typography className="!text-sm !text-gray-500 mt-1">
                        Répartition par région
                      </Typography>
                    </div>
                    <div className="bg-cyan-500/10 p-2 rounded-xl">
                      <Globe className="w-5 h-5 text-[#00C0E8]" />
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={destinationsData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        innerRadius={60}
                        label={({ name, percent }) => 
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        labelLine={false}
                      >
                        {destinationsData.map((entry, index) => (
                          <Cell
                            key={index}
                            fill={entry.color}
                            stroke="white"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Recent Reservations Table - Full width at the end */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="!rounded-3xl !shadow-md hover:!shadow-xl transition-all">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
                  <div>
                    <Typography className="!font-semibold !text-xl !text-gray-900">
                      📋 Réservations Récentes
                    </Typography>
                    <Typography className="!text-sm !text-gray-500 mt-1">
                      Dernières réservations effectuées sur la plateforme
                    </Typography>
                  </div>
                  <Link
                    to="/admin/bookings"
                    className="text-[#00C0E8] text-sm font-medium hover:underline flex items-center gap-1 bg-[#00C0E8]/10 px-4 py-2 rounded-xl transition-all hover:bg-[#00C0E8]/20"
                  >
                    Voir toutes les réservations
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Passager
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          PNR
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Destination
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Montant
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {recentReservations.map((booking, index) => (
                        <tr
                          key={index}
                          className="hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium text-gray-900">
                                {booking.name}
                              </p>
                              <p className="text-xs text-gray-400">
                                ID: {booking.pnr}
                              </p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                              {booking.pnr}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-700">
                                {booking.location}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                                booking.status === "Confirmé"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {booking.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-gray-900">
                              {booking.price}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600 text-sm">
                                {new Date(booking.date).toLocaleDateString(
                                  "fr-FR"
                                )}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Quick stats footer */}
                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-xs text-gray-500">
                        {recentReservations.filter(r => r.status === "Confirmé").length}{" "}
                        confirmées
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <span className="text-xs text-gray-500">
                        {recentReservations.filter(r => r.status === "En attente").length}{" "}
                        en attente
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Total:{" "}
                    <span className="font-bold text-gray-900">
                      {recentReservations
                        .reduce((sum, r) => sum + parseInt(r.price.replace("€", "").replace(",", "")), 0)
                        .toLocaleString()} €
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      <Outlet />
    </>
  );
}