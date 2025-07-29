// Script pour tester l'envoi de données au serveur de débogage
const axios = require('axios');
const FormData = require('form-data');

async function testTaillesDebug() {
  try {
    // Préparer les données de tailles
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
    formData.append('acompte_requis', 2500);
    formData.append('notes', 'Test de commande');
    
    // Ajouter les tailles comme JSON stringifié
    const taillesJSON = JSON.stringify(tailles);
    formData.append('tailles', taillesJSON);
    
    console.log('Tailles JSON envoyées:', taillesJSON);
    console.log('En-têtes FormData:', formData.getHeaders());
    
    // Envoyer la requête au serveur de débogage
    console.log('Envoi de la requête au serveur de débogage...');
    const response = await axios.post('http://localhost:5001/test-tailles', formData, {
      headers: {
        ...formData.getHeaders()
      }
    });
    
    console.log('Réponse du serveur de débogage:', response.data);
  } catch (error) {
    console.error('Erreur:', error.response ? error.response.data : error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    }
  }
}

// Exécuter le test
testTaillesDebug();