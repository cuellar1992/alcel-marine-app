import rateLimit from 'express-rate-limit';

// Rate limiter general para la API
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 500, // Ajustado: máximo 500 requests por ventana por IP
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Rate limiter estricto para login/registro (prevenir ataques de fuerza bruta)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Máximo 5 intentos por ventana por IP
  skipSuccessfulRequests: true, // No contar requests exitosos
  message: {
    success: false,
    message: 'Too many login attempts, please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter para creación de recursos (prevenir spam)
export const createLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 10, // Máximo 10 creaciones por minuto
  message: {
    success: false,
    message: 'Too many creation requests, please slow down.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
