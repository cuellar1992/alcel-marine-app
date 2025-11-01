/**
 * Jobs By Month Grouped Chart Component
 * Grouped bar chart showing jobs by month, differentiated by form type (Non-Claims vs Claims)
 * Apache ECharts implementation
 */

import ReactECharts from 'echarts-for-react'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Paleta de colores vibrantes y profesionales para tipos de trabajo
const COLOR_PALETTE = [
  '#3B82F6', // Azul - Ballast
  '#22C55E', // Verde - Bunker
  '#F97316', // Naranja - Claims
  '#9333EA', // Morado - Inspection
  '#EC4899', // Rosa - Survey
  '#06B6D4', // Cyan - Other
  '#8B5CF6', // Violeta
  '#10B981', // Esmeralda
  '#F59E0B', // Ámbar
  '#EF4444', // Rojo
  '#14B8A6', // Turquesa
  '#6366F1', // Índigo
  '#84CC16', // Lima
  '#F43F5E', // Rosa oscuro
  '#0EA5E9', // Cielo
  '#A855F7', // Morado claro
  '#EAB308', // Amarillo
  '#FB923C', // Naranja claro
]

// Función para asignar un color consistente basado en el nombre del tipo de trabajo
const getColorForJobType = (formType, jobType) => {
  // Mapa de colores específicos para tipos conocidos
  const specificColors = {
    'Claims': '#F97316', // Naranja distintivo para Claims
    'ballast': '#3B82F6', // Azul para Ballast
    'bunker': '#22C55E', // Verde para Bunker
    'inspection': '#9333EA', // Morado para Inspection
    'survey': '#EC4899', // Rosa para Survey
    'cargo': '#06B6D4', // Cyan para Cargo
    'tank': '#8B5CF6', // Violeta para Tank
    'gas': '#10B981', // Esmeralda para Gas
    'oil': '#F59E0B', // Ámbar para Oil
    'chemical': '#EF4444', // Rojo para Chemical
    'wtb': '#0EA5E9', // Cielo para WTB (intercambiado con BIS)
    'wbt': '#0EA5E9', // Cielo para WBT (intercambiado con BIS)
    'bis': '#FB923C', // Naranja claro para BIS (intercambiado con WTB)
    // Variaciones en mayúsculas/minúsculas
    'WTB': '#0EA5E9',
    'WBT': '#0EA5E9',
    'BIS': '#FB923C',
    'Wtb': '#0EA5E9',
    'Wbt': '#0EA5E9',
    'Bis': '#FB923C',
  }

  // Si es Claims, usar color específico
  if (formType === 'Claims') {
    return specificColors['Claims']
  }

  // Normalizar el nombre del tipo de trabajo - remover espacios y convertir a minúsculas
  const normalizedType = jobType?.toLowerCase().trim().replace(/\s+/g, '') || 'other'

  // Verificación especial para WTB/WBT y BIS - verificar si contiene estas palabras
  if (normalizedType.includes('wtb') || normalizedType === 'wbt') {
    return '#0EA5E9' // Cielo para WTB/WBT
  }
  if (normalizedType.includes('bis') || normalizedType === 'bis') {
    return '#FB923C' // Naranja claro para BIS
  }

  // Si tiene un color específico, usarlo
  if (specificColors[normalizedType]) {
    return specificColors[normalizedType]
  }

  // También verificar sin normalizar por si acaso viene con mayúsculas específicas
  const trimmedType = jobType?.trim() || ''
  if (specificColors[trimmedType]) {
    return specificColors[trimmedType]
  }

  // Si no, usar hash para asignar un color de la paleta de forma consistente
  // PERO asegurarse de que WTB y BIS siempre tengan sus colores específicos
  let hash = 0
  const typeString = `${formType}-${jobType}`
  for (let i = 0; i < typeString.length; i++) {
    hash = typeString.charCodeAt(i) + ((hash << 5) - hash)
  }
  const colorIndex = Math.abs(hash) % COLOR_PALETTE.length
  return COLOR_PALETTE[colorIndex]
}

export default function JobsByMonthGroupedChart({ data, loading = false }) {
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
        <h3 className="text-lg font-semibold text-white mb-4">Jobs by Month</h3>
        <div className="h-80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  // Organizar datos por mes y tipo de trabajo
  const monthDataMap = new Map()
  
  // Inicializar todos los meses con valores 0
  for (let month = 1; month <= 12; month++) {
    monthDataMap.set(month, {
      month,
      monthName: MONTHS[month - 1],
      jobTypes: new Map()
    })
  }

  // Procesar datos del backend
  data.forEach(item => {
    const monthData = monthDataMap.get(item.month)
    if (monthData) {
      // Usar un separador único para evitar conflictos con guiones en jobType
      const key = `${item.formType}::${item.jobType}`
      if (monthData.jobTypes.has(key)) {
        monthData.jobTypes.set(key, monthData.jobTypes.get(key) + item.count)
      } else {
        monthData.jobTypes.set(key, item.count)
      }
    }
  })

  // Obtener todos los tipos de trabajo únicos
  const allJobTypes = new Set()
  data.forEach(item => {
    const key = `${item.formType}::${item.jobType}`
    allJobTypes.add(key)
  })

  const jobTypesArray = Array.from(allJobTypes).sort((a, b) => {
    // Separar formType y jobType
    const [formTypeA] = a.split('::')
    const [formTypeB] = b.split('::')
    
    // Primero ordenar por formType (Claims primero, luego Non-Claims)
    if (formTypeA !== formTypeB) {
      if (formTypeA === 'Claims') return 1
      if (formTypeB === 'Claims') return -1
      return formTypeA.localeCompare(formTypeB)
    }
    
    // Si el formType es igual, ordenar por jobType
    return a.localeCompare(b)
  })

  // Preparar datos para el gráfico
  const months = Array.from(monthDataMap.values()).map(m => m.monthName)
  
  // Debug: mostrar todos los tipos de trabajo que están llegando
  console.log('Todos los tipos de trabajo:', jobTypesArray.map(key => {
    const [formType, ...jobTypeParts] = key.split('::')
    return { key, formType, jobType: jobTypeParts.join('::') }
  }))
  
  // Crear series para cada tipo de trabajo
  const series = jobTypesArray.map(jobTypeKey => {
    const [formType, ...jobTypeParts] = jobTypeKey.split('::')
    const jobType = jobTypeParts.join('::') // Reconstruir jobType en caso de que tenga ::
    const seriesData = Array.from(monthDataMap.values()).map(monthData => {
      const value = monthData.jobTypes.get(jobTypeKey) || 0
      // En barras apiladas, usar 0 en lugar de null para que se apilen correctamente
      return value > 0 ? value : 0
    })

    // Obtener color único para este tipo de trabajo
    const color = getColorForJobType(formType, jobType)
    
    // Debug para todos los tipos de trabajo que contengan wtb o bis
    if (jobType?.toLowerCase().includes('wtb') || jobType?.toLowerCase().includes('wbt') || jobType?.toLowerCase().includes('bis')) {
      console.log('Tipo encontrado:', { jobType, formType, color, normalized: jobType?.toLowerCase().trim() })
    }

    return {
      name: formType === 'Claims' ? 'Claims' : jobType,
      type: 'bar',
      stack: 'total', // Apilar todas las barras en el mismo stack
      data: seriesData,
      itemStyle: {
        color: color,
        borderRadius: [0, 0, 0, 0], // Sin bordes redondeados en barras apiladas
        shadowBlur: 4,
        shadowColor: `${color}40`
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: `${color}60`,
          borderWidth: 2,
          borderColor: '#fff'
        },
        focus: 'series' // Resaltar toda la serie al hacer hover
      }
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
      borderRadius: 12,
      textStyle: {
        color: '#fff',
        fontSize: 13
      },
      padding: [12, 16],
      formatter: function (params) {
        // Filtrar solo los parámetros con valor mayor que 0
        const filteredParams = params.filter(param => {
          const value = param.value || 0
          return value > 0
        })

        // Si no hay datos, mostrar mensaje
        if (filteredParams.length === 0) {
          return `<div style="font-weight: bold; margin-bottom: 8px;">${params[0].axisValue}</div>
                  <div style="color: #9ca3af;">No hay trabajos registrados</div>`
        }

        // Calcular el total sumando todos los valores filtrados
        const total = filteredParams.reduce((sum, param) => {
          return sum + (param.value || 0)
        }, 0)

        let result = `<div style="font-weight: bold; margin-bottom: 8px;">${params[0].axisValue}</div>`
        filteredParams.forEach(param => {
          const value = param.value || 0
          // Calcular el porcentaje del total para barras apiladas
          const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0
          result += `
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
              <div style="display: flex; align-items: center; flex: 1;">
                <div style="width: 12px; height: 12px; background: ${param.color}; border-radius: 3px; margin-right: 8px;"></div>
                <span style="color: #9ca3af;">${param.seriesName}:</span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="color: #fff; font-weight: bold;">${value}</span>
                <span style="color: #6b7280; font-size: 11px;">(${percentage}%)</span>
              </div>
            </div>
          `
        })
        
        // Agregar línea de total al final
        result += `
          <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(75, 85, 99, 0.5); display: flex; align-items: center; justify-content: space-between;">
            <span style="color: #fff; font-weight: bold;">Total:</span>
            <span style="color: #fff; font-weight: bold; font-size: 16px;">${total}</span>
          </div>
        `
        
        return result
      }
    },
    legend: {
      data: series.map(s => s.name),
      orient: 'horizontal',
      bottom: '5%',
      left: 'center',
      textStyle: {
        color: '#9ca3af',
        fontSize: 12,
        fontWeight: '500'
      },
      itemGap: 20,
      itemWidth: 16,
      itemHeight: 16,
      icon: 'rect',
      formatter: function(name) {
        return name
      }
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
      data: months,
      axisLine: {
        lineStyle: {
          color: '#374151'
        }
      },
      axisLabel: {
        color: '#9ca3af',
        fontSize: 12
      },
      axisTick: {
        alignWithLabel: true
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
    series: series,
    // Configuración para barras apiladas
    animationDuration: 1500,
    animationEasing: 'elasticOut'
  }

  const hasData = data.length > 0 && series.some(s => s.data.some(v => v > 0))

  return (
    <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl overflow-hidden">
      {/* Efecto de brillo sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none"></div>
      
      {/* Header con icono */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white">Jobs by Month</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 bg-gray-800/50 px-2 py-1 rounded-full">
            {new Date().getFullYear()}
          </span>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      {hasData ? (
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

