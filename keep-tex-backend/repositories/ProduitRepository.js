const { Produit } = require('../models/customModels');

class ProduitRepository {
  async create(produitData) {
    return await Produit.create(produitData);
  }

  async findById(id) {
    return await Produit.findByPk(id);
  }

  async findAll() {
    return await Produit.findAll();
  }

  async update(id, updateData) {
    const produit = await Produit.findByPk(id);
    if (!produit) return null;
    return await produit.update(updateData);
  }

  async delete(id) {
    const produit = await Produit.findByPk(id);
    if (!produit) return null;
    await produit.destroy();
    return true;
  }
}

module.exports = new ProduitRepository();