/**
 * Jobs By Type Chart Component
 * Donut chart showing distribution of jobs by type (Apache ECharts)
 */

import ReactECharts from 'echarts-for-react'

const COLORS = ['#3B82F6', '#22C55E', '#EAB308', '#F97316', '#DC2626', '#9333EA']

export default function JobsByTypeChart({ data, loading = false }) {
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
        <h3 className="text-lg font-semibold text-white mb-4">Jobs by Type</h3>
        <div className="h-80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  const chartData = data.map((item, index) => ({
    name: item._id ? item._id.charAt(0).toUpperCase() + item._id.slice(1) : 'Unknown',
    value: item.count,
    itemStyle: {
      color: COLORS[index % COLORS.length]
    }
  }))

  const totalJobs = chartData.reduce((sum, item) => sum + item.value, 0)

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
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
      orient: 'vertical',
      right: '5%',
      top: 'center',
      textStyle: {
        color: '#9ca3af',
        fontSize: 12
      },
      itemGap: 12,
      itemWidth: 12,
      itemHeight: 12
    },
    series: [
      {
        name: 'Jobs by Type',
        type: 'pie',
        radius: ['45%', '75%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: true,
        padAngle: 2,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#1f2937',
          borderWidth: 2
        },
        label: {
          show: false
        },
        emphasis: {
          scale: true,
          scaleSize: 10,
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold',
            color: '#fff'
          }
        },
        data: chartData,
        // Animación suave
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: (idx) => idx * 50
      },
      // Centro con total
      {
        type: 'pie',
        radius: ['0%', '40%'],
        center: ['35%', '50%'],
        label: {
          show: true,
          position: 'center',
          formatter: () => {
            return `{total|${totalJobs}}\n{label|Total Jobs}`
          },
          rich: {
            total: {
              fontSize: 32,
              fontWeight: 'bold',
              color: '#fff',
              lineHeight: 40
            },
            label: {
              fontSize: 12,
              color: '#9ca3af',
              lineHeight: 20
            }
          }
        },
        emphasis: {
          scale: false
        },
        itemStyle: {
          color: 'rgba(31, 41, 55, 0.3)'
        },
        data: [{ value: 1, itemStyle: { color: 'transparent' } }]
      }
    ]
  }

  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
      <h3 className="text-lg font-semibold text-white mb-4">Jobs by Type</h3>
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
