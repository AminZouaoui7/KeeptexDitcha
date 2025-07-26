const commandeRepository = require('../repositories/CommandeRepository');

class CommandeService {
  async createCommande(commandeData) {
    return await commandeRepository.create(commandeData);
  }

  async getCommandeById(id) {
    return await commandeRepository.findById(id);
  }

  async getAllCommandes() {
    return await commandeRepository.findAll();
  }

  async updateCommande(id, updateData) {
    return await commandeRepository.update(id, updateData);
  }

  async deleteCommande(id) {
    return await commandeRepository.delete(id);
  }
}

module.exports = new CommandeService();