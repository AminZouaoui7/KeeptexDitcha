const axios = require('axios');

// Configuration
const API_URL = 'http://localhost:5000/api';
const EMAIL = 'admin@keeptex.com';
const PASSWORD = 'admin123';

async function testCommandesWithUser() {
  try {
    // 1. Authentification
    console.log('Authentification en cours...');
    const authResponse = await axios.post(`${API_URL}/auth/login`, {
      email: EMAIL,
      password: PASSWORD
    });

    const token = authResponse.data.token;
    console.log('Authentification réussie, token obtenu');

    // 2. Récupération de toutes les commandes
    console.log('\nRécupération de toutes les commandes...');
    const commandesResponse = await axios.get(
      `${API_URL}/commandes`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    console.log('Réponse du serveur:', commandesResponse.status);
    console.log('Nombre de commandes:', commandesResponse.data.count);
    
    // 3. Vérification de la présence des informations utilisateur
    const commandes = commandesResponse.data.data;
    if (commandes && commandes.length > 0) {
      console.log('\nExemple de commande avec informations utilisateur:');
      const exemple = commandes[0];
      console.log(`ID: ${exemple.id}`);
      console.log(`Type: ${exemple.type}`);
      console.log(`État: ${exemple.etat}`);
      console.log(`UserID: ${exemple.userId}`);
      
      // Vérifier si les informations utilisateur sont présentes
      if (exemple.user) {
        console.log('\nInformations utilisateur:');
        console.log(`Nom: ${exemple.user.name}`);
        console.log(`Email: ${exemple.user.email}`);
      } else {
        console.log('\nAucune information utilisateur trouvée dans la réponse!');
      }
    } else {
      console.log('Aucune commande trouvée');
    }
    
    return commandesResponse.data;
  } catch (error) {
    console.error('Erreur lors du test:');
    if (error.response) {
      console.error('Statut:', error.response.status);
      console.error('Données:', error.response.data);
    } else if (error.request) {
      console.error('Aucune réponse reçue:', error.request);
    } else {
      console.error('Erreur:', error.message);
    }
    throw error;
  }
}

// Exécution du test
testCommandesWithUser()
  .then(result => {
    console.log('\nTest terminé avec succès');
  })
  .catch(error => {
    console.error('\nTest échoué');
    process.exit(1);
  });