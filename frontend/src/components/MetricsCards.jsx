import { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import './MetricsCards.css';

function MetricsCards() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState('mes');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [previousMetrics, setPreviousMetrics] = useState(null);

  const loadMetrics = async () => {
    try {
      setIsTransitioning(true);
      
      // Guardar métricas anteriores para animación
      if (metrics) {
        setPreviousMetrics(metrics);
      }
      
      // Pequeño delay para iniciar la animación de fade out
      await new Promise(resolve => setTimeout(resolve, 100));
      
      setLoading(true);
      
      // Cargar nuevas métricas
      const data = await adminService.getSalesMetrics(periodo);
      
      // Pequeño delay antes de mostrar nuevas métricas
      await new Promise(resolve => setTimeout(resolve, 150));
      
      setMetrics(data);
      setLoading(false);
      
      // Delay final para completar la transición
      await new Promise(resolve => setTimeout(resolve, 200));
      setPreviousMetrics(null);
    } catch (err) {
      console.error('Error cargando métricas:', err);
      setLoading(false);
    } finally {
      setIsTransitioning(false);
    }
  };

  useEffect(() => {
    loadMetrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [periodo]);

  const handlePeriodChange = (newPeriodo) => {
    if (newPeriodo !== periodo && !isTransitioning) {
      setPeriodo(newPeriodo);
    }
  };

  const formatCurrency = (value) => {
    if (!value) return '$0';
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value) => {
    if (value === null || value === undefined) return '0%';
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  const getChangeColor = (value) => {
    if (value >= 0) return '#10b981'; // verde
    return '#ef4444'; // rojo
  };

  const getChangeIcon = (value) => {
    if (value >= 0) return '↑';
    return '↓';
  };

  if (loading) {
    return (
      <div className="metrics-cards-loading">
        <div className="spinner"></div>
        <p>Cargando métricas...</p>
      </div>
    );
  }

  if (!metrics) {
    return <div className="metrics-cards-error">No se pudieron cargar las métricas</div>;
  }

  return (
    <div className="metrics-cards-container">
      {/* Selector de período */}
      <div className="period-selector">
        <button
          className={`period-btn ${periodo === 'hoy' ? 'active' : ''} ${isTransitioning ? 'disabled' : ''}`}
          onClick={() => handlePeriodChange('hoy')}
          disabled={isTransitioning}
        >
          <span>Hoy</span>
          {periodo === 'hoy' && <span className="active-indicator"></span>}
        </button>
        <button
          className={`period-btn ${periodo === 'semana' ? 'active' : ''} ${isTransitioning ? 'disabled' : ''}`}
          onClick={() => handlePeriodChange('semana')}
          disabled={isTransitioning}
        >
          <span>Esta Semana</span>
          {periodo === 'semana' && <span className="active-indicator"></span>}
        </button>
        <button
          className={`period-btn ${periodo === 'mes' ? 'active' : ''} ${isTransitioning ? 'disabled' : ''}`}
          onClick={() => handlePeriodChange('mes')}
          disabled={isTransitioning}
        >
          <span>Este Mes</span>
          {periodo === 'mes' && <span className="active-indicator"></span>}
        </button>
        <button
          className={`period-btn ${periodo === 'año' ? 'active' : ''} ${isTransitioning ? 'disabled' : ''}`}
          onClick={() => handlePeriodChange('año')}
          disabled={isTransitioning}
        >
          <span>Este Año</span>
          {periodo === 'año' && <span className="active-indicator"></span>}
        </button>
      </div>

      {/* Cards de métricas */}
      <div className={`metrics-cards-grid ${isTransitioning ? 'transitioning' : ''}`}>
        {/* Card: Ventas Totales */}
        <div className={`metric-card sales ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
          <div className="metric-header">
            <span className="metric-icon">💰</span>
            <h3>Ventas Totales</h3>
          </div>
          <div className="metric-value-wrapper">
            {isTransitioning && previousMetrics ? (
              <div className="metric-value old-value">{formatCurrency(previousMetrics.ventas)}</div>
            ) : null}
            <div className={`metric-value ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
              {formatCurrency(metrics.ventas)}
            </div>
          </div>
          <div className="metric-change" style={{ color: getChangeColor(metrics.cambioVentas) }}>
            <span className="change-icon">{getChangeIcon(metrics.cambioVentas)}</span>
            <span>{formatPercentage(metrics.cambioVentas)}</span>
            <span className="change-label">vs período anterior</span>
          </div>
          <div className="metric-subtitle">
            Período anterior: {formatCurrency(metrics.ventasAnterior)}
          </div>
        </div>

        {/* Card: Número de Pedidos */}
        <div className={`metric-card orders ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
          <div className="metric-header">
            <span className="metric-icon">📦</span>
            <h3>Pedidos</h3>
          </div>
          <div className="metric-value-wrapper">
            {isTransitioning && previousMetrics ? (
              <div className="metric-value old-value">{previousMetrics.pedidos}</div>
            ) : null}
            <div className={`metric-value ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
              {metrics.pedidos}
            </div>
          </div>
          <div className="metric-change" style={{ color: getChangeColor(metrics.cambioPedidos) }}>
            <span className="change-icon">{getChangeIcon(metrics.cambioPedidos)}</span>
            <span>{formatPercentage(metrics.cambioPedidos)}</span>
            <span className="change-label">vs período anterior</span>
          </div>
          <div className="metric-subtitle">
            Período anterior: {metrics.pedidosAnterior} pedidos
          </div>
        </div>

        {/* Card: Ticket Promedio */}
        <div className={`metric-card ticket ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
          <div className="metric-header">
            <span className="metric-icon">🎫</span>
            <h3>Ticket Promedio</h3>
          </div>
          <div className="metric-value-wrapper">
            {isTransitioning && previousMetrics ? (
              <div className="metric-value old-value">{formatCurrency(previousMetrics.ticketPromedio)}</div>
            ) : null}
            <div className={`metric-value ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
              {formatCurrency(metrics.ticketPromedio)}
            </div>
          </div>
          <div className="metric-change" style={{ color: getChangeColor(metrics.cambioTicket) }}>
            <span className="change-icon">{getChangeIcon(metrics.cambioTicket)}</span>
            <span>{formatPercentage(metrics.cambioTicket)}</span>
            <span className="change-label">vs período anterior</span>
          </div>
          <div className="metric-subtitle">
            Período anterior: {formatCurrency(metrics.ticketPromedioAnterior)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MetricsCards;

