/**
 * Ships By Port Chart Component
 * Bar chart showing number of ships per port (Apache ECharts)
 */

import ReactECharts from 'echarts-for-react'

const COLORS = ['#3B82F6', '#22C55E', '#EAB308', '#F97316', '#DC2626', '#9333EA', '#14B8A6']

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

  const chartData = data.map((item, index) => ({
    name: item._id || 'Unknown',
    value: item.count,
    itemStyle: {
      color: COLORS[index % COLORS.length]
    }
  }))

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
        data: chartData.map((item, index) => ({
          value: item.value,
          itemStyle: {
            color: COLORS[index % COLORS.length],
            borderRadius: [8, 8, 0, 0]
          }
        })),
        barWidth: '50%',
        label: {
          show: false
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        animationDuration: 1500,
        animationEasing: 'elasticOut',
        animationDelay: (idx) => idx * 80
      }
    ]
  }

  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
      <h3 className="text-lg font-semibold text-white mb-4">Ships by Port</h3>
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
