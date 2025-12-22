import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import productService from '../services/productService';
import ProductCard from '../components/ProductCard';
import './ProductsPage.css';

const SORT_OPTIONS = [
  { value: 'fechaCreacion,desc', label: 'Más recientes' },
  { value: 'fechaCreacion,asc', label: 'Más antiguos' },
  { value: 'precio,asc', label: 'Menor precio' },
  { value: 'precio,desc', label: 'Mayor precio' },
  { value: 'nombre,asc', label: 'A - Z' },
  { value: 'nombre,desc', label: 'Z - A' },
];

const PRICE_RANGES = [
  { value: '', label: 'Todos los precios' },
  { value: '0-15000', label: 'Hasta $15.000' },
  { value: '15000-30000', label: '$15.000 - $30.000' },
  { value: '30000-50000', label: '$30.000 - $50.000' },
  { value: '50000-100000', label: '$50.000 - $100.000' },
  { value: '100000-999999', label: 'Más de $100.000' },
];

const VIEW_OPTIONS = [
  { value: 'grid', icon: '⊞', label: 'Grilla' },
  { value: 'list', icon: '☰', label: 'Lista' },
];

function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // Para extraer marcas
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  // Filtros desde URL
  const currentSearch = searchParams.get('busqueda') || '';
  const currentCategory = searchParams.get('categoria') || '';
  const currentSort = searchParams.get('sort') || 'fechaCreacion,desc';
  const currentPriceRange = searchParams.get('precio') || '';
  const currentBrand = searchParams.get('marca') || '';
  const currentOferta = searchParams.get('oferta') === 'true';
  const currentPage = parseInt(searchParams.get('page') || '0');

  // Extraer marcas únicas de los productos
  const availableBrands = useMemo(() => {
    const brands = [...new Set(allProducts.map(p => p.marca).filter(Boolean))];
    return brands.sort();
  }, [allProducts]);

  // Cargar categorías y todos los productos (para marcas)
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [categoriesData, productsData] = await Promise.all([
          productService.getCategories(),
          productService.getAllProducts({ size: 100 }) // Cargar todos para extraer marcas
        ]);
        setCategories(categoriesData);
        setAllProducts(productsData.content || []);
      } catch (err) {
        console.error('Error cargando datos iniciales:', err);
      }
    };
    loadInitialData();
  }, []);

  // Cargar productos
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [sortField, sortDir] = currentSort.split(',');
      
      const params = {
        page: currentPage,
        size: 12,
        sort: `${sortField},${sortDir}`,
      };

      if (currentSearch) {
        params.busqueda = currentSearch;
      }

      if (currentCategory) {
        params.categoriaId = currentCategory;
      }

      let data;
      if (currentCategory && !currentSearch) {
        data = await productService.getProductsByCategory(currentCategory, params);
      } else {
        data = await productService.getAllProducts(params);
      }

      // Filtros en frontend (el backend no tiene estos filtros)
      let filteredProducts = data.content || [];
      
      // Filtro por precio
      if (currentPriceRange) {
        const [min, max] = currentPriceRange.split('-').map(Number);
        filteredProducts = filteredProducts.filter(p => {
          const price = p.precioOferta || p.precio;
          return price >= min && price <= max;
        });
      }

      // Filtro por marca
      if (currentBrand) {
        filteredProducts = filteredProducts.filter(p => p.marca === currentBrand);
      }

      // Filtro por oferta
      if (currentOferta) {
        filteredProducts = filteredProducts.filter(p => p.tieneOferta);
      }

      setProducts(filteredProducts);
      setTotalProducts(data.totalElements || filteredProducts.length);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Error cargando productos:', err);
      setError('No se pudieron cargar los productos');
    } finally {
      setLoading(false);
    }
  }, [currentSearch, currentCategory, currentSort, currentPriceRange, currentBrand, currentOferta, currentPage]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Handlers para filtros
  const updateFilters = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    // Reset page when filters change
    if (key !== 'page') {
      newParams.delete('page');
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const hasActiveFilters = currentSearch || currentCategory || currentPriceRange || currentBrand || currentOferta;

  // Obtener nombre de categoría actual
  const currentCategoryName = categories.find(c => c.id.toString() === currentCategory)?.nombre;

  return (
    <div className="products-page">
      {/* Header */}
      <div className="products-header">
        <div className="products-header-content">
          <h1>
            {currentSearch ? (
              <>Resultados para "<span>{currentSearch}</span>"</>
            ) : currentCategoryName ? (
              currentCategoryName
            ) : (
              'Todos los Productos'
            )}
          </h1>
          <p className="products-count">
            {totalProducts} producto{totalProducts !== 1 ? 's' : ''} encontrado{totalProducts !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="products-container">
        {/* Sidebar Filters */}
        <aside className={`products-sidebar ${showFilters ? 'visible' : ''}`}>
          <div className="sidebar-header">
            <h2>Filtros</h2>
            {hasActiveFilters && (
              <button className="clear-filters" onClick={clearFilters}>
                Limpiar todo
              </button>
            )}
            <button className="close-filters" onClick={() => setShowFilters(false)}>
              ✕
            </button>
          </div>

          {/* Búsqueda */}
          <div className="filter-section">
            <h3>🔍 Búsqueda</h3>
            <div className="search-filter">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={currentSearch}
                onChange={(e) => updateFilters('busqueda', e.target.value)}
              />
              {currentSearch && (
                <button onClick={() => updateFilters('busqueda', '')}>✕</button>
              )}
            </div>
          </div>

          {/* Categorías */}
          <div className="filter-section">
            <h3>📁 Categorías</h3>
            <div className="category-list">
              <button
                className={`category-item ${!currentCategory ? 'active' : ''}`}
                onClick={() => updateFilters('categoria', '')}
              >
                Todas las categorías
                <span className="category-count">{totalProducts}</span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`category-item ${currentCategory === cat.id.toString() ? 'active' : ''}`}
                  onClick={() => updateFilters('categoria', cat.id.toString())}
                >
                  {cat.nombre}
                </button>
              ))}
            </div>
          </div>

          {/* Precio */}
          <div className="filter-section">
            <h3>💰 Precio</h3>
            <div className="price-list">
              {PRICE_RANGES.map((range) => (
                <label key={range.value} className="price-item">
                  <input
                    type="radio"
                    name="precio"
                    checked={currentPriceRange === range.value}
                    onChange={() => updateFilters('precio', range.value)}
                  />
                  <span>{range.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Marcas */}
          {availableBrands.length > 0 && (
            <div className="filter-section">
              <h3>🏷️ Marcas</h3>
              <div className="brand-list">
                <button
                  className={`brand-item ${!currentBrand ? 'active' : ''}`}
                  onClick={() => updateFilters('marca', '')}
                >
                  Todas las marcas
                </button>
                {availableBrands.map((brand) => (
                  <button
                    key={brand}
                    className={`brand-item ${currentBrand === brand ? 'active' : ''}`}
                    onClick={() => updateFilters('marca', brand)}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Ofertas */}
          <div className="filter-section">
            <h3>🔥 Especiales</h3>
            <label className="oferta-toggle">
              <input
                type="checkbox"
                checked={currentOferta}
                onChange={(e) => updateFilters('oferta', e.target.checked ? 'true' : '')}
              />
              <span className="toggle-slider"></span>
              <span className="toggle-label">Solo productos en oferta</span>
            </label>
          </div>
        </aside>

        {/* Main Content */}
        <main className="products-main">
          {/* Toolbar */}
          <div className="products-toolbar">
            <button 
              className="filter-toggle"
              onClick={() => setShowFilters(!showFilters)}
            >
              ⚙️ Filtros
              {hasActiveFilters && <span className="filter-badge"></span>}
            </button>

            <div className="toolbar-right">
              <div className="view-toggle">
                {VIEW_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    className={`view-btn ${viewMode === opt.value ? 'active' : ''}`}
                    onClick={() => setViewMode(opt.value)}
                    title={opt.label}
                  >
                    {opt.icon}
                  </button>
                ))}
              </div>

              <div className="sort-select">
                <label>Ordenar:</label>
                <select
                  value={currentSort}
                  onChange={(e) => updateFilters('sort', e.target.value)}
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Active Filters Tags */}
          {hasActiveFilters && (
            <div className="active-filters">
              {currentSearch && (
                <span className="filter-tag">
                  Búsqueda: {currentSearch}
                  <button onClick={() => updateFilters('busqueda', '')}>✕</button>
                </span>
              )}
              {currentCategoryName && (
                <span className="filter-tag">
                  {currentCategoryName}
                  <button onClick={() => updateFilters('categoria', '')}>✕</button>
                </span>
              )}
                {currentPriceRange && (
                <span className="filter-tag">
                  {PRICE_RANGES.find(r => r.value === currentPriceRange)?.label}
                  <button onClick={() => updateFilters('precio', '')}>✕</button>
                </span>
              )}
              {currentBrand && (
                <span className="filter-tag">
                  Marca: {currentBrand}
                  <button onClick={() => updateFilters('marca', '')}>✕</button>
                </span>
              )}
              {currentOferta && (
                <span className="filter-tag oferta-tag">
                  🔥 En oferta
                  <button onClick={() => updateFilters('oferta', '')}>✕</button>
                </span>
              )}
            </div>
          )}

          {/* Products Grid */}
          {loading ? (
            <div className="products-loading">
              <div className="loading-spinner"></div>
              <p>Cargando productos...</p>
            </div>
          ) : error ? (
            <div className="products-error">
              <p>{error}</p>
              <button onClick={loadProducts}>Reintentar</button>
            </div>
          ) : products.length === 0 ? (
            <div className="products-empty">
              <span className="empty-icon">🔍</span>
              <h3>No encontramos productos</h3>
              <p>Probá ajustando los filtros o buscando otra cosa</p>
              <button onClick={clearFilters}>Limpiar filtros</button>
            </div>
          ) : (
            <>
              <div className={`products-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
                {products.map((product) => (
                  <ProductCard key={product.id} producto={product} viewMode={viewMode} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="products-pagination">
                  <button
                    disabled={currentPage === 0}
                    onClick={() => updateFilters('page', (currentPage - 1).toString())}
                  >
                    ← Anterior
                  </button>
                  <span className="page-info">
                    Página {currentPage + 1} de {totalPages}
                  </span>
                  <button
                    disabled={currentPage >= totalPages - 1}
                    onClick={() => updateFilters('page', (currentPage + 1).toString())}
                  >
                    Siguiente →
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default ProductsPage;

