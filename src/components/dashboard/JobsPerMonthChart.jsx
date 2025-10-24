/**
 * Jobs Per Month Chart Component
 * Shows total jobs per month including both regular jobs and claims
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function JobsPerMonthChart({ data, loading = false }) {
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
        <h3 className="text-lg font-semibold text-white mb-4">Jobs Per Month</h3>
        <div className="h-80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  // Group by month and job type
  const monthlyData = {}
  
  data.forEach(item => {
    const monthKey = item._id.month
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = {
        month: MONTHS[monthKey - 1],
        monthNumber: monthKey,
        total: 0
      }
    }
    
    const jobType = item._id.jobType || 'other'
    monthlyData[monthKey][jobType] = item.count
    monthlyData[monthKey].total += item.count
  })

  // Convert to array and sort by month
  const chartData = Object.values(monthlyData).sort((a, b) => a.monthNumber - b.monthNumber)

  // Get all unique job types
  const jobTypes = new Set()
  data.forEach(item => {
    jobTypes.add(item._id.jobType || 'other')
  })
  const jobTypesArray = Array.from(jobTypes)

  // Colors for different job types (Vibrant palette)
  const jobTypeColors = {
    'Claims': '#9333EA',     // Púrpura for Claims
    'ballast': '#3B82F6',    // Azul vibrante
    'bunker': '#22C55E',     // Verde brillante
    'bunkers': '#22C55E',    // Verde brillante (alias)
    'cargo': '#F97316',      // Naranja intenso
    'survey': '#EAB308',     // Amarillo vivo
    'inspection': '#14B8A6', // Teal
    'other': '#DC2626'       // Rojo
  }

  // Format job type name for display
  const formatJobType = (type) => {
    if (!type) return 'Other'
    if (type === 'Claims') return 'Claims'
    return type.charAt(0).toUpperCase() + type.slice(1)
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum, entry) => sum + entry.value, 0)
      return (
        <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-lg p-3 shadow-xl">
          <p className="text-white font-semibold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {formatJobType(entry.name)}: <span className="font-bold">{entry.value}</span>
            </p>
          ))}
          <div className="border-t border-gray-700 mt-2 pt-2">
            <p className="text-white text-sm font-semibold">
              Total: {total}
            </p>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Jobs Per Month (All Types)</h3>
        <span className="text-xs text-gray-500 bg-gray-800/50 px-2 py-1 rounded">
          {new Date().getFullYear()}
        </span>
      </div>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="month" 
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ fontSize: '12px' }}
              formatter={(value) => formatJobType(value)}
            />
            {jobTypesArray.map((jobType, index) => (
              <Bar 
                key={jobType}
                dataKey={jobType} 
                stackId="a"
                fill={jobTypeColors[jobType] || '#6b7280'}
                radius={index === jobTypesArray.length - 1 ? [8, 8, 0, 0] : [0, 0, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-80 flex items-center justify-center text-gray-400">
          <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-sm">No jobs data for this year</p>
        </div>
      )}
    </div>
  )
}

