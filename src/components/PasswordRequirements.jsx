import { Check, X } from 'lucide-react';
import './PasswordRequirements.css';

const PasswordRequirements = ({ password }) => {
  const requirements = [
    {
      id: 1,
      label: 'At least 8 characters',
      test: (pwd) => pwd.length >= 8,
    },
    {
      id: 2,
      label: 'At least one uppercase letter',
      test: (pwd) => /[A-Z]/.test(pwd),
    },
    {
      id: 3,
      label: 'At least one lowercase letter',
      test: (pwd) => /[a-z]/.test(pwd),
    },
    {
      id: 4,
      label: 'At least one number',
      test: (pwd) => /[0-9]/.test(pwd),
    },
    {
      id: 5,
      label: 'At least one special character (!@#$%^&*)',
      test: (pwd) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
    },
  ];

  return (
    <div className="password-requirements">
      <p className="requirements-title">Password must contain:</p>
      <ul className="requirements-list">
        {requirements.map((req) => {
          const isValid = req.test(password);
          return (
            <li
              key={req.id}
              className={`requirement-item ${
                password.length > 0 ? (isValid ? 'valid' : 'invalid') : ''
              }`}
            >
              <span className="requirement-icon">
                {password.length > 0 && (
                  isValid ? (
                    <Check size={16} className="icon-check" />
                  ) : (
                    <X size={16} className="icon-x" />
                  )
                )}
              </span>
              <span className="requirement-label">{req.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PasswordRequirements;

