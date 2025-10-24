import User from '../models/User.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/tokenUtils.js';
import crypto from 'crypto';

// Registro de nuevo usuario
export const register = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    // Validar campos requeridos
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email, password, and name.'
      });
    }

    // Validar fortaleza de contraseña
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long.'
      });
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists.'
      });
    }

    // Crear nuevo usuario
    const user = new User({
      email,
      password,
      name,
      role: role || 'user' // Default role is 'user'
    });

    await user.save();

    // Generar tokens
    const accessToken = generateAccessToken(user._id, user.email, user.role);
    const refreshToken = generateRefreshToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering user.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Login de usuario
export const login = async (req, res) => {
  try {
    const { email, password, twoFactorCode, isBackupCode, deviceId, trustDevice } = req.body;

    // Validar campos requeridos
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.'
      });
    }

    // Buscar usuario (incluir password)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Verificar si el usuario está activo
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'User account is deactivated.'
      });
    }

    // Verificar password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Si el usuario tiene 2FA habilitado
    if (user.twoFactorEnabled) {
      // Verificar si el dispositivo es confiable
      const isTrustedDevice = deviceId && user.trustedDevices && user.trustedDevices.some(device => {
        return device.deviceId === deviceId && new Date(device.expiresAt) > new Date();
      });

      // Si no es dispositivo confiable y no se proporciona código 2FA
      if (!isTrustedDevice && !twoFactorCode) {
        return res.status(200).json({
          success: true,
          requiresTwoFactor: true,
          message: '2FA code required.',
          data: {
            userId: user._id // Temporal para el siguiente paso
          }
        });
      }

      // Si no es dispositivo confiable, verificar código 2FA
      if (!isTrustedDevice) {
        const { verifyTwoFactorCode } = await import('./twoFactorController.js');
        const isCodeValid = await verifyTwoFactorCode(user._id, twoFactorCode, isBackupCode);

        if (!isCodeValid) {
          return res.status(401).json({
            success: false,
            message: 'Invalid 2FA code.'
          });
        }

        // Si el usuario quiere confiar en este dispositivo
        if (trustDevice && deviceId) {
          const userAgent = req.headers['user-agent'] || 'Unknown';
          const deviceName = getDeviceName(userAgent);
          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + 45); // 45 días

          // Eliminar dispositivos expirados
          user.trustedDevices = user.trustedDevices.filter(device =>
            new Date(device.expiresAt) > new Date()
          );

          // Verificar si el dispositivo ya existe
          const existingDeviceIndex = user.trustedDevices.findIndex(
            device => device.deviceId === deviceId
          );

          if (existingDeviceIndex !== -1) {
            // Actualizar dispositivo existente
            user.trustedDevices[existingDeviceIndex].lastUsed = new Date();
            user.trustedDevices[existingDeviceIndex].expiresAt = expiresAt;
          } else {
            // Agregar nuevo dispositivo confiable
            user.trustedDevices.push({
              deviceId,
              deviceName,
              userAgent,
              lastUsed: new Date(),
              expiresAt
            });
          }
        }
      } else {
        // Actualizar última vez usado del dispositivo confiable
        const deviceIndex = user.trustedDevices.findIndex(device => device.deviceId === deviceId);
        if (deviceIndex !== -1) {
          user.trustedDevices[deviceIndex].lastUsed = new Date();
        }
      }
    }

    // Actualizar último login
    user.lastLogin = new Date();
    await user.save();

    // Generar tokens
    const accessToken = generateAccessToken(user._id, user.email, user.role);
    const refreshToken = generateRefreshToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          lastLogin: user.lastLogin,
          twoFactorEnabled: user.twoFactorEnabled
        },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Helper para obtener nombre del dispositivo desde user agent
const getDeviceName = (userAgent) => {
  if (userAgent.includes('Chrome')) return 'Chrome Browser';
  if (userAgent.includes('Firefox')) return 'Firefox Browser';
  if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari Browser';
  if (userAgent.includes('Edge')) return 'Edge Browser';
  if (userAgent.includes('Opera')) return 'Opera Browser';
  return 'Unknown Browser';
};

// Refresh token
export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required.'
      });
    }

    // Verificar refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Buscar usuario
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token.'
      });
    }

    // Generar nuevo access token
    const newAccessToken = generateAccessToken(user._id, user.email, user.role);

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully.',
      data: {
        accessToken: newAccessToken
      }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid or expired refresh token.'
    });
  }
};

// Obtener perfil del usuario autenticado
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting profile.'
    });
  }
};

// Actualizar perfil del usuario
export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    // Actualizar campos
    if (name) user.name = name;
    if (email && email !== user.email) {
      // Verificar si el nuevo email ya existe
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use.'
        });
      }
      user.email = email;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile.'
    });
  }
};

// Cambiar contraseña
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current password and new password.'
      });
    }

    // Validar fortaleza de la nueva contraseña
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long.'
      });
    }

    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword);

    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
      return res.status(400).json({
        success: false,
        message: 'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
      });
    }

    const user = await User.findById(req.user.userId).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    // Verificar contraseña actual
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect.'
      });
    }

    // Actualizar contraseña
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully.'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error changing password.'
    });
  }
};

// Logout (opcional - principalmente para limpiar del lado del cliente)
export const logout = async (req, res) => {
  try {
    // En un sistema JWT stateless, el logout es principalmente del lado del cliente
    // Aquí podrías implementar una blacklist de tokens si lo necesitas
    res.status(200).json({
      success: true,
      message: 'Logout successful.'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging out.'
    });
  }
};
