/**
 * Recent Activity Component
 * Shows recent jobs and claims activity
 */

import { Clock, Ship, FileText, MapPin, Calendar } from 'lucide-react'
import { formatDistanceToNow } from '../../utils/helpers'

const getActivityIcon = (type) => {
  if (type === 'job') return Ship
  if (type === 'claim') return FileText
  return Clock
}

const getStatusColor = (status) => {
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
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-start gap-4 p-4 bg-gray-800/30 rounded-xl">
              <div className="w-10 h-10 bg-gray-700 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
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

  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
      <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
      
      {data.length > 0 ? (
        <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
          {data.map((activity, index) => {
            const Icon = getActivityIcon(activity.type)
            const isJob = activity.type === 'job'
            
            return (
              <div 
                key={`${activity.type}-${activity._id}-${index}`}
                className="flex items-start gap-4 p-4 bg-gray-800/30 hover:bg-gray-800/50 rounded-xl transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5 text-blue-400" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">
                        {activity.jobNumber}
                      </p>
                      {isJob ? (
                        <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                          <Ship className="w-3.5 h-3.5" />
                          <span className="truncate">{activity.vesselName}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span className="truncate">{activity.location}</span>
                        </div>
                      )}
                    </div>
                    
                    {isJob && activity.status && (
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(activity.status)} whitespace-nowrap`}>
                        {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(activity.createdAt)}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center text-gray-400 py-8">
          No recent activity
        </div>
      )}
    </div>
  )
}

