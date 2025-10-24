/**
 * Textarea Component
 * Premium textarea field for longer text
 */

export default function Textarea({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  rows = 4,
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
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className={`w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-gray-500 
          focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 
          transition-all duration-300 backdrop-blur-xl hover:border-white/20 resize-none ${className}`}
        {...props}
      />
    </div>
  )
}

