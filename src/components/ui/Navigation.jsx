/**
 * Navigation Component
 * Reusable navigation links for header
 */

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'Products', href: '#products' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export default function Navigation({ items = navItems, className = '' }) {
  return (
    <nav className={`flex items-center gap-6 ${className}`}>
      {items.map((item) => (
        <a
          key={item.label}
          href={item.href}
          className="text-gray-300 hover:text-cyan-400 transition-colors duration-200 font-medium text-sm relative group"
        >
          {item.label}
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
        </a>
      ))}
    </nav>
  )
}

/**
 * Mobile Navigation (Hamburger Menu)
 */
export function MobileNavigation({ items = navItems, isOpen, onToggle }) {
  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={onToggle}
        className="md:hidden text-gray-300 hover:text-cyan-400 transition-colors p-2"
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isOpen ? (
            <path d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-gray-800/95 backdrop-blur-lg border-b border-gray-700/50 shadow-2xl md:hidden">
          <nav className="flex flex-col py-4">
            {items.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-gray-300 hover:text-cyan-400 hover:bg-gray-700/30 transition-all duration-200 px-6 py-3 font-medium"
                onClick={onToggle}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </>
  )
}

/**
 * Navigation with Button
 */
export function NavigationWithButton({ items = navItems, buttonText = 'Get Started', onButtonClick }) {
  return (
    <nav className="flex items-center gap-6">
      {items.map((item) => (
        <a
          key={item.label}
          href={item.href}
          className="text-gray-300 hover:text-cyan-400 transition-colors duration-200 font-medium text-sm hidden md:inline-block"
        >
          {item.label}
        </a>
      ))}
      <button
        onClick={onButtonClick}
        className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
      >
        {buttonText}
      </button>
    </nav>
  )
}

