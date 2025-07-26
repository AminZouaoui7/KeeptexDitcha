const { Commande } = require('../models/customModels');

class CommandeRepository {
  async create(commandeData) {
    return await Commande.create(commandeData);
  }

  async findById(id) {
    return await Commande.findByPk(id);
  }

  async findAll() {
    return await Commande.findAll();
  }

  async update(id, updateData) {
    const commande = await Commande.findByPk(id);
    if (!commande) return null;
    return await commande.update(updateData);
  }

  async delete(id) {
    const commande = await Commande.findByPk(id);
    if (!commande) return null;
    await commande.destroy();
    return true;
  }
}

module.exports = new CommandeRepository();