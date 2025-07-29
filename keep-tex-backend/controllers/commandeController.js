const commandeService = require('../services/CommandeService');

// @desc    Get commandes by user ID
// @route   GET /api/commandes/user/:userId
// @access  Private
exports.getCommandesByUserId = async (req, res) => {
  try {
    // Vérifier que l'utilisateur est autorisé à voir ces commandes
    // Un utilisateur ne peut voir que ses propres commandes, sauf s'il est admin
    if (req.params.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Vous n\'êtes pas autorisé à accéder à ces commandes'
      });
    }
    
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
    // Validation des données de la commande
    let { type, type_modele, type_tissue, couleur, quantite_totale, prix_total, acompte_requis, tailles } = req.body;
    
    // Vérifier que les champs obligatoires sont présents
    if (!type || !quantite_totale || !prix_total) {
      return res.status(400).json({ 
        success: false, 
        error: 'Les champs type, quantite_totale et prix_total sont obligatoires' 
      });
    }
    
    // Parser le champ tailles s'il est une chaîne JSON
    if (typeof tailles === 'string') {
      try {
        tailles = JSON.parse(tailles);
      } catch (error) {
        console.error('Erreur lors du parsing des tailles:', error.message);
        return res.status(400).json({
          success: false,
          error: 'Format des tailles invalide'
        });
      }
    }
    
    // Vérifier que les tailles sont présentes et valides
    if (!tailles || !Array.isArray(tailles) || tailles.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Vous devez spécifier au moins une taille avec sa quantité' 
      });
    }
    
    // Vérifier que la somme des quantités par taille correspond à la quantité totale
    const sommeQuantites = tailles.reduce((sum, item) => sum + Number(item.quantite), 0);
    quantite_totale = Number(quantite_totale);
    console.log('Somme des quantités:', sommeQuantites, 'Type:', typeof sommeQuantites);
    console.log('Quantité totale:', quantite_totale, 'Type:', typeof quantite_totale);
    // Utiliser Math.abs pour gérer les erreurs d'arrondi potentielles
    if (Math.abs(sommeQuantites - quantite_totale) > 0.001) {
      return res.status(400).json({ 
        success: false, 
        error: 'La somme des quantités par taille doit être égale à la quantité totale' 
      });
    }
    
    // Ajouter l'ID de l'utilisateur connecté à la commande et le chemin du logo s'il existe
    // Transférer le champ 'notes' vers le champ 'description' de la table commande
    const { notes, ...restBody } = req.body;
    const commandeData = {
      ...restBody,
      description: notes, // Utiliser le champ 'notes' comme valeur pour 'description'
      tailles: tailles, // Utiliser la version parsée de tailles
      userId: req.user.id, // L'ID de l'utilisateur est disponible grâce au middleware d'authentification
      logo_path: req.file ? req.file.path : null // Ajouter le chemin du logo s'il a été uploadé
    };
    
    // Créer la commande avec ses tailles
    const commande = await commandeService.createCommande(commandeData);
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
    
    // Vérifier que l'utilisateur est autorisé à voir cette commande
    // Un utilisateur ne peut voir que ses propres commandes, sauf s'il est admin
    if (commande.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Vous n\'êtes pas autorisé à accéder à cette commande'
      });
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
    // Vérifier si la commande existe
    const existingCommande = await commandeService.getCommandeById(req.params.id);
    if (!existingCommande) {
      return res.status(404).json({ success: false, error: 'Commande not found' });
    }
    
    // Vérifier que l'utilisateur est autorisé à modifier cette commande
    // Un utilisateur ne peut modifier que ses propres commandes, sauf s'il est admin
    if (existingCommande.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Vous n\'êtes pas autorisé à modifier cette commande'
      });
    }
    
    // Validation des données de mise à jour
    let { quantite_totale, prix_total, tailles } = req.body;
    
    // Parser le champ tailles s'il est une chaîne JSON
    if (typeof tailles === 'string') {
      try {
        tailles = JSON.parse(tailles);
      } catch (error) {
        console.error('Erreur lors du parsing des tailles:', error.message);
        return res.status(400).json({
          success: false,
          error: 'Format des tailles invalide'
        });
      }
    }
    
    // Si on met à jour les tailles et la quantité totale
    if (tailles && Array.isArray(tailles) && tailles.length > 0 && quantite_totale) {
      // Vérifier que la somme des quantités par taille correspond à la quantité totale
      const sommeQuantites = tailles.reduce((sum, item) => sum + Number(item.quantite), 0);
      quantite_totale = Number(quantite_totale);
      console.log('Somme des quantités (update):', sommeQuantites, 'Type:', typeof sommeQuantites);
      console.log('Quantité totale (update):', quantite_totale, 'Type:', typeof quantite_totale);
      // Utiliser Math.abs pour gérer les erreurs d'arrondi potentielles
      if (Math.abs(sommeQuantites - quantite_totale) > 0.001) {
        return res.status(400).json({ 
          success: false, 
          error: 'La somme des quantités par taille doit être égale à la quantité totale' 
        });
      }
    }
    
    // Préparer les données de mise à jour avec le logo s'il a été fourni
    // Transférer le champ 'notes' vers le champ 'description' de la table commande
    const { notes, ...restBody } = req.body;
    const updateData = {
      ...restBody,
      description: notes, // Utiliser le champ 'notes' comme valeur pour 'description'
      tailles: tailles, // Utiliser la version parsée de tailles
      logo_path: req.file ? req.file.path : undefined // Ajouter le chemin du logo s'il a été uploadé
    };
    
    // Mettre à jour la commande
    const updatedCommande = await commandeService.updateCommande(req.params.id, updateData);
    res.status(200).json({ success: true, data: updatedCommande });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteCommande = async (req, res) => {
  try {
    // Vérifier si la commande existe
    const existingCommande = await commandeService.getCommandeById(req.params.id);
    if (!existingCommande) {
      return res.status(404).json({ success: false, error: 'Commande not found' });
    }
    
    // Vérifier que l'utilisateur est autorisé à supprimer cette commande
    // Un utilisateur ne peut supprimer que ses propres commandes, sauf s'il est admin
    if (existingCommande.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Vous n\'êtes pas autorisé à supprimer cette commande'
      });
    }
    
    const deleted = await commandeService.deleteCommande(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};