import apiClient from './apiClient';

/**
 * Servicio para gestionar productos.
 * El backend devuelve respuestas en formato: { success, message, data }
 * Para listas paginadas, data contiene: { content, totalElements, totalPages, ... }
 */
export const productService = {
  /**
   * Obtener todos los productos (paginado)
   * GET /api/productos
   * @param {Object} params - Parámetros opcionales (page, size, categoriaId, busqueda)
   * @returns {Promise<Object>} - { content: [], totalElements, totalPages, ... }
   */
  getAllProducts: async (params = {}) => {
    const response = await apiClient.get('/productos', { params });
    // response.data = { success, message, data: { content, totalElements, ... } }
    return response.data.data;
  },

  /**
   * Obtener un producto por ID
   * GET /api/productos/{id}
   * @param {number|string} id - ID del producto
   * @returns {Promise<Object>} - ProductoDTO
   */
  getProductById: async (id) => {
    const response = await apiClient.get(`/productos/${id}`);
    // response.data = { success, message, data: ProductoDTO }
    return response.data.data;
  },

  /**
   * Obtener productos destacados
   * GET /api/productos/destacados
   * @returns {Promise<Array>} - Lista de productos destacados
   */
  getFeaturedProducts: async () => {
    const response = await apiClient.get('/productos/destacados');
    return response.data.data;
  },

  /**
   * Buscar productos
   * GET /api/productos?busqueda=...
   * @param {string} query - Término de búsqueda
   * @param {Object} params - Parámetros de paginación opcionales
   * @returns {Promise<Object>} - { content: [], totalElements, totalPages, ... }
   */
  searchProducts: async (query, params = {}) => {
    const response = await apiClient.get('/productos', {
      params: { busqueda: query, ...params }
    });
    return response.data.data;
  },

  /**
   * Obtener productos por categoría
   * GET /api/categorias/{id}/productos
   * @param {number|string} categoriaId - ID de la categoría
   * @param {Object} params - Parámetros de paginación opcionales
   * @returns {Promise<Object>} - { content: [], totalElements, totalPages, ... }
   */
  getProductsByCategory: async (categoriaId, params = {}) => {
    const response = await apiClient.get(`/categorias/${categoriaId}/productos`, { params });
    return response.data.data;
  },

  /**
   * Obtener todas las categorías
   * GET /api/categorias
   * @returns {Promise<Array>} - Lista de categorías
   */
  getCategories: async () => {
    const response = await apiClient.get('/categorias');
    return response.data.data;
  },

  /**
   * Obtener talles disponibles para un producto
   * GET /api/productos/{id}/talles
   * @param {number|string} id - ID del producto
   * @returns {Promise<Array>} - Lista de talles
   */
  getProductSizes: async (id) => {
    const response = await apiClient.get(`/productos/${id}/talles`);
    return response.data.data;
  },

  /**
   * Obtener productos en oferta
   * GET /api/productos/ofertas
   * @returns {Promise<Array>} - Lista de productos en oferta
   */
  getOffersProducts: async () => {
    const response = await apiClient.get('/productos/ofertas');
    return response.data.data;
  },

  /**
   * Obtener productos relacionados
   * GET /api/productos/{id}/relacionados
   * @param {number|string} id - ID del producto
   * @returns {Promise<Array>} - Lista de productos relacionados
   */
  getRelatedProducts: async (id) => {
    const response = await apiClient.get(`/productos/${id}/relacionados`);
    return response.data.data;
  },
};

export default productService;
