import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  DollarSign,
  Calendar,
  Clock,
  Phone,
  Users,
  Briefcase,
  Shield,
  Star,
  Eye,
  Edit,
  Mail,
  Ban,
  Trash2,
} from 'lucide-react';
import { roleConfig, statusConfig } from './Constants';

const UsersTable = ({ users, onMenuOpen, onRowClick, userType = 'staff' }) => {
  if (users.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{ 
          borderRadius: 3,
          border: '1px solid #f0f0f0',
          p: 8,
          textAlign: 'center'
        }}
      >
        <div className="flex flex-col items-center gap-3">
          <Users className="w-12 h-12 text-gray-300" />
          <p className="text-gray-500">Aucun utilisateur trouvé</p>
        </div>
      </Paper>
    );
  }

  // Colonnes pour les Agents & Admins
  const staffColumns = [
    { label: "Utilisateur", width: "30%", key: "user" },
    { label: "Contact", width: "30%", key: "contact" },
    { label: "Rôle", width: "12%", key: "role" },
    { label: "Statut", width: "12%", key: "status" },
    { label: "Actions", width: "16%", key: "actions" },
  ];

  // Colonnes pour les Voyageurs
  const voyageurColumns = [
    { label: "Voyageur", width: "22%", key: "user" },
    { label: "Contact", width: "22%", key: "contact" },
    { label: "Statut", width: "10%", key: "status" },
    { label: "Réservations", width: "10%", key: "bookings" },
    // { label: "Dépenses", width: "12%", key: "spent" },
    { label: "Membre depuis", width: "12%", key: "joinDate" },
    { label: "Actions", width: "12%", key: "actions" },
  ];

  const columns = userType === 'staff' ? staffColumns : voyageurColumns;

  const ActionButtons = ({ user }) => {
    const isAgent = user.role === 'Agent';
    const isVoyageur = user.role === 'Voyageur';
    
    return (
      <div className="flex items-center gap-1">
        {/* Bouton Voir détails - uniquement pour les voyageurs */}
        {isVoyageur && (
          <Tooltip title="Voir détails">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onRowClick(user);
              }}
              sx={{ color: '#3b82f6' }}
            >
              <Eye className="w-4 h-4" />
            </IconButton>
          </Tooltip>
        )}
        
        <Tooltip title="Modifier">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onMenuOpen(e, user, 'edit');
            }}
            sx={{ color: '#f59e0b' }}
          >
            <Edit className="w-4 h-4" />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Envoyer un email">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onMenuOpen(e, user, 'email');
            }}
            sx={{ color: '#10b981' }}
          >
            <Mail className="w-4 h-4" />
          </IconButton>
        </Tooltip>
        
        {isAgent && (
          <Tooltip title="Gérer les fonctionnalités">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onMenuOpen(e, user, 'features');
              }}
              sx={{ color: '#8b5cf6' }}
            >
              <Shield className="w-4 h-4" />
            </IconButton>
          </Tooltip>
        )}
        
        <Tooltip title={user.status === 'Suspendu' ? "Réactiver" : "Suspendre"}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onMenuOpen(e, user, 'suspend');
            }}
            sx={{ color: user.status === 'Suspendu' ? '#10b981' : '#f59e0b' }}
          >
            <Ban className="w-4 h-4" />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Supprimer">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onMenuOpen(e, user, 'delete');
            }}
            sx={{ color: '#ef4444' }}
          >
            <Trash2 className="w-4 h-4" />
          </IconButton>
        </Tooltip>
      </div>
    );
  };

  const renderCell = (user, column) => {
    switch (column.key) {
      case 'user':
        return (
          <div className="flex items-center gap-3">
            <div>
              <div className="font-medium text-gray-900">{user.name}</div>
              {userType === 'staff' && (
                <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3" />
                  ID: {user.id}
                </div>
              )}
              {userType === 'voyageur' && (
                <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                  <Star className="w-3 h-3" />
                  Membre depuis {user.joinDate}
                </div>
              )}
            </div>
          </div>
        );
      
      case 'contact':
        return (
          <div>
            <div className="text-gray-900 text-sm">{user.email}</div>
            {userType === 'voyageur' && user.telephone && (
              <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                <Phone className="w-3 h-3" />
                {user.telephone}
              </div>
            )}
          </div>
        );
      
      case 'role':
        const RoleIcon = roleConfig[user.role]?.icon || Shield;
        return (
          <Chip
            icon={<RoleIcon className="w-4 h-4" />}
            label={user.role}
            size="small"
            sx={{
              backgroundColor: roleConfig[user.role]?.bg || '#f3f4f6',
              color: roleConfig[user.role]?.color || '#374151',
              fontWeight: 500,
              '& .MuiChip-icon': { color: 'inherit' },
            }}
          />
        );
      
      case 'status':
        const StatusIcon = statusConfig[user.status]?.icon;
        return (
          <Chip
            icon={StatusIcon && <StatusIcon className="w-4 h-4" />}
            label={user.status}
            size="small"
            sx={{
              backgroundColor: statusConfig[user.status]?.bg || '#f3f4f6',
              color: statusConfig[user.status]?.color || '#374151',
              fontWeight: 500,
              '& .MuiChip-icon': { color: 'inherit' },
            }}
          />
        );
      
      case 'bookings':
        return (
          <div className="flex items-center gap-1">
            <Briefcase className="w-4 h-4 text-blue-500" />
            <span className="font-semibold text-gray-900">{user.bookings || 0}</span>
          </div>
        );
      
      case 'spent':
        return (
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4 text-green-500" />
            <span className="font-semibold text-gray-900">{user.totalSpent || "€0"}</span>
          </div>
        );
      
      case 'joinDate':
        return (
          <div className="flex items-center gap-1 text-gray-500">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{user.joinDate}</span>
          </div>
        );
      
      case 'lastActive':
        return (
          <div className="flex items-center gap-1 text-gray-500">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{user.lastActive}</span>
          </div>
        );
      
      case 'actions':
        return <ActionButtons user={user} />;
      
      default:
        return null;
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{ 
        borderRadius: 3,
        border: '1px solid #f0f0f0',
        overflow: 'hidden'
      }}
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f9fafb' }}>
              {columns.map((col) => (
                <TableCell 
                  key={col.key} 
                  sx={{ 
                    fontWeight: 600, 
                    width: col.width,
                    color: '#374151',
                    fontSize: '0.875rem',
                  }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                sx={{
                  '&:hover': { backgroundColor: '#f9fafb' },
                  cursor: user.role === 'Voyageur' ? 'pointer' : 'default',
                }}
                onClick={() => {
                  if (user.role === 'Voyageur') {
                    onRowClick(user);
                  }
                }}
              >
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    {renderCell(user, col)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default UsersTable;