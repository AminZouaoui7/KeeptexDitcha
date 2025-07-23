const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Veuillez ajouter un titre de service'],
    trim: true,
    maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères']
  },
  description: {
    type: String,
    required: [true, 'Veuillez ajouter une description'],
    maxlength: [2000, 'La description ne peut pas dépasser 2000 caractères']
  },
  icon: {
    type: String,
    default: 'default-icon.png'
  },
  image: {
    type: String,
    required: [true, 'Veuillez ajouter une image']
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Service', ServiceSchema);