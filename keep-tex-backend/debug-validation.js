const sequelize = require('./sequelize');
const Article = require('./models/Article');

async function debugValidation() {
  try {
    // Check database connection
    await sequelize.authenticate();
    console.log('Database connected successfully');

    // Check table structure
    console.log('\n=== Table Structure ===');
    const [columns] = await sequelize.query(`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'Articles'
    `);
    console.log('Columns:', columns);

    // Check constraints
    console.log('\n=== Constraints ===');
    const [constraints] = await sequelize.query(`
      SELECT conname, consrc 
      FROM pg_constraint 
      WHERE conrelid = 'Articles'::regclass
    `);
    console.log('Constraints:', constraints);

    // Test API endpoint simulation
    console.log('\n=== Testing Direct Model Creation ===');
    const testData = {
      nom: 'Test Article',
      categorie: 'Test',
      couleur: 'Rouge',
      unite: 'mètre',
      quantite: 22,
      seuil: 10
    };
    
    console.log('Test data:', testData);
    
    // Test with raw values
    const article = await Article.create(testData);
    console.log('Article created successfully:', {
      id: article.id,
      quantite: article.quantite,
      seuil: article.seuil
    });

    // Clean up
    await article.destroy();
    console.log('Test article cleaned up');

  } catch (error) {
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      errors: error.errors ? error.errors.map(e => ({
        field: e.path,
        message: e.message,
        value: e.value,
        validator: e.validatorName
      })) : null
    });
  } finally {
    await sequelize.close();
  }
}

debugValidation();