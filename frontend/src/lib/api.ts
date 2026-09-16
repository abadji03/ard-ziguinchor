import axios from 'axios';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== 'undefined' ? '/api' : 'http://127.0.0.1:3000/api');

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  // Pas de Content-Type par défaut : axios le détermine selon la requête
  // (application/json pour les objets, multipart/form-data + boundary pour les FormData).
  // Un Content-Type par défaut casserait l'upload de fichiers (FormData).
});

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Intercepteur de réponse pour gérer les erreurs globales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default api;
