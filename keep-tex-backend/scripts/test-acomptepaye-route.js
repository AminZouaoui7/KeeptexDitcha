/**
 * Script pour tester la route PUT /api/commandes/:id/acomptepaye
 * Cette route marque une commande comme ayant l'acompte payé (acomptepaye = true)
 */

const axios = require('axios');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config({ path: '../.env' });

const API_URL = 'http://localhost:5000';

// Fonction pour se connecter et obtenir un token
async function login() {
  try {
    console.log('Tentative de connexion...');
    const response = await axios.post(`${API_URL}/api/auth/login`, {
      email: 'admin@keeptex.fr',
      password: 'test1234'
    });

    if (response.data.success) {
      console.log('Connexion réussie');
      return response.data.token;
    } else {
      console.error('Échec de la connexion:', response.data.error);
      return null;
    }
  } catch (error) {
    console.error('Erreur lors de la connexion:', error.response?.data?.error || error.message);
    return null;
  }
}

// Fonction pour récupérer les commandes
async function getCommandes(token) {
  try {
    const response = await axios.get(`${API_URL}/api/commandes`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.data.success) {
      console.log(`${response.data.count} commandes trouvées`);
      return response.data.data;
    } else {
      console.error('Échec de la récupération des commandes:', response.data.error);
      return [];
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error.response?.data?.error || error.message);
    return [];
  }
}

// Fonction pour mettre à jour le statut de paiement de l'acompte
async function updateAcomptePaye(token, commandeId) {
  try {
    console.log(`Mise à jour du statut de paiement de l'acompte pour la commande ID: ${commandeId}...`);
    
    // Envoyer null comme body sans Content-Type
    const response = await axios.put(
      `${API_URL}/api/commandes/${commandeId}/acomptepaye`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    console.log('Réponse:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error.response?.data?.error || error.message);
    return { success: false, error: error.response?.data?.error || error.message };
  }
}

// Fonction pour vérifier l'état actuel d'une commande
async function getCommandeById(token, commandeId) {
  try {
    const response = await axios.get(`${API_URL}/api/commandes/${commandeId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('État actuel de la commande:');
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération de la commande:', error.response?.data?.error || error.message);
    return { success: false, error: error.response?.data?.error || error.message };
  }
}

// Fonction principale
async function main() {
  try {
    // Se connecter
    const token = await login();
    if (!token) {
      console.error('Impossible de continuer sans token');
      return;
    }

    // Récupérer les commandes
    const commandes = await getCommandes(token);
    if (commandes.length === 0) {
      console.error('Aucune commande trouvée');
      return;
    }

    // Afficher les commandes avec leur statut de paiement d'acompte
    console.log('\nListe des commandes:');
    commandes.forEach(commande => {
      console.log(`ID: ${commande.id}, État: ${commande.etat}, Type: ${commande.type}, Acompte payé: ${commande.acomptepaye}`);
    });

    // Sélectionner une commande dont l'acompte n'est pas encore payé
    const commandeAModifier = commandes.find(c => c.acomptepaye === false);
    
    if (!commandeAModifier) {
      console.log('Toutes les commandes ont déjà leur acompte payé');
      return;
    }

    console.log(`\nCommande sélectionnée pour la mise à jour: ID ${commandeAModifier.id}, acomptepaye actuel: ${commandeAModifier.acomptepaye}`);

    // Mettre à jour le statut de paiement de l'acompte
    await updateAcomptePaye(token, commandeAModifier.id);

    // Vérifier que la mise à jour a bien été effectuée
    await getCommandeById(token, commandeAModifier.id);

    console.log('\nTest terminé');
  } catch (error) {
    console.error('Erreur lors de l\'exécution du script:', error);
  }
}

// Exécuter le script
main();