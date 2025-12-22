import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import orderService from '../services/orderService';
import './ProfilePage.css';

// Usuario demo
const DEMO_USER = {
  id: 1,
  nombre: 'Usuario',
  apellido: 'Demo',
  email: 'demo@menstyle.com',
  telefono: '1155667788',
  direccion: 'Av. Corrientes 1234, Piso 5',
  ciudad: 'Buenos Aires',
  codigoPostal: '1414',
};

// Estados de pedido con colores y labels
const ORDER_STATES = {
  PENDIENTE: { label: 'Pendiente', color: '#ffc107', icon: '⏳', step: 1 },
  CONFIRMADO: { label: 'Confirmado', color: '#17a2b8', icon: '✓', step: 2 },
  PAGADO: { label: 'Pagado', color: '#28a745', icon: '💳', step: 2 },
  EN_PREPARACION: { label: 'En preparación', color: '#6f42c1', icon: '📦', step: 3 },
  ENVIADO: { label: 'Enviado', color: '#007bff', icon: '🚚', step: 4 },
  ENTREGADO: { label: 'Entregado', color: '#c8a45d', icon: '✅', step: 5 },
  CANCELADO: { label: 'Cancelado', color: '#dc3545', icon: '❌', step: -1 },
  DEVUELTO: { label: 'Devuelto', color: '#6c757d', icon: '↩️', step: -1 },
};

function ProfilePage() {
  const [activeTab, setActiveTab] = useState('pedidos');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrders();
      setOrders(data || []);
    } catch (err) {
      console.error('Error cargando pedidos:', err);
      setError('No se pudieron cargar los pedidos');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('¿Estás seguro de que querés cancelar este pedido?')) {
      return;
    }
    
    try {
      await orderService.cancelOrder(orderId);
      loadOrders(); // Recargar la lista
    } catch (err) {
      console.error('Error cancelando pedido:', err);
      alert('No se pudo cancelar el pedido');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStateInfo = (estado) => {
    return ORDER_STATES[estado] || { label: estado, color: '#6c757d', icon: '❓', step: 0 };
  };

  const canCancel = (estado) => {
    return estado === 'PENDIENTE' || estado === 'CONFIRMADO';
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            <span>{DEMO_USER.nombre[0]}{DEMO_USER.apellido[0]}</span>
          </div>
          <div className="profile-info">
            <h1>{DEMO_USER.nombre} {DEMO_USER.apellido}</h1>
            <p className="profile-email">{DEMO_USER.email}</p>
            <span className="demo-badge">👤 Usuario Demo</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="profile-tabs">
          <button
            className={`tab-btn ${activeTab === 'pedidos' ? 'active' : ''}`}
            onClick={() => setActiveTab('pedidos')}
          >
            📦 Mis Pedidos
          </button>
          <button
            className={`tab-btn ${activeTab === 'datos' ? 'active' : ''}`}
            onClick={() => setActiveTab('datos')}
          >
            👤 Mis Datos
          </button>
        </div>

        {/* Tab Content */}
        <div className="profile-content">
          {/* Pedidos Tab */}
          {activeTab === 'pedidos' && (
            <div className="orders-section">
              <div className="section-header">
                <h2>Historial de Pedidos</h2>
                <span className="order-count">{orders.length} pedido{orders.length !== 1 ? 's' : ''}</span>
              </div>

              {loading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Cargando pedidos...</p>
                </div>
              ) : error ? (
                <div className="error-state">
                  <p>{error}</p>
                  <button onClick={loadOrders}>Reintentar</button>
                </div>
              ) : orders.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">📦</span>
                  <h3>No tenés pedidos todavía</h3>
                  <p>Cuando hagas tu primera compra, aparecerá acá.</p>
                  <Link to="/productos" className="btn-primary">Ver Productos</Link>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map((order) => {
                    const stateInfo = getStateInfo(order.estado);
                    const isExpanded = expandedOrder === order.id;
                    
                    return (
                      <div key={order.id} className={`order-card ${isExpanded ? 'expanded' : ''}`}>
                        {/* Order Header */}
                        <div 
                          className="order-header"
                          onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                        >
                          <div className="order-main-info">
                            <span className="order-number">{order.numeroPedido}</span>
                            <span className="order-date">{formatDate(order.fechaPedido)}</span>
                          </div>
                          
                          <div className="order-status" style={{ '--status-color': stateInfo.color }}>
                            <span className="status-icon">{stateInfo.icon}</span>
                            <span className="status-label">{stateInfo.label}</span>
                          </div>

                          <div className="order-total">
                            ${order.total?.toLocaleString('es-AR')}
                          </div>

                          <span className={`expand-icon ${isExpanded ? 'rotated' : ''}`}>
                            ▼
                          </span>
                        </div>

                        {/* Order Details (Expanded) */}
                        {isExpanded && (
                          <div className="order-details">
                            {/* Timeline */}
                            <div className="order-timeline">
                              {['PENDIENTE', 'CONFIRMADO', 'EN_PREPARACION', 'ENVIADO', 'ENTREGADO'].map((state, idx) => {
                                const info = ORDER_STATES[state];
                                const currentStep = ORDER_STATES[order.estado]?.step || 0;
                                const isActive = currentStep >= info.step && currentStep > 0;
                                const isCurrent = order.estado === state;
                                
                                return (
                                  <div 
                                    key={state} 
                                    className={`timeline-step ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''}`}
                                  >
                                    <div className="step-dot" style={{ '--step-color': info.color }}>
                                      {isActive ? info.icon : idx + 1}
                                    </div>
                                    <span className="step-label">{info.label}</span>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Order Info Grid */}
                            <div className="order-info-grid">
                              <div className="info-card">
                                <h4>📍 Dirección de Envío</h4>
                                <p>{order.direccionEnvio}</p>
                                <p>{order.ciudadEnvio} {order.codigoPostalEnvio && `(${order.codigoPostalEnvio})`}</p>
                                <p>Tel: {order.telefonoContacto}</p>
                              </div>

                              <div className="info-card">
                                <h4>💳 Pago</h4>
                                <p>{order.metodoPago?.replace(/_/g, ' ')}</p>
                                {order.referenciaPago && <p className="ref">Ref: {order.referenciaPago}</p>}
                                <p className="date">Fecha: {formatDateTime(order.fechaPedido)}</p>
                              </div>
                            </div>

                            {/* Products */}
                            {order.detalles && order.detalles.length > 0 && (
                              <div className="order-products">
                                <h4>Productos ({order.cantidadItems})</h4>
                                <div className="products-list">
                                  {order.detalles.map((item, idx) => (
                                    <div key={idx} className="product-item">
                                      <div className="product-info">
                                        <span className="product-name">{item.nombreProducto}</span>
                                        <span className="product-variant">
                                          {item.talleNombre} {item.color && `- ${item.color}`}
                                        </span>
                                      </div>
                                      <span className="product-qty">x{item.cantidad}</span>
                                      <span className="product-price">
                                        ${item.subtotal?.toLocaleString('es-AR')}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Order Summary */}
                            <div className="order-summary">
                              <div className="summary-row">
                                <span>Subtotal</span>
                                <span>${order.subtotal?.toLocaleString('es-AR')}</span>
                              </div>
                              {order.costoEnvio > 0 && (
                                <div className="summary-row">
                                  <span>Envío</span>
                                  <span>${order.costoEnvio?.toLocaleString('es-AR')}</span>
                                </div>
                              )}
                              {order.descuento > 0 && (
                                <div className="summary-row discount">
                                  <span>Descuento</span>
                                  <span>-${order.descuento?.toLocaleString('es-AR')}</span>
                                </div>
                              )}
                              <div className="summary-row total">
                                <span>Total</span>
                                <span>${order.total?.toLocaleString('es-AR')}</span>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="order-actions">
                              {canCancel(order.estado) && (
                                <button 
                                  className="btn-cancel"
                                  onClick={() => handleCancelOrder(order.id)}
                                >
                                  Cancelar Pedido
                                </button>
                              )}
                              <Link to={`/pedido-confirmado/${order.id}`} className="btn-view">
                                Ver Detalles Completos
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Datos Tab */}
          {activeTab === 'datos' && (
            <div className="datos-section">
              <div className="section-header">
                <h2>Mis Datos Personales</h2>
                <span className="demo-notice">🎮 Datos de demostración</span>
              </div>

              <div className="datos-grid">
                <div className="dato-card">
                  <label>Nombre completo</label>
                  <p>{DEMO_USER.nombre} {DEMO_USER.apellido}</p>
                </div>

                <div className="dato-card">
                  <label>Email</label>
                  <p>{DEMO_USER.email}</p>
                </div>

                <div className="dato-card">
                  <label>Teléfono</label>
                  <p>{DEMO_USER.telefono}</p>
                </div>

                <div className="dato-card full-width">
                  <label>Dirección</label>
                  <p>{DEMO_USER.direccion}</p>
                </div>

                <div className="dato-card">
                  <label>Ciudad</label>
                  <p>{DEMO_USER.ciudad}</p>
                </div>

                <div className="dato-card">
                  <label>Código Postal</label>
                  <p>{DEMO_USER.codigoPostal}</p>
                </div>
              </div>

              <div className="datos-notice">
                <p>
                  💡 Este es un proyecto demo. En una aplicación real, podrías editar 
                  tus datos personales, cambiar tu contraseña y gestionar tus preferencias.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
