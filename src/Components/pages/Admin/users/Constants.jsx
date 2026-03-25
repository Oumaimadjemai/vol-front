import { 
  User, Award, UserCog, CheckCircle2, XCircle, AlertCircle,
  BarChart3, Hotel, Plane, Car, Utensils, Compass, Users,
  Settings, TrendingUp 
} from "lucide-react";

export const mockUsers = [
  {
    id: 1,
    name: "Jean Dupont",
    email: "jean.dupont@email.com",
    phone: "+33 6 12 34 56 78",
    role: "Voyageur",
    status: "Actif",
    bookings: 3,
    totalSpent: "€3,750",
    joinDate: "2025-01-15",
    lastActive: "2025-03-05",
    avatar: null,
    features: [],
  },
  {
    id: 2,
    name: "Marie Martin",
    email: "marie.martin@email.com",
    phone: "+33 6 23 45 67 89",
    role: "Agent",
    status: "Actif",
    bookings: 12,
    totalSpent: "€28,500",
    joinDate: "2024-08-22",
    lastActive: "2025-03-06",
    avatar: null,
    features: ["bookings", "hotels", "flights"],
  },
  {
    id: 3,
    name: "Pierre Bernard",
    email: "pierre.bernard@email.com",
    phone: "+33 6 34 56 78 90",
    role: "Admin",
    status: "Actif",
    bookings: 0,
    totalSpent: "€0",
    joinDate: "2024-03-10",
    lastActive: "2025-03-06",
    avatar: null,
    features: ["all"],
  },
  {
    id: 4,
    name: "Sophie Petit",
    email: "sophie.petit@email.com",
    phone: "+33 6 45 67 89 01",
    role: "Voyageur",
    status: "Inactif",
    bookings: 1,
    totalSpent: "€890",
    joinDate: "2025-02-28",
    lastActive: "2025-02-28",
    avatar: null,
    features: [],
  },
  {
    id: 5,
    name: "Lucas Moreau",
    email: "lucas.moreau@email.com",
    phone: "+33 6 56 78 90 12",
    role: "Agent",
    status: "Suspendu",
    bookings: 2,
    totalSpent: "€2,100",
    joinDate: "2024-11-15",
    lastActive: "2025-02-15",
    avatar: null,
    features: ["bookings", "transfers"],
  },
];

export const agentFeatures = [
  { id: "dashboard", label: "Tableau de bord", icon: BarChart3 },
  { id: "bookings", label: "Gérer les réservations", icon: Hotel },
  { id: "hotels", label: "Gérer les hôtels", icon: Hotel },
  { id: "flights", label: "Gérer les vols", icon: Plane },
  { id: "transfers", label: "Gérer les transferts", icon: Car },
  { id: "restaurants", label: "Gérer les restaurants", icon: Utensils },
  { id: "tours", label: "Gérer les visites", icon: Compass },
  { id: "users", label: "Gérer les voyageurs", icon: Users },
  { id: "reports", label: "Rapports", icon: BarChart3 },
  { id: "settings", label: "Paramètres", icon: Settings },
];

export const roleConfig = {
  Admin: { color: "#ef4444", bg: "#fee2e2", icon: UserCog },
  Agent: { color: "#f59e0b", bg: "#fef3c7", icon: Award },
  Voyageur: { color: "#00C0E8", bg: "#e0f7fa", icon: User },
};

export const statusConfig = {
  Actif: { color: "#10b981", bg: "#d1fae5", icon: CheckCircle2 },
  Inactif: { color: "#6b7280", bg: "#f3f4f6", icon: XCircle },
  Suspendu: { color: "#ef4444", bg: "#fee2e2", icon: AlertCircle },
};