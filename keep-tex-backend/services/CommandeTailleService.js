const commandeTailleRepository = require('../repositories/CommandeTailleRepository');

class CommandeTailleService {
  async createCommandeTaille(tailleData) {
    return await commandeTailleRepository.create(tailleData);
  }

  async bulkCreateCommandeTailles(taillesData, options = {}) {
    return await commandeTailleRepository.bulkCreate(taillesData, options);
  }

  async getCommandeTailleById(id) {
    return await commandeTailleRepository.findById(id);
  }

  async getCommandeTaillesByCommandeId(commandeId) {
    return await commandeTailleRepository.findByCommandeId(commandeId);
  }

  async updateCommandeTaille(id, updateData) {
    return await commandeTailleRepository.update(id, updateData);
  }

  async deleteCommandeTaille(id) {
    return await commandeTailleRepository.delete(id);
  }

  async deleteCommandeTaillesByCommandeId(commandeId, options = {}) {
    return await commandeTailleRepository.deleteByCommandeId(commandeId, options);
  }
}

module.exports = new CommandeTailleService();