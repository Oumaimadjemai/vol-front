import { useState, useEffect } from "react";
import {
  Snackbar,
  Alert,
  Zoom,
  CircularProgress,
  Box,
  Tabs,
  Tab,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import Header from './Header';
import StatsGrid from './StatsGrid';
import Filters from './Filters';
import UsersTable from './usersTable';
import ActionsMenu from './ActionsMenu';
import AddUserDialog from './AddUserDialog';
import EditUserDialog from './EditUserDialog';
import DeleteDialog from './SuppDialog';
import FeatureManagementDialog from './ManagementDialog';
import EmailDialog from './EmailDialog';
import { agentFeatures } from './Constants';
import {
  Users,
  CheckCircle2,
  Shield,
  User,
  Send,
  Mail,
  AtSign,
  TrendingUp,
  UserPlus,
  Download,
} from "lucide-react";
import axiosInstance from "../../../../api/axiosInstance";
import { motion } from "framer-motion";

export default function UsersBoard() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [orderBy, setOrderBy] = useState("name");
  const [order, setOrder] = useState("asc");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFeaturesDialogOpen, setIsFeaturesDialogOpen] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserForFeatures, setSelectedUserForFeatures] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [editUser, setEditUser] = useState({
    name: "",
    email: "",
    telephone: "",
    role: "",
    status: "",
    features: [],
  });
  const [emailData, setEmailData] = useState({
    subject: "",
    content: "",
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsInitialLoading(true);
      
      const usersResponse = await axiosInstance.get('/auth-service/auth/users/');
      const voyageursResponse = await axiosInstance.get('/auth-service/auth/voyageurs/');
      const voyageursMap = new Map();
      voyageursResponse.data.forEach(voyageur => {
        voyageursMap.set(voyageur.user, voyageur);
      });
      
      const formattedUsers = usersResponse.data.map(user => {
        const isVoyageur = user.role === 'voyageur';
        const voyageurInfo = voyageursMap.get(user.id);
        
        return {
          id: user.id,
          name: isVoyageur && voyageurInfo?.prenom && voyageurInfo?.nom 
            ? `${voyageurInfo.prenom} ${voyageurInfo.nom}`
            : (user.username || user.email.split('@')[0]),
          email: user.email,
          telephone: voyageurInfo?.telephone || "",
          role: user.role === 'admin' ? 'Admin' : user.role === 'agent' ? 'Agent' : 'Voyageur',
          status: user.status || (user.is_blocked ? "Suspendu" : (user.is_active ? "Actif" : "Inactif")),
          bookings: 0,
          totalSpent: "€0",
          joinDate: user.date_joined_formatted || user.date_joined?.split('T')[0] || new Date().toISOString().split('T')[0],
          lastActive: user.last_login_formatted || user.last_login?.split('T')[0] || new Date().toISOString().split('T')[0],
          avatar: null,
          features: user.features?.filter(f => f && f !== null) || [],
          nom: voyageurInfo?.nom || "",
          prenom: voyageurInfo?.prenom || "",
          pays: voyageurInfo?.pays || "",
          voyageurId: voyageurInfo?.id || null,
        };
      });
      
      setUsers(formattedUsers);
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs:", error);
      setSnackbar({
        open: true,
        message: "Erreur lors du chargement des utilisateurs",
        severity: "error",
      });
    } finally {
      setIsInitialLoading(false);
    }
  };

  const getFilteredUsersByTab = () => {
    if (activeTab === 0) {
      return users.filter(user => user.role === 'Agent' || user.role === 'Admin');
    } else {
      return users.filter(user => user.role === 'Voyageur');
    }
  };

  const tabUsers = getFilteredUsersByTab();

  const filteredUsers = tabUsers
    .filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.telephone && user.telephone.includes(searchTerm));
      const matchesRole = roleFilter === "all" || user.role.toLowerCase() === roleFilter.toLowerCase();
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

const stats = [
  { 
    label: "Total utilisateurs", 
    value: users.length, 
    icon: Users,  // ✅ Correct - component reference
    color: "from-cyan-50 to-blue-50" 
  },
  { 
    label: "Utilisateurs actifs", 
    value: users.filter(u => u.status === "Actif").length, 
    icon: CheckCircle2,  // ✅ Correct
    color: "from-green-50 to-emerald-50" 
  },
  { 
    label: "Admins & Agents", 
    value: users.filter(u => u.role === "Admin" || u.role === "Agent").length, 
    icon: Shield,  // ✅ Correct
    color: "from-purple-50 to-pink-50" 
  },
  { 
    label: "Voyageurs", 
    value: users.filter(u => u.role === "Voyageur").length, 
    icon: User,  // ✅ Correct
    color: "from-orange-50 to-red-50" 
  },
];

  const handleMenuOpen = (event, user, actionType = null) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
    
    if (actionType) {
      switch (actionType) {
        case 'edit':
          handleEdit(user);
          break;
        case 'email':
          handleOpenEmailDialog(user);
          break;
        case 'suspend':
          handleSuspend(user);
          break;
        case 'delete':
          handleDeleteClick(user);
          break;
        case 'features':
          handleManageFeatures(user);
          break;
        default:
          break;
      }
      setAnchorEl(null);
    }
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

  const handleOpenEmailDialog = (user) => {
    setSelectedUser(user);
    setIsEmailDialogOpen(true);
    handleMenuClose();
  };

  const handleCloseEmailDialog = () => {
    setIsEmailDialogOpen(false);
    setSelectedUser(null);
  };

  const handleSendEmail = () => {
    setSnackbar({
      open: true,
      message: `Email envoyé avec succès à ${selectedUser?.name}`,
      severity: "success",
    });
    handleCloseEmailDialog();
  };

  const handleEdit = async (user) => {
    setIsLoading(true);
    try {
      let telephone = "";
      
      if (user.role.toLowerCase() === 'voyageur') {
        try {
          const voyageurResponse = await axiosInstance.get(`/auth-service/auth/voyageurs/by-user/${user.id}/`);
          if (voyageurResponse.data) {
            telephone = voyageurResponse.data.telephone || "";
          }
        } catch (error) {
          console.error("Erreur lors de la récupération du téléphone:", error);
        }
      }
      
      setEditUser({
        name: user.name,
        email: user.email,
        telephone: telephone,
        role: user.role.toLowerCase(),
        status: user.status,
        features: user.features || [],
      });
      setSelectedUser(user);
      setIsEditUserOpen(true);
      handleMenuClose();
    } catch (error) {
      console.error("Erreur lors de la préparation de l'édition:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageFeatures = (user) => {
    setSelectedUserForFeatures(user);
    setIsFeaturesDialogOpen(true);
    handleMenuClose();
  };

  const handleSaveFeatures = async (user, features) => {
    setIsLoading(true);
    try {
      await axiosInstance.patch(`/auth-service/auth/users/${user.id}/update/`, {
        features: features,
      });
      await fetchUsers();
      setSnackbar({
        open: true,
        message: `Fonctionnalités de ${user.name} mises à jour avec succès`,
        severity: "success",
      });
      setIsFeaturesDialogOpen(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour des fonctionnalités:", error);
      setSnackbar({
        open: true,
        message: "Erreur lors de la mise à jour des fonctionnalités",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    
    try {
      const userUpdateData = {
        email: editUser.email,
        username: editUser.name,
        role: editUser.role.toLowerCase(),
        is_active: editUser.status === "Actif",
        is_blocked: editUser.status === "Suspendu",
      };
      
      if (editUser.role.toLowerCase() === 'agent') {
        const validFeatures = (editUser.features || []).filter(f => f && f !== null);
        userUpdateData.features = validFeatures;
      }
      
      await axiosInstance.put(`/auth-service/auth/users/${selectedUser.id}/update/`, userUpdateData);
      
      if (editUser.role.toLowerCase() === 'voyageur') {
        try {
          const voyageurResponse = await axiosInstance.get(`/auth-service/auth/voyageurs/by-user/${selectedUser.id}/`);
          if (voyageurResponse.data) {
            const voyageurUpdateData = {
              telephone: editUser.telephone || "",
              nom: editUser.name.split(' ').slice(1).join(' ') || editUser.name,
              prenom: editUser.name.split(' ')[0] || "",
            };
            
            await axiosInstance.put(`/auth-service/auth/voyageurs/${voyageurResponse.data.id}/update/`, voyageurUpdateData);
          }
        } catch (error) {
          console.error("Erreur lors de la mise à jour du voyageur:", error);
        }
      }
      
      await fetchUsers();
      
      setSnackbar({
        open: true,
        message: `Utilisateur ${editUser.name} mis à jour avec succès`,
        severity: "success",
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Erreur lors de la mise à jour",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
      setIsEditUserOpen(false);
      setSelectedUser(null);
    }
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleConfirmDelete = async (confirmText, resetText) => {
    if (confirmText.toLowerCase() !== "supprimer") {
      setSnackbar({
        open: true,
        message: "Veuillez taper 'supprimer' pour confirmer",
        severity: "error",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await axiosInstance.delete(`/auth-service/auth/users/${selectedUser.id}/delete/`);
      await fetchUsers();
      
      resetText();
      setSnackbar({
        open: true,
        message: `Utilisateur ${selectedUser.name} supprimé avec succès`,
        severity: "success",
      });
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Erreur lors de la suppression",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const handleSuspend = async (user) => {
    handleMenuClose();
    
    setIsLoading(true);
    try {
      const newStatus = user.status === "Suspendu" ? "Actif" : "Suspendu";
      await axiosInstance.patch(`/auth-service/auth/users/${user.id}/update/`, {
        is_blocked: newStatus === "Suspendu",
        is_active: newStatus === "Actif",
      });
      
      await fetchUsers();
      
      setSnackbar({
        open: true,
        message: user.status === "Suspendu" 
          ? `${user.name} réactivé avec succès` 
          : `${user.name} suspendu avec succès`,
        severity: user.status === "Suspendu" ? "success" : "warning",
      });
    } catch (error) {
      console.error("Erreur lors de la suspension/réactivation:", error);
      setSnackbar({
        open: true,
        message: "Erreur lors de l'opération",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = async (newUser, resetForm) => {
    if (!newUser.email || !newUser.password) {
      setSnackbar({
        open: true,
        message: "Veuillez remplir tous les champs obligatoires",
        severity: "error",
      });
      return;
    }
    
    if (newUser.password.length < 8) {
      setSnackbar({
        open: true,
        message: "Le mot de passe doit contenir au moins 8 caractères",
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

    if (newUser.role === "voyageur") {
      if (!newUser.nom || !newUser.prenom || !newUser.telephone) {
        setSnackbar({
          open: true,
          message: "Veuillez remplir tous les champs (nom, prénom, téléphone)",
          severity: "error",
        });
        return;
      }
    } else {
      if (!newUser.username) {
        setSnackbar({
          open: true,
          message: "Veuillez saisir un nom d'utilisateur",
          severity: "error",
        });
        return;
      }
    }

    if (newUser.role === "agent" && newUser.features.length === 0) {
      setSnackbar({
        open: true,
        message: "Veuillez sélectionner au moins une fonctionnalité pour l'agent",
        severity: "error",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      let response;
      
      if (newUser.role === "voyageur") {
        const signupData = {
          email: newUser.email,
          password: newUser.password,
          nom: newUser.nom,
          prenom: newUser.prenom,
          telephone: newUser.telephone,
        };
        
        response = await axiosInstance.post('/auth-service/auth/signup/', signupData);
      } else {
        let featuresArray = [];
        
        if (newUser.features && newUser.features.length > 0) {
          featuresArray = newUser.features.filter(f => f && f !== undefined && f !== null);
        }
        
        const userData = {
          email: newUser.email,
          username: newUser.username,
          password: newUser.password,
          role: newUser.role,
          status: newUser.status || "active",
          features: featuresArray,
        };
        
        response = await axiosInstance.post('/auth-service/auth/users/create/', userData);
      }
      
      await fetchUsers();
      
      setIsAddUserOpen(false);
      if (resetForm) resetForm();
      
      setSnackbar({
        open: true,
        message: `Utilisateur ${newUser.role === "voyageur" ? `${newUser.prenom} ${newUser.nom}` : newUser.username} ajouté avec succès`,
        severity: "success",
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
      
      let errorMessage = "Erreur lors de l'ajout de l'utilisateur";
      
      if (error.response?.data) {
        if (typeof error.response.data === 'object') {
          const errors = error.response.data;
          if (errors.email) errorMessage = errors.email[0];
          else if (errors.username) errorMessage = errors.username[0];
          else if (errors.password) errorMessage = errors.password[0];
          else if (errors.features) errorMessage = errors.features[0];
          else if (errors.nom) errorMessage = errors.nom[0];
          else if (errors.prenom) errorMessage = errors.prenom[0];
          else if (errors.telephone) errorMessage = errors.telephone[0];
          else if (errors.role) errorMessage = errors.role[0];
          else if (errors.non_field_errors) errorMessage = errors.non_field_errors[0];
          else if (errors.message) errorMessage = errors.message;
          else if (typeof errors === 'string') errorMessage = errors;
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        }
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setRoleFilter("all");
    setStatusFilter("all");
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    clearFilters();
  };

  if (isInitialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00C0E8]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-[#00C0E8] to-[#0096b8] overflow-hidden m-4 rounded-2xl">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-3  justify-center md:justify-start">
                  <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
                    <Users className="text-white text-2xl" />
                  </div>
                  <span className="text-white/80 text-sm font-medium tracking-wide">GESTION DES UTILISATEURS</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white ">
                  Utilisateurs
                </h1>
                
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex gap-3"
            >
              <button className="bg-white/20 backdrop-blur-sm text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-white/30 transition-all">
                <Download className="w-4 h-4" />
                Exporter
              </button>
              <button
                onClick={() => setIsAddUserOpen(true)}
                className="bg-white text-[#00C0E8] px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <UserPlus className="w-4 h-4" />
                Ajouter
              </button>
            </motion.div>
          </div>
        </div>
        
       
        
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 -mt-8 relative z-10 mb-12">
  {stats.map((stat, i) => {
    const Icon = stat.icon;
    return (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1 }}
        className={`bg-gradient-to-br ${stat.color} backdrop-blur-sm rounded-2xl p-5 shadow-md hover:shadow-lg transition-all hover:-translate-y-1`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="bg-white/50 backdrop-blur-sm p-2 rounded-xl">
            <Icon className="text-[#00C0E8]" size={24} />  {/* Add size and color here */}
          </div>
          <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
        </div>
        <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">{stat.label}</p>
      </motion.div>
    );
  })}
</div>


        {/* Tabs */}
        <Paper elevation={0} sx={{ borderRadius: 3, mb: 4, border: '1px solid #f0f0f0' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                py: 2,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
              },
              '& .Mui-selected': {
                color: '#00C0E8',
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#00C0E8',
                height: 3,
              },
            }}
          >
            <Tab 
              icon={<Shield className="w-5 h-5" />} 
              iconPosition="start" 
              label="Agents & Administrateurs" 
            />
            <Tab 
              icon={<User className="w-5 h-5" />} 
              iconPosition="start" 
              label="Voyageurs" 
            />
          </Tabs>
        </Paper>
        
        {/* Filters */}
        <Filters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          roleFilter={roleFilter}
          onRoleFilterChange={setRoleFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onClearFilters={clearFilters}
          showRoleFilter={activeTab === 0}
        />

        {/* Users Table */}
        <UsersTable
          users={filteredUsers}
          onMenuOpen={handleMenuOpen}
          onRowClick={handleView}
          userType={activeTab === 0 ? 'staff' : 'voyageur'}
        />
      </div>

      {/* Dialogs */}
      <ActionsMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        selectedUser={selectedUser}
        onView={handleView}
        onEdit={handleEdit}
        onEmail={handleOpenEmailDialog}
        onSuspend={handleSuspend}
        onDelete={handleDeleteClick}
        onManageFeatures={handleManageFeatures}
      />

      <AddUserDialog
        open={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        onAdd={handleAddUser}
        isLoading={isLoading}
      />

      <EditUserDialog
        open={isEditUserOpen}
        onClose={() => setIsEditUserOpen(false)}
        onUpdate={handleUpdate}
        user={selectedUser}
        editData={editUser}
        onEditDataChange={setEditUser}
        isLoading={isLoading}
      />

      <DeleteDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        userName={selectedUser?.name}
        isLoading={isLoading}
      />

      <FeatureManagementDialog
        open={isFeaturesDialogOpen}
        onClose={() => setIsFeaturesDialogOpen(false)}
        onSave={handleSaveFeatures}
        user={selectedUserForFeatures}
        isLoading={isLoading}
      />

      <EmailDialog
        open={isEmailDialogOpen}
        onClose={handleCloseEmailDialog}
        user={selectedUser}
        onEmailSent={handleSendEmail}
      />

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