/**
 * Top Clients Chart Component
 * Horizontal bar chart showing top clients (Apache ECharts)
 */

import ReactECharts from 'echarts-for-react'

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

  const chartData = data.map((item, index) => ({
    name: item._id || 'Unknown',
    value: sortBy === 'revenue' ? item.revenue : item.count,
    revenue: item.revenue,
    count: item.count,
    itemStyle: {
      color: COLORS[index % COLORS.length]
    }
  }))

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
        data: chartData.map((item, index) => ({
          value: item.value,
          itemStyle: {
            color: COLORS[index % COLORS.length],
            borderRadius: [0, 8, 8, 0]
          }
        })),
        barWidth: '60%',
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
        animationEasing: 'cubicOut',
        animationDelay: (idx) => idx * 100
      }
    ]
  }

  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
      <h3 className="text-lg font-semibold text-white mb-4">
        Top Clients {sortBy === 'revenue' ? '(By Revenue)' : '(By Job Count)'}
      </h3>
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
