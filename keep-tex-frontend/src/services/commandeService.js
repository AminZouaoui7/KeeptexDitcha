import axios from 'axios';
import { API_URL } from '../config';

const commandeService = {
  // Récupérer toutes les commandes
  getAllCommandes: async (token) => {
    try {
      const response = await axios.get(`${API_URL}/api/commandes`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Récupérer une commande par son ID
  getCommandeById: async (id, token) => {
    try {
      const response = await axios.get(`${API_URL}/api/commandes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Créer une nouvelle commande
  createCommande: async (commandeData, token) => {
    try {
      const response = await axios.post(`${API_URL}/api/commandes`, commandeData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Mettre à jour une commande
  updateCommande: async (id, commandeData, token) => {
    try {
      const response = await axios.put(`${API_URL}/api/commandes/${id}`, commandeData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Mettre à jour l'état d'une commande
  updateEtatCommande: async (id, etat, token) => {
    try {
      const response = await axios.put(`${API_URL}/api/commandes/${id}/etat`, { etat }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Mettre à jour le statut de paiement de l'acompte d'une commande
  updateAcomptePaye: async (id, acomptepaye, token) => {
    try {
      const response = await axios.put(`${API_URL}/api/commandes/${id}/acomptepaye`, { acomptepaye }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Supprimer une commande
  deleteCommande: async (id, token) => {
    try {
      const response = await axios.delete(`${API_URL}/api/commandes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default commandeService;