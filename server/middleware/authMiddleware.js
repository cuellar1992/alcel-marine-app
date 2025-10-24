import { verifyAccessToken } from '../utils/tokenUtils.js';
import User from '../models/User.js';

// Middleware para verificar autenticación
export const authenticate = async (req, res, next) => {
  try {
    // Obtener token del header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Extraer token
    const token = authHeader.split(' ')[1];

    // Verificar token
    const decoded = verifyAccessToken(token);

    // Buscar usuario
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found.'
      });
    }

    // Verificar si el usuario está activo
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'User account is deactivated.'
      });
    }

    // Adjuntar usuario al request
    req.user = {
      userId: user._id,
      email: user.email,
      role: user.role,
      name: user.name
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);

    if (error.message === 'Invalid or expired token') {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token. Please login again.'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Authentication failed.'
    });
  }
};

// Middleware opcional - permite requests con o sin autenticación
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = verifyAccessToken(token);
      const user = await User.findById(decoded.userId).select('-password');

      if (user && user.isActive) {
        req.user = {
          userId: user._id,
          email: user.email,
          role: user.role,
          name: user.name
        };
      }
    }

    next();
  } catch (error) {
    // Si hay error, continuar sin usuario autenticado
    next();
  }
};
