import { useState } from "react";
import {
  Snackbar,
  Alert,
  Zoom,
} from "@mui/material";
import Header from './Header';
import StatsGrid from './StatsGrid';
import Filters from './Filters';
import UsersTable from './usersTable';
import ActionsMenu from './ActionsMenu';
import AddUserDialog from './AddUserDialog';
import EditUserDialog from './EditUserDialog';
import DeleteDialog from './SuppDialog';
import { mockUsers, agentFeatures } from './Constants';
import {
  Users,
  CheckCircle2,
  TrendingUp,
  Award,
} from "lucide-react";

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
  const [editUser, setEditUser] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    status: "",
    features: [],
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [isLoading, setIsLoading] = useState(false);

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
    setIsDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleConfirmDelete = (confirmText, resetText) => {
    if (confirmText.toLowerCase() !== "supprimer") {
      setSnackbar({
        open: true,
        message: "Veuillez taper 'supprimer' pour confirmer",
        severity: "error",
      });
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      const updatedUsers = users.filter(user => user.id !== selectedUser.id);
      setUsers(updatedUsers);
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
      resetText();
      setSnackbar({
        open: true,
        message: `Utilisateur ${selectedUser.name} supprimé avec succès`,
        severity: "success",
      });
      setSelectedUser(null);
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

  const handleAddUser = (newUser, resetForm) => {
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
      resetForm();
      setSnackbar({
        open: true,
        message: `Utilisateur ${newUser.name} ajouté avec succès`,
        severity: "success",
      });
    }, 1000);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setRoleFilter("all");
    setStatusFilter("all");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header onAddUser={() => setIsAddUserOpen(true)} userCount={filteredUsers.length} />
        <StatsGrid stats={stats} />
        
        <Filters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          roleFilter={roleFilter}
          onRoleFilterChange={setRoleFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onClearFilters={clearFilters}
        />

        <UsersTable
          users={filteredUsers}
          onMenuOpen={handleMenuOpen}
          onRowClick={handleView}
        />
      </div>

      <ActionsMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        selectedUser={selectedUser}
        onView={handleView}
        onEdit={handleEdit}
        onEmail={handleEmail}
        onPromote={handlePromote}
        onSuspend={handleSuspend}
        onDelete={handleDeleteClick}
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