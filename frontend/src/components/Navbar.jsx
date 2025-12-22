import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import productService from '../services/productService';
import './Navbar.css';

function Navbar() {
  const { itemCount } = useCart();
  const { favoritesCount } = useFavorites();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showProductsMenu, setShowProductsMenu] = useState(false);
  const [categories, setCategories] = useState([]);
  const userMenuRef = useRef(null);
  const moreMenuRef = useRef(null);
  const productsMenuRef = useRef(null);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target)) {
        setShowMoreMenu(false);
      }
      if (productsMenuRef.current && !productsMenuRef.current.contains(e.target)) {
        setShowProductsMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cargar categorías para el dropdown de Productos
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await productService.getCategories();
        setCategories(Array.isArray(cats) ? cats : []);
      } catch (err) {
        console.error('Error cargando categorías para navbar:', err);
        setCategories([]);
      }
    };
    loadCategories();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/productos?busqueda=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowMobileSearch(false);
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-brand">
          <Link to="/">
            <span className="brand-icon">👔</span>
            <span className="brand-text">MenStyle</span>
          </Link>
        </div>

        {/* Search Bar (izquierda, como costumbre) */}
        <form className={`navbar-search ${showMobileSearch ? 'mobile-visible' : ''}`} onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" aria-label="Buscar">
            🔍
          </button>
        </form>
      </div>

      <div className="navbar-right">
        <ul className="navbar-menu">
          <li>
            <NavLink to="/" end>Inicio</NavLink>
          </li>
          <li>
            <div
              className="nav-products"
              ref={productsMenuRef}
              onMouseEnter={() => setShowProductsMenu(true)}
              onMouseLeave={() => setShowProductsMenu(false)}
            >
              <NavLink to="/productos">Productos</NavLink>
              {showProductsMenu && categories.length > 0 && (
                <div className="nav-products-dropdown" role="menu">
                  {categories.map((cat) => (
                    <NavLink
                      key={cat.id}
                      to={`/productos?categoria=${cat.id}`}
                      className="dropdown-item"
                      onClick={() => setShowProductsMenu(false)}
                    >
                      <span>🏷️</span> {cat.nombre}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          </li>
          <li>
            <NavLink to="/ofertas">Ofertas</NavLink>
          </li>

          <li className="nav-more" ref={moreMenuRef}>
            <button
              type="button"
              className={`nav-more-trigger ${showMoreMenu ? 'open' : ''}`}
              onClick={() => setShowMoreMenu((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={showMoreMenu}
            >
              Más <span className="arrow">▾</span>
            </button>

            {showMoreMenu && (
              <div className="nav-more-dropdown" role="menu">
                <NavLink to="/favoritos" className="dropdown-item" onClick={() => setShowMoreMenu(false)}>
                  <span>❤️</span> Favoritos
                </NavLink>
              </div>
            )}
          </li>

          <li className="mobile-search-toggle">
            <button type="button" onClick={() => setShowMobileSearch(!showMobileSearch)} aria-label="Buscar">
              🔍
            </button>
          </li>
        </ul>

      <div className="navbar-actions">
        <NavLink to="/carrito" className="icon-btn cart-link" aria-label="Carrito">
          🛒
          {itemCount > 0 && (
            <span className="cart-badge">{itemCount}</span>
          )}
        </NavLink>

        {isAuthenticated ? (
          <div className="user-menu-container" ref={userMenuRef}>
            <button 
              className="user-menu-trigger"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <span className="user-avatar">{user?.avatar || '👤'}</span>
              <span className="user-name">{user?.nombre}</span>
              <span className={`arrow ${showUserMenu ? 'up' : ''}`}>▾</span>
            </button>

            {showUserMenu && (
              <div className="user-dropdown">
                <div className="dropdown-header">
                  <span className="dropdown-avatar">{user?.avatar || '👤'}</span>
                  <div className="dropdown-user-info">
                    <span className="dropdown-name">{user?.nombre} {user?.apellido}</span>
                    <span className="dropdown-email">{user?.email}</span>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <button 
                  className="dropdown-item" 
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate('/perfil');
                  }}
                >
                  <span>👤</span> Mi Perfil
                </button>
                <Link 
                  to={isAdmin ? "/admin/pedidos" : "/perfil"} 
                  className="dropdown-item" 
                  onClick={() => setShowUserMenu(false)}
                >
                  <span>📦</span> Mis Pedidos
                </Link>
                {isAdmin && (
                  <>
                    <div className="dropdown-divider"></div>
                    <Link to="/admin" className="dropdown-item admin" onClick={() => setShowUserMenu(false)}>
                      <span>⚙️</span> Panel Admin
                    </Link>
                  </>
                )}
                <div className="dropdown-divider"></div>
                <button className="dropdown-item logout" onClick={handleLogout}>
                  <span>🚪</span> Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <NavLink to="/login" className="nav-btn login-btn">Ingresar</NavLink>
            <NavLink to="/registro" className="nav-btn register-btn">Registrarse</NavLink>
          </>
        )}
      </div>
      </div>
    </nav>
  );
}

export default Navbar;
