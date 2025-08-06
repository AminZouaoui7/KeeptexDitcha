const express = require('express');
const router = express.Router();
const stockMovementController = require('../controllers/stockMovementController');

// Routes pour les mouvements de stock
router.get('/', stockMovementController.getAllStockMovements);
router.get('/stats', stockMovementController.getStockMovementStats);
router.get('/count-by-type', stockMovementController.countMovementsByType);
router.get('/count-by-type/:type', stockMovementController.countMovementsForType);
router.get('/:id', stockMovementController.getStockMovementById);
router.get('/article/:articleId', stockMovementController.getStockMovementsByArticle);

module.exports = router;