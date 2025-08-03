// Configuration de l'application

// URL de l'API
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Autres constantes de configuration
export const APP_NAME = 'KeepTex';
export const APP_VERSION = '1.0.0';

// Configuration des délais
export const REQUEST_TIMEOUT = 30000; // 30 secondes

// Configuration des messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erreur de connexion au serveur. Veuillez vérifier votre connexion internet.',
  UNAUTHORIZED: 'Vous n\'êtes pas autorisé à accéder à cette ressource.',
  NOT_FOUND: 'La ressource demandée n\'existe pas.',
  SERVER_ERROR: 'Une erreur est survenue sur le serveur. Veuillez réessayer plus tard.',
  DEFAULT: 'Une erreur est survenue. Veuillez réessayer plus tard.'
};

// Configuration des routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  COMMANDES: '/commandes',
  COMMANDE_DETAIL: '/commandes/:id',
  ADMIN: '/admin',
  NOT_FOUND: '/404'
};