const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Veuillez ajouter un nom de produit'],
    trim: true,
    maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
  },
  description: {
    type: String,
    required: [true, 'Veuillez ajouter une description'],
    maxlength: [2000, 'La description ne peut pas dépasser 2000 caractères']
  },
  category: {
    type: String,
    required: [true, 'Veuillez sélectionner une catégorie'],
    enum: [
      'Vêtements sur mesure',
      'Production en série',
      'Textile technique',
      'Accessoires'
    ]
  },
  images: [
    {
      type: String,
      required: [true, 'Veuillez ajouter au moins une image']
    }
  ],
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', ProductSchema);