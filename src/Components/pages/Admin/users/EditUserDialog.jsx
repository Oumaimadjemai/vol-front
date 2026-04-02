import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  Edit2,
  User,
  Award,
  UserCog,
  Save,
} from 'lucide-react';
import { agentFeatures } from './Constants';
import FeatureCheckboxList from './FeatureCheckboxList';
import msAuthInstance from "../../../../api/axiosInstance";

const EditUserDialog = ({
  open,
  onClose,
  onUpdate,
  user,
  editData,
  onEditDataChange,
  isLoading,
}) => {
  const [voyageurData, setVoyageurData] = useState(null);
  const [loadingVoyageur, setLoadingVoyageur] = useState(false);

  // Charger les informations du voyageur quand le dialogue s'ouvre
  useEffect(() => {
    const fetchVoyageurInfo = async () => {
      if (open && user && user.role?.toLowerCase() === 'voyageur') {
        setLoadingVoyageur(true);
        try {
          // Chercher le voyageur par user ID
          const response = await msAuthInstance.get(`/auth-service/auth/voyageurs/by-user/${user.id}/`);
          if (response.data) {
            setVoyageurData(response.data);
            onEditDataChange({
              name: user.name || "",
              email: user.email || "",
              telephone: response.data.telephone || "",
              role: user.role?.toLowerCase() || "voyageur",
              status: user.status || "Actif",
              features: user.features || [],
            });
          }
        } catch (error) {
          console.error("Erreur lors du chargement des infos voyageur:", error);
          // Fallback: utiliser les données du user
          onEditDataChange({
            name: user.name || "",
            email: user.email || "",
            telephone: user.telephone || "",
            role: user.role?.toLowerCase() || "",
            status: user.status || "Actif",
            features: user.features || [],
          });
        } finally {
          setLoadingVoyageur(false);
        }
      } else if (open && user) {
        // Pour les agents et admins, pas besoin d'aller chercher les infos voyageur
        onEditDataChange({
          name: user.name || "",
          email: user.email || "",
          telephone: "",
          role: user.role?.toLowerCase() || "",
          status: user.status || "Actif",
          features: user.features || [],
        });
      }
    };

    fetchVoyageurInfo();
  }, [open, user]);

  if (!editData || !user) return null;

  const handleFeatureToggle = (featureId) => {
    const currentFeatures = editData.features || [];
    const newFeatures = currentFeatures.includes(featureId)
      ? currentFeatures.filter(f => f !== featureId)
      : [...currentFeatures, featureId];
    
    onEditDataChange({
      ...editData,
      features: newFeatures
    });
  };

  const handleSelectAllFeatures = () => {
    if (editData.features?.length === agentFeatures.length) {
      onEditDataChange({ ...editData, features: [] });
    } else {
      onEditDataChange({ ...editData, features: agentFeatures.map(f => f.id) });
    }
  };

  const showPhoneField = editData.role?.toLowerCase() === 'voyageur';
  const showFeaturesField = editData.role?.toLowerCase() === 'agent';

  if (loadingVoyageur) {
    return (
      <Dialog open={open} maxWidth="md" fullWidth>
        <DialogContent>
          <div className="flex justify-center items-center py-12">
            <CircularProgress />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={() => !isLoading && onClose()}
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
              Modifier l'utilisateur
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {user?.name}
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
              value={editData.name || ""}
              onChange={(e) => onEditDataChange({ ...editData, name: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C0E8]/20 focus:border-[#00C0E8]"
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={editData.email || ""}
              onChange={(e) => onEditDataChange({ ...editData, email: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C0E8]/20 focus:border-[#00C0E8]"
              disabled={isLoading}
            />
          </div>
          
          {showPhoneField && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Téléphone</label>
              <input
                type="tel"
                value={editData.telephone || ""}
                onChange={(e) => onEditDataChange({ ...editData, telephone: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C0E8]/20 focus:border-[#00C0E8]"
                disabled={isLoading}
              />
            </div>
          )}
          
          <FormControl fullWidth>
            <InputLabel>Rôle</InputLabel>
            <Select
              value={editData.role || "voyageur"}
              label="Rôle"
              onChange={(e) => {
                const newRole = e.target.value;
                onEditDataChange({ 
                  ...editData, 
                  role: newRole,
                  features: newRole === 'agent' ? (editData.features || []) : []
                });
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

          <FormControl fullWidth>
            <InputLabel>Statut</InputLabel>
            <Select
              value={editData.status || "Actif"}
              label="Statut"
              onChange={(e) => onEditDataChange({ ...editData, status: e.target.value })}
              disabled={isLoading}
            >
              <MenuItem value="Actif">Actif</MenuItem>
              <MenuItem value="Inactif">Inactif</MenuItem>
              <MenuItem value="Suspendu">Suspendu</MenuItem>
            </Select>
          </FormControl>

          {showFeaturesField && (
            <>
              <Divider sx={{ my: 2 }} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Fonctionnalités de l'agent
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Gérez les fonctionnalités auxquelles cet agent a accès
              </p>
              
              <FeatureCheckboxList
                features={agentFeatures}
                selectedFeatures={editData.features || []}
                onFeatureToggle={handleFeatureToggle}
                onSelectAll={handleSelectAllFeatures}
                disabled={isLoading}
              />
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
          onClick={onClose}
          disabled={isLoading}
          className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Annuler
        </button>
        
        <button
          onClick={onUpdate}
          disabled={isLoading}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? <CircularProgress size={20} color="inherit" /> : <Save className="w-4 h-4" />}
          {isLoading ? "Mise à jour..." : "Mettre à jour"}
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUserDialog;