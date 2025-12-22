function CartSummary({ items = [], total = 0 }) {
  return (
    <div className="cart-summary">
      <h3>Resumen del Carrito</h3>
      <div className="cart-items-count">
        <span>Items:</span>
        <span>{items.length}</span>
      </div>
      <div className="cart-total">
        <span>Total:</span>
        <span>${total.toFixed(2)}</span>
      </div>
    </div>
  );
}

export default CartSummary;




















