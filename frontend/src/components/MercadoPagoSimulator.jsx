import { useState, useEffect } from 'react';
import './MercadoPagoSimulator.css';

const DEMO_CARDS = [
  { number: '4509 9535 6623 3704', name: 'VISA', cvv: '123', expiry: '11/26' },
  { number: '5031 7557 3453 0604', name: 'MASTERCARD', cvv: '456', expiry: '12/27' },
];

function MercadoPagoSimulator({ total, onSuccess, onCancel, orderDetails }) {
  const [step, setStep] = useState('select'); // select, card, processing, success, error
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
    installments: '1',
  });
  const [error, setError] = useState('');

  const paymentMethods = [
    { id: 'credit', name: 'Tarjeta de crédito', icon: '💳', installments: true },
    { id: 'debit', name: 'Tarjeta de débito', icon: '💳', installments: false },
    { id: 'account_money', name: 'Dinero en cuenta', icon: '💰', balance: 150000 },
    { id: 'transfer', name: 'Transferencia bancaria', icon: '🏦' },
  ];

  const installmentOptions = [
    { value: '1', label: '1 cuota sin interés', multiplier: 1 },
    { value: '3', label: '3 cuotas sin interés', multiplier: 1 },
    { value: '6', label: '6 cuotas sin interés', multiplier: 1 },
    { value: '12', label: '12 cuotas (CFT: 89%)', multiplier: 1.35 },
  ];

  const formatCardNumber = (value) => {
    const numbers = value.replace(/\D/g, '');
    const groups = numbers.match(/.{1,4}/g) || [];
    return groups.join(' ').substr(0, 19);
  };

  const formatExpiry = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length >= 2) {
      return numbers.substr(0, 2) + '/' + numbers.substr(2, 2);
    }
    return numbers;
  };

  const handleCardInput = (field, value) => {
    let formattedValue = value;
    if (field === 'number') {
      formattedValue = formatCardNumber(value);
    } else if (field === 'expiry') {
      formattedValue = formatExpiry(value);
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substr(0, 4);
    }
    setCardData({ ...cardData, [field]: formattedValue });
  };

  const fillDemoCard = (card) => {
    setCardData({
      ...cardData,
      number: card.number,
      name: 'USUARIO DEMO',
      expiry: card.expiry,
      cvv: card.cvv,
    });
  };

  const handleSelectMethod = (method) => {
    setPaymentMethod(method);
    if (method.id === 'credit' || method.id === 'debit') {
      setStep('card');
    } else if (method.id === 'account_money') {
      if (method.balance >= total) {
        processPayment('account_money');
      } else {
        setError('Saldo insuficiente en tu cuenta');
      }
    } else if (method.id === 'transfer') {
      processPayment('transfer');
    }
  };

  const validateCard = () => {
    if (cardData.number.replace(/\s/g, '').length < 16) {
      setError('Número de tarjeta inválido');
      return false;
    }
    if (!cardData.name.trim()) {
      setError('Ingresá el nombre del titular');
      return false;
    }
    if (cardData.expiry.length < 5) {
      setError('Fecha de vencimiento inválida');
      return false;
    }
    if (cardData.cvv.length < 3) {
      setError('Código de seguridad inválido');
      return false;
    }
    return true;
  };

  const handlePayCard = () => {
    setError('');
    if (!validateCard()) return;
    processPayment(paymentMethod.id === 'credit' ? 'TARJETA_CREDITO' : 'TARJETA_DEBITO');
  };

  const processPayment = (metodoPago) => {
    setStep('processing');
    
    // Simular tiempo de procesamiento
    setTimeout(() => {
      // 95% de éxito
      const success = Math.random() < 0.95;
      
      if (success) {
        setStep('success');
        setTimeout(() => {
          onSuccess({
            metodoPago,
            referenciaPago: 'MP-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
            installments: cardData.installments,
          });
        }, 2000);
      } else {
        setStep('error');
        setError('El pago fue rechazado. Intentá con otro medio de pago.');
      }
    }, 3000);
  };

  const getInstallmentAmount = () => {
    const option = installmentOptions.find(o => o.value === cardData.installments);
    const totalWithInterest = total * (option?.multiplier || 1);
    return totalWithInterest / parseInt(cardData.installments);
  };

  const getCardBrand = () => {
    const num = cardData.number.replace(/\s/g, '');
    if (num.startsWith('4')) return { name: 'VISA', color: '#1a1f71' };
    if (num.startsWith('5')) return { name: 'Mastercard', color: '#eb001b' };
    if (num.startsWith('3')) return { name: 'Amex', color: '#006fcf' };
    return null;
  };

  return (
    <div className="mp-overlay">
      <div className="mp-modal">
        {/* Header */}
        <div className="mp-header">
          <div className="mp-logo">
            <span className="mp-logo-icon">🤝</span>
            <span className="mp-logo-text">mercadopago</span>
          </div>
          <button className="mp-close" onClick={onCancel}>✕</button>
        </div>

        {/* Content */}
        <div className="mp-content">
          {/* Amount Display */}
          <div className="mp-amount">
            <span className="mp-amount-label">Total a pagar</span>
            <span className="mp-amount-value">${total.toLocaleString('es-AR')}</span>
          </div>

          {/* Select Payment Method */}
          {step === 'select' && (
            <div className="mp-step mp-select">
              <h3>¿Cómo querés pagar?</h3>
              <div className="mp-methods">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    className="mp-method"
                    onClick={() => handleSelectMethod(method)}
                  >
                    <span className="mp-method-icon">{method.icon}</span>
                    <div className="mp-method-info">
                      <span className="mp-method-name">{method.name}</span>
                      {method.installments && (
                        <span className="mp-method-detail">Hasta 12 cuotas</span>
                      )}
                      {method.balance && (
                        <span className="mp-method-detail">
                          Disponible: ${method.balance.toLocaleString('es-AR')}
                        </span>
                      )}
                    </div>
                    <span className="mp-method-arrow">→</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Card Form */}
          {step === 'card' && (
            <div className="mp-step mp-card-form">
              <button className="mp-back" onClick={() => setStep('select')}>
                ← Volver
              </button>
              
              <h3>Ingresá los datos de tu tarjeta</h3>

              {/* Demo Cards */}
              <div className="mp-demo-cards">
                <span className="mp-demo-label">🎮 Tarjetas de prueba:</span>
                {DEMO_CARDS.map((card, idx) => (
                  <button
                    key={idx}
                    className="mp-demo-card-btn"
                    onClick={() => fillDemoCard(card)}
                  >
                    {card.name}
                  </button>
                ))}
              </div>

              {/* Card Preview */}
              <div className="mp-card-preview" style={{ 
                background: getCardBrand()?.color || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
              }}>
                <div className="mp-card-brand">{getCardBrand()?.name || 'TARJETA'}</div>
                <div className="mp-card-number">
                  {cardData.number || '•••• •••• •••• ••••'}
                </div>
                <div className="mp-card-bottom">
                  <div className="mp-card-name">{cardData.name || 'NOMBRE DEL TITULAR'}</div>
                  <div className="mp-card-expiry">{cardData.expiry || 'MM/YY'}</div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="mp-form">
                <div className="mp-field">
                  <label>Número de tarjeta</label>
                  <input
                    type="text"
                    value={cardData.number}
                    onChange={(e) => handleCardInput('number', e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                </div>

                <div className="mp-field">
                  <label>Nombre del titular</label>
                  <input
                    type="text"
                    value={cardData.name}
                    onChange={(e) => handleCardInput('name', e.target.value.toUpperCase())}
                    placeholder="Como figura en la tarjeta"
                  />
                </div>

                <div className="mp-field-row">
                  <div className="mp-field">
                    <label>Vencimiento</label>
                    <input
                      type="text"
                      value={cardData.expiry}
                      onChange={(e) => handleCardInput('expiry', e.target.value)}
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </div>
                  <div className="mp-field">
                    <label>CVV</label>
                    <input
                      type="password"
                      value={cardData.cvv}
                      onChange={(e) => handleCardInput('cvv', e.target.value)}
                      placeholder="•••"
                      maxLength={4}
                    />
                  </div>
                </div>

                {paymentMethod?.installments && (
                  <div className="mp-field">
                    <label>Cuotas</label>
                    <select
                      value={cardData.installments}
                      onChange={(e) => setCardData({ ...cardData, installments: e.target.value })}
                    >
                      {installmentOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label} - ${(getInstallmentAmount()).toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {error && <div className="mp-error">{error}</div>}

                <button className="mp-pay-btn" onClick={handlePayCard}>
                  Pagar ${total.toLocaleString('es-AR')}
                </button>
              </div>
            </div>
          )}

          {/* Processing */}
          {step === 'processing' && (
            <div className="mp-step mp-processing">
              <div className="mp-spinner"></div>
              <h3>Procesando tu pago...</h3>
              <p>No cierres esta ventana</p>
              <div className="mp-security">
                <span>🔒</span> Conexión segura
              </div>
            </div>
          )}

          {/* Success */}
          {step === 'success' && (
            <div className="mp-step mp-success">
              <div className="mp-success-icon">✓</div>
              <h3>¡Pago aprobado!</h3>
              <p>Tu pago fue procesado con éxito</p>
              <div className="mp-success-amount">
                ${total.toLocaleString('es-AR')}
              </div>
              <p className="mp-redirect">Redirigiendo al comercio...</p>
            </div>
          )}

          {/* Error */}
          {step === 'error' && (
            <div className="mp-step mp-error-state">
              <div className="mp-error-icon">✕</div>
              <h3>Pago rechazado</h3>
              <p>{error}</p>
              <button className="mp-retry-btn" onClick={() => setStep('select')}>
                Intentar con otro medio
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mp-footer">
          <span className="mp-secure">🔒 Pago seguro</span>
          <span className="mp-powered">Procesado por Mercado Pago (Simulación)</span>
        </div>
      </div>
    </div>
  );
}

export default MercadoPagoSimulator;

















