import React from 'react';
import { Menu, MenuItem, Divider } from '@mui/material';
import {
  Eye,
  Edit2,
  Mail,
  Shield,
  Ban,
  CheckCircle2,
  Trash2,
} from 'lucide-react';

const ActionsMenu = ({
  anchorEl,
  open,
  onClose,
  selectedUser,
  onView,
  onEdit,
  onEmail,
  onPromote,
  onSuspend,
  onDelete,
}) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
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
      <MenuItem onClick={() => onView(selectedUser)} className="gap-2 py-2">
        <Eye className="w-4 h-4 text-gray-500" />
        <span>Voir les détails</span>
      </MenuItem>
      <MenuItem onClick={() => onEdit(selectedUser)} className="gap-2 py-2">
        <Edit2 className="w-4 h-4 text-gray-500" />
        <span>Modifier</span>
      </MenuItem>
      <Divider />
      <MenuItem onClick={() => onEmail(selectedUser)} className="gap-2 py-2">
        <Mail className="w-4 h-4 text-gray-500" />
        <span>Envoyer un email</span>
      </MenuItem>
      {selectedUser?.role !== "Agent" && selectedUser?.role !== "Admin" && (
        <MenuItem onClick={() => onPromote(selectedUser)} className="gap-2 py-2">
          <Shield className="w-4 h-4 text-gray-500" />
          <span>Promouvoir Agent</span>
        </MenuItem>
      )}
      <MenuItem 
        onClick={() => onSuspend(selectedUser)} 
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
        onClick={() => onDelete(selectedUser)} 
        className="gap-2 py-2 text-red-600 hover:bg-red-50"
      >
        <Trash2 className="w-4 h-4" />
        <span>Supprimer</span>
      </MenuItem>
    </Menu>
  );
};

export default ActionsMenu;