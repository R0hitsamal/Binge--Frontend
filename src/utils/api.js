import axios from 'axios';

const BASE_URL = 'https://binge-zbg9.onrender.com/';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token and fix FormData content-type
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('binge_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  
  // For FormData, let axios auto-set the Content-Type with boundary
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  
  return config;
});

// Handle 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('binge_token');
      localStorage.removeItem('binge_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ===== AUTH =====
export const authAPI = {
  login:    (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  profile:  ()     => api.get('/auth/profile'),
  getAll:   ()     => api.get('/auth/all'),
};

// ===== VIDEOS =====
export const videoAPI = {
  getAll:     (params) => api.get('/video/videos', { params }),
  getById:    (id)     => api.get(`/video/${id}`),
  upload:     (form, config) => api.post('/video/uploadVideo', form, config),
  delete:     (id)     => api.delete(`/video/${id}`),
  analytics:  ()      => api.get('/video/analytics/overview'),
};

// ===== COMMENTS =====
export const commentAPI = {
  get:    (videoId)          => api.get(`/comments/${videoId}/comments`),
  add:    (videoId, data)    => api.post(`/comments/${videoId}/newComment`, data),
  delete: (videoId, commentId) => api.delete(`/comments/${videoId}/deleteComment/${commentId}`),
};

// ===== WATCH HISTORY =====
export const historyAPI = {
  get:    ()       => api.get('/watchHistory/watchHistory'),
  add:    (videoId)=> api.get(`/watchHistory/${videoId}/addToWatchHistory`),
  remove: (videoId)=> api.delete(`/watchHistory/${videoId}/deleteFromWatchHistory`),
};

export default api;
