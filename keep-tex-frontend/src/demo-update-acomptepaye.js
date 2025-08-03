/**
 * Ce script est une démonstration de l'utilisation de la méthode updateAcomptePaye
 * depuis le frontend. Il n'est pas destiné à être exécuté directement, mais sert
 * d'exemple pour montrer comment utiliser la méthode dans une application React.
 */

import commandeService from './services/commandeService';

// Exemple d'utilisation dans un composant React
const DemoUpdateAcomptePaye = () => {
  // Fonction pour mettre à jour le statut de paiement de l'acompte
  const updateAcomptePaye = async (commandeId, newValue) => {
    try {
      // Récupérer le token d'authentification
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Utilisateur non authentifié');
        return;
      }

      // Appeler le service pour mettre à jour l'acomptepaye
      const response = await commandeService.updateAcomptePaye(commandeId, newValue, token);
      
      console.log('Mise à jour réussie:', response);
      return response;
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      throw error;
    }
  };

  // Exemple d'utilisation pour mettre à jour l'acomptepaye à true
  const markAcompteAsPaid = async (commandeId) => {
    try {
      const result = await updateAcomptePaye(commandeId, true);
      console.log(`L'acompte de la commande ${commandeId} a été marqué comme payé:`, result);
      // Mettre à jour l'interface utilisateur ici
    } catch (error) {
      // Gérer l'erreur ici
    }
  };

  // Exemple d'utilisation pour mettre à jour l'acomptepaye à false
  const markAcompteAsUnpaid = async (commandeId) => {
    try {
      const result = await updateAcomptePaye(commandeId, false);
      console.log(`L'acompte de la commande ${commandeId} a été marqué comme non payé:`, result);
      // Mettre à jour l'interface utilisateur ici
    } catch (error) {
      // Gérer l'erreur ici
    }
  };

  return (
    <div>
      <h1>Démonstration de la mise à jour du statut de paiement de l'acompte</h1>
      <p>Voir la console pour les résultats</p>
      
      {/* Boutons pour tester les fonctions */}
      <button onClick={() => markAcompteAsPaid(6)}>Marquer l'acompte de la commande 6 comme payé</button>
      <button onClick={() => markAcompteAsUnpaid(6)}>Marquer l'acompte de la commande 6 comme non payé</button>
    </div>
  );
};

export default DemoUpdateAcomptePaye;