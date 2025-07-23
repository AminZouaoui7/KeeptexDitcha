const express = require('express');
const path = require('path');
const upload = require('../middleware/upload');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Upload image
// @route   POST /api/upload
// @access  Private
router.post('/', protect, authorize('admin'), upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Veuillez télécharger un fichier'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        fileName: req.file.filename,
        filePath: `/uploads/${req.file.filename}`
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
});

// @desc    Upload multiple images
// @route   POST /api/upload/multiple
// @access  Private
router.post(
  '/multiple',
  protect,
  authorize('admin'),
  upload.array('images', 5),
  (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Veuillez télécharger au moins un fichier'
        });
      }

      const fileData = req.files.map(file => ({
        fileName: file.filename,
        filePath: `/uploads/${file.filename}`
      }));

      res.status(200).json({
        success: true,
        count: fileData.length,
        data: fileData
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: 'Erreur serveur'
      });
    }
  }
);

module.exports = router;