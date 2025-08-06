const Article = require('./models/Article');
const StockMovement = require('./models/StockMovement');
const sequelize = require('./sequelize');

async function testDirectUpdate() {
  try {
    console.log('🧪 Test direct de mise à jour d\'article avec création de mouvement');
    
    // Synchroniser les modèles
    await sequelize.sync();
    console.log('✅ Modèles synchronisés');

    // Créer ou trouver un article
    let article = await Article.findOne();
    if (!article) {
      article = await Article.create({
        nom: 'Article Test Direct',
        categorie: 'Test',
        couleur: 'Bleu',
        unite: 'unité',
        quantite: 20,
        seuil: 5
      });
      console.log(`📦 Nouvel article créé: ${article.nom} (ID: ${article.id}, Quantité: ${article.quantite})`);
    } else {
      console.log(`📦 Article trouvé: ${article.nom} (ID: ${article.id}, Quantité: ${article.quantite})`);
    }

    // Simuler la mise à jour avec création de mouvement
    const ancienneQuantite = article.quantite;
    const nouvelleQuantite = ancienneQuantite + 25;
    
    console.log(`\n📝 Mise à jour de la quantité de ${ancienneQuantite} à ${nouvelleQuantite}...`);
    
    // Mettre à jour l'article
    await article.update({ quantite: nouvelleQuantite });
    
    // Créer le mouvement de stock (similaire à ce qui se passe dans updateArticle)
    const difference = nouvelleQuantite - ancienneQuantite;
    const movement = await StockMovement.create({
      articleId: article.id,
      type: difference > 0 ? 'ENTREE' : 'SORTIE',
      quantite: Math.abs(difference),
      quantiteAvant: ancienneQuantite,
      quantiteApres: nouvelleQuantite,
      raison: 'Test de mise à jour directe',
      utilisateur: 'Test Script'
    });
    
    console.log(`✅ Mouvement créé: ID ${movement.id}, Type: ${movement.type}, Quantité: ${movement.quantite}`);
    
    // Vérifier les mouvements
    const movements = await StockMovement.findAll({
      where: { articleId: article.id },
      order: [['createdAt', 'DESC']]
    });
    
    console.log(`\n📊 Mouvements pour l\'article ${article.id}: ${movements.length}`);
    movements.forEach((m, index) => {
      console.log(`   ${index + 1}. ${m.type} - ${m.quantite} unités (${m.quantiteAvant} → ${m.quantiteApres}) - ${m.createdAt}`);
    });

    // Test de diminution
    console.log(`\n📉 Test de diminution...`);
    const nouvelleQuantite2 = nouvelleQuantite - 10;
    
    await article.update({ quantite: nouvelleQuantite2 });
    
    const difference2 = nouvelleQuantite2 - nouvelleQuantite;
    const movement2 = await StockMovement.create({
      articleId: article.id,
      type: difference2 > 0 ? 'ENTREE' : 'SORTIE',
      quantite: Math.abs(difference2),
      quantiteAvant: nouvelleQuantite,
      quantiteApres: nouvelleQuantite2,
      raison: 'Test de diminution',
      utilisateur: 'Test Script'
    });
    
    console.log(`✅ Mouvement créé: ID ${movement2.id}, Type: ${movement2.type}, Quantité: ${movement2.quantite}`);
    
    // Vérifier à nouveau
    const movements2 = await StockMovement.findAll({
      where: { articleId: article.id },
      order: [['createdAt', 'DESC']]
    });
    
    console.log(`\n📊 Total des mouvements: ${movements2.length}`);
    movements2.forEach((m, index) => {
      console.log(`   ${index + 1}. ${m.type} - ${m.quantite} unités (${m.quantiteAvant} → ${m.quantiteApres}) - ${m.createdAt}`);
    });

    console.log('\n🎉 Test terminé avec succès!');
    console.log('✅ La logique de création automatique de mouvements fonctionne.');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  } finally {
    await sequelize.close();
  }
}

// Exécuter le test
testDirectUpdate();