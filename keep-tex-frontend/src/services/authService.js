import api from './api';

const authService = {
  // Verify email before registration
  verifyEmail: async (email) => {
    const response = await api.post('/auth/verify-email', { email });
    return response.data;
  },

  // Register a new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Login a user
  login: async (credentials) => {
    try {
      console.log('Login attempt with credentials:', credentials);
      const response = await api.post('/auth/login', credentials);
      console.log('Login response:', response.data);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        // Vérifier si response.data.user existe avant de le stocker
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
          console.log('User data stored in localStorage:', response.data.user);
        } else {
          console.warn('No user data in response, only token');
        }
      }
      return response.data;
    } catch (error) {
      console.error('Login service error:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  // Logout a user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userStr) {
      console.log('No user data found in localStorage');
      return null;
    }
    
    try {
      const user = JSON.parse(userStr);
      console.log('Retrieved user from localStorage:', user);
      
      // Vérifier que les données utilisateur sont valides
      if (!user || typeof user !== 'object') {
        console.error('Invalid user data format in localStorage');
        localStorage.removeItem('user');
        throw new Error('Données utilisateur invalides');
      }
      
      // Vérifier que les champs essentiels sont présents
      if (!user.id || !user.email) {
        console.error('Missing essential user data fields');
        // On garde les données mais on signale le problème
        console.warn('User data might be incomplete but keeping session');
      }
      
      // Si nous avons un utilisateur mais pas de token, signaler le problème
      if (!token) {
        console.warn('User data exists but no token found');
      }
      
      return user;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      // En cas d'erreur de parsing, supprimer l'entrée corrompue
      localStorage.removeItem('user');
      throw new Error('Données utilisateur manquantes');
    }
  },

  // Get current user profile from API
  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Check if user is admin
  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user && user.role === 'admin';
  },
};

export default authService;