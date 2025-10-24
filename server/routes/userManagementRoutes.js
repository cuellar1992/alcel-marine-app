import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  changeUserPassword,
  deleteUser,
  toggleUserStatus,
  getUserStats
} from '../controllers/userManagementController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación Y ser admin
router.use(authenticate);
router.use(requireAdmin);

// Estadísticas de usuarios
router.get('/stats', getUserStats);

// CRUD de usuarios
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

// Operaciones especiales
router.put('/:id/password', changeUserPassword);
router.patch('/:id/toggle-status', toggleUserStatus);

export default router;
