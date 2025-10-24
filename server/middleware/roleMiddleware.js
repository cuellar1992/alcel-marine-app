// Middleware para verificar roles específicos
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    // Verificar si el usuario está autenticado
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    // Verificar si el usuario tiene uno de los roles permitidos
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }

    next();
  };
};

// Middleware específico para admin
export const requireAdmin = requireRole('admin');

// Middleware para admin o user (excluyendo viewer)
export const requireUserOrAdmin = requireRole('admin', 'user');
