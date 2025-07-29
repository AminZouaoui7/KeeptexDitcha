// Script pour tester l'envoi des données au serveur de débogage
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function testDebugTailles() {
  try {
    // Préparer les données de tailles
    const tailles = [
      { taille: 'S', quantite: 5 },
      { taille: 'M', quantite: 10 },
      { taille: 'L', quantite: 15 }
    ];
    
    // Créer un objet FormData
    const formData = new FormData();
    formData.append('type', 'a-a-z');
    formData.append('type_modele', 'polo');
    formData.append('type_tissue', 'coton');
    formData.append('couleur', 'bleu');
    formData.append('quantite_totale', '30');
    formData.append('prix_total', '1500');
    formData.append('acompte_requis', '500');
    formData.append('tailles', JSON.stringify(tailles));
    formData.append('notes', 'Test de débogage des tailles');
    
    // Ajouter un fichier logo si disponible
    // Décommentez ces lignes si vous avez un fichier logo à tester
    /*
    const logoPath = './path/to/logo.png';
    if (fs.existsSync(logoPath)) {
      formData.append('logo', fs.createReadStream(logoPath));
    }
    */
    
    console.log('Envoi des données au serveur de débogage...');
    console.log('Tailles envoyées:', JSON.stringify(tailles));
    
    // Envoyer la requête au serveur de débogage
    const response = await axios.post('http://localhost:5002/debug-tailles', formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });
    
    console.log('\nRéponse du serveur:');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('Erreur lors de l\'envoi des données:', error.message);
    if (error.response) {
      console.error('Réponse d\'erreur:', error.response.data);
    }
  }
}

// Exécuter le test
testDebugTailles();