const Article = require('./models/Article');
const sequelize = require('./sequelize');

async function clearArticles() {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Database connection established.');

    // Get current count
    const currentCount = await Article.count();
    console.log(`Current articles count: ${currentCount}`);

    if (currentCount > 0) {
      // Delete all articles
      const deletedCount = await Article.destroy({
        where: {}, // Empty where clause to delete all records
        truncate: true // Use TRUNCATE for better performance
      });
      
      console.log(`✅ Successfully deleted ${deletedCount} articles!`);
      console.log('📋 Articles table is now empty.');
    } else {
      console.log('ℹ️  Articles table is already empty.');
    }

    // Verify the table is empty
    const newCount = await Article.count();
    console.log(`✅ Verification: ${newCount} articles remaining.`);

  } catch (error) {
    console.error('❌ Error clearing articles:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the clearing
console.log('🧹 Clearing Articles table...');
clearArticles();