/**
 * Ships By Port Chart Component
 * Bar chart showing number of ships per port (Apache ECharts)
 */

import ReactECharts from 'echarts-for-react'

const COLORS = [
  { primary: '#8B5CF6', gradient: ['#A78BFA', '#8B5CF6', '#7C3AED'], shadow: 'rgba(139, 92, 246, 0.4)' },
  { primary: '#06B6D4', gradient: ['#22D3EE', '#06B6D4', '#0891B2'], shadow: 'rgba(6, 182, 212, 0.4)' },
  { primary: '#F59E0B', gradient: ['#FBBF24', '#F59E0B', '#D97706'], shadow: 'rgba(245, 158, 11, 0.4)' },
  { primary: '#EF4444', gradient: ['#F87171', '#EF4444', '#DC2626'], shadow: 'rgba(239, 68, 68, 0.4)' },
  { primary: '#10B981', gradient: ['#34D399', '#10B981', '#059669'], shadow: 'rgba(16, 185, 129, 0.4)' },
  { primary: '#F97316', gradient: ['#FB923C', '#F97316', '#EA580C'], shadow: 'rgba(249, 115, 22, 0.4)' },
  { primary: '#EC4899', gradient: ['#F472B6', '#EC4899', '#DB2777'], shadow: 'rgba(236, 72, 153, 0.4)' }
]

export default function ShipsByPortChart({ data, loading = false }) {
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
        <h3 className="text-lg font-semibold text-white mb-4">Ships by Port</h3>
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
      value: item.count,
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
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

  const ports = chartData.map(item => item.name)
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
      formatter: '{b}: {c} ships'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ports,
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
        fontSize: 12,
        rotate: 45,
        interval: 0
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#9ca3af',
        fontSize: 12
      },
      splitLine: {
        lineStyle: {
          color: '#374151',
          type: 'dashed'
        }
      }
    },
    series: [
      {
        name: 'Ships',
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
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: colorConfig.gradient[0] },
                  { offset: 0.7, color: colorConfig.gradient[1] || colorConfig.primary },
                  { offset: 1, color: colorConfig.gradient[2] || colorConfig.primary }
                ]
              },
              borderRadius: [8, 8, 0, 0],
              shadowBlur: 8,
              shadowColor: colorConfig.shadow,
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.1)'
            }
          }
        }),
        barWidth: '50%',
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
        animationDelay: (idx) => idx * 100
      }
    ]
  }

  return (
    <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl overflow-hidden">
      {/* Efecto de brillo sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 pointer-events-none"></div>
      
      {/* Header con icono */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white">Ships by Port</h3>
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <p className="text-sm font-medium">No data available</p>
          <p className="text-xs text-gray-500 mt-1">Ship data will appear here once recorded</p>
        </div>
      )}
    </div>
  )
}
