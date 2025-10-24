/**
 * Vessel Schedule Component
 * Shows upcoming vessel arrivals and departures (ETB/ETD)
 */

import { Ship, Calendar, MapPin, ArrowRight, Clock, Briefcase, User } from 'lucide-react'

export default function VesselSchedule({ data, loading = false }) {
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
        <h3 className="text-lg font-semibold text-white mb-4">Vessel Schedule (Next 7 Days)</h3>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse p-4 bg-gray-800/30 rounded-xl">
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-3"></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="h-3 bg-gray-700 rounded"></div>
                <div className="h-3 bg-gray-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Not set'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'Invalid date'
    }
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

  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Vessel Schedule</h3>
        <span className="text-xs text-gray-400 px-3 py-1 bg-gray-700/30 rounded-full">
          Next 7 Days
        </span>
      </div>
      
      {data.length > 0 ? (
        <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
          {data.map((vessel, index) => (
            <div 
              key={`${vessel._id}-${index}`}
              className={`p-4 border rounded-xl transition-all duration-200 hover:shadow-lg ${getStatusColor(vessel.status)}`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Ship className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-lg truncate">
                      {vessel.vesselName}
                    </p>
                  </div>
                </div>
                {vessel.status && (
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusBadgeColor(vessel.status)} whitespace-nowrap`}>
                    {vessel.status.charAt(0).toUpperCase() + vessel.status.slice(1)}
                  </span>
                )}
              </div>

              {/* Job Type and Client Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 pl-13">
                {vessel.jobType && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Briefcase className="w-4 h-4 text-cyan-400" />
                    <span className="capitalize">{vessel.jobType}</span>
                  </div>
                )}
                {vessel.clientName && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <User className="w-4 h-4 text-purple-400" />
                    <span className="truncate">{vessel.clientName}</span>
                  </div>
                )}
              </div>

              {/* Port */}
              {vessel.port && (
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-3 pl-13">
                  <MapPin className="w-4 h-4 text-orange-400" />
                  <span>{vessel.port}</span>
                </div>
              )}

              {/* ETB/ETD */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-13">
                {vessel.etb && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex items-center gap-1.5 text-green-400">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">ETB:</span>
                    </div>
                    <span className="text-gray-300">{formatDateTime(vessel.etb)}</span>
                  </div>
                )}
                {vessel.etd && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex items-center gap-1.5 text-orange-400">
                      <ArrowRight className="w-4 h-4" />
                      <span className="font-medium">ETD:</span>
                    </div>
                    <span className="text-gray-300">{formatDateTime(vessel.etd)}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 py-8">
          <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No scheduled vessels in the next 7 days</p>
        </div>
      )}
    </div>
  )
}

