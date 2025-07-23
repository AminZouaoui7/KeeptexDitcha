import api from './api';

const productService = {
  // Get all products
  getProducts: async (category = '') => {
    const url = category ? `/products?category=${category}` : '/products';
    const response = await api.get(url);
    return response.data;
  },

  // Get a single product by ID
  getProduct: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Get featured products
  getFeaturedProducts: async () => {
    const response = await api.get('/products/featured');
    return response.data;
  },

  // Create a new product (admin only)
  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  // Update a product (admin only)
  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  // Delete a product (admin only)
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};

export default productService;