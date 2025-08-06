const Article = require('../models/Article');
const { Op, Sequelize } = require('sequelize');

// POST /api/articles - Créer un nouvel article
exports.createArticle = async (req, res) => {
  try {
    console.log('Raw body:', req.body);
    console.log('Type of quantite:', typeof req.body.quantite, 'value:', req.body.quantite);
    console.log('Type of seuil:', typeof req.body.seuil, 'value:', req.body.seuil);
    
    const { nom, description, prix, categorie, couleur, taille, unite, quantite, seuil } = req.body;
    
    // Ensure required fields are provided
    if (!nom || !categorie || !couleur || !unite) {
      return res.status(400).json({ 
        message: 'Les champs nom, categorie, couleur et unite sont obligatoires' 
      });
    }
    
    // Convert quantite and seuil to valid numbers
    const quantiteNum = Number(quantite);
    const seuilNum = Number(seuil);
    
    console.log('Converted quantiteNum:', quantiteNum, 'seuilNum:', seuilNum);
    
    if (isNaN(quantiteNum) || isNaN(seuilNum)) {
      return res.status(400).json({ 
        message: 'Quantité et seuil doivent être des nombres valides' 
      });
    }
    
    // Create article
    const article = await Article.create({
      nom: String(nom).trim(),
      description: description ? String(description).trim() : null,
      prix: prix ? Number(prix) : null,
      categorie: String(categorie).trim(),
      couleur: String(couleur).trim(),
      taille: taille ? String(taille).trim() : null,
      unite: String(unite).trim(),
      quantite: Math.max(0, Math.floor(quantiteNum)),
      seuil: Math.max(0, Math.floor(seuilNum))
    });
    
    // Ajouter l'indicateur de rupture de stock
    const articleWithRuptureStock = {
      ...article.toJSON(),
      ruptureStock: article.quantite === article.seuil
    };
    
    res.status(201).json(articleWithRuptureStock);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      console.log('Validation errors:', error.errors);
      res.status(400).json({ 
        message: error.errors.map(e => e.message).join(', ') 
      });
    } else {
      console.error('Error creating article:', error);
      res.status(500).json({ 
        message: 'Erreur lors de la création de l\'article' 
      });
    }
  }
};

// GET /api/articles - Récupérer tous les articles
exports.getAllArticles = async (req, res) => {
  try {
    const articles = await Article.findAll();
    
    // Ajouter l'indicateur de rupture de stock
    const articlesWithRuptureStock = articles.map(article => ({
      ...article.toJSON(),
      ruptureStock: article.quantite === article.seuil
    }));
    
    res.status(200).json({
      success: true,
      count: articles.length,
      data: articlesWithRuptureStock
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: []
    });
  }
};

// GET /api/articles/:id - Récupérer un article par ID
exports.getArticleById = async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }
    
    // Ajouter l'indicateur de rupture de stock
    const articleWithRuptureStock = {
      ...article.toJSON(),
      ruptureStock: article.quantite === article.seuil
    };
    
    res.status(200).json(articleWithRuptureStock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/articles/:id - Modifier un article
exports.updateArticle = async (req, res) => {
  try {
    const StockMovement = require('../models/StockMovement');
    
    const article = await Article.findByPk(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }
    
    // Stocker l'ancienne quantité pour détecter les changements
    const ancienneQuantite = article.quantite;
    
    await article.update(req.body);
    
    // Vérifier si la quantité a changé
    if (req.body.quantite !== undefined && req.body.quantite !== ancienneQuantite) {
      const difference = req.body.quantite - ancienneQuantite;
      
      // Créer un mouvement de stock
      await StockMovement.create({
        articleId: article.id,
        type: difference > 0 ? 'ENTREE' : 'SORTIE',
        quantite: Math.abs(difference),
        quantiteAvant: ancienneQuantite,
        quantiteApres: article.quantite,
        raison: req.body.raison || 'Modification manuelle',
        utilisateur: req.body.utilisateur || 'Système'
      });
    }
    
    // Ajouter l'indicateur de rupture de stock
    const articleWithRuptureStock = {
      ...article.toJSON(),
      ruptureStock: article.quantite === article.seuil
    };
    
    res.status(200).json(articleWithRuptureStock);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /api/articles/:id - Supprimer un article
exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }
    await article.destroy();
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/articles/:id/ajouter-stock - Ajouter quantité
exports.ajouterStock = async (req, res) => {
  try {
    const StockMovement = require('../models/StockMovement');
    
    const article = await Article.findByPk(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }
    const { quantite, raison, utilisateur } = req.body;
    if (typeof quantite !== 'number' || quantite <= 0) {
      return res.status(400).json({ message: 'Quantité invalide' });
    }

    const quantiteAvant = article.quantite;
    article.quantite += quantite;
    await article.save();

    // Enregistrer le mouvement de stock
    await StockMovement.create({
      articleId: article.id,
      type: 'ENTREE',
      quantite: quantite,
      quantiteAvant: quantiteAvant,
      quantiteApres: article.quantite,
      raison: raison || 'Ajout manuel',
      utilisateur: utilisateur || 'Système'
    });

    res.status(200).json({
      success: true,
      data: article,
      message: 'Stock ajouté avec succès'
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// POST /api/articles/:id/retirer-stock - Retirer quantité
exports.retirerStock = async (req, res) => {
  try {
    const StockMovement = require('../models/StockMovement');
    
    const article = await Article.findByPk(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }
    const { quantite, raison, utilisateur } = req.body;
    if (typeof quantite !== 'number' || quantite <= 0) {
      return res.status(400).json({ message: 'Quantité invalide' });
    }
    if (article.quantite - quantite < 0) {
      return res.status(400).json({ message: 'Quantité insuffisante' });
    }

    const quantiteAvant = article.quantite;
    article.quantite -= quantite;
    await article.save();

    // Enregistrer le mouvement de stock
    await StockMovement.create({
      articleId: article.id,
      type: 'SORTIE',
      quantite: quantite,
      quantiteAvant: quantiteAvant,
      quantiteApres: article.quantite,
      raison: raison || 'Retrait manuel',
      utilisateur: utilisateur || 'Système'
    });

    res.status(200).json({
      success: true,
      data: article,
      message: 'Stock retiré avec succès'
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET /api/articles/alerte-stock - Articles avec quantité < seuil ou = seuil (rupture)
exports.getAlertesStock = async (req, res) => {
  try {
    const seuilParam = parseInt(req.query.seuil) || 5;
    const includeRupture = req.query.includeRupture === 'true';
    
    let whereClause;
    
    if (includeRupture) {
      whereClause = {
        [Op.or]: [
          { quantite: { [Op.lt]: seuilParam } },
          { quantite: { [Op.eq]: Sequelize.col('seuil') } }
        ]
      };
    } else {
      whereClause = {
        quantite: { [Op.lt]: seuilParam }
      };
    }
    
    const articles = await Article.findAll({ where: whereClause });
    
    // Ajouter l'indicateur de rupture de stock
    const articlesWithRuptureStock = articles.map(article => ({
      ...article.toJSON(),
      ruptureStock: article.quantite === article.seuil
    }));
    
    res.status(200).json(articlesWithRuptureStock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/articles/rupture-stock - Articles en rupture de stock (quantité = seuil)
exports.getRuptureStock = async (req, res) => {
  try {
    const articles = await Article.findAll({
      where: {
        quantite: { [Op.eq]: Sequelize.col('seuil') }
      }
    });
    
    // Ajouter l'indicateur de rupture de stock
    const articlesWithRuptureStock = articles.map(article => ({
      ...article.toJSON(),
      ruptureStock: true
    }));
    
    res.status(200).json(articlesWithRuptureStock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};