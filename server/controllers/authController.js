import User from '../models/User.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/tokenUtils.js';

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
    const { email, password } = req.body;

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
          lastLogin: user.lastLogin
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
