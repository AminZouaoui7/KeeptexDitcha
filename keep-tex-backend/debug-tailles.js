// Script pour déboguer le traitement des tailles dans le backend
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

// Créer une application Express minimale pour tester
const app = express();

// Configurer multer comme dans le projet principal
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Erreur: Images uniquement!', false);
    }
  }
});

// Configurer les middlewares comme dans le projet principal
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route de test pour vérifier le parsing des tailles
app.post('/test-tailles', upload.single('logo'), (req, res) => {
  console.log('=== REQUÊTE REÇUE ===');
  console.log('Headers:', req.headers);
  console.log('Body brut:', req.body);
  
  // Vérifier si tailles existe et son format
  if (req.body.tailles) {
    console.log('Tailles (brut):', req.body.tailles);
    console.log('Type de tailles:', typeof req.body.tailles);
    
    try {
      // Essayer de parser les tailles si c'est une chaîne
      let taillesParsed;
      if (typeof req.body.tailles === 'string') {
        taillesParsed = JSON.parse(req.body.tailles);
        console.log('Tailles (parsées):', taillesParsed);
        console.log('Type après parsing:', typeof taillesParsed);
        console.log('Est un tableau?', Array.isArray(taillesParsed));
        
        if (Array.isArray(taillesParsed)) {
          console.log('Nombre d\'éléments:', taillesParsed.length);
          console.log('Premier élément:', taillesParsed[0]);
        }
      } else {
        console.log('Tailles n\'est pas une chaîne, pas besoin de parser');
      }
      
      res.status(200).json({
        success: true,
        message: 'Données reçues et analysées',
        tailles: req.body.tailles,
        taillesParsed: taillesParsed || null
      });
    } catch (error) {
      console.error('Erreur lors du parsing des tailles:', error);
      res.status(400).json({
        success: false,
        error: 'Erreur lors du parsing des tailles',
        message: error.message
      });
    }
  } else {
    console.log('Aucune taille trouvée dans la requête');
    res.status(400).json({
      success: false,
      error: 'Aucune taille trouvée dans la requête'
    });
  }
});

// Démarrer le serveur
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Serveur de débogage démarré sur le port ${PORT}`);
  console.log(`Testez avec: http://localhost:${PORT}/test-tailles`);
});