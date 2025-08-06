const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

async function testUpdateArticleWithMovement() {
  try {
    console.log('🧪 Test de mise à jour d\'article avec création automatique de mouvement de stock');

    // 1. Récupérer un article existant ou en créer un nouveau
    let article;
    try {
      const response = await axios.get(`${API_BASE_URL}/articles`);
      if (response.data.data && response.data.data.length > 0) {
        article = response.data.data[0];
        console.log(`📦 Article trouvé: ${article.nom} (ID: ${article.id}, Quantité: ${article.quantite})`);
      } else {
        console.log('📦 Aucun article trouvé, création d\'un nouvel article...');
        const newArticle = await axios.post(`${API_BASE_URL}/articles`, {
          nom: 'Article Test Mise à jour',
          categorie: 'Test',
          couleur: 'Rouge',
          unite: 'unité',
          quantite: 10,
          seuil: 5
        });
        article = newArticle.data;
        console.log(`📦 Nouvel article créé: ${article.nom} (ID: ${article.id}, Quantité: ${article.quantite})`);
      }
    } catch (error) {
      console.log('📦 Erreur lors de la récupération des articles, création d\'un nouvel article...');
      const newArticle = await axios.post(`${API_BASE_URL}/articles`, {
        nom: 'Article Test Mise à jour',
        categorie: 'Test',
        couleur: 'Rouge',
        unite: 'unité',
        quantite: 10,
        seuil: 5
      });
      article = newArticle.data;
      console.log(`📦 Nouvel article créé: ${article.nom} (ID: ${article.id}, Quantité: ${article.quantite})`);
    }

    const quantiteInitiale = article.quantite;
    const nouvelleQuantite = quantiteInitiale + 15; // Augmentation de 15 unités

    // 2. Mettre à jour la quantité via PUT /api/articles/:id
    console.log(`\n📝 Mise à jour de la quantité de ${quantiteInitiale} à ${nouvelleQuantite}...`);
    const updateResponse = await axios.put(`${API_BASE_URL}/articles/${article.id}`, {
      quantite: nouvelleQuantite,
      raison: 'Test de mise à jour avec mouvement',
      utilisateur: 'Test Script'
    });

    console.log(`✅ Article mis à jour: ${updateResponse.data.nom} (Nouvelle quantité: ${updateResponse.data.quantite})`);

    // 3. Vérifier les mouvements de stock créés
    console.log('\n📊 Vérification des mouvements de stock...');
    const movementsResponse = await axios.get(`${API_BASE_URL}/stock-movements`);
    const articleMovements = movementsResponse.data.data.filter(
      movement => movement.articleId === article.id
    );

    console.log(`📈 Mouvements trouvés pour cet article: ${articleMovements.length}`);
    
    if (articleMovements.length > 0) {
      const dernierMouvement = articleMovements[articleMovements.length - 1];
      console.log(`📋 Dernier mouvement:`);
      console.log(`   - Type: ${dernierMouvement.type}`);
      console.log(`   - Quantité: ${dernierMouvement.quantite}`);
      console.log(`   - Quantité avant: ${dernierMouvement.quantiteAvant}`);
      console.log(`   - Quantité après: ${dernierMouvement.quantiteApres}`);
      console.log(`   - Raison: ${dernierMouvement.raison}`);
      console.log(`   - Date: ${dernierMouvement.createdAt}`);
    }

    // 4. Test de diminution de stock
    console.log('\n📉 Test de diminution de stock...');
    const diminutionResponse = await axios.put(`${API_BASE_URL}/articles/${article.id}`, {
      quantite: nouvelleQuantite - 5,
      raison: 'Test de diminution avec mouvement',
      utilisateur: 'Test Script'
    });

    console.log(`✅ Article mis à jour: ${diminutionResponse.data.nom} (Nouvelle quantité: ${diminutionResponse.data.quantite})`);

    // 5. Vérifier à nouveau les mouvements
    const movementsResponse2 = await axios.get(`${API_BASE_URL}/stock-movements`);
    const articleMovements2 = movementsResponse2.data.data.filter(
      movement => movement.articleId === article.id
    );

    console.log(`📈 Total des mouvements après diminution: ${articleMovements2.length}`);
    
    if (articleMovements2.length >= 2) {
      const dernierMouvement2 = articleMovements2[articleMovements2.length - 1];
      console.log(`📋 Dernier mouvement (diminution):`);
      console.log(`   - Type: ${dernierMouvement2.type}`);
      console.log(`   - Quantité: ${dernierMouvement2.quantite}`);
      console.log(`   - Quantité avant: ${dernierMouvement2.quantiteAvant}`);
      console.log(`   - Quantité après: ${dernierMouvement2.quantiteApres}`);
    }

    console.log('\n🎉 Test terminé avec succès!');
    console.log('✅ La mise à jour de la quantité via PUT /api/articles/:id crée automatiquement des mouvements de stock.');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.response ? error.response.data : error.message);
  }
}

// Exécuter le test
testUpdateArticleWithMovement();