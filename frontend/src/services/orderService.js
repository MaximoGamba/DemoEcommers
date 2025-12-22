import apiClient from './apiClient';

// ID del usuario demo para el checkout sin autenticación
const DEMO_USER_ID = 1;

const getAuthHeaders = () => {
  const userId = localStorage.getItem('userId') || DEMO_USER_ID;
  return {
    'Content-Type': 'application/json',
    'X-User-Id': userId,
  };
};

export const orderService = {
  /**
   * Crea un nuevo pedido a partir del carrito
   * @param {Object} orderData - Datos del pedido (dirección, método de pago, etc.)
   */
  createOrder: async (orderData) => {
    const response = await apiClient.post('/pedidos', orderData, { 
      headers: getAuthHeaders() 
    });
    return response.data.data;
  },

  /**
   * Obtiene todos los pedidos del usuario
   */
  getOrders: async () => {
    const response = await apiClient.get('/pedidos/lista', { 
      headers: getAuthHeaders() 
    });
    return response.data.data;
  },

  /**
   * Obtiene un pedido por su ID
   * @param {number} orderId - ID del pedido
   */
  getOrderById: async (orderId) => {
    const response = await apiClient.get(`/pedidos/${orderId}`, { 
      headers: getAuthHeaders() 
    });
    return response.data.data;
  },

  /**
   * Obtiene un pedido por su número
   * @param {string} orderNumber - Número del pedido (ej: PED-20251215-00001)
   */
  getOrderByNumber: async (orderNumber) => {
    const response = await apiClient.get(`/pedidos/numero/${orderNumber}`, { 
      headers: getAuthHeaders() 
    });
    return response.data.data;
  },

  /**
   * Cancela un pedido
   * @param {number} orderId - ID del pedido a cancelar
   */
  cancelOrder: async (orderId) => {
    const response = await apiClient.put(`/pedidos/${orderId}/cancelar`, {}, { 
      headers: getAuthHeaders() 
    });
    return response.data.data;
  },
};

export default orderService;
