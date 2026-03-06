import { useState } from "react";
import {
  Avatar,
  Chip,
  Button,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Checkbox,
  FormControlLabel,
  Divider,
  Alert,
  Snackbar,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  CircularProgress,
  Zoom,
} from "@mui/material";
import { 
  Search, 
  MoreVertical, 
  UserPlus, 
  Mail, 
  Ban,
  Shield,
  UserCog,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Download,
  RefreshCw,
  Eye,
  Edit2,
  Trash2,
  Calendar,
  DollarSign,
  Phone,
  User,
  Hotel,
  Plane,
  Car,
  Utensils,
  Compass,
  Users,
  BarChart3,
  Settings,
  Award,
  Clock,
  TrendingUp,
  AlertTriangle,
  Save,
  X,
} from "lucide-react";

const mockUsers = [
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

const agentFeatures = [
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

const roleConfig = {
  Admin: { color: "#ef4444", bg: "#fee2e2", icon: UserCog },
  Agent: { color: "#f59e0b", bg: "#fef3c7", icon: Award },
  Voyageur: { color: "#00C0E8", bg: "#e0f7fa", icon: User },
};

const statusConfig = {
  Actif: { color: "#10b981", bg: "#d1fae5", icon: CheckCircle2 },
  Inactif: { color: "#6b7280", bg: "#f3f4f6", icon: XCircle },
  Suspendu: { color: "#ef4444", bg: "#fee2e2", icon: AlertCircle },
};

export default function UsersBoard() {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [orderBy, setOrderBy] = useState("name");
  const [order, setOrder] = useState("asc");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Voyageur",
    status: "Actif",
    features: [],
  });
  const [editUser, setEditUser] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    status: "",
    features: [],
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [formStep, setFormStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteUserName, setDeleteUserName] = useState("");

  const filteredUsers = users
    .filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm);
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus = statusFilter === "all" || user.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    })
    .sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];
      if (order === "asc") {
        return aValue < bValue ? -1 : 1;
      }
      return aValue > bValue ? -1 : 1;
    });

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleView = (user) => {
    handleMenuClose();
    setSnackbar({
      open: true,
      message: `Affichage des détails de ${user.name}`,
      severity: "info",
    });
  };

  const handleEdit = (user) => {
    setEditUser({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      features: user.features || [],
    });
    setSelectedUser(user);
    setIsEditUserOpen(true);
    handleMenuClose();
  };

  const handleUpdate = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const updatedUsers = users.map(user => 
        user.id === selectedUser.id 
          ? { ...user, ...editUser }
          : user
      );
      
      setUsers(updatedUsers);
      setIsLoading(false);
      setIsEditUserOpen(false);
      setSnackbar({
        open: true,
        message: `Utilisateur ${editUser.name} mis à jour avec succès`,
        severity: "success",
      });
      setSelectedUser(null);
    }, 1000);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setDeleteUserName("");
    setIsDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleConfirmDelete = () => {
    if (deleteUserName.toLowerCase() !== "supprimer") {
      setSnackbar({
        open: true,
        message: "Veuillez taper 'supprimer' pour confirmer",
        severity: "error",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const updatedUsers = users.filter(user => user.id !== selectedUser.id);
      setUsers(updatedUsers);
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
      setSnackbar({
        open: true,
        message: `Utilisateur ${selectedUser.name} supprimé avec succès`,
        severity: "success",
      });
      setSelectedUser(null);
      setDeleteUserName("");
    }, 1000);
  };

  const handleEmail = (user) => {
    handleMenuClose();
    setSnackbar({
      open: true,
      message: `Email envoyé à ${user.name}`,
      severity: "success",
    });
  };

  const handleSuspend = (user) => {
    handleMenuClose();
    
    // Update user status
    const updatedUsers = users.map(u => 
      u.id === user.id 
        ? { ...u, status: u.status === "Suspendu" ? "Actif" : "Suspendu" }
        : u
    );
    
    setUsers(updatedUsers);
    setSnackbar({
      open: true,
      message: user.status === "Suspendu" 
        ? `${user.name} réactivé avec succès` 
        : `${user.name} suspendu avec succès`,
      severity: user.status === "Suspendu" ? "success" : "warning",
    });
  };

  const handlePromote = (user) => {
    handleMenuClose();
    
    // Promote to Agent
    const updatedUsers = users.map(u => 
      u.id === user.id 
        ? { ...u, role: "Agent", features: ["bookings", "hotels"] }
        : u
    );
    
    setUsers(updatedUsers);
    setSnackbar({
      open: true,
      message: `${user.name} promu au rôle Agent avec succès`,
      severity: "success",
    });
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.phone) {
      setSnackbar({
        open: true,
        message: "Veuillez remplir tous les champs",
        severity: "error",
      });
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) {
      setSnackbar({
        open: true,
        message: "Email invalide",
        severity: "error",
      });
      return;
    }

    if (newUser.role === "Agent" && newUser.features.length === 0) {
      setSnackbar({
        open: true,
        message: "Veuillez sélectionner au moins une fonctionnalité pour l'agent",
        severity: "error",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newId = Math.max(...users.map(u => u.id)) + 1;
      const userToAdd = {
        id: newId,
        ...newUser,
        bookings: 0,
        totalSpent: "€0",
        joinDate: new Date().toISOString().split('T')[0],
        lastActive: new Date().toISOString().split('T')[0],
        avatar: null,
      };
      
      setUsers([...users, userToAdd]);
      setIsLoading(false);
      setIsAddUserOpen(false);
      setSnackbar({
        open: true,
        message: `Utilisateur ${newUser.name} ajouté avec succès`,
        severity: "success",
      });
      setNewUser({ name: "", email: "", phone: "", role: "Voyageur", status: "Actif", features: [] });
      setFormStep(1);
    }, 1000);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setRoleFilter("all");
    setStatusFilter("all");
  };

  const handleFeatureToggle = (user, setUser, featureId) => {
    setUser(prev => ({
      ...prev,
      features: prev.features.includes(featureId)
        ? prev.features.filter(f => f !== featureId)
        : [...prev.features, featureId]
    }));
  };

  const handleSelectAllFeatures = (user, setUser) => {
    if (user.features.length === agentFeatures.length) {
      setUser({ ...user, features: [] });
    } else {
      setUser({ ...user, features: agentFeatures.map(f => f.id) });
    }
  };

  const stats = [
    { 
      label: "Total utilisateurs", 
      value: users.length, 
      change: "+12%", 
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50"
    },
    { 
      label: "Utilisateurs actifs", 
      value: users.filter(u => u.status === "Actif").length, 
      change: "+5%", 
      icon: CheckCircle2,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50"
    },
    { 
      label: "Nouveaux (30j)", 
      value: users.filter(u => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return new Date(u.joinDate) > thirtyDaysAgo;
      }).length, 
      change: "+23%", 
      icon: TrendingUp,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50"
    },
    { 
      label: "Agents", 
      value: users.filter(u => u.role === "Agent").length, 
      change: "+2", 
      icon: Award,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Utilisateurs
            </h1>
            <p className="text-gray-500 mt-1 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Gérez vos utilisateurs et leurs rôles • {filteredUsers.length} utilisateurs
            </p>
          </div>
          
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 bg-white"
            >
              <Download className="w-4 h-4" />
              <span>Exporter</span>
            </button>
            
            <button
              onClick={() => setIsAddUserOpen(true)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#00C0E8] hover:bg-[#00a8d0] text-white rounded-xl transition-all duration-200 shadow-lg shadow-[#00C0E8]/20"
            >
              <UserPlus className="w-4 h-4" />
              <span>Ajouter</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
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
                    <Icon className={`w-5 h-5`} style={{ color: stat.color.includes('blue') ? '#3b82f6' : stat.color.includes('green') ? '#10b981' : stat.color.includes('purple') ? '#8b5cf6' : '#f97316' }} />
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

        {/* Filters */}
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
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C0E8]/20 focus:border-[#00C0E8] transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C0E8]/20 focus:border-[#00C0E8] bg-white min-w-[150px]"
            >
              <option value="all">Tous les rôles</option>
              <option value="Admin">Admin</option>
              <option value="Agent">Agent</option>
              <option value="Voyageur">Voyageur</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C0E8]/20 focus:border-[#00C0E8] bg-white min-w-[150px]"
            >
              <option value="all">Tous les statuts</option>
              <option value="Actif">Actif</option>
              <option value="Inactif">Inactif</option>
              <option value="Suspendu">Suspendu</option>
            </select>

            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Réinitialiser</span>
            </button>
          </div>
        </Paper>

        {/* Users Table - No Footer */}
        <Paper
          elevation={0}
          sx={{ 
            borderRadius: 3,
            border: '1px solid #f0f0f0',
            overflow: 'hidden'
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f9fafb' }}>
                  <TableCell sx={{ fontWeight: 600, width: '25%' }}>Utilisateur</TableCell>
                  <TableCell sx={{ fontWeight: 600, width: '20%' }}>Contact</TableCell>
                  <TableCell sx={{ fontWeight: 600, width: '10%' }}>Rôle</TableCell>
                  <TableCell sx={{ fontWeight: 600, width: '10%' }}>Statut</TableCell>
                  <TableCell sx={{ fontWeight: 600, width: '8%' }}>Réservations</TableCell>
                  <TableCell sx={{ fontWeight: 600, width: '10%' }}>Dépenses</TableCell>
                  <TableCell sx={{ fontWeight: 600, width: '12%' }}>Inscription</TableCell>
                  <TableCell sx={{ fontWeight: 600, width: '5%' }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                      <div className="flex flex-col items-center gap-3">
                        <Users className="w-12 h-12 text-gray-300" />
                        <p className="text-gray-500">Aucun utilisateur trouvé</p>
                        <button
                          onClick={clearFilters}
                          className="px-4 py-2 bg-[#00C0E8] text-white rounded-xl text-sm hover:bg-[#00a8d0] transition-all"
                        >
                          Réinitialiser les filtres
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => {
                    const RoleIcon = roleConfig[user.role]?.icon || User;
                    const StatusIcon = statusConfig[user.status]?.icon || CheckCircle2;
                    
                    return (
                      <TableRow
                        key={user.id}
                        sx={{
                          '&:hover': { backgroundColor: '#f9fafb' },
                          cursor: 'pointer',
                        }}
                        onClick={() => handleView(user)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            
                            <div>
                              <div className="font-medium text-gray-900">{user.name}</div>
                              <div className="text-xs text-gray-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Actif: {user.lastActive}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div>
                            <div className="text-gray-900">{user.email}</div>
                            <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                              <Phone className="w-3 h-3" />
                              {user.phone}
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <Chip
                            icon={<RoleIcon className="w-4 h-4" />}
                            label={user.role}
                            size="small"
                            sx={{
                              backgroundColor: roleConfig[user.role]?.bg,
                              color: roleConfig[user.role]?.color,
                              fontWeight: 500,
                              '& .MuiChip-icon': { color: 'inherit' },
                            }}
                          />
                        </TableCell>
                        
                        <TableCell>
                          <Chip
                            icon={<StatusIcon className="w-4 h-4" />}
                            label={user.status}
                            size="small"
                            sx={{
                              backgroundColor: statusConfig[user.status]?.bg,
                              color: statusConfig[user.status]?.color,
                              fontWeight: 500,
                              '& .MuiChip-icon': { color: 'inherit' },
                            }}
                          />
                        </TableCell>
                        
                        <TableCell>
                          <span className="font-medium text-gray-900">{user.bookings}</span>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4 text-green-500" />
                            <span className="font-semibold text-gray-900">{user.totalSpent}</span>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-1 text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">{user.joinDate}</span>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <Tooltip title="Actions">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMenuOpen(e, user);
                              }}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                            >
                              <MoreVertical className="w-4 h-4 text-gray-500" />
                            </button>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
            minWidth: 200,
          }
        }}
      >
        <MenuItem onClick={() => handleView(selectedUser)} className="gap-2 py-2">
          <Eye className="w-4 h-4 text-gray-500" />
          <span>Voir les détails</span>
        </MenuItem>
        <MenuItem onClick={() => handleEdit(selectedUser)} className="gap-2 py-2">
          <Edit2 className="w-4 h-4 text-gray-500" />
          <span>Modifier</span>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleEmail(selectedUser)} className="gap-2 py-2">
          <Mail className="w-4 h-4 text-gray-500" />
          <span>Envoyer un email</span>
        </MenuItem>
        {selectedUser?.role !== "Agent" && selectedUser?.role !== "Admin" && (
          <MenuItem onClick={() => handlePromote(selectedUser)} className="gap-2 py-2">
            <Shield className="w-4 h-4 text-gray-500" />
            <span>Promouvoir Agent</span>
          </MenuItem>
        )}
        <MenuItem 
          onClick={() => handleSuspend(selectedUser)} 
          className={`gap-2 py-2 ${selectedUser?.status === "Suspendu" ? 'text-green-600' : 'text-orange-600'}`}
        >
          {selectedUser?.status === "Suspendu" ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Réactiver</span>
            </>
          ) : (
            <>
              <Ban className="w-4 h-4" />
              <span>Suspendre</span>
            </>
          )}
        </MenuItem>
        <Divider />
        <MenuItem 
          onClick={() => handleDeleteClick(selectedUser)} 
          className="gap-2 py-2 text-red-600 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4" />
          <span>Supprimer</span>
        </MenuItem>
      </Menu>

      {/* Add User Dialog */}
      <Dialog
        open={isAddUserOpen}
        onClose={() => !isLoading && setIsAddUserOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb',
          px: 4,
          py: 3
        }}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Ajouter un utilisateur
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Étape {formStep} sur {newUser.role === "Agent" ? 2 : 1}
              </p>
            </div>
            <div className="w-12 h-12 bg-[#00C0E8]/10 rounded-2xl flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-[#00C0E8]" />
            </div>
          </div>
        </DialogTitle>
        
        <DialogContent sx={{ p: 0 }}>
          {formStep === 1 ? (
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Nom complet</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Jean Dupont"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C0E8]/20 focus:border-[#00C0E8]"
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="jean.dupont@email.com"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C0E8]/20 focus:border-[#00C0E8]"
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Téléphone</label>
                <input
                  type="tel"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  placeholder="+33 6 12 34 56 78"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C0E8]/20 focus:border-[#00C0E8]"
                  disabled={isLoading}
                />
              </div>
              
              <FormControl fullWidth>
                <InputLabel>Rôle</InputLabel>
                <Select
                  value={newUser.role}
                  label="Rôle"
                  onChange={(e) => {
                    setNewUser({ 
                      ...newUser, 
                      role: e.target.value,
                      features: e.target.value === "Agent" ? newUser.features : []
                    });
                  }}
                  disabled={isLoading}
                >
                  <MenuItem value="Voyageur">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-[#00C0E8]" />
                      <span>Voyageur</span>
                    </div>
                  </MenuItem>
                  <MenuItem value="Agent">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-orange-500" />
                      <span>Agent</span>
                    </div>
                  </MenuItem>
                  <MenuItem value="Admin">
                    <div className="flex items-center gap-2">
                      <UserCog className="w-4 h-4 text-red-500" />
                      <span>Admin</span>
                    </div>
                  </MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Statut initial</InputLabel>
                <Select
                  value={newUser.status}
                  label="Statut initial"
                  onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
                  disabled={isLoading}
                >
                  <MenuItem value="Actif">Actif</MenuItem>
                  <MenuItem value="Inactif">Inactif</MenuItem>
                </Select>
              </FormControl>
            </div>
          ) : (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Fonctionnalités de l'agent
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Sélectionnez les fonctionnalités auxquelles cet agent aura accès
              </p>
              
              <div className="mb-4">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={newUser.features.length === agentFeatures.length}
                      indeterminate={newUser.features.length > 0 && newUser.features.length < agentFeatures.length}
                      onChange={() => handleSelectAllFeatures(newUser, setNewUser)}
                      disabled={isLoading}
                      sx={{
                        color: '#00C0E8',
                        '&.Mui-checked': { color: '#00C0E8' },
                      }}
                    />
                  }
                  label="Sélectionner tout"
                />
              </div>
              
              <Divider sx={{ mb: 4 }} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {agentFeatures.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <FormControlLabel
                      key={feature.id}
                      control={
                        <Checkbox
                          checked={newUser.features.includes(feature.id)}
                          onChange={() => handleFeatureToggle(newUser, setNewUser, feature.id)}
                          disabled={isLoading}
                          sx={{
                            color: '#00C0E8',
                            '&.Mui-checked': { color: '#00C0E8' },
                          }}
                        />
                      }
                      label={
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-[#00C0E8]" />
                          <span className="text-sm">{feature.label}</span>
                        </div>
                      }
                    />
                  );
                })}
              </div>
            </div>
          )}
        </DialogContent>
        
        <DialogActions sx={{ 
          p: 3, 
          borderTop: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb',
          gap: 2
        }}>
          <button
            onClick={() => {
              if (formStep === 1) {
                setIsAddUserOpen(false);
              } else {
                setFormStep(1);
              }
            }}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {formStep === 1 ? "Annuler" : "Retour"}
          </button>
          
          {formStep === 1 && newUser.role === "Agent" ? (
            <button
              onClick={() => setFormStep(2)}
              disabled={isLoading}
              className="px-4 py-2 bg-[#00C0E8] hover:bg-[#00a8d0] text-white rounded-xl transition-all shadow-lg shadow-[#00C0E8]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? <CircularProgress size={20} color="inherit" /> : "Suivant"}
            </button>
          ) : (
            <button
              onClick={handleAddUser}
              disabled={isLoading}
              className="px-4 py-2 bg-[#00C0E8] hover:bg-[#00a8d0] text-white rounded-xl transition-all shadow-lg shadow-[#00C0E8]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? <CircularProgress size={20} color="inherit" /> : <UserPlus className="w-4 h-4" />}
              {isLoading ? "Création..." : (formStep === 1 ? "Ajouter" : "Créer l'agent")}
            </button>
          )}
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog
        open={isEditUserOpen}
        onClose={() => !isLoading && setIsEditUserOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb',
          px: 4,
          py: 3
        }}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Modifier l'utilisateur
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {selectedUser?.name}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
              <Edit2 className="w-6 h-6 text-orange-500" />
            </div>
          </div>
        </DialogTitle>
        
        <DialogContent sx={{ p: 4 }}>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Nom complet</label>
              <input
                type="text"
                value={editUser.name}
                onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                placeholder="Jean Dupont"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C0E8]/20 focus:border-[#00C0E8]"
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={editUser.email}
                onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                placeholder="jean.dupont@email.com"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C0E8]/20 focus:border-[#00C0E8]"
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Téléphone</label>
              <input
                type="tel"
                value={editUser.phone}
                onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })}
                placeholder="+33 6 12 34 56 78"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C0E8]/20 focus:border-[#00C0E8]"
                disabled={isLoading}
              />
            </div>
            
            <FormControl fullWidth>
              <InputLabel>Rôle</InputLabel>
              <Select
                value={editUser.role}
                label="Rôle"
                onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                disabled={isLoading}
              >
                <MenuItem value="Voyageur">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#00C0E8]" />
                    <span>Voyageur</span>
                  </div>
                </MenuItem>
                <MenuItem value="Agent">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-orange-500" />
                    <span>Agent</span>
                  </div>
                </MenuItem>
                <MenuItem value="Admin">
                  <div className="flex items-center gap-2">
                    <UserCog className="w-4 h-4 text-red-500" />
                    <span>Admin</span>
                  </div>
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Statut</InputLabel>
              <Select
                value={editUser.status}
                label="Statut"
                onChange={(e) => setEditUser({ ...editUser, status: e.target.value })}
                disabled={isLoading}
              >
                <MenuItem value="Actif">Actif</MenuItem>
                <MenuItem value="Inactif">Inactif</MenuItem>
                <MenuItem value="Suspendu">Suspendu</MenuItem>
              </Select>
            </FormControl>

            {editUser.role === "Agent" && (
              <>
                <Divider sx={{ my: 2 }} />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Fonctionnalités de l'agent
                </h3>
                
                <div className="mb-4">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={editUser.features.length === agentFeatures.length}
                        indeterminate={editUser.features.length > 0 && editUser.features.length < agentFeatures.length}
                        onChange={() => handleSelectAllFeatures(editUser, setEditUser)}
                        disabled={isLoading}
                        sx={{
                          color: '#00C0E8',
                          '&.Mui-checked': { color: '#00C0E8' },
                        }}
                      />
                    }
                    label="Sélectionner tout"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {agentFeatures.map((feature) => {
                    const Icon = feature.icon;
                    return (
                      <FormControlLabel
                        key={feature.id}
                        control={
                          <Checkbox
                            checked={editUser.features.includes(feature.id)}
                            onChange={() => handleFeatureToggle(editUser, setEditUser, feature.id)}
                            disabled={isLoading}
                            sx={{
                              color: '#00C0E8',
                              '&.Mui-checked': { color: '#00C0E8' },
                            }}
                          />
                        }
                        label={
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-[#00C0E8]" />
                            <span className="text-sm">{feature.label}</span>
                          </div>
                        }
                      />
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </DialogContent>
        
        <DialogActions sx={{ 
          p: 3, 
          borderTop: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb',
          gap: 2
        }}>
          <button
            onClick={() => setIsEditUserOpen(false)}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Annuler
          </button>
          
          <button
            onClick={handleUpdate}
            disabled={isLoading}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? <CircularProgress size={20} color="inherit" /> : <Save className="w-4 h-4" />}
            {isLoading ? "Mise à jour..." : "Mettre à jour"}
          </button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => !isLoading && setIsDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
        TransitionComponent={Zoom}
      >
        <DialogTitle sx={{ 
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#fef2f2',
          px: 4,
          py: 3
        }}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Confirmer la suppression
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Cette action est irréversible
              </p>
            </div>
          </div>
        </DialogTitle>
        
        <DialogContent sx={{ p: 4 }}>
          <div className="space-y-4">
            <p className="text-gray-600">
              Êtes-vous sûr de vouloir supprimer l'utilisateur <span className="font-semibold">{selectedUser?.name}</span> ?
            </p>
            
            <div className="bg-red-50 border border-red-100 rounded-xl p-4">
              <p className="text-sm text-red-800">
                <span className="font-semibold">Attention :</span> Cette action supprimera définitivement toutes les données associées à cet utilisateur.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Tapez <span className="font-mono bg-gray-100 px-2 py-1 rounded">supprimer</span> pour confirmer
              </label>
              <input
                type="text"
                value={deleteUserName}
                onChange={(e) => setDeleteUserName(e.target.value)}
                placeholder="supprimer"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                disabled={isLoading}
              />
            </div>
          </div>
        </DialogContent>
        
        <DialogActions sx={{ 
          p: 3, 
          borderTop: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb',
          gap: 2
        }}>
          <button
            onClick={() => setIsDeleteDialogOpen(false)}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Annuler
          </button>
          
          <button
            onClick={handleConfirmDelete}
            disabled={isLoading || deleteUserName !== "supprimer"}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all shadow-lg shadow-red-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? <CircularProgress size={20} color="inherit" /> : <Trash2 className="w-4 h-4" />}
            {isLoading ? "Suppression..." : "Supprimer définitivement"}
          </button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        TransitionComponent={Zoom}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ 
            width: "100%",
            borderRadius: 2,
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}