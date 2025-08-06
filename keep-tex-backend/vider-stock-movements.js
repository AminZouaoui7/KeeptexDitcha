const StockMovement = require('./models/StockMovement');
const sequelize = require('./sequelize');

async function viderStockMovements() {
  try {
    console.log('🗑️  Vidage de la table StockMovements...');
    
    // Synchroniser la connexion
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données établie');

    // Compter le nombre d'enregistrements avant
    const countBefore = await StockMovement.count();
    console.log(`📊 Nombre d'enregistrements avant vidage: ${countBefore}`);

    if (countBefore > 0) {
      // Vider la table
      const deletedCount = await StockMovement.destroy({
        where: {},
        truncate: true // Truncate pour réinitialiser les compteurs d'auto-incrémentation
      });

      console.log(`✅ ${deletedCount} enregistrements supprimés`);
    } else {
      console.log('ℹ️  La table est déjà vide');
    }

    // Vérifier après vidage
    const countAfter = await StockMovement.count();
    console.log(`📊 Nombre d'enregistrements après vidage: ${countAfter}`);

    console.log('🎉 Table StockMovements vidée avec succès !');

  } catch (error) {
    console.error('❌ Erreur lors du vidage:', error);
  } finally {
    await sequelize.close();
  }
}

// Exécuter le script
viderStockMovements();