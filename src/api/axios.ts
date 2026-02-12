import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // Chequeá que sea tu URL
});

// --- INTERCEPTOR DE PETICIÓN ---
// Esto mete el token en el sobre ANTES de enviarlo
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
// Si el servidor nos dice que el token no va más, limpiamos y al login
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