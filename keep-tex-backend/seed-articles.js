const Article = require('./models/Article');
const sequelize = require('./sequelize');

async function seedArticles() {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Database connection established.');

    // Sample articles data
    const articles = [
      {
        nom: 'T-shirt Coton Basic',
        categorie: 'Vêtements',
        couleur: 'Blanc',
        taille: 'M',
        quantite: 50,
        unite: 'pièce',
        seuil: 10
      },
      {
        nom: 'T-shirt Coton Basic',
        categorie: 'Vêtements',
        couleur: 'Noir',
        taille: 'L',
        quantite: 30,
        unite: 'pièce',
        seuil: 10
      },
      {
        nom: 'Jean Slim',
        categorie: 'Vêtements',
        couleur: 'Bleu',
        taille: '32',
        quantite: 25,
        unite: 'pièce',
        seuil: 5
      },
      {
        nom: 'Robe Été',
        categorie: 'Vêtements',
        couleur: 'Rouge',
        taille: 'S',
        quantite: 15,
        unite: 'pièce',
        seuil: 3
      },
      {
        nom: 'Chemise Business',
        categorie: 'Vêtements',
        couleur: 'Bleu Clair',
        taille: 'XL',
        quantite: 20,
        unite: 'pièce',
        seuil: 8
      },
      {
        nom: 'Sweat-shirt',
        categorie: 'Vêtements',
        couleur: 'Gris',
        taille: 'M',
        quantite: 35,
        unite: 'pièce',
        seuil: 12
      },
      {
        nom: 'Veste Légère',
        categorie: 'Vêtements',
        couleur: 'Noir',
        taille: 'L',
        quantite: 10,
        unite: 'pièce',
        seuil: 3
      },
      {
        nom: 'Pantalon Chino',
        categorie: 'Vêtements',
        couleur: 'Beige',
        taille: '34',
        quantite: 18,
        unite: 'pièce',
        seuil: 6
      }
    ];

    // Insert articles
    console.log('Seeding articles...');
    const createdArticles = await Article.bulkCreate(articles);
    
    console.log(`✅ Successfully seeded ${createdArticles.length} articles!`);
    
    // Display the seeded articles
    console.log('\n📦 Seeded Articles:');
    createdArticles.forEach((article, index) => {
      console.log(`${index + 1}. ${article.nom} - ${article.couleur} - Taille ${article.taille} - Quantité: ${article.quantite} - Seuil: ${article.seuil}`);
    });

  } catch (error) {
    console.error('❌ Error seeding articles:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the seeding
seedArticles();