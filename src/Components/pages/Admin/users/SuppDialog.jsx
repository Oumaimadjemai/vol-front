import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Zoom,
} from '@mui/material';
import {
  AlertTriangle,
  Trash2,
} from 'lucide-react';

const DeleteDialog = ({
  open,
  onClose,
  onConfirm,
  userName,
  isLoading,
}) => {
  const [confirmText, setConfirmText] = useState("");

  const handleConfirm = () => {
    onConfirm(confirmText, () => setConfirmText(""));
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      setConfirmText("");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
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
            Êtes-vous sûr de vouloir supprimer l'utilisateur <span className="font-semibold">{userName}</span> ?
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
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
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
          onClick={handleClose}
          disabled={isLoading}
          className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Annuler
        </button>
        
        <button
          onClick={handleConfirm}
          disabled={isLoading || confirmText !== "supprimer"}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all shadow-lg shadow-red-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? <CircularProgress size={20} color="inherit" /> : <Trash2 className="w-4 h-4" />}
          {isLoading ? "Suppression..." : "Supprimer définitivement"}
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;