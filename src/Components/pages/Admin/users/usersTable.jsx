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
} from '@mui/material';
import {
  MoreVertical,
  DollarSign,
  Calendar,
  Clock,
  Phone,
  Users,
} from 'lucide-react';
import { roleConfig, statusConfig } from './Constants';

const UsersTable = ({ users, onMenuOpen, onRowClick }) => {
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
              <TableCell sx={{ fontWeight: 600, width: '25%' }}>Utilisateur</TableCell>
              <TableCell sx={{ fontWeight: 600, width: '20%' }}>Contact</TableCell>
              <TableCell sx={{ fontWeight: 600, width: '10%' }}>Rôle</TableCell>
              <TableCell sx={{ fontWeight: 600, width: '10%' }}>Statut</TableCell>
              <TableCell sx={{ fontWeight: 600, width: '8%' }}>Réservations</TableCell>
              <TableCell sx={{ fontWeight: 600, width: '10%' }}>Dépenses</TableCell>
              <TableCell sx={{ fontWeight: 600, width: '12%' }}>Inscription</TableCell>
              <TableCell sx={{ fontWeight: 600, width: '5%' }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => {
              const RoleIcon = roleConfig[user.role]?.icon;
              const StatusIcon = statusConfig[user.status]?.icon;
              
              return (
                <TableRow
                  key={user.id}
                  sx={{
                    '&:hover': { backgroundColor: '#f9fafb' },
                    cursor: 'pointer',
                  }}
                  onClick={() => onRowClick(user)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Actif: {user.lastActive}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div>
                      <div className="text-gray-900">{user.email}</div>
                      <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                        <Phone className="w-3 h-3" />
                        {user.phone}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Chip
                      icon={<RoleIcon className="w-4 h-4" />}
                      label={user.role}
                      size="small"
                      sx={{
                        backgroundColor: roleConfig[user.role]?.bg,
                        color: roleConfig[user.role]?.color,
                        fontWeight: 500,
                        '& .MuiChip-icon': { color: 'inherit' },
                      }}
                    />
                  </TableCell>
                  
                  <TableCell>
                    <Chip
                      icon={<StatusIcon className="w-4 h-4" />}
                      label={user.status}
                      size="small"
                      sx={{
                        backgroundColor: statusConfig[user.status]?.bg,
                        color: statusConfig[user.status]?.color,
                        fontWeight: 500,
                        '& .MuiChip-icon': { color: 'inherit' },
                      }}
                    />
                  </TableCell>
                  
                  <TableCell>
                    <span className="font-medium text-gray-900">{user.bookings}</span>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <span className="font-semibold text-gray-900">{user.totalSpent}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{user.joinDate}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Tooltip title="Actions">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onMenuOpen(e, user);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-500" />
                      </button>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default UsersTable;