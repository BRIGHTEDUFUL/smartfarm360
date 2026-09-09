import axios from 'axios';

// Use environment variable or relative path for API calls
// In production (unified build), use relative path
// In development, use proxy or full URL
const PROD_API_URL = 'https://smart-farming-360.onrender.com/api';
const isProductionDomain = typeof window !== 'undefined' && 
  (window.location.hostname.includes('pages.dev') || window.location.hostname.includes('onrender.com'));
const API_URL = import.meta.env.VITE_API_URL || (isProductionDomain ? PROD_API_URL : '/api');

console.log('API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken } = response.data.data;
          localStorage.setItem('accessToken', accessToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  logout: (refreshToken: string) => api.post('/auth/logout', { refreshToken }),
};

// Products API
export const productsAPI = {
  getAll: (params?: any) => api.get('/products', { params }),
  getById: (id: number) => api.get(`/products/${id}`),
  create: (data: any) => {
    // Handle FormData for file uploads
    if (data instanceof FormData) {
      return api.post('/products', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    return api.post('/products', data);
  },
  update: (id: number, data: any) => {
    // Handle FormData for file uploads
    if (data instanceof FormData) {
      return api.put(`/products/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    return api.put(`/products/${id}`, data);
  },
  delete: (id: number) => api.delete(`/products/${id}`),
  approve: (id: number) => api.put(`/products/${id}/approve`),
  reject: (id: number, reason: string) => api.put(`/products/${id}/reject`, { reason }),
};

// Cart API
export const cartAPI = {
  get: () => api.get('/cart'),
  add: (product_id: number, quantity: number) => api.post('/cart', { product_id, quantity }),
  update: (productId: number, quantity: number) => api.put(`/cart/${productId}`, { quantity }),
  remove: (productId: number) => api.delete(`/cart/${productId}`),
  clear: () => api.delete('/cart'),
};

// Orders API
export const ordersAPI = {
  create: (data: any) => api.post('/orders', data),
  getAll: () => api.get('/orders'),
  getById: (id: number) => api.get(`/orders/${id}`),
  updateStatus: (id: number, status: string) => api.put(`/orders/${id}/status`, { status }),
  cancel: (id: number) => api.put(`/orders/${id}/cancel`),
};

// Users API
export const usersAPI = {
  getAll: (params?: any) => api.get('/users', { params }),
  create: (data: any) => api.post('/users', data),
  update: (id: number, data: any) => api.put(`/users/${id}`, data),
  delete: (id: number) => api.delete(`/users/${id}`),
};

// Audit Logs API
export const auditAPI = {
  getAll: (params?: any) => api.get('/audit-logs', { params }),
};

// Community API
export const communityAPI = {
  getPosts: (params?: any) => api.get('/community/posts', { params }),
  getPost: (id: number) => api.get(`/community/posts/${id}`),
  createPost: (data: any) => api.post('/community/posts', data),
  deletePost: (id: number) => api.delete(`/community/posts/${id}`),
  getReplies: (postId: number) => api.get(`/community/posts/${postId}/replies`),
  createReply: (postId: number, content: string) => api.post(`/community/posts/${postId}/replies`, { content }),
  toggleLike: (postId: number, targetType = 'post', targetId?: number) =>
    api.post(`/community/posts/${postId}/like`, { targetType, targetId }),
  pinPost: (postId: number, pin = true) => api.put(`/community/posts/${postId}/pin`, { pin }),
  getOfficers: () => api.get('/community/officers'),
  getFarmers: () => api.get('/community/farmers'),
};

// Messages API
export const messagesAPI = {
  getConversations: () => api.get('/messages'),
  getMessages: (partnerId: number, params?: any) => api.get(`/messages/${partnerId}`, { params }),
  sendMessage: (partnerId: number, content: string) => api.post(`/messages/${partnerId}`, { content }),
  markRead: (partnerId: number) => api.put(`/messages/${partnerId}/read`),
  getUnreadCount: () => api.get('/messages/unread-count'),
};

// Connections API
export const connectionsAPI = {
  getConnections: () => api.get('/connections'),
  getPending: () => api.get('/connections/pending'),
  sendRequest: (userId: number) => api.post(`/connections/${userId}`),
  respond: (connectionId: number, action: 'Accept' | 'Decline') => api.put(`/connections/${connectionId}`, { action }),
};

// Weather API
export const weatherAPI = {
  get: (params?: { lat?: number; lon?: number; region?: string }) => api.get('/weather', { params }),
  getRegions: () => api.get('/weather/regions'),
  getAlerts: (params?: { lat?: number; lon?: number; region?: string }) => api.get('/weather/alerts', { params }),
};

// Irrigation API
export const irrigationAPI = {
  getSchedules: () => api.get('/irrigation/schedules'),
  createSchedule: (data: any) => api.post('/irrigation/schedules', data),
  updateSchedule: (id: number, data: any) => api.put(`/irrigation/schedules/${id}`, data),
  deleteSchedule: (id: number) => api.delete(`/irrigation/schedules/${id}`),
  logWatering: (id: number | null, data: any) =>
    id ? api.post(`/irrigation/schedules/${id}/log`, data) : api.post('/irrigation/log/manual', data),
  getLogs: (params?: any) => api.get('/irrigation/logs', { params }),
  getDue: () => api.get('/irrigation/due'),
};
