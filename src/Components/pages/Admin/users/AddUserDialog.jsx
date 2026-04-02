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
  CircularProgress,
} from '@mui/material';
import {
  UserPlus,
  User,
  Award,
  UserCog,
  Eye,
  EyeOff,
} from 'lucide-react';
import { agentFeatures } from './Constants';
import FeatureCheckboxList from './FeatureCheckboxList';

const AddUserDialog = ({ open, onClose, onAdd, isLoading }) => {
  const [formStep, setFormStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    password: "",
    role: "voyageur",
    status: "active",
    features: [],
  });

  const handleChange = (field, value) => {
    setNewUser(prev => ({ ...prev, [field]: value }));
  };

  // CORRECTION ICI - Fonction pour toggler une feature individuelle
  // Dans AddUserDialog.js, remplacez handleFeatureToggle par :
const handleFeatureToggle = (featureValue) => {
  // Vérifier que featureValue n'est pas undefined
  if (!featureValue) {
    console.warn("Feature value is undefined");
    return;
  }
  
  setNewUser(prev => {
    const currentFeatures = prev.features || [];
    let newFeatures;
    
    if (currentFeatures.includes(featureValue)) {
      newFeatures = currentFeatures.filter(f => f !== featureValue);
    } else {
      newFeatures = [...currentFeatures, featureValue];
    }
    
    console.log("Toggling feature:", featureValue);
    console.log("Current features:", currentFeatures);
    console.log("New features:", newFeatures);
    
    return {
      ...prev,
      features: newFeatures
    };
  });
};

// handleSelectAllFeatures améliorée
const handleSelectAllFeatures = () => {
  setNewUser(prev => {
    // Récupérer toutes les valeurs valides des features
    const allFeatureValues = agentFeatures
      .map(f => f.value || f.id)
      .filter(v => v); // Enlever les undefined
    
    const isAllSelected = prev.features.length === allFeatureValues.length && allFeatureValues.length > 0;
    
    const newFeatures = isAllSelected ? [] : [...allFeatureValues];
    
    console.log("Select all clicked. Is all selected:", isAllSelected);
    console.log("All feature values:", allFeatureValues);
    console.log("New features:", newFeatures);
    
    return {
      ...prev,
      features: newFeatures
    };
  });
};

  const validateStep1 = () => {
    if (!newUser.email || !newUser.password) {
      return false;
    }
    
    if (newUser.password.length < 8) {
      return false;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) {
      return false;
    }

    if (newUser.role === "voyageur") {
      if (!newUser.nom || !newUser.prenom || !newUser.telephone) {
        return false;
      }
    } else {
      if (!newUser.username) {
        return false;
      }
    }
    
    return true;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setFormStep(2);
    }
  };

  const handleAdd = () => {
    if (newUser.role === "agent" && newUser.features.length === 0) {
      // Optionnel: afficher une erreur
      return;
    }
    
    const userData = {
      ...newUser,
    };
    
    onAdd(userData, () => {
      setNewUser({ 
        username: "",
        nom: "",
        prenom: "",
        email: "", 
        telephone: "", 
        password: "",
        role: "voyageur", 
        status: "active", 
        features: [] 
      });
      setFormStep(1);
    });
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      setNewUser({ 
        username: "",
        nom: "",
        prenom: "",
        email: "", 
        telephone: "", 
        password: "",
        role: "voyageur", 
        status: "active", 
        features: [] 
      });
      setFormStep(1);
    }
  };

  const isVoyageur = newUser.role === "voyageur";
  const isAgentOrAdmin = newUser.role === "agent" || newUser.role === "admin";
  const showFeaturesStep = newUser.role === "agent";

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
              Étape {formStep} sur {showFeaturesStep ? 2 : 1}
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
              <label className="text-sm font-medium text-gray-700">Email *</label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="jean.dupont@email.com"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C0E8]/20 focus:border-[#00C0E8]"
                disabled={isLoading}
              />
            </div>

            {isVoyageur && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Prénom *</label>
                    <input
                      type="text"
                      value={newUser.prenom}
                      onChange={(e) => handleChange("prenom", e.target.value)}
                      placeholder="Jean"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C0E8]/20 focus:border-[#00C0E8]"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Nom *</label>
                    <input
                      type="text"
                      value={newUser.nom}
                      onChange={(e) => handleChange("nom", e.target.value)}
                      placeholder="Dupont"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C0E8]/20 focus:border-[#00C0E8]"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Téléphone *</label>
                  <input
                    type="tel"
                    value={newUser.telephone}
                    onChange={(e) => handleChange("telephone", e.target.value)}
                    placeholder="+33 6 12 34 56 78"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C0E8]/20 focus:border-[#00C0E8]"
                    disabled={isLoading}
                  />
                </div>
              </>
            )}

            {isAgentOrAdmin && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Nom d'utilisateur *</label>
                <input
                  type="text"
                  value={newUser.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                  placeholder="jean.dupont"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C0E8]/20 focus:border-[#00C0E8]"
                  disabled={isLoading}
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Mot de passe *</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newUser.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder="Min. 8 caractères"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C0E8]/20 focus:border-[#00C0E8] pr-10"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {newUser.password && newUser.password.length < 8 && (
                <p className="text-xs text-red-500 mt-1">Le mot de passe doit contenir au moins 8 caractères</p>
              )}
            </div>
            
            <FormControl fullWidth>
              <InputLabel>Rôle *</InputLabel>
              <Select
                value={newUser.role}
                label="Rôle *"
                onChange={(e) => {
                  handleChange("role", e.target.value);
                  handleChange("features", []);
                }}
                disabled={isLoading}
              >
                <MenuItem value="voyageur">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#00C0E8]" />
                    <span>Voyageur</span>
                  </div>
                </MenuItem>
                <MenuItem value="agent">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-orange-500" />
                    <span>Agent</span>
                  </div>
                </MenuItem>
                <MenuItem value="admin">
                  <div className="flex items-center gap-2">
                    <UserCog className="w-4 h-4 text-red-500" />
                    <span>Admin</span>
                  </div>
                </MenuItem>
              </Select>
            </FormControl>

            {!isVoyageur && (
              <FormControl fullWidth>
                <InputLabel>Statut initial</InputLabel>
                <Select
                  value={newUser.status}
                  label="Statut initial"
                  onChange={(e) => handleChange("status", e.target.value)}
                  disabled={isLoading}
                >
                  <MenuItem value="active">Actif</MenuItem>
                  <MenuItem value="inactive">Inactif</MenuItem>
                </Select>
              </FormControl>
            )}
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
        
        {formStep === 1 && showFeaturesStep ? (
          <button
            onClick={handleNext}
            disabled={isLoading || !validateStep1()}
            className="px-4 py-2 bg-[#00C0E8] hover:bg-[#00a8d0] text-white rounded-xl transition-all shadow-lg shadow-[#00C0E8]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            Suivant
          </button>
        ) : (
          <button
            onClick={handleAdd}
            disabled={isLoading || !validateStep1()}
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