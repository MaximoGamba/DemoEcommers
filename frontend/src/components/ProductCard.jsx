import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import './ProductGrid.css';

function ProductCard({ producto, viewMode = 'grid' }) {
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  if (!producto) return null;

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Si tiene variantes, redirigir al detalle
    // Por ahora, intentamos agregar la primera variante disponible
    if (producto.variantes && producto.variantes.length > 0) {
      const firstAvailable = producto.variantes.find(v => v.stock > 0);
      if (firstAvailable) {
        await addItem(firstAvailable.id, 1);
      }
    }
  };

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(producto);
  };

  const isProductFavorite = isFavorite(producto.id);

  return (
    <Link to={`/producto/${producto.id}`} className={`product-card ${viewMode === 'list' ? 'list-mode' : ''}`}>
      <div className="product-image">
        <img
          src={producto.imagenPrincipalUrl || 'https://via.placeholder.com/300x350?text=Sin+imagen'}
          alt={producto.nombre}
          loading="lazy"
        />
        
        {/* Favorite Button */}
        <button 
          className={`favorite-btn ${isProductFavorite ? 'active' : ''}`}
          onClick={handleToggleFavorite}
          title={isProductFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          {isProductFavorite ? '❤️' : '🤍'}
        </button>
        
        {/* Badges - Solo stock agotado */}
        {!producto.tieneStock && (
          <div className="product-badges">
            <span className="badge badge-outstock">Agotado</span>
          </div>
        )}

        {/* Quick Actions */}
        <div className="product-actions">
          <button 
            className="action-btn quick-add"
            onClick={handleQuickAdd}
            disabled={!producto.tieneStock}
            title={producto.tieneStock ? 'Agregar al carrito' : 'Sin stock'}
          >
            🛒
          </button>
          <button className="action-btn quick-view" title="Ver detalles">
            👁️
          </button>
        </div>
      </div>

      <div className="product-info">
        <span className="product-category">{producto.categoriaNombre || 'Sin categoría'}</span>
        <h3 className="product-name">{producto.nombre}</h3>
        
        {producto.marca && (
          <span className="product-brand">{producto.marca}</span>
        )}

        <div className="product-price">
          {producto.tieneOferta && producto.precioOferta ? (
            <>
              <span className="price-original">
                ${producto.precio?.toLocaleString('es-AR')}
              </span>
              <span className="price-sale">
                ${producto.precioOferta?.toLocaleString('es-AR')}
              </span>
            </>
          ) : (
            <span className="price-current">
              ${producto.precio?.toLocaleString('es-AR')}
            </span>
          )}
        </div>

        {producto.stockTotal !== undefined && producto.stockTotal > 0 && producto.stockTotal <= 5 && (
          <span className="stock-warning">¡Últimas {producto.stockTotal} unidades!</span>
        )}

        {/* Descripción solo en vista lista */}
        {viewMode === 'list' && producto.descripcion && (
          <p className="product-description-preview">
            {producto.descripcion.length > 150 
              ? producto.descripcion.substring(0, 150) + '...' 
              : producto.descripcion}
          </p>
        )}

        {/* Botón agregar al carrito en vista lista */}
        {viewMode === 'list' && (
          <button 
            className="list-add-btn"
            onClick={handleQuickAdd}
            disabled={!producto.tieneStock}
          >
            {producto.tieneStock ? '🛒 Agregar al carrito' : 'Sin stock'}
          </button>
        )}
      </div>
    </Link>
  );
}

export default ProductCard;
