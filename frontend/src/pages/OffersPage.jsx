import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productService from '../services/productService';
import ProductCard from '../components/ProductCard';
import './OffersPage.css';

function OffersPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productService.getOffersProducts();
        setProducts(data || []);
      } catch (err) {
        console.error('Error al cargar ofertas:', err);
        setError('No se pudieron cargar las ofertas.');
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  // Calcular el descuento promedio y total
  const totalDiscount = products.reduce((sum, product) => {
    if (product.tieneOferta && product.precio > 0 && product.precioOferta) {
      const discount = Math.round((1 - product.precioOferta / product.precio) * 100);
      return sum + discount;
    }
    return sum;
  }, 0);
  const avgDiscount = products.length > 0 ? Math.round(totalDiscount / products.length) : 0;

  if (loading) {
    return (
      <div className="offers-page">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Cargando ofertas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="offers-page">
        <div className="error-state">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="offers-page">
      {/* Hero Section */}
      <header className="offers-hero">
        <div className="hero-content">
          <div className="hero-badge">🔥 OFERTAS ESPECIALES</div>
          <h1>¡Aprovechá Nuestras Ofertas!</h1>
          <p className="hero-subtitle">
            Encontrá los mejores descuentos en ropa masculina. ¡No te pierdas estas oportunidades!
          </p>
          {products.length > 0 && (
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">{products.length}</span>
                <span className="stat-label">Productos en oferta</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{avgDiscount}%</span>
                <span className="stat-label">Descuento promedio</span>
              </div>
            </div>
          )}
        </div>
        <div className="hero-decoration">
          <div className="decoration-circle circle-1"></div>
          <div className="decoration-circle circle-2"></div>
          <div className="decoration-circle circle-3"></div>
        </div>
      </header>

      {/* Offers Content */}
      <section className="offers-content">
        {products.length === 0 ? (
          <div className="empty-offers">
            <span className="empty-icon">🎁</span>
            <h3>No hay ofertas disponibles en este momento</h3>
            <p>Volvé pronto para descubrir nuevas ofertas y descuentos exclusivos.</p>
            <Link to="/productos" className="btn-primary">
              Ver Todos los Productos
            </Link>
          </div>
        ) : (
          <>
            {/* Quick Filters */}
            <div className="offers-filters">
              <div className="filter-tags">
                <span className="filter-tag active">
                  🔥 Todas las ofertas ({products.length})
                </span>
                <Link to="/productos?sort=precio,asc" className="filter-tag">
                  💰 Menor precio
                </Link>
                <Link to="/productos?sort=precio,desc" className="filter-tag">
                  ⭐ Mayor descuento
                </Link>
              </div>
            </div>

            {/* Products Grid */}
            <div className="offers-grid">
              {products.map((product) => {
                const discount = product.tieneOferta && product.precio > 0 && product.precioOferta
                  ? Math.round((1 - product.precioOferta / product.precio) * 100)
                  : 0;
                
                return (
                  <div key={product.id} className="offer-product-wrapper">
                    <div className="offer-badge-large">
                      <span className="badge-text">-{discount}% OFF</span>
                    </div>
                    <ProductCard producto={product} />
                  </div>
                );
              })}
            </div>

            {/* Call to Action */}
            <div className="offers-cta">
              <div className="cta-content">
                <h2>¿Buscás algo más?</h2>
                <p>Explorá nuestro catálogo completo con más productos increíbles.</p>
                <div className="cta-buttons">
                  <Link to="/productos" className="btn-primary">
                    Ver Todos los Productos
                  </Link>
                  <Link to="/categorias" className="btn-secondary">
                    Explorar Categorías
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default OffersPage;
















