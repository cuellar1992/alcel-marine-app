/**
 * Recent Activity Component
 * Shows recent jobs and claims activity
 */

import { Clock, Ship, FileText, MapPin, Calendar, Tag } from 'lucide-react'
import { formatDistanceToNow } from '../../utils/helpers'

const getActivityIcon = (type) => {
  if (type === 'job') return Ship
  if (type === 'claim') return FileText
  return Clock
}

const getStatusColor = (status) => {
  const colors = {
    pending: 'border-orange-500/30 bg-orange-500/5',
    'in progress': 'border-blue-500/30 bg-blue-500/5',
    completed: 'border-green-500/30 bg-green-500/5',
    cancelled: 'border-red-500/30 bg-red-500/5',
  }
  return colors[status] || 'border-gray-500/30 bg-gray-500/5'
}

const getStatusBadgeColor = (status) => {
  const colors = {
    pending: 'text-orange-400 bg-orange-500/10',
    'in progress': 'text-blue-400 bg-blue-500/10',
    completed: 'text-green-400 bg-green-500/10',
    cancelled: 'text-red-400 bg-red-500/10',
  }
  return colors[status] || 'text-gray-400 bg-gray-500/10'
}

export default function RecentActivity({ data, loading = false }) {
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="animate-pulse">
              <div className="h-10 bg-gray-800/30 rounded-lg mb-3"></div>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-14 bg-gray-800/30 rounded-lg mb-2"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      return formatDistanceToNow(date)
    } catch {
      return 'Recently'
    }
  }

  // Ordenar los datos por fecha de creación (más recientes primero)
  const sortedData = [...data].sort((a, b) => {
    if (!a.createdAt && !b.createdAt) return 0
    if (!a.createdAt) return 1
    if (!b.createdAt) return -1
    return new Date(b.createdAt) - new Date(a.createdAt)
  })

  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
        <span className="text-xs text-gray-400 px-3 py-1 bg-gray-700/30 rounded-full">
          Latest Updates
        </span>
      </div>
      
      {sortedData.length > 0 ? (
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            {/* Tabla con encabezados */}
            <div className="overflow-hidden rounded-lg">
              {/* Encabezados de columna */}
              <div className="grid grid-cols-[40px_1.5fr_1fr_1.5fr_1fr_1.2fr] gap-4 px-4 py-3 bg-gray-800/40 border-b border-gray-700/50 rounded-t-lg">
                <div className="flex items-center justify-center">
                  <Clock className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Job Number
                </div>
                <div className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-cyan-400" />
                  Type
                </div>
                <div className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-orange-400" />
                  Vessel / Location
                </div>
                <div className="text-xs font-semibold text-gray-300 uppercase tracking-wider text-center">
                  Status
                </div>
                <div className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-purple-400" />
                  Time Ago
                </div>
              </div>

              {/* Filas de datos */}
              <div className="max-h-96 overflow-y-auto custom-scrollbar">
                {sortedData.map((activity, index) => {
                  const Icon = getActivityIcon(activity.type)
                  const isJob = activity.type === 'job'
                  
                  return (
                    <div
                      key={`${activity.type}-${activity._id}-${index}`}
                      className={`group grid grid-cols-[40px_1.5fr_1fr_1.5fr_1fr_1.2fr] gap-4 px-4 py-3 border-b border-gray-700/30 transition-all duration-300 hover:bg-white/5 ${isJob && activity.status ? getStatusColor(activity.status) : 'border-gray-500/30 bg-gray-500/5'}`}
                    >
                      {/* Icono */}
                      <div className="flex items-center justify-center">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${isJob ? 'from-blue-500/20 to-cyan-500/20' : 'from-purple-500/20 to-pink-500/20'} flex items-center justify-center`}>
                          <Icon className={`w-4 h-4 ${isJob ? 'text-blue-400' : 'text-purple-400'}`} />
                        </div>
                      </div>

                      {/* Job Number */}
                      <div className="flex items-center">
                        <span className="text-white font-semibold text-sm truncate font-mono">
                          {activity.jobNumber || 'N/A'}
                        </span>
                      </div>

                      {/* Type */}
                      <div className="flex items-center">
                        <span className={`text-sm font-medium truncate ${isJob ? 'text-blue-400' : 'text-purple-400'}`}>
                          {isJob ? 'Job' : 'Claim'}
                        </span>
                      </div>

                      {/* Vessel / Location */}
                      <div className="flex items-center">
                        <span className="text-gray-400 text-sm truncate">
                          {isJob ? (activity.vesselName || 'N/A') : (activity.location || 'N/A')}
                        </span>
                      </div>

                      {/* Status */}
                      <div className="flex items-center justify-center">
                        {isJob && activity.status ? (
                          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusBadgeColor(activity.status)} whitespace-nowrap`}>
                            {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                          </span>
                        ) : (
                          <span className="text-gray-500 text-xs">—</span>
                        )}
                      </div>

                      {/* Time Ago */}
                      <div className="flex items-center">
                        <span className="text-gray-400 text-sm truncate">
                          {activity.createdAt ? formatDate(activity.createdAt) : 'Recently'}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-400 py-8">
          <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No recent activity</p>
        </div>
      )}
    </div>
  )
}

