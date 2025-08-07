const StockMovement = require('../models/StockMovement');
const Article = require('../models/Article');
const User = require('../models/User');
const { Op } = require('sequelize');

// GET /api/stock-movements - Récupérer tous les mouvements de stock
exports.getAllStockMovements = async (req, res) => {
  try {
    const { articleId, type, startDate, endDate, limit = 50, offset = 0 } = req.query;
    
    let whereClause = {};
    
    if (articleId) {
      whereClause.articleId = articleId;
    }
    
    if (type && ['ENTREE', 'SORTIE'].includes(type)) {
      whereClause.type = type;
    }
    
    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) {
        whereClause.createdAt[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        whereClause.createdAt[Op.lte] = new Date(endDate);
      }
    }

    const movements = await StockMovement.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Article,
          as: 'article',
          attributes: ['nom', 'categorie', 'couleur', 'taille']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Process the movements to include user information
    const processedMovements = movements.rows.map(movement => {
      const movementData = movement.toJSON();
      return {
        ...movementData,
        article: movementData.article ? {
          nom: movementData.article.nom || 'Article sans nom',
          categorie: movementData.article.categorie,
          couleur: movementData.article.couleur,
          taille: movementData.article.taille
        } : {
          nom: 'Article inconnu',
          categorie: null,
          couleur: null,
          taille: null
        },
        user: {
          name: movementData.utilisateur || 'Système'
        }
      };
    });

    res.status(200).json({
      success: true,
      count: movements.count,
      data: processedMovements,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        totalPages: Math.ceil(movements.count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: []
    });
  }
};

// GET /api/stock-movements/:id - Récupérer un mouvement par ID
exports.getStockMovementById = async (req, res) => {
  try {
    const movement = await StockMovement.findByPk(req.params.id);

    if (!movement) {
      return res.status(404).json({
        success: false,
        message: 'Mouvement de stock non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: movement
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET /api/stock-movements/stats - Statistiques des mouvements de stock
exports.getStockMovementStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let whereClause = {};
    
    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) {
        whereClause.createdAt[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        whereClause.createdAt[Op.lte] = new Date(endDate);
      }
    }

    const stats = await StockMovement.findAll({
      where: whereClause,
      attributes: [
        'type',
        [StockMovement.sequelize.fn('SUM', StockMovement.sequelize.col('quantite')), 'total_quantite'],
        [StockMovement.sequelize.fn('COUNT', StockMovement.sequelize.col('id')), 'total_mouvements']
      ],
      group: ['type'],
      raw: true
    });

    const articleStats = await StockMovement.findAll({
      where: whereClause,
      attributes: [
        'articleId',
        [StockMovement.sequelize.fn('SUM', StockMovement.sequelize.col('quantite')), 'total_quantite'],
        [StockMovement.sequelize.fn('COUNT', StockMovement.sequelize.col('id')), 'total_mouvements']
      ],
      group: ['articleId'],
      order: [[StockMovement.sequelize.fn('COUNT', StockMovement.sequelize.col('id')), 'DESC']],
      limit: 10
    });

    res.status(200).json({
      success: true,
      data: {
        globalStats: stats,
        topArticles: articleStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET /api/stock-movements/article/:articleId - Mouvements pour un article spécifique
exports.getStockMovementsByArticle = async (req, res) => {
  try {
    const { articleId } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    const article = await Article.findByPk(articleId);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article non trouvé'
      });
    }

    const movements = await StockMovement.findAndCountAll({
      where: { articleId },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      success: true,
      count: movements.count,
      data: movements.rows,
      article: {
        id: article.id,
        nom: article.nom,
        reference: article.reference,
        quantiteActuelle: article.quantite,
        seuil: article.seuil
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET /api/stock-movements/count-by-type - Compter les mouvements par type
exports.countMovementsByType = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let whereClause = {};
    
    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) {
        whereClause.createdAt[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        whereClause.createdAt[Op.lte] = new Date(endDate);
      }
    }

    const counts = await StockMovement.findAll({
      where: whereClause,
      attributes: [
        'type',
        [StockMovement.sequelize.fn('COUNT', StockMovement.sequelize.col('id')), 'count'],
        [StockMovement.sequelize.fn('SUM', StockMovement.sequelize.col('quantite')), 'total_quantite']
      ],
      group: ['type'],
      raw: true
    });

    res.status(200).json({
      success: true,
      data: counts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET /api/stock-movements/count-by-type/:type - Compter les mouvements pour un type spécifique
exports.countMovementsForType = async (req, res) => {
  try {
    const { type } = req.params;
    const { startDate, endDate } = req.query;

    if (!['ENTREE', 'SORTIE'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Type invalide. Types valides: ENTREE, SORTIE'
      });
    }

    let whereClause = { type };
    
    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) {
        whereClause.createdAt[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        whereClause.createdAt[Op.lte] = new Date(endDate);
      }
    }

    const count = await StockMovement.count({
      where: whereClause
    });

    const totalQuantity = await StockMovement.sum('quantite', {
      where: whereClause
    });

    res.status(200).json({
      success: true,
      data: {
        type,
        count,
        total_quantite: totalQuantity || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};