// Components/pages/TripHubDz/Admin/Users.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, Edit, Trash2, Shield, Search, 
  Mail, Phone, Calendar, CheckCircle, XCircle,
  Users as UsersIcon  // <-- Rename the icon to UsersIcon
} from 'lucide-react';

const initialUsers = [
  { id: 1, name: "Ahmed Benali", email: "ahmed@triphubdz.com", role: "Super Admin", status: "active", lastLogin: "2024-03-20 09:30", avatar: "https://ui-avatars.com/api/?name=Ahmed+Benali&background=00c0e8&color=fff", phone: "+213 551 23 45 67", createdAt: "2024-01-01" },
  { id: 2, name: "Fatima Zahra", email: "fatima@triphubdz.com", role: "Admin", status: "active", lastLogin: "2024-03-19 14:20", avatar: "https://ui-avatars.com/api/?name=Fatima+Zahra&background=00c0e8&color=fff", phone: "+213 552 34 56 78", createdAt: "2024-01-15" },
  { id: 3, name: "Karim Said", email: "karim@triphubdz.com", role: "Support", status: "active", lastLogin: "2024-03-18 11:00", avatar: "https://ui-avatars.com/api/?name=Karim+Said&background=00c0e8&color=fff", phone: "+213 553 45 67 89", createdAt: "2024-02-01" },
  { id: 4, name: "Samira Lounis", email: "samira@triphubdz.com", role: "Billing", status: "inactive", lastLogin: "2024-03-10 08:15", avatar: "https://ui-avatars.com/api/?name=Samira+Lounis&background=00c0e8&color=fff", phone: "+213 554 56 78 90", createdAt: "2024-02-15" }
];

const roles = [
  { value: "Super Admin", color: "bg-purple-100 text-purple-800", icon: Shield },
  { value: "Admin", color: "bg-blue-100 text-blue-800", icon: Shield },
  { value: "Support", color: "bg-green-100 text-green-800", icon: Shield },
  { value: "Billing", color: "bg-orange-100 text-orange-800", icon: Shield }
];

export default function Users() {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'Support', phone: '' });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAddUser = () => {
    const newUser = {
      id: users.length + 1,
      ...formData,
      status: 'active',
      lastLogin: new Date().toLocaleString(),
      avatar: `https://ui-avatars.com/api/?name=${formData.name.replace(/ /g, '+')}&background=00c0e8&color=fff`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUsers([...users, newUser]);
    setShowModal(false);
    setFormData({ name: '', email: '', role: 'Support', phone: '' });
  };

  const handleDeleteUser = () => {
    setUsers(users.filter(u => u.id !== selectedUser.id));
    setShowDeleteConfirm(false);
    setSelectedUser(null);
  };

  const handleStatusToggle = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u));
  };

  const getRoleBadge = (role) => {
    const roleConfig = roles.find(r => r.value === role) || roles[2];
    return <span className={`px-2 py-1 rounded-lg text-xs font-medium ${roleConfig.color}`}>{role}</span>;
  };

  const getStatusBadge = (status) => {
    if (status === 'active') return <span className="px-2 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-800 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Actif</span>;
    return <span className="px-2 py-1 rounded-lg text-xs font-medium bg-red-100 text-red-800 flex items-center gap-1"><XCircle className="h-3 w-3" /> Inactif</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Gestion des utilisateurs</h2>
          <p className="text-sm text-gray-500 mt-1">Gérez les accès à la plateforme</p>
        </div>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-[#00c0e8] text-white rounded-lg hover:bg-[#00c0e8]/80 transition flex items-center gap-2">
          <UserPlus className="h-4 w-4" /> Nouvel utilisateur
        </button>
      </div>

      {/* Stats - Fixed icon reference */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total utilisateurs", value: users.length, color: "bg-blue-500", icon: UsersIcon },
          { label: "Actifs", value: users.filter(u => u.status === 'active').length, color: "bg-green-500", icon: CheckCircle },
          { label: "Inactifs", value: users.filter(u => u.status === 'inactive').length, color: "bg-red-500", icon: XCircle },
          { label: "Rôles", value: roles.length, color: "bg-purple-500", icon: Shield }
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className={`${stat.color} w-8 h-8 rounded-lg flex items-center justify-center`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
            </div>
            <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#00c0e8]" 
            />
          </div>
          <select 
            value={roleFilter} 
            onChange={(e) => setRoleFilter(e.target.value)} 
            className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#00c0e8]"
          >
            <option value="all">Tous les rôles</option>
            {roles.map(r => <option key={r.value} value={r.value}>{r.value}</option>)}
          </select>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)} 
            className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#00c0e8]"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
          </select>
          <button 
            onClick={() => { setSearchTerm(''); setRoleFilter('all'); setStatusFilter('all'); }} 
            className="px-4 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600">Utilisateur</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600">Contact</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600">Rôle</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600">Statut</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600">Dernière connexion</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <motion.tr 
                  key={user.id} 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  transition={{ delay: index * 0.05 }} 
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img src={user.avatar} className="w-9 h-9 rounded-lg" alt={user.name} />
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{user.name}</p>
                        <p className="text-xs text-gray-400">ID: #{user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-xs text-gray-400">{user.phone}</p>
                    </div>
                   </td>
                  <td className="px-5 py-3">{getRoleBadge(user.role)}</td>
                  <td className="px-5 py-3">{getStatusBadge(user.status)}</td>
                  <td className="px-5 py-3">
                    <div>
                      <p className="text-sm text-gray-600">{user.lastLogin?.split(' ')[0]}</p>
                      <p className="text-xs text-gray-400">{user.lastLogin?.split(' ')[1]}</p>
                    </div>
                   </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleStatusToggle(user.id)} 
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition"
                      >
                        <CheckCircle className={`h-4 w-4 ${user.status === 'active' ? 'text-green-500' : 'text-gray-400'}`} />
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 rounded-lg transition">
                        <Edit className="h-4 w-4 text-blue-500" />
                      </button>
                      <button 
                        onClick={() => { setSelectedUser(user); setShowDeleteConfirm(true); }} 
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                   </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" 
            onClick={() => setShowModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9 }} 
              animate={{ scale: 1 }} 
              exit={{ scale: 0.9 }} 
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full" 
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">Ajouter un utilisateur</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6 space-y-3">
                <input 
                  type="text" 
                  placeholder="Nom complet" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#00c0e8]" 
                />
                <input 
                  type="email" 
                  placeholder="Email" 
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#00c0e8]" 
                />
                <input 
                  type="tel" 
                  placeholder="Téléphone" 
                  value={formData.phone} 
                  onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#00c0e8]" 
                />
                <select 
                  value={formData.role} 
                  onChange={(e) => setFormData({...formData, role: e.target.value})} 
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#00c0e8]"
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Admin">Admin</option>
                  <option value="Support">Support</option>
                  <option value="Billing">Billing</option>
                </select>
                <button 
                  onClick={handleAddUser} 
                  className="w-full py-2.5 bg-[#00c0e8] text-white rounded-lg font-semibold hover:bg-[#00c0e8]/80 transition"
                >
                  Ajouter
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" 
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div 
              initial={{ scale: 0.9 }} 
              animate={{ scale: 1 }} 
              exit={{ scale: 0.9 }} 
              className="bg-white rounded-2xl shadow-2xl max-w-sm w-full" 
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Supprimer l'utilisateur</h3>
                <p className="text-gray-500 text-sm mb-6">
                  Êtes-vous sûr de vouloir supprimer <span className="font-semibold">{selectedUser?.name}</span> ? Cette action est irréversible.
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 transition">
                    Annuler
                  </button>
                  <button onClick={handleDeleteUser} className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
                    Supprimer
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}