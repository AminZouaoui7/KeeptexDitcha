const Contact = require('../models/ContactPg');
const sendEmail = require('../utils/sendEmail');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
exports.submitContact = async (req, res) => {
  try {
    console.log('Requête de contact reçue:', req.body);
    
    const contact = await Contact.create(req.body);
    console.log('Contact créé avec succès:', contact);

    // Préparer le contenu de l'email
    const emailContent = `
      <h1>Nouveau message de contact</h1>
      <p><strong>Nom:</strong> ${req.body.name}</p>
      <p><strong>Email:</strong> ${req.body.email}</p>
      <p><strong>Téléphone:</strong> ${req.body.phone || 'Non fourni'}</p>
      <p><strong>Sujet:</strong> ${req.body.subject}</p>
      <p><strong>Message:</strong></p>
      <p>${req.body.message}</p>
      <p><strong>Date:</strong> ${new Date().toLocaleString('fr-FR')}</p>
    `;

    console.log('Tentative d\'envoi d\'email à rh.bhbank.tn@gmail.com');
    // Envoyer l'email à l'adresse spécifiée
    try {
      await sendEmail({
        email: 'rh.bhbank.tn@gmail.com', // Adresse email fixe pour tous les messages de contact
        subject: `Nouveau message de contact: ${req.body.subject}`,
        message: emailContent
      });
      console.log('Email envoyé avec succès');
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi de l\'email:', emailError);
      // On continue malgré l'erreur d'envoi d'email
    }

    res.status(201).json({
      success: true,
      data: contact
    });
  } catch (err) {
    console.error('Erreur lors de la soumission du formulaire de contact:', err);
    if (err.name === 'SequelizeValidationError') {
      const messages = err.errors.map(e => e.message);

      return res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Erreur serveur'
      });
    }
  }
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private
exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.findAll({
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (err) {
    console.error('Erreur lors de la récupération des messages de contact:', err);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
};

// @desc    Get single contact message
// @route   GET /api/contact/:id
// @access  Private
exports.getContact = async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Message non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
};

// @desc    Mark contact as read
// @route   PUT /api/contact/:id/read
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Message non trouvé'
      });
    }

    contact.read = true;
    await contact.save();

    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
};

// @desc    Delete contact message
// @route   DELETE /api/contact/:id
// @access  Private
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Message non trouvé'
      });
    }

    await contact.destroy();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
};