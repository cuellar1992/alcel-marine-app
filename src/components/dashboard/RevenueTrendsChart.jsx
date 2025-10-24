/**
 * Revenue Trends Chart Component
 * Line/Area chart showing net profit trends over time
 */

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function RevenueTrendsChart({ data, loading = false }) {
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
        <h3 className="text-lg font-semibold text-white mb-4">Net Profit Trends</h3>
        <div className="h-80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  console.log('Revenue Trends Data:', data)

  const chartData = data.map(item => ({
    month: MONTHS[item.month - 1],
    revenue: item.revenue || 0,
    count: item.count || 0,
    fullDate: `${MONTHS[item.month - 1]} ${item.year}`
  }))

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-lg p-3 shadow-xl">
          <p className="text-white font-semibold mb-1">{payload[0].payload.fullDate}</p>
          <p style={{ color: '#22C55E' }} className="text-sm">
            Net Profit: <span className="font-bold">${payload[0].value.toLocaleString()}</span>
          </p>
          <p style={{ color: '#3B82F6' }} className="text-sm">
            Jobs: <span className="font-bold">{payload[0].payload.count}</span>
          </p>
        </div>
      )
    }
    return null
  }

  // Check if we have valid revenue data
  const hasRevenue = chartData.some(item => item.revenue > 0)

  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Net Profit Trends</h3>
        <span className="text-xs text-gray-500 bg-gray-800/50 px-2 py-1 rounded">
          Last 12 months
        </span>
      </div>
      
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="month"
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#22C55E"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-80 flex flex-col items-center justify-center text-gray-400">
          <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-sm">No net profit data for the last 12 months</p>
          <p className="text-xs text-gray-500 mt-1">Add invoice and subcontract amounts to your jobs to see trends</p>
        </div>
      )}
      
      {!hasRevenue && chartData.length > 0 && (
        <div className="mt-2 text-center">
          <p className="text-xs text-yellow-500/80">
            ⚠️ Jobs found but no net profit recorded. Please add invoice and subcontract amounts.
          </p>
        </div>
      )}
    </div>
  )
}

