import express from 'express';
import {
  generateTwoFactorSecret,
  enableTwoFactor,
  disableTwoFactor,
  getTwoFactorStatus
} from '../controllers/twoFactorController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Todas las rutas de 2FA requieren autenticación
router.use(authenticate);

// Generar secreto y QR code
router.post('/generate', generateTwoFactorSecret);

// Verificar y habilitar 2FA
router.post('/enable', enableTwoFactor);

// Deshabilitar 2FA
router.post('/disable', disableTwoFactor);

// Obtener estado de 2FA
router.get('/status', getTwoFactorStatus);

export default router;
