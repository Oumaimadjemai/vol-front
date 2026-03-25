import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  UserPlus,
  User,
  Award,
  UserCog,
} from 'lucide-react';
import { agentFeatures } from './Constants';
import FeatureCheckboxList from './FeatureCheckboxList';

const AddUserDialog = ({ open, onClose, onAdd, isLoading }) => {
  const [formStep, setFormStep] = useState(1);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Voyageur",
    status: "Actif",
    features: [],
  });

  const handleChange = (field, value) => {
    setNewUser(prev => ({ ...prev, [field]: value }));
  };

  const handleFeatureToggle = (featureId) => {
    setNewUser(prev => ({
      ...prev,
      features: prev.features.includes(featureId)
        ? prev.features.filter(f => f !== featureId)
        : [...prev.features, featureId]
    }));
  };

  const handleSelectAllFeatures = () => {
    if (newUser.features.length === agentFeatures.length) {
      setNewUser({ ...newUser, features: [] });
    } else {
      setNewUser({ ...newUser, features: agentFeatures.map(f => f.id) });
    }
  };

  const validateStep1 = () => {
    if (!newUser.name || !newUser.email || !newUser.phone) {
      return false;
    }
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email);
  };

  const handleNext = () => {
    if (validateStep1()) {
      setFormStep(2);
    }
  };

  const handleAdd = () => {
    if (newUser.role === "Agent" && newUser.features.length === 0) {
      return;
    }
    onAdd(newUser, () => {
      setNewUser({ name: "", email: "", phone: "", role: "Voyageur", status: "Actif", features: [] });
      setFormStep(1);
    });
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      setNewUser({ name: "", email: "", phone: "", role: "Voyageur", status: "Actif", features: [] });
      setFormStep(1);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
                onChange={(e) => handleChange("name", e.target.value)}
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
                onChange={(e) => handleChange("email", e.target.value)}
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
                onChange={(e) => handleChange("phone", e.target.value)}
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
                  handleChange("role", e.target.value);
                  handleChange("features", []);
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
                onChange={(e) => handleChange("status", e.target.value)}
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
            
            <FeatureCheckboxList
              features={agentFeatures}
              selectedFeatures={newUser.features}
              onFeatureToggle={handleFeatureToggle}
              onSelectAll={handleSelectAllFeatures}
              disabled={isLoading}
            />
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
          onClick={handleClose}
          disabled={isLoading}
          className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {formStep === 1 ? "Annuler" : "Retour"}
        </button>
        
        {formStep === 1 && newUser.role === "Agent" ? (
          <button
            onClick={handleNext}
            disabled={isLoading || !validateStep1()}
            className="px-4 py-2 bg-[#00C0E8] hover:bg-[#00a8d0] text-white rounded-xl transition-all shadow-lg shadow-[#00C0E8]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? <CircularProgress size={20} color="inherit" /> : "Suivant"}
          </button>
        ) : (
          <button
            onClick={handleAdd}
            disabled={isLoading}
            className="px-4 py-2 bg-[#00C0E8] hover:bg-[#00a8d0] text-white rounded-xl transition-all shadow-lg shadow-[#00C0E8]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? <CircularProgress size={20} color="inherit" /> : <UserPlus className="w-4 h-4" />}
            {isLoading ? "Création..." : (formStep === 1 ? "Ajouter" : "Créer l'agent")}
          </button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AddUserDialog;