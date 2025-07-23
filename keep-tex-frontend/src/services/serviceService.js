import api from './api';

const serviceService = {
  // Get all services
  getServices: async () => {
    const response = await api.get('/services');
    return response.data;
  },

  // Get a single service by ID
  getService: async (id) => {
    const response = await api.get(`/services/${id}`);
    return response.data;
  },

  // Create a new service (admin only)
  createService: async (serviceData) => {
    const response = await api.post('/services', serviceData);
    return response.data;
  },

  // Update a service (admin only)
  updateService: async (id, serviceData) => {
    const response = await api.put(`/services/${id}`, serviceData);
    return response.data;
  },

  // Delete a service (admin only)
  deleteService: async (id) => {
    const response = await api.delete(`/services/${id}`);
    return response.data;
  },
};

export default serviceService;