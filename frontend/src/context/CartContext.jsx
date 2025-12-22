import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import cartService from '../services/cartService';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar carrito al iniciar
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cartService.getCart();
      setCart(data);
    } catch (err) {
      // Si no hay carrito, no es un error crítico
      if (err.response?.status === 404) {
        setCart({ items: [], cantidadItems: 0, total: 0 });
      } else {
        console.error('Error al cargar carrito:', err);
        setError('No se pudo cargar el carrito');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Agregar item al carrito
  const addItem = async (productoVarianteId, cantidad = 1) => {
    try {
      setError(null);
      const updatedCart = await cartService.addItem(productoVarianteId, cantidad);
      setCart(updatedCart);
      return { success: true, message: 'Producto agregado al carrito' };
    } catch (err) {
      const message = err.response?.data?.message || 'Error al agregar producto';
      setError(message);
      return { success: false, message };
    }
  };

  // Actualizar cantidad de un item
  const updateQuantity = async (itemId, cantidad) => {
    try {
      setError(null);
      if (cantidad <= 0) {
        return removeItem(itemId);
      }
      const updatedCart = await cartService.updateItemQuantity(itemId, cantidad);
      setCart(updatedCart);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Error al actualizar cantidad';
      setError(message);
      return { success: false, message };
    }
  };

  // Eliminar item del carrito
  const removeItem = async (itemId) => {
    try {
      setError(null);
      const updatedCart = await cartService.removeItem(itemId);
      setCart(updatedCart);
      return { success: true, message: 'Producto eliminado del carrito' };
    } catch (err) {
      const message = err.response?.data?.message || 'Error al eliminar producto';
      setError(message);
      return { success: false, message };
    }
  };

  // Vaciar carrito
  const clearCart = async () => {
    try {
      setError(null);
      const updatedCart = await cartService.clearCart();
      setCart(updatedCart);
      return { success: true, message: 'Carrito vaciado' };
    } catch (err) {
      const message = err.response?.data?.message || 'Error al vaciar carrito';
      setError(message);
      return { success: false, message };
    }
  };

  // Refrescar carrito
  const refreshCart = () => {
    fetchCart();
  };

  // Getters convenientes
  const getItemCount = () => cart?.cantidadItems || 0;
  const getTotal = () => cart?.total || 0;
  const getItems = () => cart?.items || [];
  const isEmpty = () => !cart?.items || cart.items.length === 0;

  const value = {
    cart,
    items: getItems(),
    itemCount: getItemCount(),
    total: getTotal(),
    isEmpty: isEmpty(),
    loading,
    error,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    refreshCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
}

export default CartContext;
