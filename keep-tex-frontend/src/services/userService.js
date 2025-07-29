import api from './api';

const userService = {
  // Demander un code de confirmation d'email
  requestEmailConfirmation: async (email) => {
    const response = await api.post('/users/request-email-confirmation', { email });
    return response.data;
  },

  // Mettre à jour le profil utilisateur
  updateProfile: async (userData) => {
    const response = await api.put('/users/profile', userData);
    return response.data;
  },

  // Changer le mot de passe
  changePassword: async (passwordData) => {
    const response = await api.put('/users/change-password', passwordData);
    return response.data;
  }
};

export default userService;