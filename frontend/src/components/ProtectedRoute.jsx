import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../pages/AdminPage.css';

/**
 * Componente para proteger rutas que requieren autenticación de admin
 */
function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // Si requiere autenticación y no está autenticado, redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si requiere admin y no es admin, redirigir a home con mensaje
  if (requireAdmin && !isAdmin) {
    // Opcional: podrías mostrar un mensaje aquí antes de redirigir
    return <Navigate to="/" replace />;
  }

  // Si pasa todas las verificaciones, mostrar el contenido
  return children;
}

export default ProtectedRoute;

