import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, demoCredentials } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect si ya está logueado
  if (isAuthenticated) {
    const from = location.state?.from?.pathname || '/';
    navigate(from, { replace: true });
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Por favor completá todos los campos');
      return;
    }

    try {
      setLoading(true);
      await login(formData.email, formData.password);
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (type) => {
    const creds = demoCredentials[type];
    setFormData(creds);
    setError('');
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-left">
          <div className="auth-brand">
            <span className="brand-icon">👔</span>
            <h1>MenStyle</h1>
          </div>
          <div className="auth-hero">
            <h2>Bienvenido de nuevo</h2>
            <p>Ingresá a tu cuenta para ver tus pedidos, favoritos y más.</p>
          </div>
          <div className="auth-features">
            <div className="feature">
              <span>📦</span>
              <span>Seguí tus pedidos</span>
            </div>
            <div className="feature">
              <span>❤️</span>
              <span>Guardá favoritos</span>
            </div>
            <div className="feature">
              <span>🎁</span>
              <span>Ofertas exclusivas</span>
            </div>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-form-container">
            <h2>Iniciar Sesión</h2>
            <p className="auth-subtitle">Ingresá tus datos para continuar</p>

            {/* Demo Credentials */}
            <div className="demo-credentials">
              <span className="demo-label">🧪 Credenciales demo:</span>
              <div className="demo-buttons">
                <button 
                  type="button"
                  onClick={() => fillDemoCredentials('cliente')}
                  className="demo-btn"
                >
                  👤 Cliente
                </button>
                <button 
                  type="button"
                  onClick={() => fillDemoCredentials('admin')}
                  className="demo-btn admin"
                >
                  👑 Admin
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {error && (
                <div className="error-message">
                  <span>⚠️</span> {error}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email">Email</label>
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
                <label htmlFor="password">Contraseña</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" />
                  <span>Recordarme</span>
                </label>
                <a href="#" className="forgot-password">¿Olvidaste tu contraseña?</a>
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Ingresando...
                  </>
                ) : (
                  'Ingresar'
                )}
              </button>
            </form>

            <div className="auth-divider">
              <span>o</span>
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
              ¿No tenés cuenta? <Link to="/registro">Registrate</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
