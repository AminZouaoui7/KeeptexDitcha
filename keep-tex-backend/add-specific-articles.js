const Article = require('./models/Article');
const sequelize = require('./sequelize');

async function addSpecificArticles() {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Database connection established.');

    // Articles provided by user
    const articles = [
      {
        nom: "Tissu Coton Blanc",
        categorie: "Tissu",
        couleur: "Blanc",
        taille: "2m",
        quantite: 25,
        unite: "mètre",
        seuil: 10
      },
      {
        nom: "Fil Nylon Rouge",
        categorie: "Fil",
        couleur: "Rouge",
        taille: "Standard",
        quantite: 40,
        unite: "bobine",
        seuil: 20
      },
      {
        nom: "Fermeture Éclair 20cm",
        categorie: "Accessoire",
        couleur: "Noir",
        taille: "20cm",
        quantite: 15,
        unite: "pièce",
        seuil: 10
      },
      {
        nom: "Boutons Plastique Bleu",
        categorie: "Accessoire",
        couleur: "Bleu",
        taille: "1cm",
        quantite: 60,
        unite: "pièce",
        seuil: 30
      },
      {
        nom: "Tissu Jean Denim Brut",
        categorie: "Tissu",
        couleur: "Bleu foncé",
        taille: "3m",
        quantite: 8,
        unite: "mètre",
        seuil: 5
      }
    ];

    // Insert articles
    console.log('Adding specific articles...');
    const createdArticles = await Article.bulkCreate(articles);
    
    console.log(`✅ Successfully added ${createdArticles.length} articles!`);
    
    // Display the added articles
    console.log('\n📦 Added Articles:');
    createdArticles.forEach((article, index) => {
      console.log(`${index + 1}. ${article.nom} - ${article.couleur} - ${article.taille} - Quantité: ${article.quantite} ${article.unite} - Seuil: ${article.seuil}`);
    });

  } catch (error) {
    console.error('❌ Error adding articles:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the addition
console.log('➕ Adding specific articles...');
addSpecificArticles();