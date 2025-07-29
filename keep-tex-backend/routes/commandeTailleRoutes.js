const express = require('express');
const commandeTailleService = require('../services/CommandeTailleService');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/commande-tailles/commande/:commandeId
// @desc    Get all tailles for a specific commande
// @access  Private
router.get('/commande/:commandeId', protect, async (req, res) => {
  try {
    const tailles = await commandeTailleService.getCommandeTaillesByCommandeId(req.params.commandeId);
    res.status(200).json({ success: true, data: tailles });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   GET /api/commande-tailles/:id
// @desc    Get a specific taille by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const taille = await commandeTailleService.getCommandeTailleById(req.params.id);
    if (!taille) {
      return res.status(404).json({ success: false, error: 'Taille not found' });
    }
    res.status(200).json({ success: true, data: taille });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   POST /api/commande-tailles
// @desc    Create a new taille
// @access  Private/Admin
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const taille = await commandeTailleService.createCommandeTaille(req.body);
    res.status(201).json({ success: true, data: taille });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   PUT /api/commande-tailles/:id
// @desc    Update a taille
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const taille = await commandeTailleService.updateCommandeTaille(req.params.id, req.body);
    if (!taille) {
      return res.status(404).json({ success: false, error: 'Taille not found' });
    }
    res.status(200).json({ success: true, data: taille });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   DELETE /api/commande-tailles/:id
// @desc    Delete a taille
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const deleted = await commandeTailleService.deleteCommandeTaille(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Taille not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;