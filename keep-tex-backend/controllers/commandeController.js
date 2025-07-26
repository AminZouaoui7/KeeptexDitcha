const commandeService = require('../services/CommandeService');

// @desc    Get commandes by user ID
// @route   GET /api/commandes/user/:userId
// @access  Private
exports.getCommandesByUserId = async (req, res) => {
  try {
    const commandes = await commandeService.getCommandesByUserId(req.params.userId);
    res.status(200).json({
      success: true,
      count: commandes.length,
      data: commandes
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createCommande = async (req, res) => {
  try {
    const commande = await commandeService.createCommande(req.body);
    res.status(201).json({ success: true, data: commande });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getCommandeById = async (req, res) => {
  try {
    const commande = await commandeService.getCommandeById(req.params.id);
    if (!commande) {
      return res.status(404).json({ success: false, error: 'Commande not found' });
    }
    res.status(200).json({ success: true, data: commande });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAllCommandes = async (req, res) => {
  try {
    const commandes = await commandeService.getAllCommandes();
    res.status(200).json({ success: true, data: commandes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateCommande = async (req, res) => {
  try {
    const updatedCommande = await commandeService.updateCommande(req.params.id, req.body);
    if (!updatedCommande) {
      return res.status(404).json({ success: false, error: 'Commande not found' });
    }
    res.status(200).json({ success: true, data: updatedCommande });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteCommande = async (req, res) => {
  try {
    const deleted = await commandeService.deleteCommande(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Commande not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};