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

  // Colors for different job types with gradients and shadows
  const jobTypeColors = {
    'Claims': {
      primary: '#9333EA',
      gradient: ['#A855F7', '#9333EA', '#7C3AED'],
      shadow: 'rgba(147, 51, 234, 0.4)'
    },
    'ballast': {
      primary: '#3B82F6',
      gradient: ['#60A5FA', '#3B82F6', '#1D4ED8'],
      shadow: 'rgba(59, 130, 246, 0.4)'
    },
    'bunker': {
      primary: '#22C55E',
      gradient: ['#4ADE80', '#22C55E', '#16A34A'],
      shadow: 'rgba(34, 197, 94, 0.4)'
    },
    'bunkers': {
      primary: '#22C55E',
      gradient: ['#4ADE80', '#22C55E', '#16A34A'],
      shadow: 'rgba(34, 197, 94, 0.4)'
    },
    'cargo': {
      primary: '#F97316',
      gradient: ['#FB923C', '#F97316', '#EA580C'],
      shadow: 'rgba(249, 115, 22, 0.4)'
    },
    'survey': {
      primary: '#EAB308',
      gradient: ['#FDE047', '#EAB308', '#CA8A04'],
      shadow: 'rgba(234, 179, 8, 0.4)'
    },
    'inspection': {
      primary: '#14B8A6',
      gradient: ['#2DD4BF', '#14B8A6', '#0D9488'],
      shadow: 'rgba(20, 184, 166, 0.4)'
    },
    'other': {
      primary: '#DC2626',
      gradient: ['#F87171', '#DC2626', '#B91C1C'],
      shadow: 'rgba(220, 38, 38, 0.4)'
    }
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

  // Prepare series data for grouped bar chart with gradients
  const series = jobTypes.map(jobType => {
    const colorConfig = jobTypeColors[jobType] || { primary: '#6b7280', gradient: ['#6b7280'], shadow: 'rgba(107, 114, 128, 0.4)' }
    
    return {
      name: formatJobType(jobType),
      type: 'bar',
      barWidth: barWidth,
      barGap: '20%',
      barCategoryGap: categoryGap,
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
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 15,
          shadowColor: colorConfig.shadow,
          borderWidth: 2,
          borderColor: 'rgba(255, 255, 255, 0.3)',
          scale: 1.05
        }
      },
      data: chartData.map(month => month[jobType] || 0),
      animationDuration: 2000,
      animationEasing: 'elasticOut',
      animationDelay: (idx) => idx * 100
    }
  })

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
    <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl overflow-hidden">
      {/* Efecto de brillo sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 pointer-events-none"></div>
      
      {/* Header con icono */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white">Jobs Per Month (All Types)</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 bg-gray-800/50 px-2 py-1 rounded-full">
            {new Date().getFullYear()}
          </span>
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm font-medium">No jobs data for this year</p>
          <p className="text-xs text-gray-500 mt-1">Jobs will appear here once created</p>
        </div>
      )}
    </div>
  )
}
