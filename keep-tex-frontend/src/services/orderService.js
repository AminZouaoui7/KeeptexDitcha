import api from './api';

const orderService = {
  // Récupérer toutes les commandes de l'utilisateur connecté
  getUserOrders: async () => {
    // Vérifier si le token existe
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Utilisateur non connecté');
    }
    
    // Vérifier si les données utilisateur existent
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      throw new Error('Données utilisateur manquantes');
    }
    
    try {
      const user = JSON.parse(userStr);
      if (!user || !user.id) {
        throw new Error('Données utilisateur invalides');
      }
      
      // Ajouter un timeout pour éviter les attentes infinies
      const response = await api.get(`/commandes/user/${user.id}`, {
        timeout: 10000 // 10 secondes de timeout
      });
      
      return response.data;
    } catch (error) {
      if (error.message === 'Données utilisateur invalides' || 
          error.message === 'Données utilisateur manquantes') {
        // Nettoyer le localStorage si les données sont corrompues
        localStorage.removeItem('user');
        throw error;
      }
      
      // Propager l'erreur pour qu'elle soit gérée par le composant
      throw error;
    }
  },

  // Récupérer les détails d'une commande spécifique
  getOrderById: async (orderId) => {
    const response = await api.get(`/commandes/${orderId}`);
    return response.data;
  },

  // Créer une nouvelle commande
  createOrder: async (orderData) => {
    const response = await api.post('/commandes', orderData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Mettre à jour une commande existante
  updateOrder: async (orderId, orderData) => {
    const response = await api.put(`/commandes/${orderId}`, orderData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Annuler une commande
  cancelOrder: async (orderId) => {
    const response = await api.put(`/commandes/${orderId}/cancel`);
    return response.data;
  },

  // Formater la date
  formatDate: (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  },

  // Obtenir le statut de la commande avec couleur
  getOrderStatus: (etat) => {
    switch (etat) {
      case 'en attente':
        return { label: 'En attente', color: '#f59e0b' };
      case 'conception':
        return { label: 'Conception', color: '#3b82f6' };
      case 'patronnage':
        return { label: 'Patronnage', color: '#8b5cf6' };
      case 'coupe':
        return { label: 'Coupe', color: '#ec4899' };
      case 'confection':
        return { label: 'Confection', color: '#06b6d4' };
      case 'finition':
        return { label: 'Finition', color: '#14b8a6' };
      case 'controle':
        return { label: 'Contrôle', color: '#f97316' };
      case 'termine':
        return { label: 'Terminée', color: '#10b981' };
      case 'livree':
        return { label: 'Livrée', color: '#059669' };
      case 'annulee':
        return { label: 'Annulée', color: '#dc2626' };
      default:
        return { label: 'En attente', color: '#f59e0b' };
    }
  },

  // Calculer le pourcentage d'avancement
  calculateProgress: (etat) => {
    const etapes = ['en attente', 'conception', 'patronnage', 'coupe', 'confection', 'finition', 'controle', 'termine', 'livree'];
    
    // Cas spécial pour les commandes annulées
    if (etat === 'annulee') {
      return 0;
    }
    
    const index = etapes.indexOf(etat);
    return Math.round((index / (etapes.length - 1)) * 100);
  },

  // Calculer l'estimation de temps restant
  calculateEstimation: (etat) => {
    // Estimation basée sur l'état actuel (en jours)
    const estimations = {
      'en attente': 14,
      'conception': 10,
      'patronnage': 7,
      'coupe': 5,
      'confection': 3,
      'finition': 2,
      'controle': 1,
      'termine': 0,
      'livree': 0,
      'annulee': 0
    };
    
    return estimations[etat] || 0;
  }
};

export default orderService;