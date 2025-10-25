/**
 * Top Clients Chart Component
 * Horizontal bar chart showing top clients (Apache ECharts)
 */

import ReactECharts from 'echarts-for-react'

const COLORS = [
  { primary: '#3B82F6', gradient: ['#60A5FA', '#3B82F6', '#1D4ED8'], shadow: 'rgba(59, 130, 246, 0.4)' },
  { primary: '#22C55E', gradient: ['#4ADE80', '#22C55E', '#16A34A'], shadow: 'rgba(34, 197, 94, 0.4)' },
  { primary: '#F97316', gradient: ['#FB923C', '#F97316', '#EA580C'], shadow: 'rgba(249, 115, 22, 0.4)' },
  { primary: '#9333EA', gradient: ['#A855F7', '#9333EA', '#7C3AED'], shadow: 'rgba(147, 51, 234, 0.4)' },
  { primary: '#EAB308', gradient: ['#FDE047', '#EAB308', '#CA8A04'], shadow: 'rgba(234, 179, 8, 0.4)' }
]

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

  const chartData = data.map((item, index) => {
    const colorConfig = COLORS[index % COLORS.length]
    return {
      name: item._id || 'Unknown',
      value: sortBy === 'revenue' ? item.revenue : item.count,
      revenue: item.revenue,
      count: item.count,
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [
            { offset: 0, color: colorConfig.gradient[0] },
            { offset: 0.7, color: colorConfig.gradient[1] || colorConfig.primary },
            { offset: 1, color: colorConfig.gradient[2] || colorConfig.primary }
          ]
        },
        shadowBlur: 8,
        shadowColor: colorConfig.shadow,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)'
      }
    }
  })

  const names = chartData.map(item => item.name)
  const values = chartData.map(item => item.value)

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      backgroundColor: 'rgba(17, 24, 39, 0.95)',
      borderColor: 'rgba(75, 85, 99, 0.5)',
      borderWidth: 1,
      textStyle: {
        color: '#fff',
        fontSize: 13
      },
      padding: 12,
      formatter: function (params) {
        const item = chartData[params[0].dataIndex]
        return `
          <div style="font-weight: bold; margin-bottom: 8px;">${item.name}</div>
          <div style="color: #22C55E;">Revenue: <span style="font-weight: bold;">$${item.revenue.toLocaleString()}</span></div>
          <div style="color: #3B82F6;">Jobs: <span style="font-weight: bold;">${item.count}</span></div>
        `
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#9ca3af',
        fontSize: 12,
        formatter: (value) => sortBy === 'revenue' ? `$${value.toLocaleString()}` : value
      },
      splitLine: {
        lineStyle: {
          color: '#374151',
          type: 'dashed'
        }
      }
    },
    yAxis: {
      type: 'category',
      data: names,
      axisLine: {
        lineStyle: {
          color: '#374151'
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#9ca3af',
        fontSize: 12
      }
    },
    series: [
      {
        name: sortBy === 'revenue' ? 'Revenue' : 'Jobs',
        type: 'bar',
        data: chartData.map((item, index) => {
          const colorConfig = COLORS[index % COLORS.length]
          return {
            value: item.value,
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [
                  { offset: 0, color: colorConfig.gradient[0] },
                  { offset: 0.7, color: colorConfig.gradient[1] || colorConfig.primary },
                  { offset: 1, color: colorConfig.gradient[2] || colorConfig.primary }
                ]
              },
              borderRadius: [0, 12, 12, 0],
              shadowBlur: 8,
              shadowColor: colorConfig.shadow,
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.1)'
            }
          }
        }),
        barWidth: '65%',
        label: {
          show: false
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 15,
            shadowColor: 'rgba(0, 0, 0, 0.6)',
            borderWidth: 2,
            borderColor: 'rgba(255, 255, 255, 0.3)',
            scale: 1.05
          }
        },
        animationDuration: 2000,
        animationEasing: 'elasticOut',
        animationDelay: (idx) => idx * 150
      }
    ]
  }

  return (
    <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl overflow-hidden">
      {/* Efecto de brillo sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-blue-500/5 pointer-events-none"></div>
      
      {/* Header con icono */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white">
          Top Clients {sortBy === 'revenue' ? '(By Revenue)' : '(By Job Count)'}
        </h3>
        <div className="ml-auto text-xs text-gray-500 bg-gray-800/50 px-2 py-1 rounded-full">
          Real-time
        </div>
      </div>
      
      {chartData.length > 0 ? (
        <div className="relative">
          <ReactECharts
            option={option}
            style={{ height: '340px' }}
            opts={{ renderer: 'svg' }}
          />
          {/* Indicador de interactividad */}
          <div className="absolute bottom-2 right-2 text-xs text-gray-500 opacity-60">
            Hover for details
          </div>
        </div>
      ) : (
        <div className="h-80 flex flex-col items-center justify-center text-gray-400">
          <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-sm font-medium">No data available</p>
          <p className="text-xs text-gray-500 mt-1">Client data will appear here once jobs are created</p>
        </div>
      )}
    </div>
  )
}
