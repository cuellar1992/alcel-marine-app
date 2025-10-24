/**
 * Token Utilities - Frontend
 * Funciones para manejar tokens JWT en el cliente
 */

/**
 * Decodifica un token JWT sin verificar la firma
 * (La verificación de firma se hace en el backend)
 * @param {string} token - Token JWT
 * @returns {object|null} - Payload decodificado o null si es inválido
 */
export const decodeToken = (token) => {
  try {
    if (!token || typeof token !== 'string') {
      return null;
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // Decodificar el payload (segunda parte del JWT)
    const payload = parts[1];
    const decoded = JSON.parse(atob(payload));
    
    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Verifica si un token JWT está expirado
 * @param {string} token - Token JWT
 * @returns {boolean} - true si está expirado, false si es válido
 */
export const isTokenExpired = (token) => {
  try {
    const decoded = decodeToken(token);
    
    if (!decoded || !decoded.exp) {
      return true; // Si no se puede decodificar o no tiene exp, considerarlo expirado
    }

    // exp está en segundos, Date.now() en milisegundos
    const currentTime = Date.now() / 1000;
    
    // Agregar un buffer de 30 segundos para evitar problemas de sincronización
    return decoded.exp < (currentTime + 30);
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

/**
 * Obtiene el tiempo restante hasta que expire el token (en segundos)
 * @param {string} token - Token JWT
 * @returns {number} - Segundos hasta expiración, 0 si ya expiró o es inválido
 */
export const getTokenExpirationTime = (token) => {
  try {
    const decoded = decodeToken(token);
    
    if (!decoded || !decoded.exp) {
      return 0;
    }

    const currentTime = Date.now() / 1000;
    const timeRemaining = decoded.exp - currentTime;
    
    return timeRemaining > 0 ? timeRemaining : 0;
  } catch (error) {
    console.error('Error getting token expiration time:', error);
    return 0;
  }
};

/**
 * Verifica si los tokens almacenados son válidos
 * @returns {object} - Estado de validez de los tokens
 */
export const validateStoredTokens = () => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  return {
    hasTokens: !!(accessToken && refreshToken),
    accessTokenValid: accessToken ? !isTokenExpired(accessToken) : false,
    refreshTokenValid: refreshToken ? !isTokenExpired(refreshToken) : false,
    accessToken,
    refreshToken
  };
};

/**
 * Limpia todos los datos de autenticación del almacenamiento local
 */
export const clearAuthData = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

/**
 * Obtiene información del usuario desde el token
 * @param {string} token - Token JWT
 * @returns {object|null} - Información del usuario o null
 */
export const getUserFromToken = (token) => {
  const decoded = decodeToken(token);
  
  if (!decoded) {
    return null;
  }

  return {
    userId: decoded.userId,
    email: decoded.email,
    role: decoded.role
  };
};

/**
 * Formatea el tiempo restante en un formato legible
 * @param {number} seconds - Segundos
 * @returns {string} - Tiempo formateado
 */
export const formatTimeRemaining = (seconds) => {
  if (seconds <= 0) {
    return 'Expirado';
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
};

