import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield } from 'lucide-react';
import PasswordStrengthBar from 'react-password-strength-bar';
import PasswordRequirements from '../components/PasswordRequirements';
import './Login.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [requires2FA, setRequires2FA] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [savedCredentials, setSavedCredentials] = useState(null);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Limpiar error de contraseña cuando el usuario escribe
    if (e.target.name === 'password') {
      setPasswordError('');
    }
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return 'Password must contain at least one special character';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar contraseña en modo registro
    if (!isLogin) {
      const error = validatePassword(formData.password);
      if (error) {
        setPasswordError(error);
        return;
      }
    }

    setLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await login(formData.email, formData.password);

        // Si requiere 2FA
        if (result.requiresTwoFactor) {
          setSavedCredentials({ email: formData.email, password: formData.password });
          setRequires2FA(true);
          setLoading(false);
          return;
        }
      } else {
        result = await register(formData.name, formData.email, formData.password);
      }

      if (result.success && !result.requiresTwoFactor) {
        navigate('/');
      }
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handle2FASubmit = async (e) => {
    e.preventDefault();

    if (!twoFactorCode || (useBackupCode ? twoFactorCode.length !== 8 : twoFactorCode.length !== 6)) {
      return;
    }

    setLoading(true);

    try {
      const result = await login(
        savedCredentials.email,
        savedCredentials.password,
        twoFactorCode,
        useBackupCode
      );

      if (result.success) {
        navigate('/');
      }
    } catch (error) {
      console.error('2FA verification error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handle2FACancel = () => {
    setRequires2FA(false);
    setTwoFactorCode('');
    setUseBackupCode(false);
    setSavedCredentials(null);
    setFormData({ name: '', email: '', password: '' });
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', password: '' });
    setPasswordError('');
  };

  // Vista de 2FA
  if (requires2FA) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="flex items-center justify-center mb-2">
              <Shield className="w-8 h-8 text-cyan-400" />
            </div>
            <h1>Two-Factor Authentication</h1>
            <p>Enter the {useBackupCode ? 'backup code' : '6-digit code'} from your authenticator app</p>
          </div>

          <form onSubmit={handle2FASubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="twoFactorCode">
                {useBackupCode ? 'Backup Code' : 'Authenticator Code'}
              </label>
              <input
                type="text"
                id="twoFactorCode"
                value={twoFactorCode}
                onChange={(e) => {
                  const value = useBackupCode
                    ? e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8)
                    : e.target.value.replace(/\D/g, '').slice(0, 6);
                  setTwoFactorCode(value);
                }}
                required
                placeholder={useBackupCode ? 'XXXXXXXX' : '000000'}
                disabled={loading}
                className="text-center text-2xl tracking-widest font-mono"
                maxLength={useBackupCode ? 8 : 6}
                autoFocus
              />
            </div>

            <button
              type="button"
              onClick={() => {
                setUseBackupCode(!useBackupCode);
                setTwoFactorCode('');
              }}
              className="text-cyan-400 hover:text-cyan-300 text-sm mb-4 text-center w-full"
              disabled={loading}
            >
              {useBackupCode ? 'Use authenticator code instead' : 'Use backup code instead'}
            </button>

            <button
              type="submit"
              className="login-button"
              disabled={loading || (useBackupCode ? twoFactorCode.length !== 8 : twoFactorCode.length !== 6)}
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>

            <button
              type="button"
              onClick={handle2FACancel}
              className="login-button"
              style={{ background: '#64748b', marginTop: '10px' }}
              disabled={loading}
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Vista normal de login
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Alcel Marine</h1>
          <p>{isLogin ? 'Sign in to your account' : 'Create a new account'}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required={!isLogin}
                placeholder="Enter your full name"
                disabled={loading}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              minLength={!isLogin ? 8 : 6}
              disabled={loading}
              className={passwordError ? 'input-error' : ''}
            />
            {passwordError && (
              <span className="error-message">{passwordError}</span>
            )}
            {!isLogin && formData.password && (
              <div className="password-strength-container">
                <PasswordStrengthBar
                  password={formData.password}
                  minLength={8}
                  scoreWords={['very weak', 'weak', 'fair', 'good', 'strong']}
                  shortScoreWord="too short"
                />
              </div>
            )}
          </div>

          {!isLogin && (
            <PasswordRequirements password={formData.password} />
          )}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        {/* REGISTRO DESHABILITADO: Solo admins pueden crear usuarios desde User Management
        <div className="login-footer">
          <p>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={toggleMode} className="toggle-button" disabled={loading}>
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
        */}
      </div>
    </div>
  );
};

export default Login;
