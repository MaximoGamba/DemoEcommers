import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import ProductCard from '../components/ProductCard';
import ImageCarousel from '../components/ImageCarousel';
import productService from '../services/productService';
import { useViewedProducts } from '../context/ViewedProductsContext';
import './HomePage.css';

function HomePage() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [loadingCategorias, setLoadingCategorias] = useState(true);
  const { getRecentViewedProducts } = useViewedProducts();
  const navigate = useNavigate();
  
  const recentViewedProducts = getRecentViewedProducts(8); // Últimos 8 productos vistos

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Llamar al backend para obtener productos
        const data = await productService.getAllProducts();
        
        // El backend devuelve paginación, los productos están en "content"
        setProductos(data.content || []);
      } catch (err) {
        console.error('Error al cargar productos:', err);
        setError('No se pudieron cargar los productos. Verificá que el backend esté corriendo.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        setLoadingCategorias(true);
        const data = await productService.getCategories();
        setCategorias(data || []);
      } catch (err) {
        console.error('Error al cargar categorías:', err);
      } finally {
        setLoadingCategorias(false);
      }
    };

    fetchCategorias();
  }, []);

  const handleCategoryClick = (categoriaId) => {
    navigate(`/productos?categoria=${categoriaId}`);
  };

  return (
    <div className="home-page">
      {/* Carrusel de Imágenes */}
      <ImageCarousel />
      
      <header className="home-header">
        <h1>Bienvenido a MenStyle</h1>
        <p>Tu tienda de moda masculina</p>
      </header>
      
      {/* Sección de Productos Vistos Recientemente */}
      {recentViewedProducts.length > 0 && (
        <section className="recently-viewed-section">
          <div className="section-header">
            <h2>🕒 Vistos Recientemente</h2>
            <p>Productos que has explorado</p>
          </div>
          <div className="recently-viewed-grid">
            {recentViewedProducts.map((producto) => (
              <ProductCard key={producto.id} producto={producto} />
            ))}
          </div>
        </section>
      )}
      
      <section className="featured-section">
        <h2>Productos Destacados</h2>
        
        {loading && (
          <div className="loading-state">
            <p>Cargando productos...</p>
          </div>
        )}
        
        {error && (
          <div className="error-state">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>
              Reintentar
            </button>
          </div>
        )}
        
        {!loading && !error && (
          <ProductGrid productos={productos} />
        )}
        
        {!loading && !error && productos.length === 0 && (
          <div className="empty-state">
            <p>No hay productos disponibles en este momento.</p>
          </div>
        )}
      </section>

      {/* Sección de Categorías */}
      {!loadingCategorias && categorias.length > 0 && (
        <section className="categories-section">
          <div className="section-header">
            <h2>🛍️ Nuestras Categorías</h2>
            <p>Explorá nuestras colecciones</p>
          </div>
          <div className="categories-grid">
            {categorias.map((categoria) => (
              <button
                key={categoria.id}
                className="category-button"
                onClick={() => handleCategoryClick(categoria.id)}
              >
                <span className="category-name">{categoria.nombre}</span>
                <span className="category-arrow">→</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Sección de Ubicación */}
      <section className="location-section">
        <div className="section-header">
          <h2>📍 Nuestra Ubicación</h2>
          <p>Visitános en nuestro local</p>
        </div>
        <div className="location-content">
          <div className="location-info">
            <div className="location-details">
              <h3>MenStyle Store</h3>
              <div className="location-item">
                <span className="location-icon">📍</span>
                <div>
                  <p className="location-label">Dirección</p>
                  <p className="location-value">Av. Corrientes 1234, Buenos Aires, Argentina</p>
                </div>
              </div>
              <div className="location-item">
                <span className="location-icon">🕐</span>
                <div>
                  <p className="location-label">Horarios</p>
                  <p className="location-value">Lunes a Sábados: 10:00 - 20:00<br />Domingos: 12:00 - 18:00</p>
                </div>
              </div>
              <div className="location-item">
                <span className="location-icon">📞</span>
                <div>
                  <p className="location-label">Teléfono</p>
                  <p className="location-value">+54 11 1234-5678</p>
                </div>
              </div>
            </div>
          </div>
          <div className="location-map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.016713276849!2d-58.3815704!3d-34.6037389!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccacf9c8d0001%3A0x5db5e5e5e5e5e5e5!2sAv.%20Corrientes%2C%20C1043%20CABA!5e0!3m2!1ses-419!2sar!4v1234567890123!5m2!1ses-419!2sar"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación de MenStyle"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
