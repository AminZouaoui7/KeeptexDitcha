const commandeRepository = require('../repositories/CommandeRepository');
const commandeTailleService = require('./CommandeTailleService');
const sequelize = require('../sequelize');

class CommandeService {
  async createCommande(commandeData) {
    const transaction = await sequelize.transaction();
    
    try {
      // Extraire les tailles de la commande
      const { tailles, ...commandeInfo } = commandeData;
      
      // Créer la commande
      const commande = await commandeRepository.create(commandeInfo, { transaction });
      
      // Si des tailles sont fournies, les créer
      if (tailles && Array.isArray(tailles) && tailles.length > 0) {
        const taillesData = tailles.map(taille => ({
          commande_id: commande.id,
          taille: taille.taille,
          quantite: taille.quantite
        }));
        
        await commandeTailleService.bulkCreateCommandeTailles(taillesData, { transaction });
      }
      
      await transaction.commit();
      
      // Récupérer la commande avec ses tailles
      return await this.getCommandeById(commande.id);
    } catch (error) {
      await transaction.rollback();
      console.error('Erreur lors de la création de la commande:', error);
      throw error;
    }
  }

  async getCommandeById(id) {
    return await commandeRepository.findById(id);
  }

  async getAllCommandes() {
    return await commandeRepository.findAll();
  }
  
  async getCommandesByUserId(userId) {
    return await commandeRepository.findByUserId(userId);
  }

  async updateCommande(id, updateData) {
    const transaction = await sequelize.transaction();
    
    try {
      // Extraire les tailles de la commande
      const { tailles, ...commandeInfo } = updateData;
      
      // Mettre à jour la commande
      const updatedCommande = await commandeRepository.update(id, commandeInfo, { transaction });
      
      // Si des tailles sont fournies, mettre à jour les tailles
      if (tailles && Array.isArray(tailles) && tailles.length > 0) {
        // Supprimer les anciennes tailles
        await commandeTailleService.deleteCommandeTaillesByCommandeId(id, { transaction });
        
        // Créer les nouvelles tailles
        const taillesData = tailles.map(taille => ({
          commande_id: id,
          taille: taille.taille,
          quantite: taille.quantite
        }));
        
        await commandeTailleService.bulkCreateCommandeTailles(taillesData, { transaction });
      }
      
      await transaction.commit();
      
      // Récupérer la commande mise à jour avec ses tailles
      return await this.getCommandeById(id);
    } catch (error) {
      await transaction.rollback();
      console.error('Erreur lors de la mise à jour de la commande:', error);
      throw error;
    }
  }

  async deleteCommande(id) {
    const transaction = await sequelize.transaction();
    
    try {
      // Supprimer les tailles associées à la commande
      await commandeTailleService.deleteCommandeTaillesByCommandeId(id, { transaction });
      
      // Supprimer la commande
      const result = await commandeRepository.delete(id, { transaction });
      
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

module.exports = new CommandeService();