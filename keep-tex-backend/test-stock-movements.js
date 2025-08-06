const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testStockMovementSystem() {
  console.log('🧪 Test du système de mouvements de stock...\n');

  try {
    // 1. Créer un article de test
    console.log('1. Création d\'un article de test...');
    const articleResponse = await axios.post(`${API_URL}/articles`, {
      nom: 'Tissu Test Stock',
      categorie: 'Tissu',
      couleur: 'Bleu',
      taille: '1m',
      quantite: 50,
      unite: 'mètre',
      seuil: 10
    });
    
    const article = articleResponse.data;
    console.log(`✅ Article créé: ${article.nom} (ID: ${article.id}, Quantité: ${article.quantite})`);

    // 2. Ajouter du stock
    console.log('\n2. Ajout de 25 unités de stock...');
    const addResponse = await axios.post(`${API_URL}/articles/${article.id}/ajouter-stock`, {
      quantite: 25,
      raison: 'Réception de commande',
      utilisateur: 'Admin Test'
    });
    console.log(`✅ Stock ajouté: ${addResponse.data.message} (Nouvelle quantité: ${addResponse.data.data.quantite})`);

    // 3. Retirer du stock
    console.log('\n3. Retrait de 15 unités de stock...');
    const removeResponse = await axios.post(`${API_URL}/articles/${article.id}/retirer-stock`, {
      quantite: 15,
      raison: 'Vente client',
      utilisateur: 'Vendeur Test'
    });
    console.log(`✅ Stock retiré: ${removeResponse.data.message} (Nouvelle quantité: ${removeResponse.data.data.quantite})`);

    // 4. Vérifier les mouvements de stock
    console.log('\n4. Récupération des mouvements de stock...');
    const movementsResponse = await axios.get(`${API_URL}/stock-movements`);
    console.log(`✅ Mouvements trouvés: ${movementsResponse.data.count}`);
    
    movementsResponse.data.data.forEach(movement => {
      console.log(`   - ${movement.type}: ${movement.quantite} unités (${movement.raison}) - ${movement.utilisateur}`);
    });

    // 5. Vérifier les mouvements par article
    console.log('\n5. Récupération des mouvements pour l\'article...');
    const articleMovementsResponse = await axios.get(`${API_URL}/stock-movements/article/${article.id}`);
    console.log(`✅ Mouvements pour l'article: ${articleMovementsResponse.data.count}`);
    
    articleMovementsResponse.data.data.forEach(movement => {
      console.log(`   - ${movement.type}: ${movement.quantiteAvant} → ${movement.quantiteApres} (${movement.raison})`);
    });

    // 6. Vérifier les statistiques
    console.log('\n6. Récupération des statistiques...');
    const statsResponse = await axios.get(`${API_URL}/stock-movements/stats`);
    console.log('✅ Statistiques:');
    statsResponse.data.data.globalStats.forEach(stat => {
      console.log(`   - ${stat.type}: ${stat.total_quantite} unités, ${stat.total_mouvements} mouvements`);
    });

    // 7. Test avec filtre par type
    console.log('\n7. Test filtre par type ENTREE...');
    const entreesResponse = await axios.get(`${API_URL}/stock-movements?type=ENTREE`);
    console.log(`✅ Mouvements ENTREE: ${entreesResponse.data.count}`);

    // 8. Test avec filtre par date
    console.log('\n8. Test filtre par date...');
    const today = new Date().toISOString().split('T')[0];
    const dateResponse = await axios.get(`${API_URL}/stock-movements?startDate=${today}`);
    console.log(`✅ Mouvements du jour: ${dateResponse.data.count}`);

    console.log('\n🎉 Tous les tests ont réussi!');
    console.log('\n📋 Résumé des endpoints disponibles:');
    console.log('   - GET /api/stock-movements - Tous les mouvements');
    console.log('   - GET /api/stock-movements/:id - Un mouvement spécifique');
    console.log('   - GET /api/stock-movements/article/:articleId - Mouvements par article');
    console.log('   - GET /api/stock-movements/stats - Statistiques');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.response?.data || error.message);
  }
}

// Exécuter le test si ce fichier est exécuté directement
if (require.main === module) {
  testStockMovementSystem();
}

module.exports = testStockMovementSystem;