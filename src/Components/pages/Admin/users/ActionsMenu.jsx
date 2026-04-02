import React from 'react';
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Eye,
  Edit,
  Mail,
  UserCog,
  Ban,
  Trash2,
  Shield,
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
  onManageFeatures,
}) => {
  const handleAction = (action) => {
    switch (action) {
      case 'view':
        onView(selectedUser);
        break;
      case 'edit':
        onEdit(selectedUser);
        break;
      case 'email':
        onEmail(selectedUser);
        break;
      case 'promote':
        onPromote(selectedUser);
        break;
      case 'suspend':
        onSuspend(selectedUser);
        break;
      case 'delete':
        onDelete(selectedUser);
        break;
      case 'features':
        if (onManageFeatures) onManageFeatures(selectedUser);
        break;
      default:
        break;
    }
    onClose();
  };

  if (!selectedUser) return null;

  const isAgent = selectedUser.role === 'Agent';
  const isVoyageur = selectedUser.role === 'Voyageur';
  const isAdminOrAgent = selectedUser.role === 'Admin' || selectedUser.role === 'Agent';

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 2,
          minWidth: 200,
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
        }
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <MenuItem onClick={() => handleAction('view')}>
        <ListItemIcon>
          <Eye className="w-4 h-4 text-blue-500" />
        </ListItemIcon>
        <ListItemText>Voir détails</ListItemText>
      </MenuItem>
      
      <MenuItem onClick={() => handleAction('edit')}>
        <ListItemIcon>
          <Edit className="w-4 h-4 text-orange-500" />
        </ListItemIcon>
        <ListItemText>Modifier</ListItemText>
      </MenuItem>
      
      <MenuItem onClick={() => handleAction('email')}>
        <ListItemIcon>
          <Mail className="w-4 h-4 text-green-500" />
        </ListItemIcon>
        <ListItemText>Envoyer un email</ListItemText>
      </MenuItem>
      
      {isAgent && (
        <MenuItem onClick={() => handleAction('features')}>
          <ListItemIcon>
            <Shield className="w-4 h-4 text-purple-500" />
          </ListItemIcon>
          <ListItemText>Gérer les fonctionnalités</ListItemText>
        </MenuItem>
      )}
      
      {isVoyageur && (
        <MenuItem onClick={() => handleAction('promote')}>
          <ListItemIcon>
            <UserCog className="w-4 h-4 text-pink-500" />
          </ListItemIcon>
          <ListItemText>Promouvoir Agent</ListItemText>
        </MenuItem>
      )}
      
      <Divider />
      
      <MenuItem onClick={() => handleAction('suspend')}>
        <ListItemIcon>
          <Ban className={`w-4 h-4 ${selectedUser.status === 'Suspendu' ? 'text-green-500' : 'text-orange-500'}`} />
        </ListItemIcon>
        <ListItemText>
          {selectedUser.status === 'Suspendu' ? 'Réactiver' : 'Suspendre'}
        </ListItemText>
      </MenuItem>
      
      <MenuItem onClick={() => handleAction('delete')} sx={{ color: '#ef4444' }}>
        <ListItemIcon>
          <Trash2 className="w-4 h-4 text-red-500" />
        </ListItemIcon>
        <ListItemText>Supprimer</ListItemText>
      </MenuItem>
    </Menu>
  );
};

export default ActionsMenu;