/**
 * SearchBar Component
 * Premium search bar with integrated advanced filters toggle
 */

import { Search, X, ChevronDown, ChevronUp, Filter } from 'lucide-react'

export default function SearchBar({ 
  value, 
  onChange, 
  onClear,
  placeholder = 'Search...',
  className = '',
  // Advanced filters props
  showAdvancedToggle = false,
  isAdvancedOpen = false,
  onAdvancedToggle,
  hasActiveFilters = false
}) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10">
        <Search className="w-5 h-5" />
      </div>
      
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full pl-12 py-3.5 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-gray-500 
          focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 
          transition-all duration-300 backdrop-blur-xl hover:border-white/20
          ${showAdvancedToggle ? 'pr-32' : value ? 'pr-12' : 'pr-4'}`}
      />
      
      {/* Right side buttons container */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
        {/* Clear button */}
        {value && (
          <button
            onClick={onClear}
            className="text-gray-400 hover:text-white transition-colors duration-200 p-2 hover:bg-white/5 rounded-lg"
            title="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        
        {/* Advanced filters toggle */}
        {showAdvancedToggle && (
          <>
            {/* Divider */}
            {value && (
              <div className="h-6 w-px bg-white/10"></div>
            )}
            
            {/* Advanced filters button */}
            <button
              onClick={onAdvancedToggle}
              className={`
                relative flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300
                ${hasActiveFilters 
                  ? 'bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-cyan-400 border border-cyan-500/30' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }
              `}
              title="Advanced Filters"
            >
              <Filter className="w-4 h-4" />
              {isAdvancedOpen ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
              
              {/* Active indicator dot */}
              {hasActiveFilters && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-cyan-400 rounded-full border border-slate-900 animate-pulse"></span>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

