// Components/pages/TripHubDz/Admin/Payments.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Clock, Receipt, CheckCircle, Eye, Download, TrendingUp, Calendar } from 'lucide-react';

// Mock data
const recentPayments = [
  { id: 1, agency: "Global Voyages", amount: 29900, date: "2024-03-15", status: "completed", method: "CIB" },
  { id: 2, agency: "SkyHigh Travel", amount: 39900, date: "2024-03-20", status: "completed", method: "Edahabia" },
  { id: 3, agency: "Aventure Monde", amount: 19900, date: "2024-03-10", status: "pending", method: "CIB" },
  { id: 4, agency: "Global Voyages", amount: 29900, date: "2024-02-15", status: "completed", method: "CIB" },
  { id: 5, agency: "SkyHigh Travel", amount: 39900, date: "2024-02-20", status: "completed", method: "Edahabia" },
  { id: 6, agency: "Sahara Tours", amount: 24900, date: "2024-03-25", status: "pending", method: "CIB" },
  { id: 7, agency: "Desert Travel", amount: 29900, date: "2024-03-28", status: "completed", method: "Visa" }
];

const monthlyRevenue = [
  { month: "Jan", revenue: 1245000, year: 2024 },
  { month: "Fév", revenue: 1568000, year: 2024 },
  { month: "Mar", revenue: 1892000, year: 2024 },
  { month: "Avr", revenue: 2145000, year: 2024 },
  { month: "Mai", revenue: 2356000, year: 2024 },
  { month: "Jun", revenue: 2678000, year: 2024 },
  { month: "Jul", revenue: 2890000, year: 2024 },
  { month: "Aoû", revenue: 3120000, year: 2024 },
  { month: "Sep", revenue: 2980000, year: 2024 },
  { month: "Oct", revenue: 3250000, year: 2024 },
  { month: "Nov", revenue: 3410000, year: 2024 },
  { month: "Déc", revenue: 3670000, year: 2024 }
];

const paymentMethods = [
  { id: "all", name: "Tous", icon: "💰" },
  { id: "CIB", name: "CIB", icon: "💳" },
  { id: "Edahabia", name: "Edahabia", icon: "🏦" },
  { id: "Visa", name: "Visa", icon: "💳" }
];

export default function Payments() {
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedMethod, setSelectedMethod] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const paymentStats = {
    totalRevenue: recentPayments.reduce((sum, p) => p.status === 'completed' ? sum + p.amount : sum, 0),
    pendingRevenue: recentPayments.reduce((sum, p) => p.status === 'pending' ? sum + p.amount : sum, 0),
    totalTransactions: recentPayments.length,
    completedTransactions: recentPayments.filter(p => p.status === 'completed').length,
    successRate: ((recentPayments.filter(p => p.status === 'completed').length / recentPayments.length) * 100).toFixed(1)
  };

  const filteredPayments = recentPayments.filter(payment => {
    const matchesMethod = selectedMethod === "all" || payment.method === selectedMethod;
    const matchesSearch = payment.agency.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesMethod && matchesSearch;
  });

  const getStatusBadge = (status) => {
    const badges = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800'
    };
    const labels = { completed: 'Complété', pending: 'En attente', failed: 'Échoué' };
    return <span className={`px-2 py-1 rounded-lg text-xs font-medium ${badges[status]}`}>{labels[status]}</span>;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-DZ', { style: 'currency', currency: 'DZD', minimumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { icon: DollarSign, label: "Revenus totaux", value: formatCurrency(paymentStats.totalRevenue), color: "bg-green-500", change: "+23%" },
          { icon: Clock, label: "En attente", value: formatCurrency(paymentStats.pendingRevenue), color: "bg-yellow-500", change: "-5%" },
          { icon: Receipt, label: "Transactions", value: paymentStats.totalTransactions, color: "bg-blue-500", change: "+12%" },
          { icon: CheckCircle, label: "Taux de succès", value: `${paymentStats.successRate}%`, color: "bg-purple-500", change: "+3%" }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl shadow-sm p-5 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`${stat.color} w-10 h-10 rounded-xl flex items-center justify-center`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
              <span className={`text-sm font-medium px-2 py-1 rounded-lg ${stat.change.startsWith('+') ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
            <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-semibold text-gray-800">Évolution des revenus</h3>
            <p className="text-xs text-gray-500 mt-1">Comparaison mensuelle des revenus</p>
          </div>
          <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} className="text-sm border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#00c0e8]">
            <option value={2024}>2024</option>
            <option value={2023}>2023</option>
          </select>
        </div>
        <div className="h-80">
          <div className="flex items-end h-64 space-x-2">
            {monthlyRevenue.filter(m => m.year === selectedYear).map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center group">
                <div className="relative w-full">
                  <div className="w-full bg-gradient-to-t from-[#00c0e8] to-[#00c0e8]/70 rounded-t-lg transition-all group-hover:opacity-80" style={{ height: `${(item.revenue / 4000000) * 100}px` }}>
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      {formatCurrency(item.revenue)}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-500 mt-2">{item.month}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between text-sm text-gray-500">
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#00c0e8] rounded"></div><span>Revenus {selectedYear}</span></div>
            <div className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-green-500" /><span className="text-green-600">+18.5% vs année dernière</span></div>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b bg-gray-50 flex justify-between items-center flex-wrap gap-3">
          <div>
            <h3 className="font-semibold text-gray-800">Historique des paiements</h3>
            <p className="text-xs text-gray-500 mt-0.5">Liste de toutes les transactions</p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <input type="text" placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 pr-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#00c0e8]" />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <select value={selectedMethod} onChange={(e) => setSelectedMethod(e.target.value)} className="px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#00c0e8]">
              {paymentMethods.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600">Agence</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600">Montant</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600">Date</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600">Méthode</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600">Statut</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment, index) => (
                <motion.tr key={payment.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.02 }} className="border-t hover:bg-gray-50 transition">
                  <td className="px-5 py-3 text-sm font-medium text-gray-800">{payment.agency}</td>
                  <td className="px-5 py-3 text-sm font-semibold text-[#00c0e8]">{formatCurrency(payment.amount)}</td>
                  <td className="px-5 py-3 text-sm text-gray-500">{payment.date}</td>
                  <td className="px-5 py-3"><span className="px-2 py-1 rounded-lg text-xs bg-blue-100 text-blue-800">{payment.method}</span></td>
                  <td className="px-5 py-3">{getStatusBadge(payment.status)}</td>
                  <td className="px-5 py-3"><div className="flex gap-2"><button className="text-blue-600 hover:text-blue-800"><Eye className="h-4 w-4" /></button><button className="text-gray-600 hover:text-gray-800"><Download className="h-4 w-4" /></button></div></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t bg-gray-50 flex justify-between items-center text-sm">
          <span className="text-gray-500">Total: {filteredPayments.length} transactions</span>
          <button className="text-[#00c0e8] hover:underline">Voir tout</button>
        </div>
      </div>
    </div>
  );
}