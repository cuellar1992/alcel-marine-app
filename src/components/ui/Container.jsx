/**
 * Container Component
 * Responsive container with max-width and padding
 */

export default function Container({ 
  children, 
  className = '', 
  size = 'default',
  ...props 
}) {
  const sizes = {
    sm: 'max-w-3xl',
    default: 'max-w-7xl',
    lg: 'max-w-[1400px]',
    full: 'max-w-full',
  }

  return (
    <div
      className={`${sizes[size]} mx-auto px-4 sm:px-6 lg:px-8 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

