/**
 * Button Component
 * Premium button with enhanced visual effects
 */

const variants = {
  primary: 'bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 bg-size-200 text-white hover:bg-pos-100 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50',
  secondary: 'bg-gradient-to-r from-slate-700 to-gray-700 text-white hover:from-slate-600 hover:to-gray-600 shadow-lg shadow-gray-900/50',
  outline: 'border-2 border-white/20 text-gray-200 hover:border-blue-400/60 hover:text-blue-300 hover:bg-blue-500/10 backdrop-blur-xl',
  ghost: 'text-gray-300 hover:bg-white/5 backdrop-blur-xl',
}

const sizes = {
  sm: 'px-5 py-2.5 text-sm',
  md: 'px-8 py-3.5 text-base',
  lg: 'px-10 py-4 text-lg',
}

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  onClick,
  disabled = false,
  ...props 
}) {
  const baseStyles = 'font-semibold rounded-xl transition-all duration-300 active:scale-95 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 relative overflow-hidden group'
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
      )}
    </button>
  )
}

