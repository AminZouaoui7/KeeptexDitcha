const express = require('express');
const {
  createCommande,
  getCommandeById,
  getAllCommandes,
  updateCommande,
  deleteCommande,
  getCommandesByUserId,
  updateEtatCommande,
  updateAcomptePaye
} = require('../controllers/commandeController');

const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.route('/')
  .get(protect, authorize('admin'), getAllCommandes)
  .post(protect, upload.single('logo'), createCommande);

router.route('/user/:userId')
  .get(protect, getCommandesByUserId);

router.route('/:id')
  .get(protect, getCommandeById)
  .put(protect, upload.single('logo'), updateCommande)
  .delete(protect, deleteCommande);

// Route pour mettre à jour uniquement l'état d'une commande
router.route('/:id/etat')
  .put(protect, updateEtatCommande);

// Route pour mettre à jour uniquement le statut de paiement de l'acompte
router.route('/:id/acomptepaye')
  .put(protect, authorize('admin'), updateAcomptePaye);

module.exports = router;