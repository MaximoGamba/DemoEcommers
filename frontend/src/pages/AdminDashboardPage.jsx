import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import adminService from '../services/adminService';
import MetricsCards from '../components/MetricsCards';
import { useAuth } from '../context/AuthContext';
import './AdminPage.css';

function AdminDashboardPage() {
  const { isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    products: { total: 0, active: 0, outOfStock: 0, featured: 0 },
    orders: {},
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Verificar que el usuario sea admin
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/login');
    }
  }, [isAdmin, isAuthenticated, navigate]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [products, orderStats, recent] = await Promise.all([
        adminService.getAllProducts(),
        adminService.getOrderStats(),
        adminService.getRecentOrders(),
      ]);

      // Calcular stats de productos
      const productsList = products || [];
      const productStats = {
        total: productsList.length,
        active: productsList.filter(p => p.activo).length,
        outOfStock: productsList.filter(p => !p.tieneStock).length,
        featured: productsList.filter(p => p.destacado).length,
        onSale: productsList.filter(p => p.tieneOferta).length,
      };

      setStats({
        products: productStats,
        orders: orderStats || {},
      });
      setRecentOrders(recent || []);
    } catch (err) {
      console.error('Error cargando dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getEstadoStyle = (estado) => {
    const styles = {
      PENDIENTE: { bg: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', icon: '⏳' },
      CONFIRMADO: { bg: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6', icon: '✓' },
      PAGADO: { bg: 'rgba(16, 185, 129, 0.2)', color: '#10b981', icon: '💳' },
      EN_PREPARACION: { bg: 'rgba(139, 92, 246, 0.2)', color: '#8b5cf6', icon: '📦' },
      ENVIADO: { bg: 'rgba(6, 182, 212, 0.2)', color: '#06b6d4', icon: '🚚' },
      ENTREGADO: { bg: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', icon: '✅' },
      CANCELADO: { bg: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', icon: '❌' },
    };
    return styles[estado] || styles.PENDIENTE;
  };

  const totalOrders = Object.values(stats.orders).reduce((a, b) => a + (b || 0), 0);
  const pendingOrders = (stats.orders.pendientes || 0) + (stats.orders.confirmados || 0);

  return (
    <div className="admin-page">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <span className="admin-icon">⚙️</span>
          <h2>Admin Panel</h2>
        </div>
        <nav className="sidebar-nav">
          <Link to="/admin" className="nav-item active">
            <span>📊</span> Dashboard
          </Link>
          <Link to="/admin/productos" className="nav-item">
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
            <h1>📊 Dashboard</h1>
            <p>Resumen general de tu tienda</p>
          </div>
        </header>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Cargando datos...</p>
          </div>
        ) : (
          <>
            {/* Métricas Avanzadas de Ventas - Solo para Admin */}
            {isAdmin && <MetricsCards />}

            {/* Overview Stats */}
            <div className="dashboard-overview">
              <div className="overview-card products">
                <div className="overview-icon">📦</div>
                <div className="overview-content">
                  <span className="overview-value">{stats.products.total}</span>
                  <span className="overview-label">Productos</span>
                </div>
                <div className="overview-meta">
                  <span className="meta-item success">{stats.products.active} activos</span>
                  <span className="meta-item warning">{stats.products.outOfStock} sin stock</span>
                </div>
                <Link to="/admin/productos" className="overview-link">Ver todos →</Link>
              </div>

              <div className="overview-card orders">
                <div className="overview-icon">📋</div>
                <div className="overview-content">
                  <span className="overview-value">{totalOrders}</span>
                  <span className="overview-label">Pedidos totales</span>
                </div>
                <div className="overview-meta">
                  <span className="meta-item warning">{pendingOrders} por procesar</span>
                  <span className="meta-item success">{stats.orders.entregados || 0} entregados</span>
                </div>
                <Link to="/admin/pedidos" className="overview-link">Ver todos →</Link>
              </div>

              <div className="overview-card alerts">
                <div className="overview-icon">⚠️</div>
                <div className="overview-content">
                  <span className="overview-value">{stats.products.outOfStock}</span>
                  <span className="overview-label">Alertas de stock</span>
                </div>
                <div className="overview-meta">
                  <span className="meta-item danger">Productos sin stock</span>
                </div>
                <Link to="/admin/productos" className="overview-link">Revisar →</Link>
              </div>

              <div className="overview-card featured">
                <div className="overview-icon">⭐</div>
                <div className="overview-content">
                  <span className="overview-value">{stats.products.featured}</span>
                  <span className="overview-label">Destacados</span>
                </div>
                <div className="overview-meta">
                  <span className="meta-item info">{stats.products.onSale} en oferta</span>
                </div>
                <Link to="/admin/productos" className="overview-link">Gestionar →</Link>
              </div>
            </div>

            {/* Order Status Distribution */}
            <div className="dashboard-section">
              <h2>📊 Estado de Pedidos</h2>
              <div className="order-distribution">
                {Object.entries({
                  PENDIENTE: { label: 'Pendientes', value: stats.orders.pendientes || 0 },
                  CONFIRMADO: { label: 'Confirmados', value: stats.orders.confirmados || 0 },
                  PAGADO: { label: 'Pagados', value: stats.orders.pagados || 0 },
                  EN_PREPARACION: { label: 'En Preparación', value: stats.orders.enPreparacion || 0 },
                  ENVIADO: { label: 'Enviados', value: stats.orders.enviados || 0 },
                  ENTREGADO: { label: 'Entregados', value: stats.orders.entregados || 0 },
                  CANCELADO: { label: 'Cancelados', value: stats.orders.cancelados || 0 },
                }).map(([key, { label, value }]) => {
                  const style = getEstadoStyle(key);
                  const percentage = totalOrders > 0 ? (value / totalOrders) * 100 : 0;
                  return (
                    <div key={key} className="distribution-item">
                      <div className="distribution-header">
                        <span className="distribution-icon" style={{ backgroundColor: style.bg, color: style.color }}>
                          {style.icon}
                        </span>
                        <span className="distribution-label">{label}</span>
                        <span className="distribution-value">{value}</span>
                      </div>
                      <div className="distribution-bar">
                        <div 
                          className="distribution-fill"
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: style.color 
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Orders */}
            <div className="dashboard-section">
              <div className="section-header">
                <h2>🕐 Pedidos Recientes</h2>
                <Link to="/admin/pedidos" className="view-all-link">Ver todos →</Link>
              </div>
              <div className="recent-orders-list">
                {recentOrders.length === 0 ? (
                  <div className="empty-state">
                    <p>No hay pedidos recientes</p>
                  </div>
                ) : (
                  recentOrders.slice(0, 5).map(order => {
                    const style = getEstadoStyle(order.estado);
                    return (
                      <div key={order.id} className="recent-order-item">
                        <div className="order-info">
                          <span className="order-number">#{order.numeroPedido}</span>
                          <span className="order-date">{formatDate(order.fechaPedido)}</span>
                        </div>
                        <div className="order-customer">
                          {order.nombreCliente || order.direccionEnvio?.nombre || 'Cliente'}
                        </div>
                        <div className="order-total">
                          ${order.total?.toLocaleString('es-AR')}
                        </div>
                        <span 
                          className="order-status"
                          style={{ backgroundColor: style.bg, color: style.color }}
                        >
                          {style.icon} {order.estado?.replace('_', ' ')}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="dashboard-section">
              <h2>⚡ Acciones Rápidas</h2>
              <div className="quick-actions">
                <Link to="/admin/productos" className="quick-action">
                  <span className="action-icon">➕</span>
                  <span>Agregar Producto</span>
                </Link>
                <Link to="/admin/pedidos?estado=PENDIENTE" className="quick-action">
                  <span className="action-icon">📋</span>
                  <span>Pedidos Pendientes</span>
                </Link>
                <Link to="/productos" className="quick-action">
                  <span className="action-icon">🛒</span>
                  <span>Ver Tienda</span>
                </Link>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default AdminDashboardPage;

















