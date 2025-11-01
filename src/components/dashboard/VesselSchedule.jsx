/**
 * Vessel Schedule Component
 * Shows upcoming vessel arrivals and departures (ETB/ETD)
 */

import { Ship, Calendar, MapPin, Briefcase, User } from 'lucide-react'

export default function VesselSchedule({ data, loading = false }) {
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
        <h3 className="text-lg font-semibold text-white mb-4">Vessel Schedule (Next 2 Weeks)</h3>
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

  // Ordenar los datos por fecha (más antiguos primero)
  const sortedData = [...data].sort((a, b) => {
    if (!a.dateTime && !b.dateTime) return 0
    if (!a.dateTime) return 1
    if (!b.dateTime) return -1
    return new Date(a.dateTime) - new Date(b.dateTime)
  })

  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Vessel Schedule</h3>
        <span className="text-xs text-gray-400 px-3 py-1 bg-gray-700/30 rounded-full">
          Next 2 Weeks
        </span>
      </div>
      
      {sortedData.length > 0 ? (
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            {/* Tabla con encabezados */}
            <div className="overflow-hidden rounded-lg">
              {/* Encabezados de columna */}
              <div className="grid grid-cols-[40px_1.8fr_1.3fr_1.2fr_1.2fr_1.5fr] gap-4 px-4 py-3 bg-gray-800/40 border-b border-gray-700/50 rounded-t-lg">
                <div className="flex items-center justify-center">
                  <Ship className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Vessel Name
                </div>
                <div className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  Date & Time
                </div>
                <div className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-orange-400" />
                  Port
                </div>
                <div className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
                  Job Type
                </div>
                <div className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-purple-400" />
                  Client
                </div>
              </div>

              {/* Filas de datos */}
              <div className="max-h-96 overflow-y-auto custom-scrollbar">
                {sortedData.map((vessel, index) => (
                  <div
                    key={`${vessel._id}-${index}`}
                    className={`group grid grid-cols-[40px_1.8fr_1.3fr_1.2fr_1.2fr_1.5fr] gap-4 px-4 py-3 border-b border-gray-700/30 transition-all duration-300 hover:bg-white/5 ${getStatusColor(vessel.status)}`}
                  >
                    {/* Icono del barco */}
                    <div className="flex items-center justify-center">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                        <Ship className="w-4 h-4 text-cyan-400" />
                      </div>
                    </div>

                    {/* Nombre del Vessel */}
                    <div className="flex items-center">
                      <span className="text-white font-semibold text-sm truncate">
                        {vessel.vesselName || 'N/A'}
                      </span>
                    </div>

                    {/* Fecha y Hora */}
                    <div className="flex items-center">
                      <span className="text-gray-300 text-sm truncate">
                        {vessel.dateTime ? formatDateTime(vessel.dateTime) : 'Not set'}
                      </span>
                    </div>

                    {/* Puerto */}
                    <div className="flex items-center">
                      <span className="text-gray-400 text-sm truncate">
                        {vessel.port || 'N/A'}
                      </span>
                    </div>

                    {/* Tipo de Trabajo */}
                    <div className="flex items-center">
                      <span className="text-gray-400 text-sm capitalize truncate">
                        {vessel.jobType || 'N/A'}
                      </span>
                    </div>

                    {/* Cliente */}
                    <div className="flex items-center">
                      <span className="text-gray-400 text-sm truncate">
                        {vessel.clientName || 'N/A'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-400 py-8">
          <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No scheduled vessels in the next 2 weeks</p>
        </div>
      )}
    </div>
  )
}

