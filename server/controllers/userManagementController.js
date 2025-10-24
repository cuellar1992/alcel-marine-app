import User from '../models/User.js';
import { generateAccessToken } from '../utils/tokenUtils.js';

// Obtener todos los usuarios (solo admin)
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', role = '', isActive = '' } = req.query;

    // Construir query de búsqueda
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (role) {
      query.role = role;
    }

    if (isActive !== '') {
      query.isActive = isActive === 'true';
    }

    // 🔒 OCULTAR SUPER ADMIN: Solo el propio Super Admin puede verse a sí mismo
    // Otros usuarios NO verán al Super Admin en la lista
    const currentUser = await User.findById(req.user.userId);
    
    if (!currentUser || !currentUser.isSuperAdmin) {
      // Si el usuario actual NO es Super Admin, ocultar al Super Admin de los resultados
      query.isSuperAdmin = { $ne: true };
    }
    // Si es Super Admin, puede ver todos los usuarios incluyéndose a sí mismo

    // Paginación
    const skip = (page - 1) * limit;

    // Ejecutar query
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    // Mapear _id a id para el frontend
    const mappedUsers = users.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isSuperAdmin: user.isSuperAdmin || false,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));

    res.status(200).json({
      success: true,
      data: {
        users: mappedUsers,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Obtener un usuario por ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    // 🔒 PROTECCIÓN: Solo el Super Admin puede verse a sí mismo
    // Otros usuarios no pueden acceder a su información
    const currentUser = await User.findById(req.user.userId);
    
    if (user.isSuperAdmin && (!currentUser || !currentUser.isSuperAdmin)) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    // Mapear _id a id para el frontend
    const mappedUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isSuperAdmin: user.isSuperAdmin || false,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.status(200).json({
      success: true,
      data: { user: mappedUser }
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Crear un nuevo usuario (solo admin)
export const createUser = async (req, res) => {
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
      role: role || 'user'
    });

    await user.save();

    // Retornar usuario sin password y con id mapeado
    res.status(201).json({
      success: true,
      message: 'User created successfully.',
      data: { 
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isSuperAdmin: false, // Nuevos usuarios nunca son super admin
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating user.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Actualizar un usuario (solo admin)
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, name, role, isActive } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    // 🔒 PROTECCIÓN: Solo el propio Super Admin puede modificarse a sí mismo
    // Otros admins NO pueden modificar al Super Admin
    // Convertir ambos IDs a string para comparación confiable
    const isSelfEdit = user._id.toString() === req.user.userId.toString();
    
    if (user.isSuperAdmin && !isSelfEdit) {
      return res.status(403).json({
        success: false,
        message: 'Super Admin can only be modified by themselves. This account is protected from external changes.'
      });
    }

    // Prevenir que el admin se desactive a sí mismo
    if (id === req.user.userId && isActive === false) {
      return res.status(400).json({
        success: false,
        message: 'You cannot deactivate your own account.'
      });
    }

    // Prevenir que el admin cambie su propio rol
    if (id === req.user.userId && role && role !== user.role) {
      return res.status(400).json({
        success: false,
        message: 'You cannot change your own role.'
      });
    }

    // Actualizar campos
    if (name) user.name = name;
    if (role) user.role = role;
    if (typeof isActive !== 'undefined') user.isActive = isActive;

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

    // Si se actualizó el email o rol (campos en el token JWT), regenerar token para el usuario actual
    // Nota: El nombre NO está en el token, se obtiene de la DB en cada request
    const isUpdatingOwnProfile = id === req.user.userId;
    const emailChanged = email && email !== req.user.email;
    const roleChanged = role && role !== req.user.role;
    const needsTokenRefresh = isUpdatingOwnProfile && (emailChanged || roleChanged);

    const response = {
      success: true,
      message: 'User updated successfully.',
      data: { 
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isSuperAdmin: user.isSuperAdmin || false,
          isActive: user.isActive,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }
    };

    // Si necesita refresh del token, generarlo y enviarlo
    if (needsTokenRefresh) {
      const newAccessToken = generateAccessToken(user._id, user.email, user.role);
      response.data.accessToken = newAccessToken;
      response.message = 'User updated successfully. Your session has been refreshed.';
    }

    res.status(200).json(response);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Cambiar contraseña de un usuario (solo admin)
export const changeUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long.'
      });
    }

    // Validar fortaleza de contraseña
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword);

    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    // 🔒 PROTECCIÓN: Solo el propio Super Admin puede cambiar su contraseña
    // Otros admins NO pueden cambiar la contraseña del Super Admin
    // Convertir ambos IDs a string para comparación confiable
    const isSelfPasswordChange = user._id.toString() === req.user.userId.toString();
    
    if (user.isSuperAdmin && !isSelfPasswordChange) {
      return res.status(403).json({
        success: false,
        message: 'Super Admin password can only be changed by the Super Admin themselves.'
      });
    }

    // Actualizar contraseña (el hash se hace automáticamente en el modelo)
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully.'
    });
  } catch (error) {
    console.error('Change user password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error changing password.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Eliminar un usuario (solo admin)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevenir que el admin se elimine a sí mismo
    if (id === req.user.userId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account.'
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    // 🔒 PROTECCIÓN: No se puede eliminar al Super Admin
    if (user.isSuperAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Super Admin cannot be deleted. This account is protected.'
      });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully.'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Activar/Desactivar usuario (solo admin)
export const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    // 🔒 PROTECCIÓN: No se puede desactivar al Super Admin
    if (user.isSuperAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Super Admin cannot be deactivated. This account is protected.'
      });
    }

    // Prevenir que el admin se desactive a sí mismo
    if (id === req.user.userId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot change the status of your own account.'
      });
    }

    // Toggle isActive
    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully.`,
      data: {
        user: {
          id: user._id,
          isActive: user.isActive
        }
      }
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling user status.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Obtener estadísticas de usuarios
export const getUserStats = async (req, res) => {
  try {
    // 🔒 OCULTAR SUPER ADMIN: Excluir de estadísticas si no es el propio Super Admin
    const currentUser = await User.findById(req.user.userId);
    const filter = {};
    
    if (!currentUser || !currentUser.isSuperAdmin) {
      // Si el usuario actual NO es Super Admin, excluir al Super Admin de las estadísticas
      filter.isSuperAdmin = { $ne: true };
    }

    const total = await User.countDocuments(filter);
    const active = await User.countDocuments({ ...filter, isActive: true });
    const inactive = await User.countDocuments({ ...filter, isActive: false });

    const byRole = await User.aggregate([
      {
        $match: filter
      },
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    const roleStats = {};
    byRole.forEach(item => {
      roleStats[item._id] = item.count;
    });

    res.status(200).json({
      success: true,
      data: {
        total,
        active,
        inactive,
        byRole: roleStats
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user statistics.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
