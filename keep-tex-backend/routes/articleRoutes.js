const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');

// Routes pour les articles
router.post('/', articleController.createArticle);
router.get('/', articleController.getAllArticles);
router.get('/:id', articleController.getArticleById);
router.put('/:id', articleController.updateArticle);
router.delete('/:id', articleController.deleteArticle);
router.post('/:id/ajouter-stock', articleController.ajouterStock);
router.post('/:id/retirer-stock', articleController.retirerStock);
router.get('/alerte-stock', articleController.getAlertesStock);
router.get('/rupture-stock', articleController.getRuptureStock);

module.exports = router;