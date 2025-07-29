const commandeService = require('./services/CommandeService');

async function testService() {
  try {
    // Données de test avec tailles déjà sous forme de tableau
    const commandeData = {
      type: 'test',
      quantite_totale: 30,
      prix_total: 100,
      userId: '123e4567-e89b-12d3-a456-426614174000', // UUID valide
      tailles: [
        { taille: 'S', quantite: 5 },
        { taille: 'M', quantite: 10 },
        { taille: 'L', quantite: 15 }
      ]
    };

    console.log('Démarrage du test du service...');
    console.log('Type de tailles:', typeof commandeData.tailles);
    console.log('Est-ce que tailles est un tableau?', Array.isArray(commandeData.tailles));
    console.log('Contenu de tailles:', JSON.stringify(commandeData.tailles));

    // Appel direct au service
    const commande = await commandeService.createCommande(commandeData);
    console.log('Commande créée avec succès:', commande);
  } catch (error) {
    console.error('Erreur lors du test du service:', error);
  }
}

testService();