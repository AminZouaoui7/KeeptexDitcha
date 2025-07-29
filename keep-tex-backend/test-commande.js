// Script de test pour simuler l'envoi d'une commande
const axios = require('axios');
const FormData = require('form-data');
// const fs = require('fs');

// Fonction pour afficher le contenu d'un FormData
function logFormData(formData) {
  console.log('Contenu du FormData:');
  // Dans Node.js, FormData n'a pas de méthode entries()
  // On peut accéder aux clés via formData.getBuffer() mais c'est complexe
  // Affichons simplement ce que nous ajoutons
}
const path = require('path');

// Fonction pour tester l'envoi d'une commande
async function testCreateCommande() {
  try {
    // Essayer différentes combinaisons d'identifiants
    let token;
    try {
      console.log('Tentative d\'authentification avec test@example.com...');
      const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
        email: 'test@example.com',
        password: 'test123'
      });
      
      token = loginResponse.data.token;
      console.log('Token obtenu:', token);
    } catch (authError) {
      console.log('Premier essai d\'authentification échoué:', authError.response?.data || authError.message);
      
      try {
        console.log('Tentative avec admin@keeptex.com...');
        const altLoginResponse = await axios.post('http://localhost:5000/api/auth/login', {
          email: 'admin@keeptex.com',
          password: 'admin123'
        });
        
        token = altLoginResponse.data.token;
        console.log('Token obtenu:', token);
      } catch (altAuthError) {
        console.log('Deuxième essai d\'authentification échoué:', altAuthError.response?.data || altAuthError.message);
        throw new Error('Impossible de s\'authentifier');
      }
    }
    
    if (!token) {
      throw new Error('Aucun token obtenu');
    }
    
    // Préparer les données de tailles
    const tailles = [
      { taille: 'XS', quantite: 500 }
    ];
    
    // Tester différentes façons d'envoyer les tailles
    console.log('Tailles (objet):', tailles);
    console.log('Tailles (JSON):', JSON.stringify(tailles));
    
    // Créer un FormData pour l'envoi
    const formData = new FormData();
    
    // Ajouter les champs de base
    formData.append('type', 'A to Z');
    formData.append('modele', 'T-shirt');
    formData.append('tissu', 'Coton');
    formData.append('couleur', 'Noir');
    formData.append('quantite_totale', '500');
    formData.append('prix_total', '5000');
    formData.append('acompte_requis', '2500');
    formData.append('notes', 'Test de commande');
    
    // Ajouter les tailles comme JSON stringifié
    const taillesJSON = JSON.stringify(tailles);
    formData.append('tailles', taillesJSON);
    
    console.log('Tailles JSON envoyées:', taillesJSON);
    console.log('Envoi de la requête...');
    
    // Avec FormData dans Node.js, les en-têtes sont automatiquement définis
    // y compris le boundary pour multipart/form-data
    const response = await axios.post('http://localhost:5000/api/commandes', formData, {
      headers: {
        ...formData.getHeaders(), // Utiliser les en-têtes générés par FormData
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Réponse:', response.data);
  } catch (error) {
    console.error('Erreur:', error.response ? error.response.data : error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    }
  }
}

// Exécuter le test
testCreateCommande();