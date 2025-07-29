const { Commande, CommandeTaille } = require('../models/customModels');

class CommandeRepository {
  async create(commandeData, options = {}) {
    return await Commande.create(commandeData, options);
  }

  async findById(id) {
    return await Commande.findByPk(id, {
      include: [{ model: CommandeTaille, as: 'tailles' }]
    });
  }

  async findAll() {
    return await Commande.findAll({
      include: [{ model: CommandeTaille, as: 'tailles' }]
    });
  }
  
  async findByUserId(userId) {
    return await Commande.findAll({
      where: { userId },
      include: [{ model: CommandeTaille, as: 'tailles' }]
    });
  }

  async update(id, updateData, options = {}) {
    const commande = await Commande.findByPk(id);
    if (!commande) return null;
    return await commande.update(updateData, options);
  }

  async delete(id, options = {}) {
    const commande = await Commande.findByPk(id);
    if (!commande) return false;
    await commande.destroy(options);
    return true;
  }
}

module.exports = new CommandeRepository();