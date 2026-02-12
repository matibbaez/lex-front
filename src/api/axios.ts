import axios from 'axios';

const api = axios.create({
  // 1. LA MAGIA: Usamos la variable de entorno de Vercel.
  // Si no existe (estás en local), usa localhost PERO CON /api AL FINAL.
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api', 
  
  withCredentials: true // 2. IMPORTANTE: Para que las cookies y CORS viajen bien
});

// --- INTERCEPTOR DE PETICIÓN ---
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// --- INTERCEPTOR DE RESPUESTA ---
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Solo redireccionamos si no estamos ya en el login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;