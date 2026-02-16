import axios from 'axios';

// Create axios instance with base config
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Request interceptor — attach auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor — handle 401 (expired token)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;

/* ─── Auth API ─── */
export const authAPI = {
    register: (data) => api.post('/register', data),
    login: (data) => api.post('/login', data),
    logout: () => api.post('/logout'),
    getUser: () => api.get('/user'),
};

/* ─── Product API ─── */
export const productAPI = {
    getAll: (params) => api.get('/products', { params }),
    getById: (id) => api.get(`/products/${id}`),
    create: (data) => api.post('/admin/products', data),
    update: (id, data) => api.put(`/admin/products/${id}`, data),
    delete: (id) => api.delete(`/admin/products/${id}`),
};

/* ─── Category API ─── */
export const categoryAPI = {
    getAll: () => api.get('/categories'),
    create: (data) => api.post('/admin/categories', data),
    update: (id, data) => api.put(`/admin/categories/${id}`, data),
    delete: (id) => api.delete(`/admin/categories/${id}`),
};

/* ─── Order API ─── */
export const orderAPI = {
    create: (data) => api.post('/orders', data),
    getAll: () => api.get('/orders'),
    getById: (id) => api.get(`/orders/${id}`),
    // Admin
    adminGetAll: (params) => api.get('/admin/orders', { params }),
    adminUpdate: (id, data) => api.put(`/admin/orders/${id}`, data),
};

/* ─── Payment API ─── */
export const paymentAPI = {
    upload: (data) => api.post('/payments', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
    adminReview: (id, data) => api.put(`/admin/payments/${id}`, data),
};

/* ─── Favorites API ─── */
export const favoriteAPI = {
    getAll: () => api.get('/favorites'),
    add: (productId) => api.post('/favorites', { product_id: productId }),
    remove: (id) => api.delete(`/favorites/${id}`),
};

/* ─── Upload API ─── */
export const uploadAPI = {
    upload: (file) => {
        const formData = new FormData();
        formData.append('image', file);
        return api.post('/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
};

/* ─── Admin API ─── */
export const adminAPI = {
    getStats: () => api.get('/admin/stats'),
    getUsers: () => api.get('/admin/users'),
};
