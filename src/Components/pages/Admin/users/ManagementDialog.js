import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import { Shield, Save } from 'lucide-react';
import FeatureCheckboxList from './FeatureCheckboxList';
import { agentFeatures } from './Constants';

const FeatureManagementDialog = ({
  open,
  onClose,
  onSave,
  user,
  isLoading,
}) => {
  const [selectedFeatures, setSelectedFeatures] = useState(user?.features || []);

  React.useEffect(() => {
    if (user) {
      setSelectedFeatures(user.features || []);
    }
  }, [user]);

  if (!user) return null;

  const handleFeatureToggle = (featureId) => {
    setSelectedFeatures(prev =>
      prev.includes(featureId)
        ? prev.filter(f => f !== featureId)
        : [...prev, featureId]
    );
  };

  const handleSelectAllFeatures = () => {
    if (selectedFeatures.length === agentFeatures.length) {
      setSelectedFeatures([]);
    } else {
      setSelectedFeatures(agentFeatures.map(f => f.id));
    }
  };

  const handleSave = () => {
    onSave(user, selectedFeatures);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
              Gérer les fonctionnalités
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {user.name}
            </p>
          </div>
          <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-purple-500" />
          </div>
        </div>
      </DialogTitle>
      
      <DialogContent sx={{ p: 4 }}>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Fonctionnalités de l'agent
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Sélectionnez les fonctionnalités auxquelles cet agent aura accès
        </p>
        
        <FeatureCheckboxList
          features={agentFeatures}
          selectedFeatures={selectedFeatures}
          onFeatureToggle={handleFeatureToggle}
          onSelectAll={handleSelectAllFeatures}
          disabled={isLoading}
        />
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
          className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all"
        >
          Annuler
        </button>
        
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-all shadow-lg shadow-purple-500/20 flex items-center gap-2"
        >
          {isLoading ? <CircularProgress size={20} color="inherit" /> : <Save className="w-4 h-4" />}
          {isLoading ? "Sauvegarde..." : "Sauvegarder"}
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default FeatureManagementDialog;