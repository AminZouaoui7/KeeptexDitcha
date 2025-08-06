const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testStockMovementSystem() {
  console.log('🧪 Test du système de mouvements de stock (version simplifiée)...\n');

  try {
    // 1. Lister les articles existants
    console.log('1. Récupération des articles existants...');
    const articlesResponse = await axios.get(`${API_URL}/articles`);
    const articles = articlesResponse.data.data;
    
    if (articles.length === 0) {
      console.log('❌ Aucun article trouvé. Création d\'un article de test...');
      const newArticle = await axios.post(`${API_URL}/articles`, {
        nom: 'Article Test Stock',
        categorie: 'Test',
        couleur: 'Rouge',
        quantite: 100,
        unite: 'unité',
        seuil: 10
      });
      var article = newArticle.data;
    } else {
      var article = articles[0];
    }
    
    console.log(`✅ Article sélectionné: ${article.nom} (ID: ${article.id}, Quantité: ${article.quantite})`);

    // 2. Ajouter du stock
    console.log('\n2. Test ajout de stock...');
    const addResponse = await axios.post(`${API_URL}/articles/${article.id}/ajouter-stock`, {
      quantite: 20,
      raison: 'Test ajout',
      utilisateur: 'Test System'
    });
    console.log(`✅ Stock ajouté: ${addResponse.data.message}`);

    // 3. Retirer du stock
    console.log('\n3. Test retrait de stock...');
    const removeResponse = await axios.post(`${API_URL}/articles/${article.id}/retirer-stock`, {
      quantite: 10,
      raison: 'Test retrait',
      utilisateur: 'Test System'
    });
    console.log(`✅ Stock retiré: ${removeResponse.data.message}`);

    // 4. Vérifier les mouvements de stock
    console.log('\n4. Récupération des mouvements de stock...');
    const movementsResponse = await axios.get(`${API_URL}/stock-movements`);
    console.log(`✅ Total mouvements: ${movementsResponse.data.count}`);
    
    if (movementsResponse.data.data.length > 0) {
      movementsResponse.data.data.slice(0, 3).forEach((movement, index) => {
        console.log(`   ${index + 1}. ${movement.type} - ${movement.quantite} unités (${movement.raison})`);
      });
    }

    // 5. Vérifier les mouvements par article
    console.log('\n5. Récupération des mouvements pour l\'article...');
    const articleMovementsResponse = await axios.get(`${API_URL}/stock-movements/article/${article.id}`);
    console.log(`✅ Mouvements pour l'article: ${articleMovementsResponse.data.count}`);

    // 6. Vérifier les statistiques
    console.log('\n6. Récupération des statistiques...');
    const statsResponse = await axios.get(`${API_URL}/stock-movements/stats`);
    console.log('✅ Statistiques globales:');
    statsResponse.data.data.globalStats.forEach(stat => {
      console.log(`   - ${stat.type}: ${stat.total_quantite || 0} unités, ${stat.total_mouvements || 0} mouvements`);
    });

    console.log('\n🎉 Test terminé avec succès!');
    console.log('\n📋 Endpoints disponibles pour Flutter:');
    console.log('   - GET /api/stock-movements - Liste tous les mouvements');
    console.log('   - GET /api/stock-movements/article/:id - Mouvements par article');
    console.log('   - GET /api/stock-movements/stats - Statistiques');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

// Exécuter le test
if (require.main === module) {
  testStockMovementSystem();
}

module.exports = testStockMovementSystem;