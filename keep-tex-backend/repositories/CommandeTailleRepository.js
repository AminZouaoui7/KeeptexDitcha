const { CommandeTaille } = require('../models/customModels');

class CommandeTailleRepository {
  async create(tailleData, options = {}) {
    return await CommandeTaille.create(tailleData, options);
  }

  async bulkCreate(taillesData, options = {}) {
    return await CommandeTaille.bulkCreate(taillesData, options);
  }

  async findById(id) {
    return await CommandeTaille.findByPk(id);
  }

  async findByCommandeId(commandeId) {
    return await CommandeTaille.findAll({ where: { commande_id: commandeId } });
  }

  async update(id, updateData, options = {}) {
    const taille = await CommandeTaille.findByPk(id);
    if (!taille) return null;
    return await taille.update(updateData, options);
  }

  async delete(id, options = {}) {
    const taille = await CommandeTaille.findByPk(id);
    if (!taille) return null;
    await taille.destroy(options);
    return true;
  }

  async deleteByCommandeId(commandeId, options = {}) {
    return await CommandeTaille.destroy({
      where: { commande_id: commandeId },
      ...options
    });
  }
}

module.exports = new CommandeTailleRepository();