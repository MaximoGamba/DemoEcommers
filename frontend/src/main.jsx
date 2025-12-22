import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { ViewedProductsProvider } from './context/ViewedProductsContext';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <ViewedProductsProvider>
            <App />
          </ViewedProductsProvider>
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  </StrictMode>
);
