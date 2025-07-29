// Script de test simplifié pour comprendre le traitement des tailles
const axios = require('axios');
const FormData = require('form-data');

async function testTailles() {
  try {
    // Authentification
    console.log('Tentative d\'authentification avec admin@keeptex.com...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@keeptex.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('Token obtenu');
    
    // Préparer les données de tailles de différentes façons
    const tailles = [
      { taille: 'XS', quantite: 500 }
    ];
    
    // Créer un FormData pour l'envoi
    const formData = new FormData();
    
    // Ajouter les champs de base
    formData.append('type', 'A to Z');
    formData.append('type_modele', 'T-shirt');
    formData.append('type_tissue', 'Coton');
    formData.append('couleur', 'Noir');
    formData.append('quantite_totale', 500);
    formData.append('prix_total', 5000);
    
    // Test 1: Envoyer tailles comme JSON stringifié
    console.log('\n--- Test 1: Tailles comme JSON stringifié ---');
    const taillesJSON = JSON.stringify(tailles);
    formData.append('tailles', taillesJSON);
    
    console.log('Tailles envoyées:', taillesJSON);
    console.log('Type de tailles:', typeof taillesJSON);
    
    try {
      const response1 = await axios.post('http://localhost:5000/api/commandes', formData, {
        headers: {
          ...formData.getHeaders(),
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Réponse Test 1:', response1.data);
    } catch (error) {
      console.error('Erreur Test 1:', error.response?.data || error.message);
    }
    
    // Test 2: Envoyer tailles comme objet JavaScript
    console.log('\n--- Test 2: Tailles comme objet JavaScript ---');
    const formData2 = new FormData();
    formData2.append('type', 'A to Z');
    formData2.append('type_modele', 'T-shirt');
    formData2.append('type_tissue', 'Coton');
    formData2.append('couleur', 'Noir');
    formData2.append('quantite_totale', 500);
    formData2.append('prix_total', 5000);
    formData2.append('tailles', tailles); // Envoyer l'objet directement
    
    try {
      const response2 = await axios.post('http://localhost:5000/api/commandes', formData2, {
        headers: {
          ...formData2.getHeaders(),
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Réponse Test 2:', response2.data);
    } catch (error) {
      console.error('Erreur Test 2:', error.response?.data || error.message);
    }
    
    // Test 3: Envoyer tailles comme champ JSON avec Content-Type spécifié
    console.log('\n--- Test 3: Tailles avec Content-Type spécifié ---');
    const formData3 = new FormData();
    formData3.append('type', 'A to Z');
    formData3.append('type_modele', 'T-shirt');
    formData3.append('type_tissue', 'Coton');
    formData3.append('couleur', 'Noir');
    formData3.append('quantite_totale', 500);
    formData3.append('prix_total', 5000);
    
    try {
      const response3 = await axios.post('http://localhost:5000/api/commandes', {
        type: 'A to Z',
        type_modele: 'T-shirt',
        type_tissue: 'Coton',
        couleur: 'Noir',
        quantite_totale: 500,
        prix_total: 5000,
        tailles: tailles // Envoyer l'objet directement dans un JSON
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Réponse Test 3:', response3.data);
    } catch (error) {
      console.error('Erreur Test 3:', error.response?.data || error.message);
    }
    
  } catch (error) {
    console.error('Erreur générale:', error.message);
  }
}

// Exécuter le test
testTailles();