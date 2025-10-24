/**
 * Revenue Trends Chart Component
 * Area chart showing net profit trends over time (Apache ECharts)
 */

import ReactECharts from 'echarts-for-react'

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

  const chartData = data.map(item => ({
    month: MONTHS[item.month - 1],
    revenue: item.revenue || 0,
    count: item.count || 0,
    fullDate: `${MONTHS[item.month - 1]} ${item.year}`
  }))

  const months = chartData.map(item => item.month)
  const revenues = chartData.map(item => item.revenue)
  const counts = chartData.map(item => item.count)

  const hasRevenue = chartData.some(item => item.revenue > 0)

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(17, 24, 39, 0.95)',
      borderColor: 'rgba(75, 85, 99, 0.5)',
      borderWidth: 1,
      textStyle: {
        color: '#fff',
        fontSize: 13
      },
      padding: 12,
      formatter: function (params) {
        const dataIndex = params[0].dataIndex
        return `
          <div style="font-weight: bold; margin-bottom: 8px;">${chartData[dataIndex].fullDate}</div>
          <div style="color: #22C55E;">Net Profit: <span style="font-weight: bold;">$${params[0].value.toLocaleString()}</span></div>
          <div style="color: #3B82F6;">Jobs: <span style="font-weight: bold;">${counts[dataIndex]}</span></div>
        `
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: months,
      axisLine: {
        lineStyle: {
          color: '#374151'
        }
      },
      axisLabel: {
        color: '#9ca3af',
        fontSize: 12
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
        fontSize: 12,
        formatter: (value) => `$${value.toLocaleString()}`
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
        name: 'Net Profit',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        sampling: 'lttb',
        itemStyle: {
          color: '#22C55E',
          borderWidth: 2,
          borderColor: '#fff'
        },
        lineStyle: {
          width: 3,
          color: '#22C55E'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(34, 197, 94, 0.3)'
              },
              {
                offset: 1,
                color: 'rgba(34, 197, 94, 0.05)'
              }
            ]
          }
        },
        emphasis: {
          focus: 'series',
          itemStyle: {
            color: '#22C55E',
            borderWidth: 3,
            borderColor: '#fff',
            shadowBlur: 10,
            shadowColor: 'rgba(34, 197, 94, 0.5)'
          }
        },
        data: revenues,
        animationDuration: 2000,
        animationEasing: 'cubicOut'
      }
    ]
  }

  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Net Profit Trends</h3>
        <span className="text-xs text-gray-500 bg-gray-800/50 px-2 py-1 rounded">
          Last 12 months
        </span>
      </div>

      {chartData.length > 0 ? (
        <>
          <ReactECharts
            option={option}
            style={{ height: '320px' }}
            opts={{ renderer: 'svg' }}
          />
          {!hasRevenue && (
            <div className="mt-2 text-center">
              <p className="text-xs text-yellow-500/80">
                ⚠️ Jobs found but no net profit recorded. Please add invoice and subcontract amounts.
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="h-80 flex flex-col items-center justify-center text-gray-400">
          <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-sm">No net profit data for the last 12 months</p>
          <p className="text-xs text-gray-500 mt-1">Add invoice and subcontract amounts to your jobs to see trends</p>
        </div>
      )}
    </div>
  )
}
