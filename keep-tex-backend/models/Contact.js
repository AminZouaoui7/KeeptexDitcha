const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Veuillez ajouter votre nom'],
    trim: true,
    maxlength: [50, 'Le nom ne peut pas dépasser 50 caractères']
  },
  email: {
    type: String,
    required: [true, 'Veuillez ajouter votre email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Veuillez ajouter un email valide'
    ]
  },
  phone: {
    type: String,
    required: false, // Rendre le téléphone optionnel
    maxlength: [20, 'Le numéro de téléphone ne peut pas dépasser 20 caractères']
  },
  subject: {
    type: String,
    required: [true, 'Veuillez ajouter un sujet'],
    maxlength: [100, 'Le sujet ne peut pas dépasser 100 caractères']
  },
  message: {
    type: String,
    required: [true, 'Veuillez ajouter un message'],
    maxlength: [1000, 'Le message ne peut pas dépasser 1000 caractères']
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Contact', ContactSchema);