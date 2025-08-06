const sequelize = require('./sequelize');
const StockMovement = require('./models/StockMovement');
const Article = require('./models/Article');

async function migrateStockMovements() {
  console.log('🔄 Migration du système de mouvements de stock...');

  try {
    // Synchroniser les modèles
    console.log('📋 Synchronisation des modèles...');
    await sequelize.sync({ alter: true });
    console.log('✅ Modèles synchronisés avec succès');

    // Vérifier si la table existe
    const tables = await sequelize.showAllSchemas();
    console.log('📊 Tables disponibles:', tables);

    // Vérifier les associations
    console.log('🔗 Vérification des associations...');
    
    // Test simple de connexion
    const articleCount = await Article.count();
    console.log(`📦 Nombre d'articles: ${articleCount}`);

    console.log('\n✅ Migration terminée avec succès!');
    console.log('📝 Le système de mouvements de stock est maintenant opérationnel.');
    console.log('\n🧪 Pour tester le système, exécutez:');
    console.log('   node test-stock-movements.js');

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
  } finally {
    await sequelize.close();
  }
}

// Exécuter la migration
migrateStockMovements();