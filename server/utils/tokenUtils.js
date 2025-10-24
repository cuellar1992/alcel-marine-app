import jwt from 'jsonwebtoken';

// Generar Access Token (15 minutos de expiración)
export const generateAccessToken = (userId, email, role) => {
  return jwt.sign(
    {
      userId,
      email,
      role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m'
    }
  );
};

// Generar Refresh Token (7 días de expiración)
export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d'
    }
  );
};

// Verificar Access Token
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

// Verificar Refresh Token
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};

// Decodificar token sin verificar (útil para debugging)
export const decodeToken = (token) => {
  return jwt.decode(token);
};
