import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const AUTH_KEY = 'ecommerce_auth';

// Usuarios demo predefinidos
const DEMO_USERS = [
  {
    id: 1,
    email: 'cliente@demo.com',
    password: '123456',
    nombre: 'Juan',
    apellido: 'Pérez',
    telefono: '1155667788',
    role: 'cliente',
    avatar: '👤',
  },
  {
    id: 2,
    email: 'admin@demo.com',
    password: 'admin123',
    nombre: 'Admin',
    apellido: 'Sistema',
    telefono: '1122334455',
    role: 'admin',
    avatar: '👑',
  },
];

// Simular "base de datos" de usuarios registrados
const getStoredUsers = () => {
  const stored = localStorage.getItem('ecommerce_users');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return [];
};

const saveStoredUsers = (users) => {
  localStorage.setItem('ecommerce_users', JSON.stringify(users));
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Cargar sesión al montar
  useEffect(() => {
    const savedAuth = localStorage.getItem(AUTH_KEY);
    if (savedAuth) {
      try {
        const userData = JSON.parse(savedAuth);
        setUser(userData);
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem(AUTH_KEY);
      }
    }
    setLoading(false);
  }, []);

  // Login simulado
  const login = async (email, password) => {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 800));

    // Buscar en usuarios demo
    let foundUser = DEMO_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    // Si no está en demo, buscar en registrados
    if (!foundUser) {
      const storedUsers = getStoredUsers();
      foundUser = storedUsers.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
    }

    if (!foundUser) {
      throw new Error('Email o contraseña incorrectos');
    }

    // Crear objeto de usuario sin password
    const userData = {
      id: foundUser.id,
      email: foundUser.email,
      nombre: foundUser.nombre,
      apellido: foundUser.apellido,
      telefono: foundUser.telefono,
      role: foundUser.role,
      avatar: foundUser.avatar || '👤',
    };

    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem(AUTH_KEY, JSON.stringify(userData));

    return userData;
  };

  // Registro simulado
  const register = async (userData) => {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 800));

    const { email, password, nombre, apellido, telefono } = userData;

    // Verificar si el email ya existe
    const allUsers = [...DEMO_USERS, ...getStoredUsers()];
    if (allUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('Este email ya está registrado');
    }

    // Crear nuevo usuario
    const newUser = {
      id: Date.now(),
      email,
      password,
      nombre,
      apellido,
      telefono: telefono || '',
      role: 'cliente',
      avatar: '👤',
      createdAt: new Date().toISOString(),
    };

    // Guardar en "base de datos"
    const storedUsers = getStoredUsers();
    storedUsers.push(newUser);
    saveStoredUsers(storedUsers);

    // Auto-login después de registro
    const userSession = {
      id: newUser.id,
      email: newUser.email,
      nombre: newUser.nombre,
      apellido: newUser.apellido,
      telefono: newUser.telefono,
      role: newUser.role,
      avatar: newUser.avatar,
    };

    setUser(userSession);
    setIsAuthenticated(true);
    localStorage.setItem(AUTH_KEY, JSON.stringify(userSession));

    return userSession;
  };

  // Logout
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_KEY);
  };

  // Actualizar perfil
  const updateProfile = async (updates) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem(AUTH_KEY, JSON.stringify(updatedUser));

    // Si es un usuario registrado, actualizar en "base de datos"
    if (!DEMO_USERS.some(u => u.id === user.id)) {
      const storedUsers = getStoredUsers();
      const idx = storedUsers.findIndex(u => u.id === user.id);
      if (idx !== -1) {
        storedUsers[idx] = { ...storedUsers[idx], ...updates };
        saveStoredUsers(storedUsers);
      }
    }

    return updatedUser;
  };

  const value = {
    user,
    isAuthenticated,
    isAdmin: user?.role === 'admin',
    loading,
    login,
    register,
    logout,
    updateProfile,
    // Datos demo para mostrar en UI
    demoCredentials: {
      cliente: { email: 'cliente@demo.com', password: '123456' },
      admin: { email: 'admin@demo.com', password: 'admin123' },
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}

export default AuthContext;
