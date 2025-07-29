const commandeController = require('./controllers/commandeController');

// Simuler une requête avec des tailles sous forme de chaîne JSON
const req = {
  user: { 
    id: '123e4567-e89b-12d3-a456-426614174000', 
    role: 'admin' 
  },
  body: {
    type: 'test',
    quantite_totale: 30,
    prix_total: 100,
    tailles: JSON.stringify([
      { taille: 'S', quantite: 5 },
      { taille: 'M', quantite: 10 },
      { taille: 'L', quantite: 15 }
    ])
  }
};

// Simuler une réponse
const res = {
  status: function(statusCode) {
    console.log('Status:', statusCode);
    return this;
  },
  json: function(data) {
    console.log('Response data:', data);
    return this;
  }
};

// Ajouter des logs pour déboguer
console.log('Démarrage du test de debug...');
console.log('Tailles avant parsing:', req.body.tailles);
console.log('Type de tailles:', typeof req.body.tailles);

// Modifier le corps de la requête pour ajouter des logs après le parsing
const originalCreateCommande = commandeController.createCommande;
commandeController.createCommande = async function(req, res) {
  // Parser le champ tailles s'il est une chaîne JSON
  if (typeof req.body.tailles === 'string') {
    try {
      req.body.tailles = JSON.parse(req.body.tailles);
      console.log('Tailles après parsing:', req.body.tailles);
      console.log('Type de tailles après parsing:', typeof req.body.tailles);
      console.log('Est-ce que tailles est un tableau?', Array.isArray(req.body.tailles));
    } catch (error) {
      console.error('Erreur lors du parsing des tailles:', error.message);
    }
  }
  
  // Appeler la fonction originale
  return originalCreateCommande(req, res);
};

// Exécuter la fonction createCommande
commandeController.createCommande(req, res)
  .then(() => {
    console.log('Test terminé avec succès');
  })
  .catch(error => {
    console.error('Erreur lors du test:', error);
  });