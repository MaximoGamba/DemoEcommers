import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../services/adminService';
import './AdminPage.css';

const ESTADOS = {
  PENDIENTE: { label: 'Pendiente', color: '#f59e0b', icon: '⏳' },
  CONFIRMADO: { label: 'Confirmado', color: '#3b82f6', icon: '✓' },
  PAGADO: { label: 'Pagado', color: '#10b981', icon: '💳' },
  EN_PREPARACION: { label: 'En Preparación', color: '#8b5cf6', icon: '📦' },
  ENVIADO: { label: 'Enviado', color: '#06b6d4', icon: '🚚' },
  ENTREGADO: { label: 'Entregado', color: '#22c55e', icon: '✅' },
  CANCELADO: { label: 'Cancelado', color: '#ef4444', icon: '❌' },
};

function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ordersData, statsData] = await Promise.all([
        filterStatus 
          ? adminService.getOrdersByStatus(filterStatus) 
          : adminService.getAllOrders(),
        adminService.getOrderStats(),
      ]);
      
      // ordersData puede ser paginado
      const ordersList = ordersData?.content || ordersData || [];
      setOrders(ordersList);
      setStats(statsData || {});
    } catch (err) {
      console.error('Error cargando datos:', err);
      setError('Error al cargar los pedidos');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = async (orderId, action) => {
    try {
      const actions = {
        confirmar: adminService.confirmOrder,
        pagar: adminService.markAsPaid,
        preparar: adminService.prepareOrder,
        enviar: adminService.shipOrder,
        entregar: adminService.deliverOrder,
        cancelar: adminService.cancelOrder,
      };

      if (action === 'cancelar' && !window.confirm('¿Estás seguro de cancelar este pedido?')) {
        return;
      }

      await actions[action](orderId);
      loadData();
      
      if (selectedOrder?.id === orderId) {
        const updated = await adminService.getOrderById(orderId);
        setSelectedOrder(updated);
      }
    } catch (err) {
      console.error('Error actualizando pedido:', err);
      alert('Error al actualizar el pedido');
    }
  };

  const openDetailModal = async (order) => {
    try {
      const detail = await adminService.getOrderById(order.id);
      setSelectedOrder(detail);
      setShowDetailModal(true);
    } catch (err) {
      console.error('Error cargando detalle:', err);
    }
  };

  const getNextAction = (estado) => {
    const flow = {
      PENDIENTE: { action: 'confirmar', label: 'Confirmar' },
      CONFIRMADO: { action: 'pagar', label: 'Marcar Pagado' },
      PAGADO: { action: 'preparar', label: 'En Preparación' },
      EN_PREPARACION: { action: 'enviar', label: 'Enviar' },
      ENVIADO: { action: 'entregar', label: 'Entregar' },
    };
    return flow[estado] || null;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Mapeo de estados a claves de estadísticas del backend
  const getStatKey = (estadoKey) => {
    const mapping = {
      PENDIENTE: 'pendientes',
      CONFIRMADO: 'confirmados',
      PAGADO: 'pagados',
      EN_PREPARACION: 'enPreparacion',
      ENVIADO: 'enviados',
      ENTREGADO: 'entregados',
      CANCELADO: 'cancelados',
    };
    return mapping[estadoKey] || estadoKey.toLowerCase();
  };

  const totalStats = Object.values(stats).reduce((a, b) => a + (b || 0), 0);

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
          <Link to="/admin/productos" className="nav-item">
            <span>📦</span> Productos
          </Link>
          <Link to="/admin/pedidos" className="nav-item active">
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
            <h1>📋 Gestión de Pedidos</h1>
            <p>Administrá y procesá los pedidos de la tienda</p>
          </div>
        </header>

        {/* Stats */}
        <div className="stats-grid orders-stats">
          <div 
            className={`stat-card ${!filterStatus ? 'selected' : ''}`}
            onClick={() => setFilterStatus('')}
          >
            <span className="stat-value">{totalStats}</span>
            <span className="stat-label">Total</span>
          </div>
          {Object.entries(ESTADOS).map(([key, { label, color, icon }]) => (
            <div 
              key={key}
              className={`stat-card clickable ${filterStatus === key ? 'selected' : ''}`}
              style={{ '--accent-color': color }}
              onClick={() => setFilterStatus(filterStatus === key ? '' : key)}
            >
              <span className="stat-value">
                <span className="stat-icon">{icon}</span>
                {stats[getStatKey(key)] || 0}
              </span>
              <span className="stat-label">{label}</span>
            </div>
          ))}
        </div>

        {/* Orders Table */}
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Cargando pedidos...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>{error}</p>
            <button onClick={loadData}>Reintentar</button>
          </div>
        ) : (
          <div className="data-table-container">
            <table className="data-table orders-table">
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => {
                  const estadoInfo = ESTADOS[order.estado] || ESTADOS.PENDIENTE;
                  const nextAction = getNextAction(order.estado);
                  
                  return (
                    <tr key={order.id}>
                      <td>
                        <div className="order-number-cell">
                          <span className="order-number">#{order.numeroPedido}</span>
                          <span className="order-items">{order.cantidadItems || order.detalles?.length || 0} items</span>
                        </div>
                      </td>
                      <td>
                        <div className="customer-cell">
                          <span className="customer-name">{order.usuarioNombre || 'Cliente'}</span>
                          <span className="customer-email">{order.usuarioEmail || '-'}</span>
                        </div>
                      </td>
                      <td>
                        <span className="date">{formatDate(order.fechaPedido)}</span>
                      </td>
                      <td>
                        <span className="total">${order.total?.toLocaleString('es-AR')}</span>
                      </td>
                      <td>
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: estadoInfo.color }}
                        >
                          {estadoInfo.icon} {estadoInfo.label}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="action-btn view"
                            onClick={() => openDetailModal(order)}
                            title="Ver detalle"
                          >
                            👁️
                          </button>
                          {nextAction && (
                            <button 
                              className="action-btn next-step"
                              onClick={() => handleQuickAction(order.id, nextAction.action)}
                              title={nextAction.label}
                            >
                              ▶️ {nextAction.label}
                            </button>
                          )}
                          {order.estado !== 'CANCELADO' && order.estado !== 'ENTREGADO' && (
                            <button 
                              className="action-btn cancel"
                              onClick={() => handleQuickAction(order.id, 'cancelar')}
                              title="Cancelar"
                            >
                              ❌
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {orders.length === 0 && (
              <div className="empty-table">
                <p>No se encontraron pedidos{filterStatus && ` con estado ${ESTADOS[filterStatus]?.label}`}</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Order Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal order-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Pedido #{selectedOrder.numeroPedido}</h3>
              <button className="close-btn" onClick={() => setShowDetailModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="order-detail-grid">
                {/* Estado */}
                <div className="detail-section">
                  <h4>Estado del Pedido</h4>
                  <div className="order-status-flow">
                    {Object.entries(ESTADOS).slice(0, -1).map(([key, { label, color, icon }]) => {
                      const isActive = selectedOrder.estado === key;
                      const isPassed = Object.keys(ESTADOS).indexOf(key) < Object.keys(ESTADOS).indexOf(selectedOrder.estado);
                      return (
                        <div 
                          key={key}
                          className={`flow-step ${isActive ? 'active' : ''} ${isPassed ? 'passed' : ''}`}
                          style={{ '--step-color': color }}
                        >
                          <span className="flow-icon">{icon}</span>
                          <span className="flow-label">{label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Info Cliente */}
                <div className="detail-section">
                  <h4>📍 Envío</h4>
                  <div className="info-grid">
                    <div>
                      <span className="label">Cliente:</span>
                      <span>{selectedOrder.usuarioNombre || '-'}</span>
                    </div>
                    <div>
                      <span className="label">Email:</span>
                      <span>{selectedOrder.usuarioEmail || '-'}</span>
                    </div>
                    <div>
                      <span className="label">Dirección:</span>
                      <span>{selectedOrder.direccionEnvio || '-'}</span>
                    </div>
                    <div>
                      <span className="label">Ciudad:</span>
                      <span>
                        {selectedOrder.ciudadEnvio || '-'}
                        {selectedOrder.codigoPostalEnvio && ` (${selectedOrder.codigoPostalEnvio})`}
                      </span>
                    </div>
                    <div>
                      <span className="label">Teléfono:</span>
                      <span>{selectedOrder.telefonoContacto || '-'}</span>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="detail-section">
                  <h4>🛒 Productos</h4>
                  <div className="order-items-list">
                    {(selectedOrder.detalles || []).map((item, idx) => (
                      <div key={idx} className="order-item">
                        <div className="item-image-placeholder">
                          <span>📦</span>
                        </div>
                        <div className="item-details">
                          <span className="item-name">{item.nombreProducto || 'Producto'}</span>
                          <span className="item-variant">
                            {item.color && `Color: ${item.color}`}
                            {item.talleNombre && ` | Talle: ${item.talleNombre}`}
                          </span>
                          {item.skuVariante && (
                            <span className="item-sku">SKU: {item.skuVariante}</span>
                          )}
                        </div>
                        <div className="item-qty">x{item.cantidad}</div>
                        <div className="item-price">
                          ${item.precioUnitario?.toLocaleString('es-AR')} c/u
                          <br />
                          <span className="item-subtotal">Total: ${item.subtotal?.toLocaleString('es-AR')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totales */}
                <div className="detail-section totals">
                  <div className="total-row">
                    <span>Subtotal:</span>
                    <span>${selectedOrder.subtotal?.toLocaleString('es-AR')}</span>
                  </div>
                  <div className="total-row">
                    <span>Envío:</span>
                    <span>${(selectedOrder.costoEnvio || 0)?.toLocaleString('es-AR')}</span>
                  </div>
                  {selectedOrder.descuento && selectedOrder.descuento > 0 && (
                    <div className="total-row discount">
                      <span>Descuento:</span>
                      <span>-${selectedOrder.descuento.toLocaleString('es-AR')}</span>
                    </div>
                  )}
                  <div className="total-row final">
                    <span>Total:</span>
                    <span>${selectedOrder.total?.toLocaleString('es-AR')}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="modal-actions">
                {getNextAction(selectedOrder.estado) && (
                  <button 
                    className="btn-primary"
                    onClick={() => handleQuickAction(selectedOrder.id, getNextAction(selectedOrder.estado).action)}
                  >
                    {getNextAction(selectedOrder.estado).label}
                  </button>
                )}
                {selectedOrder.estado !== 'CANCELADO' && selectedOrder.estado !== 'ENTREGADO' && (
                  <button 
                    className="btn-danger"
                    onClick={() => handleQuickAction(selectedOrder.id, 'cancelar')}
                  >
                    Cancelar Pedido
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrdersPage;
