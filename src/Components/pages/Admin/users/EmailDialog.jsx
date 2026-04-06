import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Send, Mail, User, AtSign } from 'lucide-react';
import axiosInstance from "../../../../api/axiosInstance";

const EmailDialog = ({ open, onClose, user, onEmailSent }) => {
  const [emailData, setEmailData] = useState({
    subject: "",
    content: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Réinitialiser le formulaire quand le dialogue s'ouvre
  React.useEffect(() => {
    if (open && user) {
      setEmailData({
        subject: `Message pour ${user.name}`,
        content: `Bonjour ${user.name},\n\n`,
      });
      setError("");
    }
  }, [open, user]);

  if (!user) return null;

  const handleChange = (field, value) => {
    setEmailData(prev => ({ ...prev, [field]: value }));
  };

  const handleSend = async () => {
    if (!emailData.subject.trim()) {
      setError("Veuillez saisir un sujet");
      return;
    }
    
    if (!emailData.content.trim()) {
      setError("Veuillez saisir un contenu");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Appel API pour envoyer l'email
      const response = await axiosInstance.post('/auth-service/auth/send-email/', {
        to: user.email,
        subject: emailData.subject,
        content: emailData.content,
        userName: user.name,
      });

      if (onEmailSent) {
        onEmailSent(user, emailData);
      }
      
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email:", error);
      setError(error.response?.data?.message || "Erreur lors de l'envoi de l'email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => !isLoading && onClose()}
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
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-500" />
              Envoyer un email
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Envoyer un message à {user.name}
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
            <Send className="w-6 h-6 text-blue-500" />
          </div>
        </div>
      </DialogTitle>
      
      <DialogContent sx={{ p: 4 }}>
        <div className="space-y-4">
          {/* Information du destinataire */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Destinataire:</span>
              <span className="font-medium text-gray-900">{user.name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <AtSign className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Email:</span>
              <span className="font-medium text-gray-900">{user.email}</span>
            </div>
          </div>

          {/* Champ Sujet */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Sujet <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={emailData.subject}
              onChange={(e) => handleChange("subject", e.target.value)}
              placeholder="Sujet de l'email..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              disabled={isLoading}
            />
          </div>

          {/* Champ Contenu */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              value={emailData.content}
              onChange={(e) => handleChange("content", e.target.value)}
              placeholder="Votre message..."
              rows={8}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
              disabled={isLoading}
            />
          </div>

          {/* Message d'erreur */}
          {error && (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {/* Indication */}
          <div className="text-xs text-gray-400 text-center">
            L'email sera envoyé depuis l'adresse admin@votre-site.com
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
          onClick={onClose}
          disabled={isLoading}
          className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-50"
        >
          Annuler
        </button>
        
        <button
          onClick={handleSend}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center gap-2"
        >
          {isLoading ? <CircularProgress size={20} color="inherit" /> : <Send className="w-4 h-4" />}
          {isLoading ? "Envoi en cours..." : "Envoyer l'email"}
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default EmailDialog;