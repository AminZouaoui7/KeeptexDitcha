import api from './api';
// Importation de l'URL de l'API depuis le module api

// Récupération de l'URL de l'API depuis la configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const contactService = {
  // Submit a contact form
  submitContactForm: async (contactData) => {
    console.log('Envoi de la requête au serveur:', API_URL + '/contact', contactData);
    try {
      const response = await api.post('/contact', contactData);
      console.log('Réponse reçue du serveur:', response);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'envoi du formulaire:', error);
      console.error('Message d\'erreur:', error.message);
      console.error('Réponse d\'erreur:', error.response ? error.response.data : 'Pas de réponse');
      throw error;
    }
  },

  // Get all contact messages (admin only)
  getContacts: async () => {
    const response = await api.get('/contact');
    return response.data;
  },

  // Get a single contact message by ID (admin only)
  getContact: async (id) => {
    const response = await api.get(`/contact/${id}`);
    return response.data;
  },

  // Mark a contact message as read (admin only)
  markAsRead: async (id) => {
    const response = await api.put(`/contact/${id}/read`);
    return response.data;
  },

  // Delete a contact message (admin only)
  deleteContact: async (id) => {
    const response = await api.delete(`/contact/${id}`);
    return response.data;
  },
};

export default contactService;