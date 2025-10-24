import jwt from 'jsonwebtoken';

// Generar Access Token (1 hora de expiración - aumentado para mejor UX)
export const generateAccessToken = (userId, email, role) => {
  return jwt.sign(
    {
      userId,
      email,
      role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRATION || '1h'
    }
  );
};

// Generar Refresh Token (30 días de expiración - aumentado para mejor UX)
export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRATION || '30d'
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
