// Script de test pour simuler l'envoi d'une commande avec correction du format des tailles
const axios = require('axios');
const FormData = require('form-data');

async function testCreateCommande() {
  try {
    // Authentification
    let token;
    try {
      console.log('Tentative d\'authentification avec admin@keeptex.com...');
      const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
        email: 'admin@keeptex.com',
        password: 'admin123'
      });
      
      token = loginResponse.data.token;
      console.log('Token obtenu:', token);
    } catch (authError) {
      console.log('Authentification échouée:', authError.response?.data || authError.message);
      throw new Error('Impossible de s\'authentifier');
    }
    
    if (!token) {
      throw new Error('Aucun token obtenu');
    }
    
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
    formData.append('quantite_totale', 500); // Nombre au lieu de chaîne
    formData.append('prix_total', 5000);
    formData.append('acompte_requis', 2500);
    formData.append('notes', 'Test de commande');
    
    // Convertir le tableau d'objets tailles en tableau JSON parsable
    // Assurons-nous que les quantités sont des nombres et non des chaînes
    const taillesFormatted = tailles.map(t => ({
      taille: t.taille,
      quantite: parseInt(t.quantite, 10)
    }));
    
    // Ajouter les tailles comme JSON stringifié
    const taillesJSON = JSON.stringify(taillesFormatted);
    formData.append('tailles', taillesJSON);
    
    console.log('Tailles JSON envoyées:', taillesJSON);
    console.log('En-têtes FormData:', formData.getHeaders());
    
    // Afficher le contenu du FormData pour débogage
    console.log('Contenu du FormData:');
    for (const [key, value] of Object.entries(formData.getBuffer().toString())) {
      console.log(`${key}: ${value}`);
    }
    
    // Envoyer la requête
    console.log('Envoi de la requête...');
    const response = await axios.post('http://localhost:5000/api/commandes', formData, {
      headers: {
        ...formData.getHeaders(),
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