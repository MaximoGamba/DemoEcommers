import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import './FavoritesPage.css';

function FavoritesPage() {
  const { favorites, removeFavorite, clearFavorites } = useFavorites();
  const { addItem } = useCart();

  const handleAddToCart = async (product) => {
    // Nota: Esto solo funcionará si el producto tiene variantes cargadas
    // Para un flow completo, se debería redirigir al detalle
    console.log('Redirigir a detalle para agregar al carrito:', product.id);
  };

  if (favorites.length === 0) {
    return (
      <div className="favorites-page">
        <div className="favorites-empty">
          <div className="empty-icon">💔</div>
          <h2>No tenés favoritos</h2>
          <p>Explorá nuestros productos y agregá tus favoritos para encontrarlos fácilmente.</p>
          <Link to="/productos" className="btn-explore">
            Explorar productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <div className="header-info">
          <h1>❤️ Mis Favoritos</h1>
          <span className="favorites-count">{favorites.length} {favorites.length === 1 ? 'producto' : 'productos'}</span>
        </div>
        <button className="btn-clear" onClick={clearFavorites}>
          🗑️ Limpiar todo
        </button>
      </div>

      <div className="favorites-grid">
        {favorites.map(product => {
          const discount = product.tieneOferta && product.precio > 0
            ? Math.round((1 - product.precioOferta / product.precio) * 100)
            : 0;

          return (
            <div key={product.id} className="favorite-card">
              <button 
                className="remove-btn"
                onClick={() => removeFavorite(product.id)}
                title="Quitar de favoritos"
              >
                ✕
              </button>

              <Link to={`/producto/${product.id}`} className="favorite-link">
                <div className="favorite-image">
                  <img 
                    src={product.imagenPrincipalUrl || 'https://via.placeholder.com/200x250?text=Sin+imagen'} 
                    alt={product.nombre}
                  />
                  {product.tieneOferta && (
                    <span className="discount-badge">-{discount}%</span>
                  )}
                  {!product.tieneStock && (
                    <div className="out-of-stock-overlay">
                      <span>Agotado</span>
                    </div>
                  )}
                </div>

                <div className="favorite-info">
                  <span className="favorite-category">{product.categoriaNombre}</span>
                  <h3 className="favorite-name">{product.nombre}</h3>
                  {product.marca && (
                    <span className="favorite-brand">{product.marca}</span>
                  )}
                  
                  <div className="favorite-price">
                    {product.tieneOferta && product.precioOferta ? (
                      <>
                        <span className="price-original">${product.precio?.toLocaleString('es-AR')}</span>
                        <span className="price-sale">${product.precioOferta?.toLocaleString('es-AR')}</span>
                      </>
                    ) : (
                      <span className="price-current">${product.precio?.toLocaleString('es-AR')}</span>
                    )}
                  </div>
                </div>
              </Link>

              <div className="favorite-actions">
                <Link to={`/producto/${product.id}`} className="btn-view">
                  Ver producto
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FavoritesPage;

















