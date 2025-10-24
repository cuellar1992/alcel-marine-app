import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import crypto from 'crypto';
import User from '../models/User.js';

// Generar secreto y QR code para 2FA
export const generateTwoFactorSecret = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    // Verificar si ya tiene 2FA habilitado
    if (user.twoFactorEnabled) {
      return res.status(400).json({
        success: false,
        message: '2FA is already enabled. Please disable it first if you want to reconfigure.'
      });
    }

    // Generar secreto
    const secret = speakeasy.generateSecret({
      name: `Alcel Marine (${user.email})`,
      issuer: 'Alcel Marine'
    });

    // Generar QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    // Guardar secreto temporal (no habilitado aún)
    user.twoFactorSecret = secret.base32;
    await user.save();

    res.status(200).json({
      success: true,
      message: '2FA secret generated successfully.',
      data: {
        secret: secret.base32,
        qrCode: qrCodeUrl,
        otpauthUrl: secret.otpauth_url
      }
    });
  } catch (error) {
    console.error('Generate 2FA secret error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating 2FA secret.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Verificar y habilitar 2FA
export const enableTwoFactor = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required.'
      });
    }

    const user = await User.findById(req.user.userId).select('+twoFactorSecret');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    if (!user.twoFactorSecret) {
      return res.status(400).json({
        success: false,
        message: 'Please generate 2FA secret first.'
      });
    }

    if (user.twoFactorEnabled) {
      return res.status(400).json({
        success: false,
        message: '2FA is already enabled.'
      });
    }

    // Verificar token
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: token,
      window: 2 // Permitir 2 pasos de tiempo de diferencia (60 segundos)
    });

    if (!verified) {
      return res.status(401).json({
        success: false,
        message: 'Invalid verification code.'
      });
    }

    // Generar códigos de recuperación
    const backupCodes = [];
    for (let i = 0; i < 10; i++) {
      const code = crypto.randomBytes(4).toString('hex').toUpperCase();
      backupCodes.push(code);
    }

    // Hashear códigos de recuperación antes de guardar
    const hashedBackupCodes = backupCodes.map(code =>
      crypto.createHash('sha256').update(code).digest('hex')
    );

    // Habilitar 2FA
    user.twoFactorEnabled = true;
    user.twoFactorBackupCodes = hashedBackupCodes;
    await user.save();

    res.status(200).json({
      success: true,
      message: '2FA enabled successfully.',
      data: {
        backupCodes // Enviar códigos sin hashear SOLO UNA VEZ
      }
    });
  } catch (error) {
    console.error('Enable 2FA error:', error);
    res.status(500).json({
      success: false,
      message: 'Error enabling 2FA.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Deshabilitar 2FA
export const disableTwoFactor = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required to disable 2FA.'
      });
    }

    const user = await User.findById(req.user.userId).select('+password +twoFactorSecret +twoFactorBackupCodes');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    // Verificar password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password.'
      });
    }

    // Deshabilitar 2FA
    user.twoFactorEnabled = false;
    user.twoFactorSecret = undefined;
    user.twoFactorBackupCodes = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: '2FA disabled successfully.'
    });
  } catch (error) {
    console.error('Disable 2FA error:', error);
    res.status(500).json({
      success: false,
      message: 'Error disabling 2FA.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Verificar código 2FA durante el login
export const verifyTwoFactorCode = async (userId, token, isBackupCode = false) => {
  try {
    const user = await User.findById(userId).select('+twoFactorSecret +twoFactorBackupCodes');

    if (!user || !user.twoFactorEnabled) {
      return false;
    }

    // Si es código de recuperación
    if (isBackupCode) {
      const hashedCode = crypto.createHash('sha256').update(token).digest('hex');
      const codeIndex = user.twoFactorBackupCodes.indexOf(hashedCode);

      if (codeIndex !== -1) {
        // Remover código usado
        user.twoFactorBackupCodes.splice(codeIndex, 1);
        await user.save();
        return true;
      }
      return false;
    }

    // Verificar token TOTP
    return speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: token,
      window: 2
    });
  } catch (error) {
    console.error('Verify 2FA code error:', error);
    return false;
  }
};

// Obtener estado de 2FA
export const getTwoFactorStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('+twoFactorBackupCodes');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        twoFactorEnabled: user.twoFactorEnabled,
        backupCodesRemaining: user.twoFactorBackupCodes ? user.twoFactorBackupCodes.length : 0
      }
    });
  } catch (error) {
    console.error('Get 2FA status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting 2FA status.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
