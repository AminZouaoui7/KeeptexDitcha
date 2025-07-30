import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Configuration par défaut pour éviter les attentes infinies
  timeout: 15000, // 15 secondes par défaut
  // Permettre aux requêtes d'être annulées
  cancelToken: new axios.CancelToken((c) => {
    // Stocker la fonction d'annulation pour une utilisation ultérieure si nécessaire
    window.cancelRequest = c;
  }),
});

// Add a request interceptor to attach the token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle token expiration and network errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Vérifier si nous sommes sur une page d'authentification
    const isAuthPage = window.location.pathname.includes('/login') || 
                       window.location.pathname.includes('/register');
    
    // Gérer les erreurs d'authentification (401)
    if (error.response && error.response.status === 401) {
      console.log('Token expired or invalid:', error.response.data);
      
      // Vérifier si c'est une erreur de token ou une autre erreur 401
      const isTokenError = error.response.data?.message?.toLowerCase().includes('token') || 
                          error.response.data?.error?.toLowerCase().includes('token');
      
      if (isTokenError) {
        console.log('Token error detected, cleaning up session data');
        // Ne pas supprimer les données utilisateur pour permettre une reconnexion silencieuse
        // Supprimer uniquement le token qui est invalide
        localStorage.removeItem('token');
        
        // Rediriger vers la page de connexion seulement si nous ne sommes pas déjà sur cette page
        // pour éviter une boucle de redirection
        if (!isAuthPage) {
          console.log('Redirecting to login page');
          // Utiliser une redirection avec un délai pour éviter les boucles potentielles
          setTimeout(() => {
            window.location.href = '/login';
          }, 100);
        }
      } else {
        console.log('Non-token 401 error, keeping session data');
        // Pour les autres erreurs 401, ne pas nettoyer les données de session
      }
    }
    // Gérer les erreurs de timeout
    else if (error.code === 'ECONNABORTED') {
      console.error('Request timeout:', error.message);
      // Ne pas nettoyer les données de session pour les erreurs de timeout
      error.message = 'La requête a pris trop de temps à répondre. Veuillez réessayer plus tard.';
    }
    // Gérer les erreurs réseau (pas de connexion)
    else if (!error.response) {
      console.error('Network error:', error.message);
      error.message = 'Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet et réessayer.';
    }
    // Gérer les erreurs serveur (500)
    else if (error.response && error.response.status >= 500) {
      console.error('Server error:', error.response.status, error.message);
      error.message = 'Une erreur est survenue sur le serveur. Veuillez réessayer plus tard.';
    }
    
    return Promise.reject(error);
  }
);

export default api;