// Components/pages/TripHubDz/Admin/Settings.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Lock, Palette, Bell, Mail, Shield, Save, RefreshCw, Database, Server, Cloud, CheckCircle } from 'lucide-react';

export default function SuperSettings() {
  const [settings, setSettings] = useState({
    siteName: 'TripHubDz',
    siteEmail: 'contact@triphubdz.com',
    sitePhone: '+213 23 45 67 89',
    siteAddress: 'Algiers, Algeria',
    currency: 'DZD',
    timezone: 'Africa/Algiers',
    dateFormat: 'DD/MM/YYYY',
    emailNotifications: true,
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUser: 'noreply@triphubdz.com',
    theme: 'light',
    primaryColor: '#00c0e8',
    twoFactorAuth: false,
    forceHttps: true,
    maintenanceMode: false,
    backupFrequency: 'daily',
    logRetention: '30'
  });

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1500);
  };

  const sections = [
    { id: 'general', icon: Globe, label: 'Général', color: 'bg-blue-500' },
    { id: 'email', icon: Mail, label: 'Email', color: 'bg-green-500' },
    { id: 'appearance', icon: Palette, label: 'Apparence', color: 'bg-purple-500' },
    { id: 'security', icon: Lock, label: 'Sécurité', color: 'bg-red-500' },
    { id: 'backup', icon: Database, label: 'Sauvegarde', color: 'bg-orange-500' }
  ];

  const [activeSection, setActiveSection] = useState('general');

  const renderSection = () => {
    switch(activeSection) {
      case 'general':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Nom du site</label><input type="text" value={settings.siteName} onChange={(e) => setSettings({...settings, siteName: e.target.value})} className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-[#00c0e8]" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Email de contact</label><input type="email" value={settings.siteEmail} onChange={(e) => setSettings({...settings, siteEmail: e.target.value})} className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-[#00c0e8]" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label><input type="text" value={settings.sitePhone} onChange={(e) => setSettings({...settings, sitePhone: e.target.value})} className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-[#00c0e8]" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label><input type="text" value={settings.siteAddress} onChange={(e) => setSettings({...settings, siteAddress: e.target.value})} className="w-full p-2.5 border rounded-lg focus:ring-1 focus:ring-[#00c0e8]" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Devise</label><select value={settings.currency} onChange={(e) => setSettings({...settings, currency: e.target.value})} className="w-full p-2.5 border rounded-lg"><option value="DZD">DZD - Dinar Algérien</option><option value="EUR">EUR - Euro</option><option value="USD">USD - Dollar US</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Fuseau horaire</label><select value={settings.timezone} onChange={(e) => setSettings({...settings, timezone: e.target.value})} className="w-full p-2.5 border rounded-lg"><option value="Africa/Algiers">Africa/Algiers</option><option value="Europe/Paris">Europe/Paris</option><option value="Europe/London">Europe/London</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Format de date</label><select value={settings.dateFormat} onChange={(e) => setSettings({...settings, dateFormat: e.target.value})} className="w-full p-2.5 border rounded-lg"><option value="DD/MM/YYYY">DD/MM/YYYY</option><option value="MM/DD/YYYY">MM/DD/YYYY</option><option value="YYYY-MM-DD">YYYY-MM-DD</option></select></div>
          </div>
        );
      case 'email':
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Serveur SMTP</label><input type="text" value={settings.smtpHost} onChange={(e) => setSettings({...settings, smtpHost: e.target.value})} className="w-full p-2.5 border rounded-lg" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Port SMTP</label><input type="text" value={settings.smtpPort} onChange={(e) => setSettings({...settings, smtpPort: e.target.value})} className="w-full p-2.5 border rounded-lg" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Utilisateur SMTP</label><input type="text" value={settings.smtpUser} onChange={(e) => setSettings({...settings, smtpUser: e.target.value})} className="w-full p-2.5 border rounded-lg" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe SMTP</label><input type="password" placeholder="••••••••" className="w-full p-2.5 border rounded-lg" /></div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg"><input type="checkbox" checked={settings.emailNotifications} onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})} className="rounded" /><span className="text-sm text-gray-700">Activer les notifications par email</span><button className="ml-auto px-4 py-1.5 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 transition">Tester la connexion</button></div>
          </div>
        );
      case 'appearance':
        return (
          <div className="space-y-5">
            <div className="flex items-center gap-4"><label className="text-sm font-medium text-gray-700 w-32">Thème</label><select value={settings.theme} onChange={(e) => setSettings({...settings, theme: e.target.value})} className="flex-1 p-2.5 border rounded-lg"><option value="light">Clair</option><option value="dark">Sombre</option><option value="auto">Auto</option></select></div>
            <div className="flex items-center gap-4"><label className="text-sm font-medium text-gray-700 w-32">Couleur principale</label><div className="flex items-center gap-2"><input type="color" value={settings.primaryColor} onChange={(e) => setSettings({...settings, primaryColor: e.target.value})} className="w-10 h-10 border rounded cursor-pointer" /><span className="text-sm text-gray-500">{settings.primaryColor}</span><div className="ml-4 w-8 h-8 rounded-full" style={{ backgroundColor: settings.primaryColor }}></div></div></div>
            <div className="flex items-center gap-4"><label className="text-sm font-medium text-gray-700 w-32">Police</label><select className="flex-1 p-2.5 border rounded-lg"><option value="system">Police système</option><option value="poppins">Poppins</option><option value="inter">Inter</option></select></div>
          </div>
        );
      case 'security':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b"><div><p className="font-medium text-gray-800">Authentification à deux facteurs</p><p className="text-xs text-gray-500">Sécurisez votre compte avec une double vérification</p></div><label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" checked={settings.twoFactorAuth} onChange={(e) => setSettings({...settings, twoFactorAuth: e.target.checked})} className="sr-only peer" /><div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-[#00c0e8] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"></div></label></div>
            <div className="flex items-center justify-between py-3 border-b"><div><p className="font-medium text-gray-800">Forcer HTTPS</p><p className="text-xs text-gray-500">Redirige automatiquement vers HTTPS</p></div><label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" checked={settings.forceHttps} onChange={(e) => setSettings({...settings, forceHttps: e.target.checked})} className="sr-only peer" /><div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-[#00c0e8] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"></div></label></div>
            <div className="flex items-center justify-between py-3 border-b"><div><p className="font-medium text-gray-800">Mode maintenance</p><p className="text-xs text-gray-500">Site inaccessible aux visiteurs</p></div><label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" checked={settings.maintenanceMode} onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})} className="sr-only peer" /><div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-red-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"></div></label></div>
          </div>
        );
      case 'backup':
        return (
          <div className="space-y-5">
            <div className="flex items-center gap-4"><label className="text-sm font-medium text-gray-700 w-40">Fréquence de sauvegarde</label><select value={settings.backupFrequency} onChange={(e) => setSettings({...settings, backupFrequency: e.target.value})} className="flex-1 p-2.5 border rounded-lg"><option value="daily">Quotidienne</option><option value="weekly">Hebdomadaire</option><option value="monthly">Mensuelle</option></select></div>
            <div className="flex items-center gap-4"><label className="text-sm font-medium text-gray-700 w-40">Conservation des logs</label><select value={settings.logRetention} onChange={(e) => setSettings({...settings, logRetention: e.target.value})} className="flex-1 p-2.5 border rounded-lg"><option value="7">7 jours</option><option value="30">30 jours</option><option value="90">90 jours</option><option value="365">1 an</option></select></div>
            <div className="bg-gray-50 p-4 rounded-lg"><div className="flex items-center justify-between"><div><p className="font-medium text-gray-800">Dernière sauvegarde</p><p className="text-xs text-gray-500">15 Mars 2024 à 02:00</p></div><button className="px-4 py-2 bg-[#00c0e8] text-white rounded-lg hover:bg-[#00c0e8]/80 transition flex items-center gap-2"><RefreshCw className="h-4 w-4" /> Sauvegarder maintenant</button></div></div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><div><h2 className="text-xl font-bold text-gray-800">Paramètres</h2><p className="text-sm text-gray-500 mt-1">Configurez votre plateforme</p></div>{saveSuccess && <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg"><CheckCircle className="h-4 w-4" /><span className="text-sm">Paramètres enregistrés</span></div>}</div>

      <div className="flex gap-6 flex-wrap lg:flex-nowrap">
        {/* Sidebar */}
        <div className="w-full lg:w-64 space-y-1">
          {sections.map((section) => (<button key={section.id} onClick={() => setActiveSection(section.id)} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${activeSection === section.id ? 'bg-[#00c0e8]/10 text-[#00c0e8] border-l-2 border-[#00c0e8]' : 'text-gray-600 hover:bg-gray-50'}`}><div className={`${section.color} w-6 h-6 rounded-lg flex items-center justify-center`}><section.icon className="h-3.5 w-3.5 text-white" /></div><span className="text-sm">{section.label}</span></button>))}
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {renderSection()}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t"><button className="px-5 py-2 border rounded-lg hover:bg-gray-50 transition">Annuler</button><button onClick={handleSave} disabled={saving} className="px-5 py-2 bg-[#00c0e8] text-white rounded-lg hover:bg-[#00c0e8]/80 transition flex items-center gap-2">{saving ? <><RefreshCw className="h-4 w-4 animate-spin" /> Enregistrement...</> : <><Save className="h-4 w-4" /> Enregistrer</>}</button></div>
        </div>
      </div>
    </div>
  );
}