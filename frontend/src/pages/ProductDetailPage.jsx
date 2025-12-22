import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import productService from '../services/productService';
import { useCart } from '../context/CartContext';
import { useViewedProducts } from '../context/ViewedProductsContext';
import ProductCard from '../components/ProductCard';
import ProductImageCarousel from '../components/ProductImageCarousel';
import './ProductDetailPage.css';

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { addViewedProduct } = useViewedProducts();
  
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado para selección de variante
  const [selectedVariante, setSelectedVariante] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedMessage, setAddedMessage] = useState(null);
  
  // Estado para productos relacionados
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await productService.getProductById(id);
        setProducto(data);
        
        // Registrar producto como visto
        if (data) {
          addViewedProduct(data);
        }
        
        // Pre-seleccionar primera variante disponible
        if (data.variantes && data.variantes.length > 0) {
          const disponible = data.variantes.find(v => v.stock > 0);
          if (disponible) {
            setSelectedVariante(disponible);
          }
        }
      } catch (err) {
        console.error('Error al cargar el producto:', err);
        setError('No se pudo cargar el producto.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProducto();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Cargar productos relacionados cuando el producto esté cargado
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!producto || !id) return;
      
      try {
        setLoadingRelated(true);
        const data = await productService.getRelatedProducts(id);
        setRelatedProducts(data || []);
      } catch (err) {
        console.error('Error al cargar productos relacionados:', err);
        // No mostramos error, simplemente no mostramos productos relacionados
        setRelatedProducts([]);
      } finally {
        setLoadingRelated(false);
      }
    };

    if (producto?.id) {
      fetchRelatedProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [producto?.id]);

  // Obtener colores únicos
  const getUniqueColors = () => {
    if (!producto?.variantes) return [];
    const colors = [...new Set(producto.variantes.map(v => v.color).filter(Boolean))];
    return colors;
  };

  // Obtener talles disponibles para un color
  const getTallesForColor = (color) => {
    if (!producto?.variantes) return [];
    return producto.variantes.filter(v => v.color === color);
  };

  // Verificar si el producto es una remera
  const isRemera = () => {
    const categoriaNombre = producto?.categoriaNombre?.toLowerCase() || '';
    return categoriaNombre.includes('remera') || categoriaNombre.includes('camiseta');
  };

  // Formatear el nombre del talle para mostrar
  const formatTalleNombre = (talleNombre) => {
    if (!talleNombre) return '';
    
    // Si es una remera, mostrar directamente S, M, L, XL
    if (isRemera()) {
      const talleUpper = talleNombre.toUpperCase().trim();
      // Si ya está en formato S, M, L, XL, devolverlo tal cual
      if (['S', 'M', 'L', 'XL', 'XXL'].includes(talleUpper)) {
        return talleUpper;
      }
      // Si viene como número o otro formato, intentar mapear
      const talleMap = {
        '1': 'S',
        '2': 'M',
        '3': 'L',
        '4': 'XL',
        '5': 'XXL',
        'SMALL': 'S',
        'MEDIUM': 'M',
        'LARGE': 'L',
        'EXTRA LARGE': 'XL',
        'EXTRA LARGE': 'XL'
      };
      return talleMap[talleUpper] || talleNombre;
    }
    
    // Para otros productos, mostrar el nombre original
    return talleNombre;
  };

  const handleAddToCart = async () => {
    if (!selectedVariante) {
      setAddedMessage({ type: 'error', text: 'Seleccioná un talle antes de agregar' });
      return;
    }

    setAddingToCart(true);
    setAddedMessage(null);

    const result = await addItem(selectedVariante.id, cantidad);
    
    if (result.success) {
      setAddedMessage({ type: 'success', text: '¡Producto agregado al carrito!' });
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setAddedMessage(null), 3000);
    } else {
      setAddedMessage({ type: 'error', text: result.message });
    }

    setAddingToCart(false);
  };

  const handleGoToCart = () => {
    navigate('/carrito');
  };

  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="loading-state">
          <p>Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-detail-page">
        <div className="error-state">
          <p>{error}</p>
          <Link to="/" className="back-link">Volver al inicio</Link>
        </div>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="product-detail-page">
        <div className="error-state">
          <p>Producto no encontrado.</p>
          <Link to="/" className="back-link">Volver al inicio</Link>
        </div>
      </div>
    );
  }

  const uniqueColors = getUniqueColors();
  const selectedColor = selectedVariante?.color || uniqueColors[0];

  return (
    <div className="product-detail-page">
      <Link to="/" className="back-link">← Volver al catálogo</Link>
      
      <div className="product-detail-container">
        <div className="product-image-section">
          <ProductImageCarousel 
            imagenes={producto.imagenes}
            imagenPrincipal={selectedVariante?.imagenUrl || producto.imagenPrincipalUrl}
          />
          {producto.tieneOferta && (
            <span className="offer-badge">OFERTA</span>
          )}
        </div>
        
        <div className="product-info-section">
          <div className="product-category">
            {producto.categoriaNombre || 'Sin categoría'}
          </div>
          
          <h1 className="product-title">{producto.nombre}</h1>
          
          {producto.marca && (
            <p className="product-brand">Marca: {producto.marca}</p>
          )}
          
          <div className="product-pricing">
            {producto.tieneOferta && producto.precioOferta ? (
              <>
                <span className="original-price">${producto.precio}</span>
                <span className="sale-price">${producto.precioFinal || producto.precioOferta}</span>
              </>
            ) : (
              <span className="current-price">${producto.precio}</span>
            )}
          </div>

          {/* Selector de Color */}
          {uniqueColors.length > 1 && (
            <div className="variant-selector">
              <h3>Color</h3>
              <div className="color-options">
                {uniqueColors.map((color) => {
                  const colorVariante = producto.variantes.find(v => v.color === color);
                  return (
                    <button
                      key={color}
                      className={`color-button ${selectedColor === color ? 'selected' : ''}`}
                      style={{ backgroundColor: colorVariante?.codigoColor || '#ccc' }}
                      onClick={() => {
                        const firstAvailable = getTallesForColor(color).find(v => v.stock > 0);
                        setSelectedVariante(firstAvailable || getTallesForColor(color)[0]);
                      }}
                      title={color}
                    />
                  );
                })}
              </div>
              <span className="selected-color-name">{selectedColor}</span>
            </div>
          )}

          {/* Selector de Talle */}
          {producto.variantes && producto.variantes.length > 0 && (
            <div className="variant-selector">
              <h3>Talle</h3>
              <div className="size-options">
                {(uniqueColors.length > 1 ? getTallesForColor(selectedColor) : producto.variantes).map((variante) => (
                  <button
                    key={variante.id}
                    className={`size-button ${selectedVariante?.id === variante.id ? 'selected' : ''} ${variante.stock <= 0 ? 'disabled' : ''}`}
                    onClick={() => variante.stock > 0 && setSelectedVariante(variante)}
                    disabled={variante.stock <= 0}
                  >
                    {formatTalleNombre(variante.talleNombre)}
                    {variante.stock <= 0 && <span className="sold-out">Agotado</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock info */}
          {selectedVariante && (
            <div className="stock-info">
              {selectedVariante.stock > 0 ? (
                <span className="in-stock">
                  ✓ En stock ({selectedVariante.stock} disponibles)
                </span>
              ) : (
                <span className="out-of-stock">✗ Sin stock</span>
              )}
            </div>
          )}

          {/* Selector de Cantidad */}
          {selectedVariante && selectedVariante.stock > 0 && (
            <div className="quantity-selector">
              <h3>Cantidad</h3>
              <div className="quantity-controls">
                <button 
                  className="qty-btn"
                  onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                  disabled={cantidad <= 1}
                >
                  −
                </button>
                <span className="qty-value">{cantidad}</span>
                <button 
                  className="qty-btn"
                  onClick={() => setCantidad(Math.min(selectedVariante.stock, cantidad + 1))}
                  disabled={cantidad >= selectedVariante.stock}
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Mensaje de feedback */}
          {addedMessage && (
            <div className={`cart-message ${addedMessage.type}`}>
              {addedMessage.text}
              {addedMessage.type === 'success' && (
                <button className="go-to-cart-btn" onClick={handleGoToCart}>
                  Ver carrito
                </button>
              )}
            </div>
          )}

          {/* Botones de acción */}
          <div className="product-actions">
            <button 
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={!selectedVariante || selectedVariante.stock <= 0 || addingToCart}
            >
              {addingToCart ? 'Agregando...' : 
               !selectedVariante ? 'Seleccioná un talle' :
               selectedVariante.stock <= 0 ? 'Sin stock' : 
               'Agregar al carrito'}
            </button>
          </div>
          
          {producto.descripcion && (
            <div className="product-description">
              <h3>Descripción</h3>
              <p>{producto.descripcion}</p>
            </div>
          )}
          
          {producto.material && (
            <div className="product-material">
              <strong>Material:</strong> {producto.material}
            </div>
          )}
          
          {producto.sku && (
            <div className="product-sku">
              <strong>SKU:</strong> {producto.sku}
            </div>
          )}
        </div>
      </div>

      {/* Sección de Productos Relacionados */}
      {relatedProducts.length > 0 && (
        <section className="related-products-section">
          <div className="related-products-header">
            <h2>✨ Productos Relacionados</h2>
            <p>También te pueden interesar</p>
          </div>
          {loadingRelated ? (
            <div className="related-loading">
              <p>Cargando productos relacionados...</p>
            </div>
          ) : (
            <div className="related-products-grid">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} producto={relatedProduct} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default ProductDetailPage;
