/**
 * Header Component
 * Premium professional header with navigation
 */

import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Shield } from 'lucide-react'
import Container from '../ui/Container'
import { useAuth } from '../../context/AuthContext'

export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [showSettingsMenu, setShowSettingsMenu] = useState(false)
  const menuRef = useRef(null)

  // Navigation items
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Marine Non-Claims', path: '/ballast-bunker' },
    { name: 'Marine Claims', path: '/marine-claims' },
  ]

  const isActive = (path) => {
    return location.pathname === path
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowSettingsMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleUserManagement = () => {
    setShowSettingsMenu(false)
    navigate('/users')
  }

  const handleSettings = () => {
    setShowSettingsMenu(false)
    navigate('/settings')
  }

  const handleLogout = () => {
    setShowSettingsMenu(false)
    logout()
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

            {/* User Menu */}
            {user && (
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/10">
                <div className="flex flex-col items-end">
                  <span className="text-sm text-gray-300 font-medium">{user.name}</span>
                  <span className="text-xs text-gray-500">{user.role}</span>
                </div>

                {/* Settings Dropdown */}
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                    className="p-2 text-gray-300 hover:text-cyan-400 hover:bg-white/5 rounded-lg transition-all duration-300"
                    title="Settings"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {showSettingsMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                      <div className="py-2">
                        {/* Security */}
                        <button
                          onClick={handleSettings}
                          className="w-full px-4 py-3 text-left text-gray-300 hover:bg-white/5 hover:text-cyan-400 transition-colors flex items-center gap-3"
                        >
                          <Shield className="h-5 w-5" />
                          <div>
                            <div className="text-sm font-medium">Security</div>
                            <div className="text-xs text-gray-500">Account & security</div>
                          </div>
                        </button>

                        {/* User Management - Only for Admin */}
                        {user.role === 'admin' && (
                          <>
                            <div className="border-t border-white/10 my-2"></div>
                            <button
                              onClick={handleUserManagement}
                              className="w-full px-4 py-3 text-left text-gray-300 hover:bg-white/5 hover:text-cyan-400 transition-colors flex items-center gap-3"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                />
                              </svg>
                              <div>
                                <div className="text-sm font-medium">User Management</div>
                                <div className="text-xs text-gray-500">Manage users and roles</div>
                              </div>
                            </button>
                          </>
                        )}

                        {/* Divider */}
                        <div className="border-t border-white/10 my-2"></div>

                        {/* Logout */}
                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-3 text-left text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors flex items-center gap-3"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          <div>
                            <div className="text-sm font-medium">Logout</div>
                            <div className="text-xs text-gray-500">Sign out of your account</div>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </nav>
        </div>
      </Container>
    </header>
  )
}

