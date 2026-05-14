// Components/pages/TripHubDz/Admin/Agencies.jsx
import { useState } from 'react';
import { Search, Plus, Eye, Edit, Trash2, Users, Calendar, DollarSign, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock data
const initialAgencies = [
  {
    id: 1, name: "Global Voyages", subdomain: "global-voyages", plan: "Professional", status: "active",
    registered: "2024-01-15", revenue: 29900, agents: 12, voyageurs: 456, rating: 4.8, reviews: 1234,
    email: "contact@global-voyages.com", phone: "+213 23 45 67 89", address: "Alger, Algérie",
    logo: "https://ui-avatars.com/api/?name=Global+Voyages&background=00c0e8&color=fff",
    coverImage: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=400&h=200&fit=crop",
    description: "Expert en voyages internationaux depuis 2010", owner: "Ahmed Benali", ownerEmail: "ahmed@global-voyages.com"
  },
  // Add more agencies...
];

export default function Agencies() {
  const [agencies, setAgencies] = useState(initialAgencies);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [formData, setFormData] = useState({
    name: '', subdomain: '', plan: 'Basic', email: '', phone: '', address: '', owner: '', ownerEmail: ''
  });

  const filteredAgencies = agencies.filter(agency => {
    const matchesSearch = agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          agency.subdomain.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          agency.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || agency.status === statusFilter;
    const matchesPlan = planFilter === 'all' || agency.plan === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-red-100 text-red-800'
    };
    const labels = { active: 'Actif', pending: 'En attente', suspended: 'Suspendu' };
    return <span className={`px-2 py-1 rounded-lg text-xs font-medium ${badges[status]}`}>{labels[status]}</span>;
  };

  const getPlanBadge = (plan) => {
    const badges = {
      Basic: 'bg-blue-100 text-blue-800',
      Professional: 'bg-purple-100 text-purple-800',
      Enterprise: 'bg-orange-100 text-orange-800'
    };
    return <span className={`px-2 py-1 rounded-lg text-xs font-medium ${badges[plan]}`}>{plan}</span>;
  };

  const handleAddAgency = () => {
    const newAgency = {
      id: agencies.length + 1,
      ...formData,
      status: 'pending',
      registered: new Date().toISOString().split('T')[0],
      revenue: formData.plan === 'Enterprise' ? 39900 : formData.plan === 'Professional' ? 29900 : 19900,
      agents: 0, voyageurs: 0, rating: 0, reviews: 0,
      logo: `https://ui-avatars.com/api/?name=${formData.name.replace(/ /g, '+')}&background=00c0e8&color=fff`,
      coverImage: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=400&h=200&fit=crop',
      description: `Nouvelle agence ${formData.name}`
    };
    setAgencies([...agencies, newAgency]);
    setShowModal(false);
    setFormData({ name: '', subdomain: '', plan: 'Basic', email: '', phone: '', address: '', owner: '', ownerEmail: '' });
  };

  const handleDeleteAgency = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette agence ?')) {
      setAgencies(agencies.filter(a => a.id !== id));
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setAgencies(agencies.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Rechercher une agence..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00c0e8] text-sm" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#00c0e8]">
            <option value="all">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="pending">En attente</option>
            <option value="suspended">Suspendu</option>
          </select>
          <select value={planFilter} onChange={(e) => setPlanFilter(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#00c0e8]">
            <option value="all">Tous les plans</option>
            <option value="Basic">Basic</option>
            <option value="Professional">Professional</option>
            <option value="Enterprise">Enterprise</option>
          </select>
          <button onClick={() => { setSearchTerm(''); setStatusFilter('all'); setPlanFilter('all'); }} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm">Réinitialiser</button>
          <button onClick={() => { setModalType('add'); setShowModal(true); }} className="px-4 py-2 bg-[#00c0e8] text-white rounded-lg hover:bg-[#00c0e8]/80 transition flex items-center gap-2 text-sm">
            <Plus className="h-4 w-4" /> Nouvelle agence
          </button>
        </div>
      </div>

      {/* Agencies Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredAgencies.map((agency, index) => (
          <motion.div
            key={agency.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
          >
            <div className="relative h-28">
              <img src={agency.coverImage} alt={agency.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute top-2 right-2 flex space-x-1">
                <button className="p-1.5 bg-white/90 rounded-lg hover:bg-white transition"><Eye className="h-3.5 w-3.5 text-gray-700" /></button>
                <button className="p-1.5 bg-white/90 rounded-lg hover:bg-white transition"><Edit className="h-3.5 w-3.5 text-gray-700" /></button>
                <button onClick={() => handleDeleteAgency(agency.id)} className="p-1.5 bg-white/90 rounded-lg hover:bg-white transition"><Trash2 className="h-3.5 w-3.5 text-red-500" /></button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <img src={agency.logo} alt={agency.name} className="w-10 h-10 rounded-lg object-cover" />
                <div>
                  <h3 className="font-semibold text-gray-800">{agency.name}</h3>
                  <div className="flex items-center"><Star className="h-3.5 w-3.5 text-yellow-400 fill-current" /><span className="text-xs text-gray-600 ml-1">{agency.rating}</span></div>
                </div>
              </div>
              <p className="text-gray-500 text-xs mb-3 line-clamp-2">{agency.description}</p>
              <div className="flex justify-between items-center mb-3">{getStatusBadge(agency.status)}{getPlanBadge(agency.plan)}</div>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-3">
                <div className="flex items-center"><Users className="h-3 w-3 mr-1" /> {agency.agents} agents</div>
                <div className="flex items-center"><Calendar className="h-3 w-3 mr-1" /> {agency.registered}</div>
                <div className="flex items-center"><DollarSign className="h-3 w-3 mr-1" /> {agency.revenue.toLocaleString()} DA</div>
                <div className="flex items-center"><Users className="h-3 w-3 mr-1" /> {agency.voyageurs} voyageurs</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleStatusChange(agency.id, agency.status === 'active' ? 'suspended' : 'active')} className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition ${agency.status === 'active' ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                  {agency.status === 'active' ? 'Suspendre' : 'Activer'}
                </button>
                <a href={`http://${agency.subdomain}.75.119.131.39:3000`} target="_blank" rel="noopener noreferrer" className="flex-1 bg-gray-100 text-gray-700 py-1.5 rounded-lg text-xs font-medium text-center hover:bg-gray-200 transition">Visiter</a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Agency Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">Nouvelle agence</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>
              <div className="p-6 space-y-3">
                <input type="text" placeholder="Nom de l'agence" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00c0e8]" />
                <input type="text" placeholder="Sous-domaine" value={formData.subdomain} onChange={(e) => setFormData({...formData, subdomain: e.target.value})} className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00c0e8]" />
                <select value={formData.plan} onChange={(e) => setFormData({...formData, plan: e.target.value})} className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00c0e8]">
                  <option value="Basic">Basic</option>
                  <option value="Professional">Professional</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
                <input type="email" placeholder="Email de contact" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00c0e8]" />
                <input type="text" placeholder="Téléphone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00c0e8]" />
                <input type="text" placeholder="Adresse" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00c0e8]" />
                <input type="text" placeholder="Nom du propriétaire" value={formData.owner} onChange={(e) => setFormData({...formData, owner: e.target.value})} className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00c0e8]" />
                <input type="email" placeholder="Email du propriétaire" value={formData.ownerEmail} onChange={(e) => setFormData({...formData, ownerEmail: e.target.value})} className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00c0e8]" />
                <button onClick={handleAddAgency} className="w-full py-2.5 bg-[#00c0e8] text-white rounded-lg font-semibold hover:bg-[#00c0e8]/80 transition">Créer l'agence</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}