const produitRepository = require('../repositories/ProduitRepository');

class ProduitService {
  async createProduit(produitData) {
    return await produitRepository.create(produitData);
  }

  async getProduitById(id) {
    return await produitRepository.findById(id);
  }

  async getAllProduits() {
    return await produitRepository.findAll();
  }

  async updateProduit(id, updateData) {
    return await produitRepository.update(id, updateData);
  }

  async deleteProduit(id) {
    return await produitRepository.delete(id);
  }
}

module.exports = new ProduitService();