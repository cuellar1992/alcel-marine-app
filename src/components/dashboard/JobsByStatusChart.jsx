/**
 * Jobs By Status Chart Component
 * Donut chart showing distribution of jobs by status (Apache ECharts)
 */

import ReactECharts from 'echarts-for-react'

const STATUS_COLORS = {
  pending: {
    primary: '#EAB308',
    gradient: ['#FDE047', '#EAB308', '#CA8A04'],
    shadow: 'rgba(234, 179, 8, 0.4)'
  },
  'in progress': {
    primary: '#3B82F6',
    gradient: ['#60A5FA', '#3B82F6', '#1D4ED8'],
    shadow: 'rgba(59, 130, 246, 0.4)'
  },
  completed: {
    primary: '#22C55E',
    gradient: ['#4ADE80', '#22C55E', '#16A34A'],
    shadow: 'rgba(34, 197, 94, 0.4)'
  },
  cancelled: {
    primary: '#DC2626',
    gradient: ['#F87171', '#DC2626', '#B91C1C'],
    shadow: 'rgba(220, 38, 38, 0.4)'
  },
}

export default function JobsByStatusChart({ data, loading = false }) {
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
        <h3 className="text-lg font-semibold text-white mb-4">Jobs by Status</h3>
        <div className="h-80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  const chartData = data.map(item => {
    const statusKey = item._id
    const colorConfig = STATUS_COLORS[statusKey] || { primary: '#6b7280', gradient: ['#6b7280'], shadow: 'rgba(107, 114, 128, 0.4)' }
    
    return {
      name: item._id ? item._id.charAt(0).toUpperCase() + item._id.slice(1) : 'Unknown',
      value: item.count,
      itemStyle: {
        color: {
          type: 'radial',
          x: 0.5,
          y: 0.5,
          r: 0.8,
          colorStops: [
            { offset: 0, color: colorConfig.gradient[0] },
            { offset: 0.7, color: colorConfig.gradient[1] || colorConfig.primary },
            { offset: 1, color: colorConfig.gradient[2] || colorConfig.primary }
          ]
        },
        shadowBlur: 8,
        shadowColor: colorConfig.shadow,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.1)'
      }
    }
  })

  const totalJobs = chartData.reduce((sum, item) => sum + item.value, 0)

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(17, 24, 39, 0.95)',
      borderColor: 'rgba(75, 85, 99, 0.5)',
      borderWidth: 1,
      borderRadius: 12,
      textStyle: {
        color: '#fff',
        fontSize: 13
      },
      padding: [12, 16],
      formatter: function(params) {
        const percentage = ((params.value / totalJobs) * 100).toFixed(1)
        return `
          <div style="display: flex; align-items: center; margin-bottom: 8px;">
            <div style="width: 12px; height: 12px; background: ${params.color}; border-radius: 50%; margin-right: 8px;"></div>
            <span style="font-weight: bold; font-size: 14px;">${params.name}</span>
          </div>
          <div style="color: #9ca3af;">Jobs: <span style="color: #fff; font-weight: bold;">${params.value}</span></div>
          <div style="color: #9ca3af;">Percentage: <span style="color: #fff; font-weight: bold;">${percentage}%</span></div>
        `
      }
    },
    legend: {
      orient: 'horizontal',
      bottom: '5%',
      left: 'center',
      textStyle: {
        color: '#9ca3af',
        fontSize: 13,
        fontWeight: '500'
      },
      itemGap: 20,
      itemWidth: 16,
      itemHeight: 16,
      icon: 'circle',
      formatter: function(name) {
        const item = chartData.find(d => d.name === name)
        return `${name} (${item ? item.value : 0})`
      }
    },
    series: [
      {
        name: 'Jobs by Status',
        type: 'pie',
        radius: ['50%', '75%'], // Dona más elegante con mayor diferencia
        center: ['50%', '45%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8, // Bordes redondeados para un look más moderno
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 2,
          shadowBlur: 12,
          shadowColor: 'rgba(0, 0, 0, 0.3)'
        },
        label: {
          show: false // Ocultamos labels por defecto para un look más limpio
        },
        labelLine: {
          show: false
        },
        emphasis: {
          scale: true,
          scaleSize: 12,
          itemStyle: {
            shadowBlur: 20,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            borderWidth: 3,
            borderColor: 'rgba(255, 255, 255, 0.3)'
          },
          label: {
            show: false
          },
          labelLine: {
            show: false
          }
        },
        data: chartData,
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDuration: 2000,
        animationDelay: (idx) => idx * 100
      },
      // Centro con total mejorado
      {
        type: 'pie',
        radius: ['0%', '45%'],
        center: ['50%', '45%'],
        silent: true,
        label: {
          show: true,
          position: 'center',
          formatter: () => {
            return `{total|${totalJobs}}\n{label|Total Jobs}\n{subtitle|Status Overview}`
          },
          rich: {
            total: {
              fontSize: 32,
              fontWeight: 'bold',
              color: '#fff',
              lineHeight: 40,
              textShadowColor: 'rgba(0, 0, 0, 0.3)',
              textShadowBlur: 4
            },
            label: {
              fontSize: 12,
              color: '#9ca3af',
              lineHeight: 18,
              fontWeight: '500'
            },
            subtitle: {
              fontSize: 10,
              color: '#6b7280',
              lineHeight: 16
            }
          }
        },
        itemStyle: {
          color: {
            type: 'radial',
            x: 0.5,
            y: 0.5,
            r: 0.8,
            colorStops: [
              { offset: 0, color: 'rgba(31, 41, 55, 0.8)' },
              { offset: 1, color: 'rgba(17, 24, 39, 0.9)' }
            ]
          },
          borderWidth: 2,
          borderColor: 'rgba(75, 85, 99, 0.3)',
          shadowBlur: 8,
          shadowColor: 'rgba(0, 0, 0, 0.2)'
        },
        data: [{ value: 1 }]
      }
    ]
  }

  return (
    <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl overflow-hidden">
      {/* Efecto de brillo sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none"></div>
      
      {/* Header con icono */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white">Jobs by Status</h3>
        <div className="ml-auto text-xs text-gray-500 bg-gray-800/50 px-2 py-1 rounded-full">
          Real-time
        </div>
      </div>
      
      {chartData.length > 0 ? (
        <div className="relative">
          <ReactECharts
            option={option}
            style={{ height: '380px' }}
            opts={{ renderer: 'svg' }}
          />
        </div>
      ) : (
        <div className="h-80 flex flex-col items-center justify-center text-gray-400">
          <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-sm font-medium">No data available</p>
          <p className="text-xs text-gray-500 mt-1">Jobs will appear here once created</p>
        </div>
      )}
    </div>
  )
}
