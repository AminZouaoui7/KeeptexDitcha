const axios = require('axios');

const API_URL = 'http://localhost:5000/api/articles';

async function testRuptureStock() {
  console.log('=== Test Rupture de Stock ===\n');

  try {
    // 1. Créer des articles avec différentes quantités/seuils
    console.log('1. Création d\'articles de test...');
    
    const articlesTest = [
      { nom: 'Article 1', categorie: 'Test', couleur: 'Rouge', unite: 'unité', quantite: 5, seuil: 5 }, // Rupture
      { nom: 'Article 2', categorie: 'Test', couleur: 'Bleu', unite: 'unité', quantite: 3, seuil: 5 }, // Alerte
      { nom: 'Article 3', categorie: 'Test', couleur: 'Vert', unite: 'unité', quantite: 8, seuil: 5 }, // Normal
      { nom: 'Article 4', categorie: 'Test', couleur: 'Jaune', unite: 'unité', quantite: 10, seuil: 10 } // Rupture
    ];

    const createdArticles = [];
    for (const article of articlesTest) {
      const response = await axios.post(API_URL, article);
      createdArticles.push(response.data);
      console.log(`   ✓ ${article.nom} créé (ID: ${response.data.id}, ruptureStock: ${response.data.ruptureStock})`);
    }

    console.log('\n2. Vérification des articles en rupture de stock...');
    
    // 2. Tester l'endpoint rupture-stock
    const ruptureResponse = await axios.get(`${API_URL}/rupture-stock`);
    console.log(`   Articles en rupture: ${ruptureResponse.data.length}`);
    ruptureResponse.data.forEach(article => {
      console.log(`   - ${article.nom}: quantité=${article.quantite}, seuil=${article.seuil}, ruptureStock=${article.ruptureStock}`);
    });

    console.log('\n3. Vérification de tous les articles avec indicateur...');
    
    // 3. Tester l'endpoint getAll avec indicateur
    const allResponse = await axios.get(API_URL);
    console.log(`   Total articles: ${allResponse.data.count}`);
    allResponse.data.data.forEach(article => {
      console.log(`   - ${article.nom}: quantité=${article.quantite}, seuil=${article.seuil}, ruptureStock=${article.ruptureStock}`);
    });

    console.log('\n4. Vérification de l\'endpoint alerte-stock avec rupture...');
    
    // 4. Tester l'endpoint alerte-stock avec includeRupture
    const alerteResponse = await axios.get(`${API_URL}/alerte-stock?includeRupture=true`);
    console.log(`   Articles en alerte ou rupture: ${alerteResponse.data.length}`);
    alerteResponse.data.forEach(article => {
      const type = article.quantite === article.seuil ? 'RUPTURE' : 'ALERTE';
      console.log(`   - ${article.nom}: ${type} (quantité=${article.quantite}, seuil=${article.seuil})`);
    });

    console.log('\n=== Test terminé avec succès! ===');

  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
  }
}

// Exécuter le test
testRuptureStock();