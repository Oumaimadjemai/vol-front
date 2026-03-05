import { Card, CardContent, Typography, Chip } from "@mui/material";

import { LocationOn, ArrowUpward, Add, Visibility } from "@mui/icons-material";

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
} from "recharts";

import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Calendar,
  DollarSign,
  MapPin,
  Users,
} from "lucide-react";

const stats = [
  {
    title: "Réservations Totales",
    value: "1,234",
    change: "+12.5%",
    changeValue: "+142",
    icon: Calendar,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    trending: "up",
  },
  {
    title: "Revenus du Mois",
    value: "€145,680",
    change: "+8.3%",
    changeValue: "+€11,200",
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-50",
    trending: "up",
  },
  {
    title: "Utilisateurs Actifs",
    value: "8,456",
    change: "+15.2%",
    changeValue: "+1,115",
    icon: Users,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    trending: "up",
  },
  {
    title: "Destinations",
    value: "124",
    change: "+3.2%",
    changeValue: "+4",
    icon: MapPin,
    color: "text-[#00C0E8]",
    bgColor: "bg-cyan-50",
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
   { month: "Juillet", bookings: 65, revenue: 45000 },
  { month: "Aout", bookings: 78, revenue: 52000 },
  { month: "Septembre", bookings: 90, revenue: 61000 },
  { month: "Octobre", bookings: 81, revenue: 58000 },
  { month: "Novembre", bookings: 95, revenue: 67000 },
  { month: "Decembre", bookings: 110, revenue: 78000 },
];

const destinationsData = [
  { name: "Europe", value: 45, color: "#00C0E8" },
  { name: "Asie", value: 30, color: "#3b82f6" },
  { name: "Amérique", value: 15, color: "#8b5cf6" },
  { name: "Afrique", value: 10, color: "#10b981" },
];

const quickActions = [
  {
    label: "Nouvelle réservation",
    icon: <Add />,
    color: "bg-[#00C0E8] hover:bg-[#00a8cc]",
    link: "/admin/bookings",
  },
  {
    label: "Ajouter destination",
    icon: <LocationOn />,
    color: "bg-purple-500 hover:bg-purple-600",
    link: "/admin/destinations",
  },
  {
    label: "Voir messages",
    icon: <Visibility />,
    color: "bg-blue-500 hover:bg-blue-600",
    link: "/admin/messages",
  },
];
const recentReservations = [
  {
    name: "Jean Dupont",
    location: "Paris, France",
    status: "Confirmé",
    price: "€1,250",
    date: "2026-03-15",
  },
  {
    name: "Marie Martin",
    location: "Tokyo, Japan",
    status: "En attente",
    price: "€2,850",
    date: "2026-03-18",
  },
  {
    name: "Pierre Bernard",
    location: "New York, USA",
    status: "Confirmé",
    price: "€1,890",
    date: "2026-03-20",
  },
  {
    name: "Sophie Laurent",
    location: "Bali, Indonesia",
    status: "Confirmé",
    price: "€3,200",
    date: "2026-03-22",
  },
  {
    name: "Luc Moreau",
    location: "Dubai, UAE",
    status: "En attente",
    price: "€4,100",
    date: "2026-03-25",
  },
];

export default function Dashboard() {
  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600 mt-2">
            Bienvenue sur votre panneau d'administration Traveling!
          </p>
        </div>

        <div className="flex gap-4 flex-wrap">
          {quickActions.map((action) => (
            <Link key={action.label} to={action.link}>
              <button
                className={`flex items-center gap-2 ${action.color} text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg`}
              >
                {action.icon}
                {action.label}
              </button>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card
              key={stat.title}
              className="!rounded-3xl !shadow-sm !hover:shadow-md !transition"
            >
              <CardContent className="flex justify-between items-center p-6">
                <div>
                  <Typography className="!text-gray-500 !text-sm !font-bold">
                    {stat.title}
                  </Typography>

                  <Typography className="!text-3xl !font-bold !mt-1">
                    {stat.value}
                  </Typography>

                  <Chip
                    icon={
                      <ArrowUpRight
                        size={17}
                        strokeWidth={1.5}
                        className="!text-green-600 !text-sm"
                      />
                    }
                    label={stat.change}
                    size="small"
                    className="!mt-2 !bg-green-100 !text-green-700 !font-semibold"
                  />
                </div>

                <div className={` p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`${stat.color} `} sx={{ fontSize: 28 }} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="space-y-6">
        <Card className="!rounded-3xl !shadow-sm">
          <CardContent>
            <Typography className="!font-semibold !mb-4">
              Réservations Mensuelles
            </Typography>

            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={bookingsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="#00C0E8"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="!rounded-3xl !shadow-sm">
          <CardContent>
            <Typography className="!font-semibold !mb-4">
              Revenus Mensuels
            </Typography>

            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={bookingsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#00C0E8" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="!rounded-3xl !shadow-sm">
          <CardContent>
            <Typography className="!font-semibold !mb-4">
              Destinations Populaires
            </Typography>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={destinationsData}
                  dataKey="value"
                  outerRadius={100}
                  label
                >
                  {destinationsData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="!rounded-3xl !shadow-sm">
          <CardContent className="!p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <Typography className="!font-semibold !text-lg">
                Réservations Récentes
              </Typography>

              <Link
                to="/admin/bookings"
                className="text-[#00C0E8] text-sm font-medium hover:underline flex items-center gap-1"
              >
                Voir tout ↗
              </Link>
            </div>

            <div className="space-y-4">
              {recentReservations.map((booking, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-2xl p-4 hover:bg-gray-100 transition"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="font-semibold text-gray-900">
                        {booking.name}
                      </p>

                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium
                  ${
                    booking.status === "Confirmé"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <p className="text-gray-500 text-sm mt-1">
                      📍 {booking.location}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-lg text-gray-900">
                      {booking.price}
                    </p>
                    <p className="text-gray-500 text-sm">{booking.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
