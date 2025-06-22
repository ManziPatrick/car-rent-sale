import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (userData) => api.post('/users/register', userData),
  login: (credentials) => api.post('/users/login', credentials),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  changePassword: (passwordData) => api.put('/users/change-password', passwordData),
};

// Cars API
export const carsAPI = {
  getAll: (params) => api.get('/cars', { params }),
  getById: (id) => api.get(`/cars/${id}`),
  create: (carData) => api.post('/cars', carData),
  update: (id, carData) => api.put(`/cars/${id}`, carData),
  delete: (id) => api.delete(`/cars/${id}`),
};

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (categoryData) => api.post('/categories', categoryData),
  update: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Orders API
export const ordersAPI = {
  getAll: (params) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  getUserOrders: () => api.get('/orders/my'),
  create: (orderData) => api.post('/orders', orderData),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  bulkUpdateStatus: (orderIds, status) => api.put('/orders/bulk-status', { orderIds, status }),
  delete: (id) => api.delete(`/orders/${id}`),
  generateContract: (id, contractText) => api.post(`/orders/${id}/contract`, { contractText }),
  approveContract: (id) => api.put(`/orders/${id}/approve-contract`),
};

// Users API (Admin)
export const usersAPI = {
  getAll: (params) => api.get('/users', { params }),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
};

// Admin API
export const adminAPI = {
  // Dashboard
  getStats: () => api.get('/admin/stats'),
  
  // Email Templates
  getEmailTemplates: () => api.get('/admin/email-templates'),
  createEmailTemplate: (templateData) => api.post('/admin/email-templates', templateData),
  updateEmailTemplate: (id, templateData) => api.put(`/admin/email-templates/${id}`, templateData),
  deleteEmailTemplate: (id) => api.delete(`/admin/email-templates/${id}`),
  
  // Notifications
  getNotifications: () => api.get('/admin/notifications'),
  sendTestEmail: (templateId) => api.post(`/admin/send-test-email/${templateId}`),
  sendBulkEmail: (templateId) => api.post(`/admin/send-bulk-email/${templateId}`),
  
  // User Management
  updateUser: (id, userData) => api.put(`/admin/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
};

export default api; 