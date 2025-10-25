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
          <div style="color: #22C55E;">Net Profit: <span style="font-weight: bold; font-size: 16px;">$${params[0].value.toLocaleString()}</span></div>
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
        formatter: (value) => `{dollar|$}{amount|${value.toLocaleString()}}`,
        rich: {
          dollar: {
            fontSize: 14,
            fontWeight: 'bold',
            color: '#9ca3af'
          },
          amount: {
            fontSize: 12,
            color: '#9ca3af'
          }
        }
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
          borderWidth: 3,
          borderColor: '#fff',
          shadowBlur: 8,
          shadowColor: 'rgba(34, 197, 94, 0.3)'
        },
        lineStyle: {
          width: 4,
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: '#4ADE80' },
              { offset: 0.5, color: '#22C55E' },
              { offset: 1, color: '#16A34A' }
            ]
          },
          shadowBlur: 6,
          shadowColor: 'rgba(34, 197, 94, 0.4)'
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
                color: 'rgba(34, 197, 94, 0.4)'
              },
              {
                offset: 0.5,
                color: 'rgba(34, 197, 94, 0.2)'
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
            borderWidth: 4,
            borderColor: '#fff',
            shadowBlur: 15,
            shadowColor: 'rgba(34, 197, 94, 0.6)',
            scale: 1.2
          },
          lineStyle: {
            width: 5,
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
    <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl overflow-hidden">
      {/* Efecto de brillo sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 pointer-events-none"></div>
      
      {/* Header con icono */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white">Net Profit Trends</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 bg-gray-800/50 px-2 py-1 rounded-full">
            Last 12 months
          </span>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      {chartData.length > 0 ? (
        <>
          <div className="relative">
            <ReactECharts
              option={option}
              style={{ height: '340px' }}
              opts={{ renderer: 'svg' }}
            />
            {/* Indicador de interactividad */}
            <div className="absolute top-2 right-2 text-xs text-gray-500 opacity-60 bg-gray-800/50 px-2 py-1 rounded-full">
              Hover for details
            </div>
          </div>
          {!hasRevenue && (
            <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-xs text-yellow-500/80 font-medium">
                  Jobs found but no net profit recorded. Please add invoice and subcontract amounts.
                </p>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="h-80 flex flex-col items-center justify-center text-gray-400">
          <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-sm font-medium">No net profit data for the last 12 months</p>
          <p className="text-xs text-gray-500 mt-1">Add invoice and subcontract amounts to your jobs to see trends</p>
        </div>
      )}
    </div>
  )
}
