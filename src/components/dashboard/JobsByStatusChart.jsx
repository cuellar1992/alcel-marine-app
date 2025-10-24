/**
 * Jobs By Status Chart Component
 * Donut chart showing distribution of jobs by status (Apache ECharts)
 */

import ReactECharts from 'echarts-for-react'

const STATUS_COLORS = {
  pending: '#EAB308',      // Amarillo vivo
  'in progress': '#3B82F6', // Azul vibrante
  completed: '#22C55E',     // Verde brillante
  cancelled: '#DC2626',     // Rojo
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

  const chartData = data.map(item => ({
    name: item._id ? item._id.charAt(0).toUpperCase() + item._id.slice(1) : 'Unknown',
    value: item.count,
    itemStyle: {
      color: STATUS_COLORS[item._id] || '#6b7280'
    }
  }))

  const totalJobs = chartData.reduce((sum, item) => sum + item.value, 0)

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} jobs ({d}%)',
      backgroundColor: 'rgba(17, 24, 39, 0.95)',
      borderColor: 'rgba(75, 85, 99, 0.5)',
      borderWidth: 1,
      textStyle: {
        color: '#fff',
        fontSize: 13
      },
      padding: 12
    },
    legend: {
      orient: 'horizontal',
      bottom: '5%',
      left: 'center',
      textStyle: {
        color: '#9ca3af',
        fontSize: 12
      },
      itemGap: 20,
      itemWidth: 14,
      itemHeight: 14
    },
    series: [
      {
        name: 'Jobs by Status',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '45%'],
        avoidLabelOverlap: true,
        padAngle: 3,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#1f2937',
          borderWidth: 3
        },
        label: {
          show: false
        },
        emphasis: {
          scale: true,
          scaleSize: 12,
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold',
            color: '#fff',
            formatter: '{b}\n{d}%'
          }
        },
        data: chartData,
        // Animación suave
        animationType: 'expansion',
        animationEasing: 'elasticOut',
        animationDelay: (idx) => idx * 80
      },
      // Centro con total
      {
        type: 'pie',
        radius: ['0%', '35%'],
        center: ['50%', '45%'],
        label: {
          show: true,
          position: 'center',
          formatter: () => {
            return `{total|${totalJobs}}\n{label|Total}`
          },
          rich: {
            total: {
              fontSize: 36,
              fontWeight: 'bold',
              color: '#fff',
              lineHeight: 44
            },
            label: {
              fontSize: 13,
              color: '#9ca3af',
              lineHeight: 22
            }
          }
        },
        emphasis: {
          scale: false
        },
        itemStyle: {
          color: 'rgba(31, 41, 55, 0.3)'
        },
        data: [{ value: 1, itemStyle: { color: 'transparent' } }],
        silent: true
      }
    ]
  }

  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
      <h3 className="text-lg font-semibold text-white mb-4">Jobs by Status</h3>
      {chartData.length > 0 ? (
        <ReactECharts
          option={option}
          style={{ height: '320px' }}
          opts={{ renderer: 'svg' }}
        />
      ) : (
        <div className="h-80 flex items-center justify-center text-gray-400">
          No data available
        </div>
      )}
    </div>
  )
}
