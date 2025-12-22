import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './CartPage.css';

function CartPage() {
  const { 
    items, 
    total, 
    isEmpty, 
    loading, 
    error,
    updateQuantity, 
    removeItem, 
    clearCart 
  } = useCart();

  const handleQuantityChange = async (itemId, newQuantity) => {
    await updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = async (itemId) => {
    await removeItem(itemId);
  };

  const handleClearCart = async () => {
    if (window.confirm('¿Estás seguro de que querés vaciar el carrito?')) {
      await clearCart();
    }
  };

  if (loading) {
    return (
      <div className="cart-page">
        <h1>Carrito de Compras</h1>
        <div className="loading-state">
          <p>Cargando carrito...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-page">
        <h1>Carrito de Compras</h1>
        <div className="error-state">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="cart-page">
        <h1>Carrito de Compras</h1>
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Tu carrito está vacío</h2>
          <p>¡Explorá nuestros productos y agregá algo!</p>
          <Link to="/" className="continue-shopping-btn">
            Ver productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Carrito de Compras</h1>
        <button className="clear-cart-btn" onClick={handleClearCart}>
          Vaciar carrito
        </button>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {items.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="item-image">
                <img 
                  src={item.imagenUrl || 'https://via.placeholder.com/100x100?text=Sin+imagen'} 
                  alt={item.productoNombre} 
                />
              </div>
              
              <div className="item-details">
                <h3 className="item-name">{item.productoNombre}</h3>
                <div className="item-variant">
                  {item.talleNombre && <span className="item-size">Talle: {item.talleNombre}</span>}
                  {item.color && <span className="item-color">Color: {item.color}</span>}
                </div>
                <p className="item-price">${item.precioUnitario?.toFixed(2)}</p>
                {!item.stockSuficiente && (
                  <p className="stock-warning">⚠️ Stock insuficiente</p>
                )}
              </div>

              <div className="item-quantity">
                <button 
                  className="qty-btn"
                  onClick={() => handleQuantityChange(item.id, item.cantidad - 1)}
                  disabled={item.cantidad <= 1}
                >
                  −
                </button>
                <span className="qty-value">{item.cantidad}</span>
                <button 
                  className="qty-btn"
                  onClick={() => handleQuantityChange(item.id, item.cantidad + 1)}
                  disabled={item.cantidad >= item.stockDisponible}
                >
                  +
                </button>
              </div>

              <div className="item-subtotal">
                <span className="subtotal-label">Subtotal</span>
                <span className="subtotal-value">${item.subtotal?.toFixed(2)}</span>
              </div>

              <button 
                className="remove-item-btn"
                onClick={() => handleRemoveItem(item.id)}
                title="Eliminar producto"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Resumen del pedido</h2>
          
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${total?.toFixed(2)}</span>
          </div>
          
          <div className="summary-row">
            <span>Envío</span>
            <span className="free-shipping">Gratis</span>
          </div>
          
          <div className="summary-divider"></div>
          
          <div className="summary-row total">
            <span>Total</span>
            <span>${total?.toFixed(2)}</span>
          </div>

          <Link to="/checkout" className="checkout-btn">
            Finalizar compra
          </Link>

          <Link to="/" className="continue-shopping-link">
            ← Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
