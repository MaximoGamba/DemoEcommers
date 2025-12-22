import { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

const FAVORITES_KEY = 'ecommerce_favorites';

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  // Cargar favoritos desde localStorage al montar
  useEffect(() => {
    const saved = localStorage.getItem(FAVORITES_KEY);
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error('Error parsing favorites:', e);
        setFavorites([]);
      }
    }
  }, []);

  // Guardar en localStorage cada vez que cambian
  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (product) => {
    setFavorites(prev => {
      // Evitar duplicados
      if (prev.some(p => p.id === product.id)) {
        return prev;
      }
      return [...prev, {
        id: product.id,
        nombre: product.nombre,
        precio: product.precio,
        precioOferta: product.precioOferta,
        tieneOferta: product.tieneOferta,
        imagenPrincipalUrl: product.imagenPrincipalUrl,
        marca: product.marca,
        categoriaNombre: product.categoriaNombre,
        tieneStock: product.tieneStock,
      }];
    });
  };

  const removeFavorite = (productId) => {
    setFavorites(prev => prev.filter(p => p.id !== productId));
  };

  const toggleFavorite = (product) => {
    if (isFavorite(product.id)) {
      removeFavorite(product.id);
    } else {
      addFavorite(product);
    }
  };

  const isFavorite = (productId) => {
    return favorites.some(p => p.id === productId);
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  const value = {
    favorites,
    favoritesCount: favorites.length,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites debe usarse dentro de FavoritesProvider');
  }
  return context;
}

export default FavoritesContext;

















