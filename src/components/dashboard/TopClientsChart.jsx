/**
 * Top Clients Chart Component
 * Horizontal bar chart showing top clients
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const COLORS = ['#3B82F6', '#22C55E', '#F97316', '#9333EA', '#EAB308']

export default function TopClientsChart({ data, loading = false, sortBy = 'revenue' }) {
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
        <h3 className="text-lg font-semibold text-white mb-4">Top Clients</h3>
        <div className="h-80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  const chartData = data.map(item => ({
    name: item._id || 'Unknown',
    value: sortBy === 'revenue' ? item.revenue : item.count,
    revenue: item.revenue,
    count: item.count
  }))

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-lg p-3 shadow-xl">
          <p className="text-white font-semibold mb-1">{payload[0].payload.name}</p>
          <p style={{ color: '#22C55E' }} className="text-sm">
            Revenue: <span className="font-bold">${payload[0].payload.revenue.toLocaleString()}</span>
          </p>
          <p style={{ color: '#3B82F6' }} className="text-sm">
            Jobs: <span className="font-bold">{payload[0].payload.count}</span>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
      <h3 className="text-lg font-semibold text-white mb-4">
        Top Clients {sortBy === 'revenue' ? '(By Revenue)' : '(By Job Count)'}
      </h3>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              type="number" 
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => sortBy === 'revenue' ? `$${value.toLocaleString()}` : value}
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
              width={120}
            />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Bar dataKey="value" radius={[0, 8, 8, 0]} activeBar={false}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-80 flex items-center justify-center text-gray-400">
          No data available
        </div>
      )}
    </div>
  )
}

