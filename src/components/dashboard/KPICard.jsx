/**
 * KPI Card Component
 * Displays a single KPI metric with icon and trend
 */

import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export default function KPICard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue, 
  color = 'blue',
  suffix = '',
  loading = false 
}) {
  const colorClasses = {
    blue: 'from-blue-500/10 to-blue-600/5 border-blue-500/20 text-blue-400',
    green: 'from-green-500/10 to-green-600/5 border-green-500/20 text-green-400',
    purple: 'from-purple-500/10 to-purple-600/5 border-purple-500/20 text-purple-400',
    orange: 'from-orange-500/10 to-orange-600/5 border-orange-500/20 text-orange-400',
    cyan: 'from-cyan-500/10 to-cyan-600/5 border-cyan-500/20 text-cyan-400',
    pink: 'from-pink-500/10 to-pink-600/5 border-pink-500/20 text-pink-400',
  }

  const getTrendIcon = () => {
    if (!trend) return <Minus className="w-4 h-4" />
    if (trend === 'up') return <TrendingUp className="w-4 h-4" />
    if (trend === 'down') return <TrendingDown className="w-4 h-4" />
    return <Minus className="w-4 h-4" />
  }

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-400'
    if (trend === 'down') return 'text-red-400'
    return 'text-gray-400'
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 bg-gray-700 rounded w-1/3"></div>
          <div className="w-10 h-10 bg-gray-700 rounded-xl"></div>
        </div>
        <div className="h-8 bg-gray-700 rounded w-2/3 mb-2"></div>
        <div className="h-3 bg-gray-700 rounded w-1/2"></div>
      </div>
    )
  }

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} backdrop-blur-xl border rounded-2xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105`}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">
          {title}
        </p>
        {Icon && (
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center shadow-lg`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
      
      <div className="mb-2">
        <p className="text-4xl font-bold text-white">
          {typeof value === 'number' ? value.toLocaleString() : value}
          {suffix && <span className="text-2xl ml-1">{suffix}</span>}
        </p>
      </div>

      {(trend || trendValue) && (
        <div className={`flex items-center gap-1 text-sm ${getTrendColor()}`}>
          {getTrendIcon()}
          {trendValue && <span>{trendValue}</span>}
        </div>
      )}
    </div>
  )
}

