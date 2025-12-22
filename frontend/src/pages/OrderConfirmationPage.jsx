import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import orderService from '../services/orderService';
import './OrderConfirmationPage.css';

function OrderConfirmationPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const { isAdmin } = useAuth();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!order && orderId) {
      const fetchOrder = async () => {
        try {
          setLoading(true);
          const fetchedOrder = await orderService.getOrderById(orderId);
          setOrder(fetchedOrder);
        } catch (err) {
          console.error('Error al cargar el pedido:', err);
          setError('No se pudo cargar la información del pedido.');
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [order, orderId]);

  if (loading) {
    return (
      <div className="confirmation-page">
        <div className="confirmation-loading">Cargando información del pedido...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="confirmation-page">
        <div className="confirmation-error">
          <h2>Error</h2>
          <p>{error}</p>
          <Link to="/" className="btn-primary">Volver al inicio</Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="confirmation-page">
        <div className="confirmation-error">
          <h2>Pedido no encontrado</h2>
          <Link to="/" className="btn-primary">Volver al inicio</Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getMetodoPagoLabel = (metodoPago) => {
    const metodos = {
      TARJETA_CREDITO: 'Tarjeta de Crédito',
      TARJETA_DEBITO: 'Tarjeta de Débito',
      TRANSFERENCIA: 'Transferencia Bancaria',
      MERCADO_PAGO: 'Mercado Pago',
      EFECTIVO_CONTRA_ENTREGA: 'Efectivo contra entrega',
    };
    return metodos[metodoPago] || metodoPago;
  };

  const getEstadoClass = (estado) => {
    const estados = {
      PENDIENTE: 'status-pending',
      CONFIRMADO: 'status-confirmed',
      PAGADO: 'status-paid',
      EN_PREPARACION: 'status-preparing',
      ENVIADO: 'status-shipped',
      ENTREGADO: 'status-delivered',
      CANCELADO: 'status-cancelled',
    };
    return estados[estado] || '';
  };

  return (
    <div className="confirmation-page">
      <div className="confirmation-container">
        {/* Success Header */}
        <div className="confirmation-header">
          <div className="success-icon">✓</div>
          <h1>¡Pedido Confirmado!</h1>
          <p>Gracias por tu compra. Tu pedido ha sido procesado exitosamente.</p>
        </div>

        {/* Order Number Card */}
        <div className="order-number-card">
          <span className="label">Número de Pedido</span>
          <span className="number">{order.numeroPedido}</span>
          <span className={`status ${getEstadoClass(order.estado)}`}>
            {order.estado}
          </span>
        </div>

        {/* Order Details Grid */}
        <div className="order-details-grid">
          {/* Shipping Info */}
          <div className="detail-card">
            <h3>📦 Envío</h3>
            <div className="detail-content">
              <p><strong>Dirección:</strong> {order.direccionEnvio}</p>
              <p><strong>Ciudad:</strong> {order.ciudadEnvio} {order.codigoPostalEnvio && `(${order.codigoPostalEnvio})`}</p>
              <p><strong>Teléfono:</strong> {order.telefonoContacto}</p>
              {order.notas && <p><strong>Notas:</strong> {order.notas}</p>}
            </div>
          </div>

          {/* Payment Info */}
          <div className="detail-card">
            <h3>💳 Pago</h3>
            <div className="detail-content">
              <p><strong>Método:</strong> {getMetodoPagoLabel(order.metodoPago)}</p>
              <p><strong>Fecha:</strong> {formatDate(order.fechaPedido)}</p>
              {order.referenciaPago && (
                <p><strong>Referencia:</strong> {order.referenciaPago}</p>
              )}
            </div>
          </div>
        </div>

        {/* Order Items */}
        {order.detalles && order.detalles.length > 0 && (
          <div className="order-items-section">
            <h3>🛍️ Productos</h3>
            <div className="order-items-list">
              {order.detalles.map((item, index) => (
                <div key={index} className="order-item">
                  <div className="item-info">
                    <span className="item-name">{item.productoNombre}</span>
                    <span className="item-variant">
                      {item.talleNombre} {item.color && `- ${item.color}`}
                    </span>
                  </div>
                  <div className="item-qty">x{item.cantidad}</div>
                  <div className="item-price">
                    ${item.subtotal?.toLocaleString('es-AR')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Order Totals */}
        <div className="order-totals">
          <div className="total-row">
            <span>Subtotal</span>
            <span>${order.subtotal?.toLocaleString('es-AR')}</span>
          </div>
          {order.costoEnvio > 0 && (
            <div className="total-row">
              <span>Envío</span>
              <span>${order.costoEnvio?.toLocaleString('es-AR')}</span>
            </div>
          )}
          {order.descuento > 0 && (
            <div className="total-row discount">
              <span>Descuento</span>
              <span>-${order.descuento?.toLocaleString('es-AR')}</span>
            </div>
          )}
          <div className="total-row final">
            <span>Total</span>
            <span>${order.total?.toLocaleString('es-AR')}</span>
          </div>
        </div>

        {/* Demo Notice */}
        <div className="demo-notice">
          <span className="demo-icon">ℹ️</span>
          <p>
            Este es un proyecto demo. No se procesarán pagos reales ni envíos. 
            Los datos son de demostración.
          </p>
        </div>

        {/* Actions */}
        <div className="confirmation-actions">
          <Link to="/" className="btn-primary">
            Seguir Comprando
          </Link>
          <Link 
            to={isAdmin ? "/admin/pedidos" : "/perfil"} 
            className="btn-secondary"
          >
            Ver Mis Pedidos
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmationPage;








