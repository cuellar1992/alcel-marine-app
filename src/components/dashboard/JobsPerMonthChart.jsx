/**
 * Jobs Per Month Chart Component
 * Grouped bar chart showing jobs per month by type (Apache ECharts)
 */

import ReactECharts from 'echarts-for-react'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function JobsPerMonthChart({ data, loading = false }) {
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
        <h3 className="text-lg font-semibold text-white mb-4">Jobs Per Month</h3>
        <div className="h-80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  // Group by month and job type
  const monthlyData = {}

  data.forEach(item => {
    const monthKey = item._id.month
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = {
        month: MONTHS[monthKey - 1],
        monthNumber: monthKey,
        total: 0
      }
    }

    const jobType = item._id.jobType || 'other'
    monthlyData[monthKey][jobType] = item.count
    monthlyData[monthKey].total += item.count
  })

  // Convert to array and sort by month
  let chartData = Object.values(monthlyData).sort((a, b) => a.monthNumber - b.monthNumber)

  // Filter out months with no data (total = 0)
  chartData = chartData.filter(month => month.total > 0)

  // Get all unique job types
  const jobTypesSet = new Set()
  data.forEach(item => {
    jobTypesSet.add(item._id.jobType || 'other')
  })
  const jobTypes = Array.from(jobTypesSet)

  // Colors for different job types (Vibrant palette)
  const jobTypeColors = {
    'Claims': '#9333EA',     // Púrpura for Claims
    'ballast': '#3B82F6',    // Azul vibrante
    'bunker': '#22C55E',     // Verde brillante
    'bunkers': '#22C55E',    // Verde brillante (alias)
    'cargo': '#F97316',      // Naranja intenso
    'survey': '#EAB308',     // Amarillo vivo
    'inspection': '#14B8A6', // Teal
    'other': '#DC2626'       // Rojo
  }

  // Format job type name for display
  const formatJobType = (type) => {
    if (!type) return 'Other'
    if (type === 'Claims') return 'Claims'
    return type.charAt(0).toUpperCase() + type.slice(1)
  }

  const months = chartData.map(item => item.month)

  // Calculate bar width based on number of months
  const numberOfMonths = chartData.length
  const barWidth = numberOfMonths <= 3 ? 24 : numberOfMonths <= 6 ? 20 : 18
  const categoryGap = numberOfMonths <= 3 ? '50%' : numberOfMonths <= 6 ? '45%' : '40%'

  // Prepare series data for grouped bar chart
  const series = jobTypes.map(jobType => ({
    name: formatJobType(jobType),
    type: 'bar',
    barWidth: barWidth, // Ancho dinámico según cantidad de meses
    barGap: '20%', // Espacio entre barras del mismo grupo
    barCategoryGap: categoryGap, // Espacio entre grupos de barras (meses)
    itemStyle: {
      color: jobTypeColors[jobType] || '#6b7280',
      borderRadius: [6, 6, 0, 0]
    },
    emphasis: {
      itemStyle: {
        shadowBlur: 10,
        shadowColor: 'rgba(0, 0, 0, 0.5)',
        borderWidth: 2,
        borderColor: '#fff'
      }
    },
    data: chartData.map(month => month[jobType] || 0),
    animationDuration: 1500,
    animationEasing: 'elasticOut',
    animationDelay: (idx) => idx * 50
  }))

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
        let result = `<div style="font-weight: bold; margin-bottom: 8px; font-size: 14px;">${params[0].axisValue}</div>`
        let total = 0

        // Sort by value descending
        const sortedParams = [...params].sort((a, b) => b.value - a.value)

        sortedParams.forEach(item => {
          if (item.value > 0) {
            result += `
              <div style="display: flex; align-items: center; margin-bottom: 4px;">
                <span style="display: inline-block; width: 12px; height: 12px; background-color: ${item.color}; border-radius: 3px; margin-right: 8px;"></span>
                <span style="color: #9ca3af;">${item.seriesName}:</span>
                <span style="font-weight: bold; margin-left: 8px; color: ${item.color};">${item.value}</span>
              </div>
            `
            total += item.value
          }
        })

        result += `<div style="border-top: 1px solid #374151; margin-top: 8px; padding-top: 8px; display: flex; justify-content: space-between;">
          <span style="color: #9ca3af;">Total:</span>
          <span style="font-weight: bold; color: #fff;">${total}</span>
        </div>`

        return result
      }
    },
    legend: {
      data: jobTypes.map(formatJobType),
      textStyle: {
        color: '#9ca3af',
        fontSize: 12
      },
      bottom: '2%',
      itemGap: 20,
      itemWidth: 16,
      itemHeight: 12,
      icon: 'roundRect'
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '12%',
      top: '8%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: months,
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
    series: series
  }

  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Jobs Per Month (All Types)</h3>
        <span className="text-xs text-gray-500 bg-gray-800/50 px-2 py-1 rounded">
          {new Date().getFullYear()}
        </span>
      </div>
      {chartData.length > 0 ? (
        <ReactECharts
          option={option}
          style={{ height: '320px' }}
          opts={{ renderer: 'svg' }}
        />
      ) : (
        <div className="h-80 flex items-center justify-center text-gray-400">
          <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-sm">No jobs data for this year</p>
        </div>
      )}
    </div>
  )
}
