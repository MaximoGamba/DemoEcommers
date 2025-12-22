import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../services/adminService';
import productService from '../services/productService';
import './AdminPage.css';

function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    precioOferta: '',
    categoriaId: '',
    marca: '',
    material: '',
    imagenPrincipalUrl: '',
    sku: '',
    activo: true,
    destacado: false,
  });
  const [productImages, setProductImages] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        adminService.getAllProducts(),
        productService.getCategories(),
      ]);
      setProducts(productsData || []);
      setCategories(categoriesData || []);
    } catch (err) {
      console.error('Error cargando datos:', err);
      setError('Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '',
      precioOferta: '',
      categoriaId: categories[0]?.id || '',
      marca: '',
      material: '',
      imagenPrincipalUrl: '',
      sku: '',
      activo: true,
      destacado: false,
    });
    setProductImages([]);
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      nombre: product.nombre || '',
      descripcion: product.descripcion || '',
      precio: product.precio?.toString() || '',
      precioOferta: product.precioOferta?.toString() || '',
      categoriaId: product.categoriaId || '',
      marca: product.marca || '',
      material: product.material || '',
      imagenPrincipalUrl: product.imagenPrincipalUrl || '',
      sku: product.sku || '',
      activo: product.activo ?? true,
      destacado: product.destacado ?? false,
    });
    // Cargar imágenes del producto si existen
    setProductImages(product.imagenes ? product.imagenes.map(img => ({
      url: img.url,
      descripcion: img.descripcion || '',
      orden: img.orden || 0,
      esPrincipal: img.esPrincipal || false
    })) : []);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        precio: parseFloat(formData.precio),
        precioOferta: formData.precioOferta ? parseFloat(formData.precioOferta) : null,
        categoriaId: parseInt(formData.categoriaId),
        imagenes: productImages.filter(img => img.url && img.url.trim() !== ''),
      };

      if (editingProduct) {
        await adminService.updateProduct(editingProduct.id, data);
      } else {
        await adminService.createProduct(data);
      }

      setShowModal(false);
      loadData();
    } catch (err) {
      console.error('Error guardando producto:', err);
      alert('Error al guardar el producto');
    }
  };

  const addImage = () => {
    setProductImages([...productImages, { url: '', descripcion: '', orden: productImages.length, esPrincipal: false }]);
  };

  const removeImage = (index) => {
    setProductImages(productImages.filter((_, i) => i !== index));
  };

  const updateImage = (index, field, value) => {
    const updated = [...productImages];
    updated[index] = { ...updated[index], [field]: value };
    setProductImages(updated);
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`¿Estás seguro de eliminar "${product.nombre}"?`)) {
      return;
    }

    try {
      await adminService.deleteProduct(product.id);
      loadData();
    } catch (err) {
      console.error('Error eliminando producto:', err);
      alert('Error al eliminar el producto');
    }
  };

  const toggleActive = async (product) => {
    // Actualización optimista: actualizar el estado local inmediatamente
    const newActiveState = !product.activo;
    setProducts(prevProducts => 
      prevProducts.map(p => 
        p.id === product.id ? { ...p, activo: newActiveState } : p
      )
    );

    try {
      await adminService.updateProduct(product.id, {
        ...product,
        activo: newActiveState,
      });
      // No necesitamos recargar, ya actualizamos el estado local
    } catch (err) {
      console.error('Error actualizando producto:', err);
      // Revertir el cambio si hay error
      setProducts(prevProducts => 
        prevProducts.map(p => 
          p.id === product.id ? { ...p, activo: product.activo } : p
        )
      );
      alert('Error al actualizar el producto. Por favor, intentá nuevamente.');
    }
  };

  const toggleFeatured = async (product) => {
    // Actualización optimista: actualizar el estado local inmediatamente
    const newFeaturedState = !product.destacado;
    setProducts(prevProducts => 
      prevProducts.map(p => 
        p.id === product.id ? { ...p, destacado: newFeaturedState } : p
      )
    );

    try {
      await adminService.updateProduct(product.id, {
        ...product,
        destacado: newFeaturedState,
      });
      // No necesitamos recargar, ya actualizamos el estado local
    } catch (err) {
      console.error('Error actualizando producto:', err);
      // Revertir el cambio si hay error
      setProducts(prevProducts => 
        prevProducts.map(p => 
          p.id === product.id ? { ...p, destacado: product.destacado } : p
        )
      );
      alert('Error al actualizar el producto. Por favor, intentá nuevamente.');
    }
  };

  // Filtrar productos
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || p.categoriaId?.toString() === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Estadísticas
  const stats = {
    total: products.length,
    activos: products.filter(p => p.activo).length,
    inactivos: products.filter(p => !p.activo).length,
    destacados: products.filter(p => p.destacado).length,
    enOferta: products.filter(p => p.tieneOferta).length,
    sinStock: products.filter(p => !p.tieneStock).length,
  };

  return (
    <div className="admin-page">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <span className="admin-icon">⚙️</span>
          <h2>Admin Panel</h2>
        </div>
        <nav className="sidebar-nav">
          <Link to="/admin" className="nav-item">
            <span>📊</span> Dashboard
          </Link>
          <Link to="/admin/productos" className="nav-item active">
            <span>📦</span> Productos
          </Link>
          <Link to="/admin/pedidos" className="nav-item">
            <span>📋</span> Pedidos
          </Link>
          <Link to="/" className="nav-item back-link">
            <span>←</span> Volver a la tienda
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <div className="header-title">
            <h1>📦 Gestión de Productos</h1>
            <p>Administrá tu catálogo de productos</p>
          </div>
          <button className="btn-primary" onClick={openCreateModal}>
            + Nuevo Producto
          </button>
        </header>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-card success">
            <span className="stat-value">{stats.activos}</span>
            <span className="stat-label">Activos</span>
          </div>
          <div className="stat-card warning">
            <span className="stat-value">{stats.inactivos}</span>
            <span className="stat-label">Inactivos</span>
          </div>
          <div className="stat-card info">
            <span className="stat-value">{stats.destacados}</span>
            <span className="stat-label">Destacados</span>
          </div>
          <div className="stat-card danger">
            <span className="stat-value">{stats.sinStock}</span>
            <span className="stat-label">Sin Stock</span>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-bar">
          <div className="search-box">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Buscar por nombre o SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </select>
        </div>

        {/* Products Table */}
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Cargando productos...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>{error}</p>
            <button onClick={loadData}>Reintentar</button>
          </div>
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>SKU</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.id} className={!product.activo ? 'inactive' : ''}>
                    <td>
                      <div className="product-cell">
                        <img 
                          src={product.imagenPrincipalUrl || 'https://via.placeholder.com/50'} 
                          alt={product.nombre}
                        />
                        <div className="product-info">
                          <span className="product-name">{product.nombre}</span>
                          <span className="product-brand">{product.marca}</span>
                        </div>
                        {(product.destacado || product.tieneOferta) && (
                          <div className="product-badges">
                            {product.destacado && <span className="badge featured" title="Producto destacado">⭐</span>}
                            {product.tieneOferta && <span className="badge sale" title="Producto en oferta">%</span>}
                          </div>
                        )}
                      </div>
                    </td>
                    <td><code>{product.sku}</code></td>
                    <td>{product.categoriaNombre}</td>
                    <td>
                      {product.tieneOferta ? (
                        <div className="price-cell">
                          <span className="price-original">${product.precio?.toLocaleString('es-AR')}</span>
                          <span className="price-sale">${product.precioOferta?.toLocaleString('es-AR')}</span>
                        </div>
                      ) : (
                        <span>${product.precio?.toLocaleString('es-AR')}</span>
                      )}
                    </td>
                    <td>
                      <span className={`stock-badge ${product.tieneStock ? 'in-stock' : 'no-stock'}`}>
                        {product.stockTotal || 0}
                      </span>
                    </td>
                    <td>
                      <button 
                        className={`toggle-btn ${product.activo ? 'active' : ''}`}
                        onClick={() => toggleActive(product)}
                        title={product.activo ? 'Desactivar' : 'Activar'}
                      >
                        {product.activo ? '✓ Activo' : '✕ Inactivo'}
                      </button>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className={`action-btn star ${product.destacado ? 'active' : ''}`}
                          onClick={() => toggleFeatured(product)}
                          title={product.destacado ? 'Quitar destacado' : 'Destacar'}
                        >
                          {product.destacado ? '★' : '☆'}
                        </button>
                        <button 
                          className="action-btn edit"
                          onClick={() => openEditModal(product)}
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button 
                          className="action-btn delete"
                          onClick={() => handleDelete(product)}
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredProducts.length === 0 && (
              <div className="empty-table">
                <p>No se encontraron productos</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label>Nombre *</label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>SKU</label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Descripción</label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Precio *</label>
                    <input
                      type="number"
                      name="precio"
                      value={formData.precio}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Precio Oferta</label>
                    <input
                      type="number"
                      name="precioOferta"
                      value={formData.precioOferta}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Categoría *</label>
                    <select
                      name="categoriaId"
                      value={formData.categoriaId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Seleccionar...</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Marca</label>
                    <input
                      type="text"
                      name="marca"
                      value={formData.marca}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Material</label>
                  <input
                    type="text"
                    name="material"
                    value={formData.material}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>URL de Imagen Principal</label>
                  <input
                    type="url"
                    name="imagenPrincipalUrl"
                    value={formData.imagenPrincipalUrl}
                    onChange={handleInputChange}
                    placeholder="https://..."
                  />
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <label>Imágenes Adicionales</label>
                    <button type="button" onClick={addImage} style={{ padding: '5px 15px', background: 'var(--color-accent)', color: '#0a0a0a', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                      + Agregar Imagen
                    </button>
                  </div>
                  {productImages.map((img, index) => (
                    <div key={index} style={{ marginBottom: '15px', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <strong>Imagen {index + 1}</strong>
                        <button type="button" onClick={() => removeImage(index)} style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer' }}>
                          Eliminar
                        </button>
                      </div>
                      <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>URL *</label>
                        <input
                          type="url"
                          value={img.url}
                          onChange={(e) => updateImage(index, 'url', e.target.value)}
                          placeholder="https://..."
                          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.3)', color: 'white' }}
                        />
                      </div>
                      <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Descripción (ej: "Frente", "Dorso", "Detalle")</label>
                        <input
                          type="text"
                          value={img.descripcion}
                          onChange={(e) => updateImage(index, 'descripcion', e.target.value)}
                          placeholder="Frente, Dorso, etc."
                          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.3)', color: 'white' }}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '15px' }}>
                        <div style={{ flex: 1 }}>
                          <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Orden</label>
                          <input
                            type="number"
                            value={img.orden}
                            onChange={(e) => updateImage(index, 'orden', parseInt(e.target.value) || 0)}
                            min="0"
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.3)', color: 'white' }}
                          />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '25px' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={img.esPrincipal}
                              onChange={(e) => updateImage(index, 'esPrincipal', e.target.checked)}
                            />
                            <span style={{ fontSize: '0.9rem' }}>Principal</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                  {productImages.length === 0 && (
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                      No hay imágenes adicionales. Hacé clic en "Agregar Imagen" para añadir fotos del producto.
                    </p>
                  )}
                </div>

                <div className="form-row checkboxes">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="activo"
                      checked={formData.activo}
                      onChange={handleInputChange}
                    />
                    <span>Producto activo</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="destacado"
                      checked={formData.destacado}
                      onChange={handleInputChange}
                    />
                    <span>Producto destacado</span>
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProductsPage;
