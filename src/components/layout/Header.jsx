/**
 * Header Component
 * Premium professional header with navigation
 */

import { Link, useLocation } from 'react-router-dom'
import Container from '../ui/Container'

export default function Header() {
  const location = useLocation()
  
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Marine Non-Claims', path: '/ballast-bunker' },
    { name: 'Marine Claims', path: '/marine-claims' },
  ]
  
  const isActive = (path) => {
    return location.pathname === path
  }
  
  return (
    <header className="bg-gradient-to-r from-slate-900/95 via-gray-900/95 to-slate-900/95 backdrop-blur-xl border-b border-white/10 shadow-2xl sticky top-0 z-50">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-cyan-600/5 to-blue-600/5"></div>
      <Container>
        <div className="relative py-4 flex items-center justify-between">
          
          {/* Logo Section - Premium style */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <img 
                src="/logo.png" 
                alt="Alcel Marine - Marine Services Provider" 
                className="relative h-24 w-auto object-contain transition-all duration-500 group-hover:scale-105 drop-shadow-2xl"
              />
            </div>
          </Link>
          
          {/* Navigation */}
          <nav className="flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative text-base font-medium transition-all duration-300 group ${
                  isActive(item.path)
                    ? 'text-cyan-400'
                    : 'text-gray-300 hover:text-cyan-400'
                }`}
              >
                {item.name}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-300 ${
                    isActive(item.path)
                      ? 'w-full'
                      : 'w-0 group-hover:w-full'
                  }`}
                ></span>
              </Link>
            ))}
          </nav>
        </div>
      </Container>
    </header>
  )
}

