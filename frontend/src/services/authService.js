import apiClient from './apiClient';

export const authService = {
  // Iniciar sesión
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  // Registrar usuario
  register: async (userData) => {
    const response = await apiClient.post('/auth/registro', userData);
    return response.data;
  },

  // Cerrar sesión
  logout: () => {
    localStorage.removeItem('token');
  },

  // Obtener perfil del usuario actual
  getProfile: async () => {
    const response = await apiClient.get('/auth/perfil');
    return response.data;
  },

  // Actualizar perfil
  updateProfile: async (userData) => {
    const response = await apiClient.put('/auth/perfil', userData);
    return response.data;
  },

  // Verificar si hay token guardado
  isLoggedIn: () => {
    return !!localStorage.getItem('token');
  },
};

export default authService;




















