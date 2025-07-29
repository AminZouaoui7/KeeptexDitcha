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

module.exports = router;