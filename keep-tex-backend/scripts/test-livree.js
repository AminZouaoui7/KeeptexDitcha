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

// Fonction pour tester la mise à jour de l'état d'une commande
async function testUpdateEtat(token) {
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
      console.log(`ID: ${cmd.id}, État: ${cmd.etat}, Type: ${cmd.type}`);
    });
    
    // Sélectionner une commande qui n'est pas déjà annulée ou livrée
    const commandeAModifier = commandes.find(cmd => 
      cmd.etat !== 'annulee' && cmd.etat !== 'livree'
    );
    
    if (!commandeAModifier) {
      console.log('Aucune commande disponible pour le test. Utilisation de la première commande.');
      var commandeId = commandes.length > 0 ? commandes[0].id : 1;
    } else {
      var commandeId = commandeAModifier.id;
    }
    
    console.log(`\nUtilisation de la commande ID: ${commandeId} pour le test`);
    
    // Tester la mise à jour de l'état à "livree"
    console.log('\nTentative de mise à jour de l\'état à "livree"...');
    const updateResponse = await axios.put(
      `http://localhost:5000/api/commandes/${commandeId}/etat`,
      { etat: 'livree' },
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
    
  } catch (error) {
    console.error('Erreur lors de la mise à jour:');
    console.error('  Status:', error.response?.status);
    console.error('  Data:', JSON.stringify(error.response?.data, null, 2));
    console.error('  Message complet:', error.message);
    if (error.response?.data?.error) {
      console.error('  Erreur détaillée:', error.response.data.error);
    }
  }
}

// Exécuter le test complet
async function runTest() {
  const token = await login();
  
  if (token) {
    await testUpdateEtat(token);
  } else {
    console.error('Impossible de continuer sans token valide.');
  }
}

runTest();