import axios from 'axios';

// URL base del backend Spring Boot
// En desarrollo usa localhost, en producción usa la URL de tu backend desplegado
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Crear instancia de axios con configuración base
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos
});

// Interceptor para agregar token de autenticación a las requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
apiClient.interceptors.response.use(
  (response) => {
    // El backend devuelve { success, message, data }
    // Extraemos directamente el data para simplificar el uso
    return response;
  },
  (error) => {
    // Manejar errores comunes
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Token expirado o inválido
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          console.error('No tienes permisos para esta acción');
          break;
        case 404:
          console.error('Recurso no encontrado');
          break;
        case 500:
          console.error('Error interno del servidor');
          break;
        default:
          console.error('Error en la petición:', error.response.data?.message);
      }
    } else if (error.request) {
      console.error('No se pudo conectar con el servidor');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
