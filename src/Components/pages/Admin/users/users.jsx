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
import { agentFeatures } from './Constants';
import {
  Users,
  CheckCircle2,
  Shield,
  User,
  Send,
  Mail,
  AtSign,
} from "lucide-react";
import axiosInstance from "../../../../api/axiosInstance";

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
      label: "Admins & Agents", 
      value: users.filter(u => u.role === "Admin" || u.role === "Agent").length, 
      change: "+2", 
      icon: Shield,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50"
    },
    { 
      label: "Voyageurs", 
      value: users.filter(u => u.role === "Voyageur").length, 
      change: "+15%", 
      icon: User,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50"
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

  // Ouvrir le dialogue d'email
  const handleOpenEmailDialog = (user) => {
    setSelectedUser(user);
    setEmailData({
      subject: `Message pour ${user.name}`,
      content: `Bonjour ${user.name},\n\n`,
    });
    setIsEmailDialogOpen(true);
    handleMenuClose();
  };

  // Fermer le dialogue d'email
  const handleCloseEmailDialog = () => {
    setIsEmailDialogOpen(false);
    setSelectedUser(null);
    setEmailData({ subject: "", content: "" });
  };

  // Envoyer l'email (simulé)
  const handleSendEmail = () => {
    if (!emailData.subject.trim()) {
      setSnackbar({
        open: true,
        message: "Veuillez saisir un sujet",
        severity: "error",
      });
      return;
    }
    
    if (!emailData.content.trim()) {
      setSnackbar({
        open: true,
        message: "Veuillez saisir un contenu",
        severity: "error",
      });
      return;
    }

    // Simulation d'envoi d'email
    console.log("Email envoyé à:", selectedUser?.email);
    console.log("Sujet:", emailData.subject);
    console.log("Contenu:", emailData.content);
    
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
  // Validation de base
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

  // Validation selon le rôle
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
      
      console.log("Sending voyageur signup data:", signupData);
      response = await axiosInstance.post('/auth-service/auth/signup/', signupData);
      
    } else {
      // CORRECTION ICI : Filtrer et mapper correctement les features
      let featuresArray = [];
      
      if (newUser.features && newUser.features.length > 0) {
        // newUser.features contient des IDs comme "bookings", "hotels", etc.
        // Pas besoin de mapper, ce sont déjà les bonnes valeurs
        featuresArray = newUser.features.filter(f => f && f !== undefined && f !== null);
      }
      
      const userData = {
        email: newUser.email,
        username: newUser.username,
        password: newUser.password,
        role: newUser.role,
        status: newUser.status || "active",
        features: featuresArray,  // Utiliser directement le tableau filtré
      };
      
      console.log("Sending user data:", JSON.stringify(userData, null, 2));
      response = await axiosInstance.post('/auth-service/auth/users/create/', userData);
    }
    
    console.log("User created successfully:", response.data);
    
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
      console.log("Error response data:", error.response.data);
      
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
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header onAddUser={() => setIsAddUserOpen(true)} userCount={filteredUsers.length} />
        <StatsGrid stats={stats} />
        
        <Paper elevation={0} sx={{ borderRadius: 3, mb: 3, border: '1px solid #f0f0f0' }}>
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
                color: '#3b82f6',
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#3b82f6',
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

        <UsersTable
          users={filteredUsers}
          onMenuOpen={handleMenuOpen}
          onRowClick={handleView}
          userType={activeTab === 0 ? 'staff' : 'voyageur'}
        />
      </div>

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

      {/* Email Dialog */}
      <Dialog
        open={isEmailDialogOpen}
        onClose={handleCloseEmailDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ 
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb',
          px: 4,
          py: 3
        }}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-500" />
                Envoyer un email
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Envoyer un message à {selectedUser?.name}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
              <Send className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </DialogTitle>
        
        <DialogContent sx={{ p: 4 }}>
          <div className="space-y-4">
            {/* Information du destinataire */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Destinataire:</span>
                <span className="font-medium text-gray-900">{selectedUser?.name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <AtSign className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Email:</span>
                <span className="font-medium text-gray-900">{selectedUser?.email}</span>
              </div>
            </div>

            {/* Champ Sujet */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Sujet <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={emailData.subject}
                onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                placeholder="Sujet de l'email..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Champ Contenu */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                value={emailData.content}
                onChange={(e) => setEmailData({ ...emailData, content: e.target.value })}
                placeholder="Votre message..."
                rows={8}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
              />
            </div>

            {/* Indication */}
            <div className="text-xs text-gray-400 text-center">
              L'email sera envoyé depuis l'adresse admin@votre-site.com
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
            onClick={handleCloseEmailDialog}
            className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all"
          >
            Annuler
          </button>
          
          <button
            onClick={handleSendEmail}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Envoyer l'email
          </button>
        </DialogActions>
      </Dialog>

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