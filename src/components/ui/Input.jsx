/**
 * Input Component
 * Premium input field with label
 */

export default function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  className = '',
  ...props
}) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
          {required && <span className="text-cyan-400 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-gray-500 
          focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 
          transition-all duration-300 backdrop-blur-xl hover:border-white/20 ${className}`}
        {...props}
      />
    </div>
  )
}

