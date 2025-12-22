import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productService from '../services/productService';
import './CategoriesPage.css';

// Imágenes/iconos para cada categoría (hardcoded para demo)
const CATEGORY_IMAGES = {
  'Remeras': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=400&fit=crop',
  'Pantalones': 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&h=400&fit=crop',
  'Camperas': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=400&fit=crop',
  'Camisas': 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&h=400&fit=crop',
  'Accesorios': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=400&fit=crop',
  'Zapatillas': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=400&fit=crop',
  'default': 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=500&h=400&fit=crop',
};

const CATEGORY_ICONS = {
  'Remeras': '👕',
  'Pantalones': '👖',
  'Camperas': '🧥',
  'Camisas': '👔',
  'Accesorios': '🎒',
  'Zapatillas': '👟',
  'default': '🏷️',
};

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const cats = await productService.getCategories();
      setCategories(cats || []);

      // Cargar conteo de productos por categoría
      const productCounts = {};
      for (const cat of cats || []) {
        try {
          const products = await productService.getProductsByCategory(cat.id, { size: 1 });
          productCounts[cat.id] = products?.totalElements || 0;
        } catch {
          productCounts[cat.id] = 0;
        }
      }
      setCategoryProducts(productCounts);
    } catch (err) {
      console.error('Error cargando categorías:', err);
      setError('Error al cargar las categorías');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryImage = (name) => {
    return CATEGORY_IMAGES[name] || CATEGORY_IMAGES.default;
  };

  const getCategoryIcon = (name) => {
    return CATEGORY_ICONS[name] || CATEGORY_ICONS.default;
  };

  if (loading) {
    return (
      <div className="categories-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando categorías...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="categories-page">
        <div className="error-state">
          <p>{error}</p>
          <button onClick={loadCategories}>Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="categories-page">
      {/* Hero Section */}
      <section className="categories-hero">
        <div className="hero-content">
          <h1>Categorías</h1>
          <p>Explorá nuestra colección de ropa masculina organizada por categorías</p>
        </div>
        <div className="hero-pattern"></div>
      </section>

      {/* Categories Grid */}
      <section className="categories-section">
        <div className="categories-grid">
          {categories.map((category, index) => (
            <Link 
              key={category.id}
              to={`/productos?categoria=${category.id}`}
              className="category-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="category-image">
                <img 
                  src={getCategoryImage(category.nombre)} 
                  alt={category.nombre}
                  loading="lazy"
                />
                <div className="category-overlay">
                  <span className="category-icon">{getCategoryIcon(category.nombre)}</span>
                </div>
              </div>
              <div className="category-info">
                <h2 className="category-name">{category.nombre}</h2>
                {category.descripcion && (
                  <p className="category-description">{category.descripcion}</p>
                )}
                <span className="category-count">
                  {categoryProducts[category.id] || 0} productos
                </span>
                <span className="category-cta">Ver productos →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Promo */}
      <section className="promo-section">
        <div className="promo-card">
          <div className="promo-content">
            <span className="promo-tag">🔥 Ofertas especiales</span>
            <h2>Hasta 40% OFF en productos seleccionados</h2>
            <p>Aprovechá nuestras ofertas exclusivas en todas las categorías</p>
            <Link to="/productos?ofertas=true" className="promo-btn">
              Ver ofertas
            </Link>
          </div>
          <div className="promo-pattern"></div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="quick-links-section">
        <h2>Accesos rápidos</h2>
        <div className="quick-links">
          <Link to="/productos?destacados=true" className="quick-link">
            <span className="link-icon">⭐</span>
            <span className="link-text">Destacados</span>
          </Link>
          <Link to="/productos?nuevos=true" className="quick-link">
            <span className="link-icon">🆕</span>
            <span className="link-text">Nuevos ingresos</span>
          </Link>
          <Link to="/productos?ordenar=precio-asc" className="quick-link">
            <span className="link-icon">💰</span>
            <span className="link-text">Precios bajos</span>
          </Link>
          <Link to="/productos" className="quick-link">
            <span className="link-icon">🛍️</span>
            <span className="link-text">Ver todo</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default CategoriesPage;

















