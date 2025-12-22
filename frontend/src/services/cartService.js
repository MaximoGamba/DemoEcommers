import apiClient from './apiClient';

// ID del usuario demo para el checkout sin autenticación
const DEMO_USER_ID = 1;

/**
 * Genera o recupera el session ID para usuarios anónimos.
 * Se almacena en localStorage para persistir entre sesiones.
 */
const getSessionId = () => {
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
};

/**
 * Obtiene los headers necesarios para las peticiones del carrito.
 * Usa el usuario demo por defecto para la demo.
 */
const getCartHeaders = () => {
  const userId = localStorage.getItem('userId') || DEMO_USER_ID;
  const sessionId = getSessionId();
  
  return {
    'X-Session-Id': sessionId,
    'X-User-Id': userId
  };
};

/**
 * Servicio para gestionar el carrito de compras.
 */
export const cartService = {
  /**
   * Obtener el carrito actual
   * GET /api/carrito
   */
  getCart: async () => {
    const response = await apiClient.get('/carrito', {
      headers: getCartHeaders()
    });
    return response.data.data;
  },

  /**
   * Agregar un item al carrito
   * POST /api/carrito/items
   * @param {number} productoVarianteId - ID de la variante del producto
   * @param {number} cantidad - Cantidad a agregar
   */
  addItem: async (productoVarianteId, cantidad = 1) => {
    const response = await apiClient.post('/carrito/items', 
      { productoVarianteId, cantidad },
      { headers: getCartHeaders() }
    );
    return response.data.data;
  },

  /**
   * Actualizar cantidad de un item
   * PUT /api/carrito/items/{itemId}
   * @param {number} itemId - ID del item en el carrito
   * @param {number} cantidad - Nueva cantidad
   */
  updateItemQuantity: async (itemId, cantidad) => {
    const response = await apiClient.put(`/carrito/items/${itemId}`, 
      { cantidad },
      { headers: getCartHeaders() }
    );
    return response.data.data;
  },

  /**
   * Eliminar un item del carrito
   * DELETE /api/carrito/items/{itemId}
   * @param {number} itemId - ID del item a eliminar
   */
  removeItem: async (itemId) => {
    const response = await apiClient.delete(`/carrito/items/${itemId}`, {
      headers: getCartHeaders()
    });
    return response.data.data;
  },

  /**
   * Vaciar el carrito completo
   * DELETE /api/carrito
   */
  clearCart: async () => {
    const response = await apiClient.delete('/carrito', {
      headers: getCartHeaders()
    });
    return response.data.data;
  },

  /**
   * Transferir carrito anónimo a usuario autenticado
   * POST /api/carrito/transferir
   * @param {number} userId - ID del usuario
   */
  transferCart: async (userId) => {
    const sessionId = getSessionId();
    const response = await apiClient.post('/carrito/transferir', null, {
      headers: {
        'X-Session-Id': sessionId,
        'X-User-Id': userId
      }
    });
    return response.data.data;
  },

  /**
   * Obtener el session ID actual
   */
  getSessionId
};

export default cartService;

