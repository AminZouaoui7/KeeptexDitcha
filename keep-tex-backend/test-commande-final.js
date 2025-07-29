const axios = require('axios');
const FormData = require('form-data');

// Configuration
const API_URL = 'http://localhost:5000/api';
const EMAIL = 'admin@keeptex.com';
const PASSWORD = 'admin123';

async function testCommande() {
  try {
    // 1. Authentification
    console.log('Authentification en cours...');
    const authResponse = await axios.post(`${API_URL}/auth/login`, {
      email: EMAIL,
      password: PASSWORD
    });

    const token = authResponse.data.token;
    console.log('Authentification réussie, token obtenu');

    // 2. Préparation des données de commande
    const formData = new FormData();
    
    // Tailles
    const tailles = [
      { taille: 'S', quantite: 5 },
      { taille: 'M', quantite: 10 },
      { taille: 'L', quantite: 15 }
    ];
    
    // Calcul de la quantité totale à partir des tailles
    const quantiteTotale = tailles.reduce((sum, item) => sum + item.quantite, 0);
    console.log('Quantité totale calculée:', quantiteTotale);
    
    // Données de base
    formData.append('type', 'a-a-z');
    formData.append('type_modele', 'polo');
    formData.append('type_tissue', 'coton');
    formData.append('couleur', 'bleu');
    formData.append('quantite_totale', quantiteTotale);
    formData.append('prix_total', 1500);
    formData.append('acompte_requis', 500);
    formData.append('notes', 'Test de commande avec correction du parsing des tailles');
    
    // Conversion des tailles en JSON
    const taillesJSON = JSON.stringify(tailles);
    formData.append('tailles', taillesJSON);
    console.log('Tailles JSON envoyées:', taillesJSON);
    
    console.log('Données de commande préparées');
    console.log('Tailles:', JSON.stringify(tailles));
    console.log('Quantité totale envoyée:', quantiteTotale);
    
    // 3. Envoi de la commande
    console.log('Envoi de la commande...');
    const commandeResponse = await axios.post(`${API_URL}/commandes`, formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Réponse du serveur:', commandeResponse.status);
    console.log('Données de la commande créée:', commandeResponse.data);
    
    return commandeResponse.data;
  } catch (error) {
    console.error('Erreur lors du test de commande:');
    if (error.response) {
      // La requête a été faite et le serveur a répondu avec un code d'état
      // qui n'est pas dans la plage 2xx
      console.error('Statut:', error.response.status);
      console.error('Données:', error.response.data);
      console.error('En-têtes:', error.response.headers);
    } else if (error.request) {
      // La requête a été faite mais aucune réponse n'a été reçue
      console.error('Aucune réponse reçue:', error.request);
    } else {
      // Une erreur s'est produite lors de la configuration de la requête
      console.error('Erreur:', error.message);
    }
    throw error;
  }
}

// Exécution du test
testCommande()
  .then(result => {
    console.log('Test terminé avec succès');
  })
  .catch(error => {
    console.error('Test échoué');
    process.exit(1);
  });