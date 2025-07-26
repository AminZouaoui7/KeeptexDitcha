const express = require('express');
const {
  createCommande,
  getCommandeById,
  getAllCommandes,
  updateCommande,
  deleteCommande,
  getCommandesByUserId
} = require('../controllers/commandeController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getAllCommandes)
  .post(protect, authorize('admin'), createCommande);

router.route('/user/:userId')
  .get(protect, getCommandesByUserId);

router.route('/:id')
  .get(getCommandeById)
  .put(protect, authorize('admin'), updateCommande)
  .delete(protect, authorize('admin'), deleteCommande);

module.exports = router;