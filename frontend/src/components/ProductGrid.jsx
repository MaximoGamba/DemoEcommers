import ProductCard from './ProductCard';
import './ProductGrid.css';

function ProductGrid({ productos = [] }) {
  if (productos.length === 0) {
    return null;
  }

  return (
    <div className="product-grid">
      {productos.map((producto) => (
        <ProductCard key={producto.id} producto={producto} />
      ))}
    </div>
  );
}

export default ProductGrid;
