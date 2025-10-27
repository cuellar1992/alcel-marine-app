import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getDeviceFingerprint } from '../utils/deviceFingerprint';
import {
  validateStoredTokens,
  clearAuthData,
  isTokenExpired
} from '../utils/tokenUtils';

// API Base URL - use relative path in production, localhost in development
const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // In production build, use relative path (same origin)
  if (import.meta.env.PROD) {
    return '';
  }
  // In development, use localhost
  return 'http://localhost:5000';
};

const API_BASE_URL = getApiBaseUrl();

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Cargar usuario desde localStorage al montar y verificar tokens
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const tokenStatus = validateStoredTokens();

        // Si no hay tokens, limpiar y terminar
        if (!tokenStatus.hasTokens) {
          clearAuthData();
          setLoading(false);
          return;
        }

        // Si el access token es válido, cargar usuario
        if (tokenStatus.accessTokenValid) {
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
          setLoading(false);
          return;
        }

        // Si el access token expiró pero el refresh token es válido, intentar refrescar
        if (!tokenStatus.accessTokenValid && tokenStatus.refreshTokenValid) {
          console.log('🔄 Access token expirado, intentando refrescar...');
          
          try {
            const newAccessToken = await refreshTokenSilent();
            
            if (newAccessToken && storedUser) {
              setUser(JSON.parse(storedUser));
              toast.success('Sesión renovada automáticamente', { duration: 2000 });
            } else {
              clearAuthData();
            }
          } catch (error) {
            console.error('Error al refrescar token:', error);
            clearAuthData();
          }
        } else {
          // Ambos tokens expirados, limpiar todo
          console.log('❌ Tokens expirados, limpiando sesión...');
          clearAuthData();
        }
      } catch (error) {
        console.error('Error loading user:', error);
        clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login (con soporte para 2FA y dispositivos confiables)
  const login = async (email, password, twoFactorCode = null, isBackupCode = false, trustDevice = false) => {
    try {
      const deviceId = getDeviceFingerprint();

      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          twoFactorCode,
          isBackupCode,
          deviceId,
          trustDevice
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Si requiere 2FA, retornar sin guardar tokens
      if (data.requiresTwoFactor) {
        return {
          success: true,
          requiresTwoFactor: true,
          userId: data.data?.userId
        };
      }

      // Guardar tokens y usuario
      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('refreshToken', data.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.data.user));

      setUser(data.data.user);
      toast.success('Login successful!');

      return { success: true, requiresTwoFactor: false };
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed');
      return { success: false, error: error.message };
    }
  };

  // Register
  const register = async (name, email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Guardar tokens y usuario
      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('refreshToken', data.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.data.user));

      setUser(data.data.user);
      toast.success('Registration successful!');

      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed');
      return { success: false, error: error.message };
    }
  };

  // Logout
  const logout = async () => {
    try {
      // Llamar al endpoint de logout (opcional)
      const token = localStorage.getItem('accessToken');
      if (token) {
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Limpiar estado local
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setUser(null);
      toast.success('Logged out successfully');
      navigate('/login');
    }
  };

  // Refresh token silencioso (sin notificaciones ni logout automático)
  const refreshTokenSilent = async () => {
    try {
      const refreshTokenValue = localStorage.getItem('refreshToken');

      if (!refreshTokenValue) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: refreshTokenValue }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Token refresh failed');
      }

      // Actualizar access token
      localStorage.setItem('accessToken', data.data.accessToken);

      return data.data.accessToken;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error; // Lanzar error para que lo maneje el llamador
    }
  };

  // Refresh token (con notificaciones y manejo de errores)
  const refreshToken = async () => {
    try {
      const newToken = await refreshTokenSilent();
      return newToken;
    } catch (error) {
      // Si falla el refresh, hacer logout
      logout();
      return null;
    }
  };

  // Verificar si el usuario tiene un rol específico
  const hasRole = (role) => {
    if (!user) return false;
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  };

  // Verificar si el usuario es admin
  const isAdmin = () => hasRole('admin');

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    refreshToken,
    hasRole,
    isAdmin,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
