import api from './api';

const uploadService = {
  // Upload a single image
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },
  
  // Upload multiple images
  uploadMultipleImages: async (files) => {
    const formData = new FormData();
    
    files.forEach((file) => {
      formData.append('images', file);
    });
    
    const response = await api.post('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },
};

export default uploadService;