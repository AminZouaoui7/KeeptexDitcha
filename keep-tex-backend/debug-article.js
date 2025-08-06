const Article = require('./models/Article');
const sequelize = require('./sequelize');

async function debugArticle() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connected successfully');
    
    // Test creating an article directly
    console.log('Testing direct article creation...');
    
    const testData = {
      nom: 'Test Article',
      categorie: 'Test',
      couleur: 'Rouge',
      unite: 'mètre',
      quantite: 22,
      seuil: 10
    };
    
    console.log('Input data:', testData);
    
    const article = await Article.create(testData);
    console.log('Article created successfully:', article.toJSON());
    
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
    
    // Check actual table structure
    try {
      const [columns] = await sequelize.query(`
        SELECT column_name, data_type, is_nullable, column_default 
        FROM information_schema.columns 
        WHERE table_name = 'Articles'
      `);
      console.log('Table structure:', columns);
    } catch (dbError) {
      console.error('Could not fetch table structure:', dbError.message);
    }
  } finally {
    await sequelize.close();
  }
}

debugArticle();