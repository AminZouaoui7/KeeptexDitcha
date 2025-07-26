const {
  adminService,
  clientService,
  employeeService,
  commandeService,
  produitService,
  feedbackService
} = require('../services/adminService');

// Admin Controllers
exports.createAdmin = async (req, res) => {
  try {
    const admin = await adminService.createAdmin(req.body);
    res.status(201).json({ success: true, data: admin });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAdminById = async (req, res) => {
  try {
    const admin = await adminService.getAdminById(req.params.id);
    if (!admin) {
      return res.status(404).json({ success: false, error: 'Admin not found' });
    }
    res.status(200).json({ success: true, data: admin });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await adminService.getAllAdmins();
    res.status(200).json({ success: true, data: admins });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateAdmin = async (req, res) => {
  try {
    const updatedAdmin = await adminService.updateAdmin(req.params.id, req.body);
    if (!updatedAdmin) {
      return res.status(404).json({ success: false, error: 'Admin not found' });
    }
    res.status(200).json({ success: true, data: updatedAdmin });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const deleted = await adminService.deleteAdmin(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Admin not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Client Controllers
exports.createClient = async (req, res) => {
  try {
    const client = await clientService.createClient(req.body);
    res.status(201).json({ success: true, data: client });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getClientById = async (req, res) => {
  try {
    const client = await clientService.getClientById(req.params.id);
    if (!client) {
      return res.status(404).json({ success: false, error: 'Client not found' });
    }
    res.status(200).json({ success: true, data: client });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAllClients = async (req, res) => {
  try {
    const clients = await clientService.getAllClients();
    res.status(200).json({ success: true, data: clients });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateClient = async (req, res) => {
  try {
    const updatedClient = await clientService.updateClient(req.params.id, req.body);
    if (!updatedClient) {
      return res.status(404).json({ success: false, error: 'Client not found' });
    }
    res.status(200).json({ success: true, data: updatedClient });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteClient = async (req, res) => {
  try {
    const deleted = await clientService.deleteClient(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Client not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Employee Controllers
exports.createEmployee = async (req, res) => {
  try {
    const employee = await employeeService.createEmployee(req.body);
    res.status(201).json({ success: true, data: employee });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await employeeService.getEmployeeById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, error: 'Employee not found' });
    }
    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await employeeService.getAllEmployees();
    res.status(200).json({ success: true, data: employees });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const updatedEmployee = await employeeService.updateEmployee(req.params.id, req.body);
    if (!updatedEmployee) {
      return res.status(404).json({ success: false, error: 'Employee not found' });
    }
    res.status(200).json({ success: true, data: updatedEmployee });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const deleted = await employeeService.deleteEmployee(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Employee not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Commande Controllers
exports.createCommande = async (req, res) => {
  try {
    const commande = await commandeService.createCommande(req.body);
    res.status(201).json({ success: true, data: commande });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getCommandeById = async (req, res) => {
  try {
    const commande = await commandeService.getCommandeById(req.params.id);
    if (!commande) {
      return res.status(404).json({ success: false, error: 'Commande not found' });
    }
    res.status(200).json({ success: true, data: commande });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAllCommandes = async (req, res) => {
  try {
    const commandes = await commandeService.getAllCommandes();
    res.status(200).json({ success: true, data: commandes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateCommande = async (req, res) => {
  try {
    const updatedCommande = await commandeService.updateCommande(req.params.id, req.body);
    if (!updatedCommande) {
      return res.status(404).json({ success: false, error: 'Commande not found' });
    }
    res.status(200).json({ success: true, data: updatedCommande });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteCommande = async (req, res) => {
  try {
    const deleted = await commandeService.deleteCommande(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Commande not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Produit Controllers
exports.createProduit = async (req, res) => {
  try {
    const produit = await produitService.createProduit(req.body);
    res.status(201).json({ success: true, data: produit });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getProduitById = async (req, res) => {
  try {
    const produit = await produitService.getProduitById(req.params.id);
    if (!produit) {
      return res.status(404).json({ success: false, error: 'Produit not found' });
    }
    res.status(200).json({ success: true, data: produit });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAllProduits = async (req, res) => {
  try {
    const produits = await produitService.getAllProduits();
    res.status(200).json({ success: true, data: produits });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateProduit = async (req, res) => {
  try {
    const updatedProduit = await produitService.updateProduit(req.params.id, req.body);
    if (!updatedProduit) {
      return res.status(404).json({ success: false, error: 'Produit not found' });
    }
    res.status(200).json({ success: true, data: updatedProduit });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteProduit = async (req, res) => {
  try {
    const deleted = await produitService.deleteProduit(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Produit not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Feedback Controllers
exports.createFeedback = async (req, res) => {
  try {
    const feedback = await feedbackService.createFeedback(req.body);
    res.status(201).json({ success: true, data: feedback });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getFeedbackById = async (req, res) => {
  try {
    const feedback = await feedbackService.getFeedbackById(req.params.idclient);
    if (!feedback) {
      return res.status(404).json({ success: false, error: 'Feedback not found' });
    }
    res.status(200).json({ success: true, data: feedback });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await feedbackService.getAllFeedbacks();
    res.status(200).json({ success: true, data: feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateFeedback = async (req, res) => {
  try {
    const updatedFeedback = await feedbackService.updateFeedback(req.params.idclient, req.body);
    if (!updatedFeedback) {
      return res.status(404).json({ success: false, error: 'Feedback not found' });
    }
    res.status(200).json({ success: true, data: updatedFeedback });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteFeedback = async (req, res) => {
  try {
    const deleted = await feedbackService.deleteFeedback(req.params.idclient);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Feedback not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};