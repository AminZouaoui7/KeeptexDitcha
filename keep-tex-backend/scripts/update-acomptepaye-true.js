const axios = require('axios');
require('dotenv').config({ path: '../.env' });

// Fonction pour se connecter et obtenir un token
async function login() {
  try {
    console.log('Tentative de connexion...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@keeptex.fr',
      password: 'test1234'
    });
    
    console.log('Connexion réussie!');
    return loginResponse.data.token;
  } catch (error) {
    console.error('Erreur de connexion:');
    console.error('  Status:', error.response?.status);
    console.error('  Data:', error.response?.data);
    return null;
  }
}

// Fonction pour mettre à jour le champ acomptepaye en true
async function updateAcomptepayeTrue(token, commandeId) {
  try {
    console.log(`\nMise à jour du champ acomptepaye pour la commande ID: ${commandeId}...`);
    
    const updateResponse = await axios.put(
      `http://localhost:5000/api/commandes/${commandeId}/acomptepaye`,
      { acomptepaye: true },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    console.log('Mise à jour réussie:');
    console.log(updateResponse.data);
    
    // Vérifier l'état de la commande
    const commandeResponse = await axios.get(
      `http://localhost:5000/api/commandes/${commandeId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    console.log('\nÉtat actuel de la commande:');
    console.log(commandeResponse.data);
    
    return true;
  } catch (error) {
    console.error('Erreur lors de la mise à jour:');
    console.error('  Status:', error.response?.status);
    console.error('  Data:', JSON.stringify(error.response?.data, null, 2));
    console.error('  Message complet:', error.message);
    if (error.response?.data?.error) {
      console.error('  Erreur détaillée:', error.response.data.error);
    }
    return false;
  }
}

// Fonction pour récupérer la liste des commandes
async function getCommandes(token) {
  try {
    console.log('\nRécupération de la liste des commandes...');
    const commandesResponse = await axios.get(
      'http://localhost:5000/api/commandes',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    console.log('Commandes disponibles:');
    const commandes = commandesResponse.data.data;
    commandes.forEach(cmd => {
      console.log(`ID: ${cmd.id}, État: ${cmd.etat}, Type: ${cmd.type}, Acompte payé: ${cmd.acomptepaye}`);
    });
    
    return commandes;
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:');
    console.error('  Status:', error.response?.status);
    console.error('  Data:', error.response?.data);
    return [];
  }
}

// Exécuter le test complet
async function runTest() {
  const token = await login();
  
  if (!token) {
    console.error('Impossible de continuer sans token valide.');
    return;
  }
  
  // Récupérer la liste des commandes
  const commandes = await getCommandes(token);
  
  if (commandes.length === 0) {
    console.error('Aucune commande disponible.');
    return;
  }
  
  // Trouver une commande avec acomptepaye = false
  const commandeAModifier = commandes.find(cmd => cmd.acomptepaye === false);
  
  if (!commandeAModifier) {
    console.log('Aucune commande avec acomptepaye = false trouvée. Utilisation de la première commande.');
    var commandeId = commandes[0].id;
  } else {
    var commandeId = commandeAModifier.id;
    console.log(`Commande sélectionnée pour la mise à jour: ID ${commandeId}, acomptepaye actuel: ${commandeAModifier.acomptepaye}`);
  }
  
  // Mettre à jour le champ acomptepaye en true
  const success = await updateAcomptepayeTrue(token, commandeId);
  
  if (success) {
    console.log(`\nLe champ acomptepaye de la commande ID ${commandeId} a été mis à jour avec succès en true.`);
  } else {
    console.error(`\nÉchec de la mise à jour du champ acomptepaye de la commande ID ${commandeId}.`);
  }
}

runTest();