import apiClient from './apiClient';

const couponService = {
  /**
   * Valida un código de cupón y calcula el descuento aplicable
   * POST /api/cupones/validar?codigo=XXX&montoCompra=YYY
   * @param {string} codigo - Código del cupón
   * @param {number} montoCompra - Monto total de la compra
   * @returns {Promise<Object>} - Respuesta con validación y descuento
   */
  validarCupon: async (codigo, montoCompra) => {
    try {
      const response = await apiClient.post('/cupones/validar', null, {
        params: {
          codigo: codigo.trim().toUpperCase(),
          montoCompra: montoCompra,
        },
      });
      return response.data.data;
    } catch (error) {
      // Si el cupón es inválido, devolver la respuesta de error del backend
      if (error.response?.data?.data) {
        return error.response.data.data;
      }
      throw error;
    }
  },
};

export default couponService;















