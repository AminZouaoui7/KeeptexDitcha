import api from './api';

const contactService = {
  // Submit a contact form
  submitContact: async (contactData) => {
    const response = await api.post('/contact', contactData);
    return response.data;
  },

  // Get all contact messages (admin only)
  getContacts: async () => {
    const response = await api.get('/contact');
    return response.data;
  },

  // Get a single contact message by ID (admin only)
  getContact: async (id) => {
    const response = await api.get(`/contact/${id}`);
    return response.data;
  },

  // Mark a contact message as read (admin only)
  markAsRead: async (id) => {
    const response = await api.put(`/contact/${id}/read`);
    return response.data;
  },

  // Delete a contact message (admin only)
  deleteContact: async (id) => {
    const response = await api.delete(`/contact/${id}`);
    return response.data;
  },
};

export default contactService;