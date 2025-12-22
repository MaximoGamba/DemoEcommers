import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css';

function RegisterPage() {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Redirect si ya está logueado
  if (isAuthenticated) {
    navigate('/', { replace: true });
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.nombre || !formData.apellido || !formData.email || !formData.password) {
      setError('Por favor completá todos los campos obligatorios');
      return false;
    }

    if (!formData.email.includes('@')) {
      setError('Por favor ingresá un email válido');
      return false;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }

    if (!acceptTerms) {
      setError('Debés aceptar los términos y condiciones');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    try {
      setLoading(true);
      await register({
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        telefono: formData.telefono,
        password: formData.password,
      });
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { level: 0, text: '' };
    if (password.length < 6) return { level: 1, text: 'Débil', color: '#ef4444' };
    if (password.length < 8) return { level: 2, text: 'Media', color: '#f59e0b' };
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) {
      return { level: 4, text: 'Fuerte', color: '#22c55e' };
    }
    return { level: 3, text: 'Buena', color: '#3b82f6' };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-left">
          <div className="auth-brand">
            <span className="brand-icon">👔</span>
            <h1>MenStyle</h1>
          </div>
          <div className="auth-hero">
            <h2>Creá tu cuenta</h2>
            <p>Unite a nuestra comunidad y disfrutá de beneficios exclusivos.</p>
          </div>
          <div className="auth-features">
            <div className="feature">
              <span>🚀</span>
              <span>Registro rápido</span>
            </div>
            <div className="feature">
              <span>🔒</span>
              <span>Datos seguros</span>
            </div>
            <div className="feature">
              <span>💳</span>
              <span>Compras fáciles</span>
            </div>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-form-container register-form">
            <h2>Registrarse</h2>
            <p className="auth-subtitle">Completá tus datos para crear una cuenta</p>

            <form onSubmit={handleSubmit} className="auth-form">
              {error && (
                <div className="error-message">
                  <span>⚠️</span> {error}
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nombre">Nombre *</label>
                  <div className="input-wrapper">
                    <span className="input-icon">👤</span>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      placeholder="Juan"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="apellido">Apellido *</label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      id="apellido"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleChange}
                      placeholder="Pérez"
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <div className="input-wrapper">
                  <span className="input-icon">📧</span>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="telefono">Teléfono</label>
                <div className="input-wrapper">
                  <span className="input-icon">📱</span>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="1155667788"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Contraseña *</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Mínimo 6 caracteres"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                {formData.password && (
                  <div className="password-strength">
                    <div className="strength-bar">
                      <div 
                        className="strength-fill"
                        style={{ 
                          width: `${passwordStrength.level * 25}%`,
                          backgroundColor: passwordStrength.color 
                        }}
                      />
                    </div>
                    <span style={{ color: passwordStrength.color }}>
                      {passwordStrength.text}
                    </span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar Contraseña *</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repetí tu contraseña"
                    autoComplete="new-password"
                  />
                  {formData.confirmPassword && formData.password === formData.confirmPassword && (
                    <span className="match-indicator">✓</span>
                  )}
                </div>
              </div>

              <label className="terms-checkbox">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                />
                <span>
                  Acepto los <a href="#">términos y condiciones</a> y la{' '}
                  <a href="#">política de privacidad</a>
                </span>
              </label>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Creando cuenta...
                  </>
                ) : (
                  'Crear cuenta'
                )}
              </button>
            </form>

            <div className="auth-divider">
              <span>o registrate con</span>
            </div>

            <div className="social-login">
              <button className="social-btn google">
                <span>G</span> Google
              </button>
              <button className="social-btn facebook">
                <span>f</span> Facebook
              </button>
            </div>

            <p className="auth-redirect">
              ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
