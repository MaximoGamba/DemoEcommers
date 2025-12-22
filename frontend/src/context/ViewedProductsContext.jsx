import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ViewedProductsContext = createContext();

const VIEWED_PRODUCTS_KEY = 'ecommerce_viewed_products';
const MAX_VIEWED_PRODUCTS = 12; // Máximo de productos en el historial

export function ViewedProductsProvider({ children }) {
  const [viewedProducts, setViewedProducts] = useState([]);

  // Cargar productos vistos desde localStorage al montar
  useEffect(() => {
    const saved = localStorage.getItem(VIEWED_PRODUCTS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ordenar por timestamp más reciente primero
        const sorted = parsed.sort((a, b) => new Date(b.viewedAt) - new Date(a.viewedAt));
        setViewedProducts(sorted);
      } catch (e) {
        console.error('Error parsing viewed products:', e);
        setViewedProducts([]);
      }
    }
  }, []);

  // Guardar en localStorage cada vez que cambian
  useEffect(() => {
    localStorage.setItem(VIEWED_PRODUCTS_KEY, JSON.stringify(viewedProducts));
  }, [viewedProducts]);

  /**
   * Agrega un producto al historial de vistos.
   * Si el producto ya existe, lo mueve al inicio (más reciente).
   * Limita el historial a MAX_VIEWED_PRODUCTS.
   */
  const addViewedProduct = useCallback((product) => {
    setViewedProducts(prev => {
      // Remover el producto si ya existe (para evitar duplicados)
      const filtered = prev.filter(p => p.id !== product.id);
      
      // Agregar el producto al inicio con timestamp actual
      const newProduct = {
        id: product.id,
        nombre: product.nombre,
        precio: product.precio,
        precioOferta: product.precioOferta,
        precioFinal: product.precioFinal,
        tieneOferta: product.tieneOferta,
        imagenPrincipalUrl: product.imagenPrincipalUrl,
        marca: product.marca,
        categoriaNombre: product.categoriaNombre,
        tieneStock: product.tieneStock,
        viewedAt: new Date().toISOString(), // Timestamp de cuando se vio
      };
      
      // Agregar al inicio y limitar a MAX_VIEWED_PRODUCTS
      const updated = [newProduct, ...filtered].slice(0, MAX_VIEWED_PRODUCTS);
      
      return updated;
    });
  }, []);

  /**
   * Limpia todo el historial de productos vistos.
   */
  const clearViewedProducts = useCallback(() => {
    setViewedProducts([]);
  }, []);

  /**
   * Obtiene los productos vistos más recientes (últimos N).
   */
  const getRecentViewedProducts = useCallback((limit = MAX_VIEWED_PRODUCTS) => {
    return viewedProducts.slice(0, limit);
  }, [viewedProducts]);

  const value = {
    viewedProducts,
    viewedProductsCount: viewedProducts.length,
    addViewedProduct,
    clearViewedProducts,
    getRecentViewedProducts,
  };

  return (
    <ViewedProductsContext.Provider value={value}>
      {children}
    </ViewedProductsContext.Provider>
  );
}

export function useViewedProducts() {
  const context = useContext(ViewedProductsContext);
  if (!context) {
    throw new Error('useViewedProducts debe usarse dentro de ViewedProductsProvider');
  }
  return context;
}

export default ViewedProductsContext;







