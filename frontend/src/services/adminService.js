import apiClient from './apiClient';

/**
 * Servicio para funcionalidades de administración
 */
export const adminService = {
  // ==================== PRODUCTOS ====================

  /**
   * Obtiene todos los productos (incluyendo inactivos)
   */
  getAllProducts: async () => {
    const response = await apiClient.get('/admin/productos');
    return response.data.data;
  },

  /**
   * Obtiene un producto por ID con todas sus variantes
   */
  getProductById: async (id) => {
    const response = await apiClient.get(`/admin/productos/${id}`);
    return response.data.data;
  },

  /**
   * Crea un nuevo producto
   */
  createProduct: async (productData) => {
    const response = await apiClient.post('/admin/productos', productData);
    return response.data.data;
  },

  /**
   * Actualiza un producto
   */
  updateProduct: async (id, productData) => {
    const response = await apiClient.put(`/admin/productos/${id}`, productData);
    return response.data.data;
  },

  /**
   * Elimina (desactiva) un producto
   */
  deleteProduct: async (id) => {
    const response = await apiClient.delete(`/admin/productos/${id}`);
    return response.data;
  },

  /**
   * Obtiene las variantes de un producto
   */
  getProductVariants: async (productId) => {
    const response = await apiClient.get(`/admin/productos/${productId}/variantes`);
    return response.data.data;
  },

  /**
   * Agrega una variante a un producto
   */
  addVariant: async (productId, variantData) => {
    const response = await apiClient.post(`/admin/productos/${productId}/variantes`, variantData);
    return response.data.data;
  },

  /**
   * Actualiza una variante
   */
  updateVariant: async (variantId, variantData) => {
    const response = await apiClient.put(`/admin/variantes/${variantId}`, variantData);
    return response.data.data;
  },

  // ==================== PEDIDOS ====================

  /**
   * Obtiene todos los pedidos con paginación
   */
  getAllOrders: async (params = {}) => {
    const response = await apiClient.get('/admin/pedidos', { params });
    return response.data.data;
  },

  /**
   * Obtiene pedidos por estado
   */
  getOrdersByStatus: async (estado, params = {}) => {
    const response = await apiClient.get('/admin/pedidos', { 
      params: { estado, ...params } 
    });
    return response.data.data;
  },

  /**
   * Obtiene pedidos pendientes
   */
  getPendingOrders: async () => {
    const response = await apiClient.get('/admin/pedidos/pendientes');
    return response.data.data;
  },

  /**
   * Obtiene los últimos pedidos
   */
  getRecentOrders: async () => {
    const response = await apiClient.get('/admin/pedidos/recientes');
    return response.data.data;
  },

  /**
   * Obtiene un pedido por ID
   */
  getOrderById: async (id) => {
    const response = await apiClient.get(`/admin/pedidos/${id}`);
    return response.data.data;
  },

  /**
   * Obtiene estadísticas de pedidos
   */
  getOrderStats: async () => {
    const response = await apiClient.get('/admin/pedidos/estadisticas');
    return response.data.data;
  },

  /**
   * Cambia el estado de un pedido
   */
  changeOrderStatus: async (id, nuevoEstado) => {
    const response = await apiClient.put(`/admin/pedidos/${id}/estado`, { nuevoEstado });
    return response.data.data;
  },

  // Acciones rápidas
  confirmOrder: async (id) => {
    const response = await apiClient.put(`/admin/pedidos/${id}/confirmar`);
    return response.data.data;
  },

  markAsPaid: async (id) => {
    const response = await apiClient.put(`/admin/pedidos/${id}/marcar-pagado`);
    return response.data.data;
  },

  prepareOrder: async (id) => {
    const response = await apiClient.put(`/admin/pedidos/${id}/preparar`);
    return response.data.data;
  },

  shipOrder: async (id) => {
    const response = await apiClient.put(`/admin/pedidos/${id}/enviar`);
    return response.data.data;
  },

  deliverOrder: async (id) => {
    const response = await apiClient.put(`/admin/pedidos/${id}/entregar`);
    return response.data.data;
  },

  cancelOrder: async (id) => {
    const response = await apiClient.put(`/admin/pedidos/${id}/cancelar`);
    return response.data.data;
  },

  // ==================== MÉTRICAS AVANZADAS ====================

  /**
   * Obtiene métricas de ventas por período
   */
  getSalesMetrics: async (periodo = 'mes') => {
    const response = await apiClient.get('/admin/metricas/ventas', {
      params: { periodo }
    });
    return response.data.data;
  },

  /**
   * Obtiene datos de ventas en el tiempo para gráficos
   */
  getSalesOverTime: async (dias = 30) => {
    const response = await apiClient.get('/admin/metricas/ventas-tiempo', {
      params: { dias }
    });
    return response.data.data;
  },

  /**
   * Obtiene productos más vendidos
   */
  getTopProducts: async (limite = 10) => {
    const response = await apiClient.get('/admin/metricas/productos-mas-vendidos', {
      params: { limite }
    });
    return response.data.data;
  },

  /**
   * Obtiene métricas por categoría
   */
  getCategoryMetrics: async () => {
    const response = await apiClient.get('/admin/metricas/categorias');
    return response.data.data;
  },

  /**
   * Obtiene métricas de clientes
   */
  getCustomerMetrics: async (periodo = 'mes') => {
    const response = await apiClient.get('/admin/metricas/clientes', {
      params: { periodo }
    });
    return response.data.data;
  },

  /**
   * Obtiene resumen completo de métricas
   */
  getMetricsSummary: async () => {
    const response = await apiClient.get('/admin/metricas/resumen');
    return response.data.data;
  },
};

export default adminService;

















