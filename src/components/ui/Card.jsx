/**
 * Card Component
 * Premium card container with enhanced glass effect
 */

export default function Card({ 
  children, 
  className = '', 
  variant = 'default',
  hover = false,
  ...props 
}) {
  const variants = {
    default: 'bg-gradient-to-br from-slate-800/40 via-gray-800/40 to-slate-900/40 border-white/10',
    gradient: 'bg-gradient-to-br from-slate-800/60 via-gray-800/50 to-slate-900/60 border-white/20',
    solid: 'bg-slate-900/80 border-white/10',
  }

  const hoverEffect = hover 
    ? 'hover:border-blue-400/40 hover:shadow-blue-500/20 hover:scale-[1.02] cursor-pointer group' 
    : ''

  return (
    <div
      className={`backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] border ${variants[variant]} ${hoverEffect} transition-all duration-500 relative overflow-hidden ${className}`}
      {...props}
    >
      {/* Premium shine effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

