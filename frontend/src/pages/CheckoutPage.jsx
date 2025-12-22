import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import orderService from '../services/orderService';
import couponService from '../services/couponService';
import MercadoPagoSimulator from '../components/MercadoPagoSimulator';
import './CheckoutPage.css';

const METODOS_PAGO = [
  { value: 'MERCADO_PAGO', label: 'Mercado Pago', icon: '🤝', recommended: true, description: 'Tarjetas, dinero en cuenta y más' },
  { value: 'TARJETA_CREDITO', label: 'Tarjeta de Crédito', icon: '💳', description: 'Visa, Mastercard, Amex' },
  { value: 'TARJETA_DEBITO', label: 'Tarjeta de Débito', icon: '💳', description: 'Débito inmediato' },
  { value: 'TRANSFERENCIA', label: 'Transferencia Bancaria', icon: '🏦', description: 'CBU o Alias' },
  { value: 'EFECTIVO_CONTRA_ENTREGA', label: 'Efectivo contra entrega', icon: '💵', description: 'Pagás cuando recibís' },
];

function CheckoutPage() {
  const navigate = useNavigate();
  const { items, total, isEmpty, clearCart, loading: cartLoading } = useCart();
  
  const [formData, setFormData] = useState({
    direccionEnvio: '',
    ciudadEnvio: '',
    codigoPostalEnvio: '',
    telefonoContacto: '',
    notas: '',
    metodoPago: 'MERCADO_PAGO',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1); // 1: Datos, 2: Pago, 3: Confirmar
  const [showMPSimulator, setShowMPSimulator] = useState(false);
  
  // Estado para cupón de descuento
  const [codigoCupon, setCodigoCupon] = useState('');
  const [cuponValidado, setCuponValidado] = useState(null);
  const [validandoCupon, setValidandoCupon] = useState(false);
  const [errorCupon, setErrorCupon] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const validateStep1 = () => {
    if (!formData.direccionEnvio.trim()) {
      setError('Por favor ingresá tu dirección de envío');
      return false;
    }
    if (!formData.ciudadEnvio.trim()) {
      setError('Por favor ingresá tu ciudad');
      return false;
    }
    if (!formData.telefonoContacto.trim()) {
      setError('Por favor ingresá tu teléfono de contacto');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (step === 1 && !validateStep1()) return;
    setStep((prev) => prev + 1);
    setError(null);
  };

  const handlePrevStep = () => {
    setStep((prev) => prev - 1);
    setError(null);
  };

  // Maneja el pago cuando se selecciona Mercado Pago o tarjetas
  const handlePayWithMP = () => {
    if (formData.metodoPago === 'MERCADO_PAGO' || 
        formData.metodoPago === 'TARJETA_CREDITO' || 
        formData.metodoPago === 'TARJETA_DEBITO') {
      setShowMPSimulator(true);
    } else {
      handleSubmitOrder();
    }
  };

  // Callback cuando el pago de MP es exitoso
  const handleMPSuccess = async (paymentData) => {
    setShowMPSimulator(false);
    
    // Actualizar el método de pago con el que realmente se pagó
    const updatedFormData = {
      ...formData,
      metodoPago: paymentData.metodoPago,
    };
    
    await handleSubmitOrder(updatedFormData, paymentData.referenciaPago);
  };

  const handleMPCancel = () => {
    setShowMPSimulator(false);
  };

  const handleSubmitOrder = async (overrideData = null, referenciaPago = null) => {
    try {
      setLoading(true);
      setError(null);

      const data = overrideData || formData;

      const orderData = {
        direccionEnvio: data.direccionEnvio,
        ciudadEnvio: data.ciudadEnvio,
        codigoPostalEnvio: data.codigoPostalEnvio || null,
        telefonoContacto: data.telefonoContacto,
        notas: data.notas || null,
        metodoPago: data.metodoPago,
        codigoCupon: cuponValidado ? codigoCupon.trim().toUpperCase() : null,
      };

      const createdOrder = await orderService.createOrder(orderData);
      
      // Agregar referencia de pago si existe
      if (referenciaPago) {
        createdOrder.referenciaPago = referenciaPago;
      }
      
      // Vaciar el carrito después de crear el pedido exitosamente
      await clearCart();

      // Redirigir a la página de confirmación
      navigate(`/pedido-confirmado/${createdOrder.id}`, { 
        state: { order: createdOrder } 
      });

    } catch (err) {
      console.error('Error al crear el pedido:', err);
      setError(err.response?.data?.message || 'Error al procesar tu pedido. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Validar cupón
  const handleValidarCupon = async () => {
    if (!codigoCupon.trim()) {
      setErrorCupon('Ingresá un código de cupón');
      return;
    }

    setValidandoCupon(true);
    setErrorCupon(null);

    try {
      const subtotal = total;
      const response = await couponService.validarCupon(codigoCupon, subtotal);
      
      if (response.valido) {
        setCuponValidado(response);
        setErrorCupon(null);
      } else {
        setCuponValidado(null);
        setErrorCupon(response.mensaje || 'Cupón inválido');
      }
    } catch (err) {
      setCuponValidado(null);
      setErrorCupon('Error al validar el cupón. Intenta nuevamente.');
      console.error('Error al validar cupón:', err);
    } finally {
      setValidandoCupon(false);
    }
  };

  // Remover cupón
  const handleRemoverCupon = () => {
    setCodigoCupon('');
    setCuponValidado(null);
    setErrorCupon(null);
  };

  // Calcular costo de envío (simulado)
  const costoEnvio = total > 50000 ? 0 : 2999;
  const descuento = cuponValidado?.descuentoAplicable || 0;
  const totalFinal = total + costoEnvio - descuento;

  if (cartLoading) {
    return (
      <div className="checkout-page">
        <div className="checkout-loading">Cargando...</div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty">
          <h2>Tu carrito está vacío</h2>
          <p>Agregá productos antes de proceder al checkout.</p>
          <Link to="/" className="btn-primary">Ver Productos</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Progress Steps */}
        <div className="checkout-progress">
          <div className={`progress-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">Envío</span>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Pago</span>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-label">Confirmar</span>
          </div>
        </div>

        <div className="checkout-content">
          {/* Formulario */}
          <div className="checkout-form-section">
            {/* Step 1: Datos de envío */}
            {step === 1 && (
              <div className="checkout-step">
                <h2>Datos de Envío</h2>
                <p className="step-description">Ingresá la dirección donde querés recibir tu pedido.</p>

                <div className="form-group">
                  <label htmlFor="direccionEnvio">Dirección *</label>
                  <input
                    type="text"
                    id="direccionEnvio"
                    name="direccionEnvio"
                    value={formData.direccionEnvio}
                    onChange={handleInputChange}
                    placeholder="Ej: Av. Corrientes 1234, Piso 5, Depto A"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="ciudadEnvio">Ciudad *</label>
                    <input
                      type="text"
                      id="ciudadEnvio"
                      name="ciudadEnvio"
                      value={formData.ciudadEnvio}
                      onChange={handleInputChange}
                      placeholder="Ej: Buenos Aires"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="codigoPostalEnvio">Código Postal</label>
                    <input
                      type="text"
                      id="codigoPostalEnvio"
                      name="codigoPostalEnvio"
                      value={formData.codigoPostalEnvio}
                      onChange={handleInputChange}
                      placeholder="Ej: 1414"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="telefonoContacto">Teléfono de contacto *</label>
                  <input
                    type="tel"
                    id="telefonoContacto"
                    name="telefonoContacto"
                    value={formData.telefonoContacto}
                    onChange={handleInputChange}
                    placeholder="Ej: 1155667788"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="notas">Notas adicionales (opcional)</label>
                  <textarea
                    id="notas"
                    name="notas"
                    value={formData.notas}
                    onChange={handleInputChange}
                    placeholder="Indicaciones para la entrega, horarios preferidos, etc."
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Método de pago */}
            {step === 2 && (
              <div className="checkout-step">
                <h2>Método de Pago</h2>
                <p className="step-description">Seleccioná cómo querés pagar tu compra.</p>

                <div className="payment-methods">
                  {METODOS_PAGO.map((metodo) => (
                    <label
                      key={metodo.value}
                      className={`payment-option ${formData.metodoPago === metodo.value ? 'selected' : ''} ${metodo.recommended ? 'recommended' : ''}`}
                    >
                      <input
                        type="radio"
                        name="metodoPago"
                        value={metodo.value}
                        checked={formData.metodoPago === metodo.value}
                        onChange={handleInputChange}
                      />
                      <span className="payment-icon">{metodo.icon}</span>
                      <div className="payment-info">
                        <span className="payment-label">
                          {metodo.label}
                          {metodo.recommended && <span className="recommended-badge">Recomendado</span>}
                        </span>
                        {metodo.description && (
                          <span className="payment-description">{metodo.description}</span>
                        )}
                      </div>
                      <span className="payment-check">
                        {formData.metodoPago === metodo.value && '✓'}
                      </span>
                    </label>
                  ))}
                </div>

                <div className="payment-notice">
                  <p>🔒 Tu información de pago está segura. Este es un demo con simulación de Mercado Pago.</p>
                </div>
              </div>
            )}

            {/* Step 3: Confirmación */}
            {step === 3 && (
              <div className="checkout-step">
                <h2>Confirmar Pedido</h2>
                <p className="step-description">Revisá los detalles antes de confirmar.</p>

                <div className="confirmation-details">
                  <div className="confirmation-section">
                    <h3>📦 Dirección de Envío</h3>
                    <p>{formData.direccionEnvio}</p>
                    <p>{formData.ciudadEnvio} {formData.codigoPostalEnvio && `(${formData.codigoPostalEnvio})`}</p>
                    <p>Tel: {formData.telefonoContacto}</p>
                    {formData.notas && <p className="notas">Notas: {formData.notas}</p>}
                  </div>

                  <div className="confirmation-section">
                    <h3>💳 Método de Pago</h3>
                    <p>
                      {METODOS_PAGO.find(m => m.value === formData.metodoPago)?.icon}{' '}
                      {METODOS_PAGO.find(m => m.value === formData.metodoPago)?.label}
                    </p>
                  </div>

                  <div className="confirmation-section">
                    <h3>🛒 Productos ({items.length})</h3>
                    <ul className="confirmation-items">
                      {items.map((item) => (
                        <li key={item.id}>
                          <span className="item-name">
                            {item.productoNombre} ({item.talleNombre})
                          </span>
                          <span className="item-qty">x{item.cantidad}</span>
                          <span className="item-price">
                            ${item.subtotal?.toLocaleString('es-AR')}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Error message */}
            {error && <div className="checkout-error">{error}</div>}

            {/* Navigation buttons */}
            <div className="checkout-actions">
              {step > 1 && (
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={handlePrevStep}
                  disabled={loading}
                >
                  ← Anterior
                </button>
              )}
              
              {step < 3 && (
                <button 
                  type="button" 
                  className="btn-primary" 
                  onClick={handleNextStep}
                >
                  Siguiente →
                </button>
              )}

              {step === 3 && (
                <button 
                  type="button" 
                  className="btn-confirm" 
                  onClick={handlePayWithMP}
                  disabled={loading}
                >
                  {loading ? 'Procesando...' : (
                    formData.metodoPago === 'MERCADO_PAGO' || 
                    formData.metodoPago === 'TARJETA_CREDITO' || 
                    formData.metodoPago === 'TARJETA_DEBITO'
                      ? '💳 Pagar con Mercado Pago'
                      : '✓ Confirmar Pedido'
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className="checkout-summary">
            <h3>Resumen del Pedido</h3>
            
            <div className="summary-items">
              {items.map((item) => (
                <div key={item.id} className="summary-item">
                  <img 
                    src={item.imagenUrl || 'https://via.placeholder.com/60'} 
                    alt={item.productoNombre} 
                  />
                  <div className="summary-item-info">
                    <span className="item-name">{item.productoNombre}</span>
                    <span className="item-variant">{item.talleNombre} {item.color && `- ${item.color}`}</span>
                    <span className="item-qty-price">
                      {item.cantidad} × ${item.precioUnitario?.toLocaleString('es-AR')}
                    </span>
                  </div>
                  <span className="item-subtotal">
                    ${item.subtotal?.toLocaleString('es-AR')}
                  </span>
                </div>
              ))}
            </div>

            {/* Campo de cupón */}
            <div className="coupon-section">
              {!cuponValidado ? (
                <div className="coupon-input-group">
                  <input
                    type="text"
                    placeholder="Código de cupón"
                    value={codigoCupon}
                    onChange={(e) => {
                      setCodigoCupon(e.target.value);
                      setErrorCupon(null);
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleValidarCupon();
                      }
                    }}
                    className="coupon-input"
                  />
                  <button
                    type="button"
                    onClick={handleValidarCupon}
                    disabled={validandoCupon || !codigoCupon.trim()}
                    className="coupon-button"
                  >
                    {validandoCupon ? 'Validando...' : 'Aplicar'}
                  </button>
                </div>
              ) : (
                <div className="coupon-applied">
                  <div className="coupon-info">
                    <span className="coupon-code">✓ {cuponValidado.cupon.codigo}</span>
                    <span className="coupon-discount">
                      -${descuento.toLocaleString('es-AR')}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoverCupon}
                    className="coupon-remove"
                  >
                    ✕
                  </button>
                </div>
              )}
              {errorCupon && (
                <div className="coupon-error">{errorCupon}</div>
              )}
            </div>

            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${total.toLocaleString('es-AR')}</span>
              </div>
              {cuponValidado && (
                <div className="summary-row discount">
                  <span>Descuento ({cuponValidado.cupon.codigo})</span>
                  <span className="discount-amount">
                    -${descuento.toLocaleString('es-AR')}
                  </span>
                </div>
              )}
              <div className="summary-row">
                <span>Envío</span>
                <span className={costoEnvio === 0 ? 'free-shipping' : ''}>
                  {costoEnvio === 0 ? '¡Gratis!' : `$${costoEnvio.toLocaleString('es-AR')}`}
                </span>
              </div>
              {costoEnvio > 0 && (
                <div className="shipping-notice">
                  ¡Comprá ${(50000 - total).toLocaleString('es-AR')} más para envío gratis!
                </div>
              )}
              <div className="summary-row total">
                <span>Total</span>
                <span>${totalFinal.toLocaleString('es-AR')}</span>
              </div>
            </div>

            <Link to="/carrito" className="edit-cart-link">
              ← Modificar carrito
            </Link>
          </div>
        </div>
      </div>

      {/* Mercado Pago Simulator Modal */}
      {showMPSimulator && (
        <MercadoPagoSimulator
          total={totalFinal}
          onSuccess={handleMPSuccess}
          onCancel={handleMPCancel}
          orderDetails={{
            items,
            direccion: formData.direccionEnvio,
            ciudad: formData.ciudadEnvio,
          }}
        />
      )}
    </div>
  );
}

export default CheckoutPage;
