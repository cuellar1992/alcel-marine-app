# Dashboard System - Complete Guide

## Overview
El sistema de Dashboard de Alcel Marine proporciona una vista completa y analítica de todas las operaciones marinas, incluyendo KPIs, gráficos interactivos, y estadísticas en tiempo real.

## Características Principales

### 1. KPI Cards (Indicadores Clave)
Cuatro tarjetas principales que muestran métricas esenciales:

- **Total Jobs & Claims**: Total de trabajos y reclamos combinados
- **Total Revenue**: Ingresos totales generados
- **Pending Jobs**: Trabajos pendientes que requieren atención
- **Issued Invoices**: Facturas emitidas vs. no emitidas

### 2. Gráficos y Análisis

#### Jobs by Status (Donut Chart)
- Visualización de la distribución de trabajos por estado
- Estados: Pending, In Progress, Completed, Cancelled
- Colores personalizados para cada estado

#### Revenue Trends (Area Chart)
- Tendencias de ingresos de los últimos 6 meses
- Muestra tanto el revenue como el número de jobs por mes
- Gráfico de área con gradiente

#### Top Clients (Horizontal Bar Chart)
- Top 5 clientes por revenue o cantidad de jobs
- Información detallada de revenue y número de trabajos
- Colores diferenciados para cada cliente

#### Jobs by Type (Bar Chart)
- Distribución de trabajos por tipo (Ballast, Bunkers, Cargo, etc.)
- Gráfico de barras verticales con colores únicos

#### Ships by Port (Bar Chart)
- Cantidad de barcos únicos por puerto
- Ayuda a identificar los puertos más activos

#### Jobs Per Month (Stacked Bar Chart)
- Total de jobs por mes incluyendo ambos formularios
- Desglose por tipo de trabajo
- Vista apilada para mejor comparación

### 3. Recent Activity Feed
- Últimas 10 actividades (jobs y claims)
- Información de creación y estado
- Formato tipo timeline con iconos distintivos

### 4. Invoice Overview
- Resumen visual del estado de facturas
- Distribución: Not Issued, Issued, Paid
- Progress bars con porcentajes
- Montos totales por categoría

### 5. Vessel Schedule (ETB/ETD Calendar)
- Próximos 7 días de arribos y salidas
- Información de ETB (Estimated Time of Berthing)
- Información de ETD (Estimated Time of Departure)
- Estado actual de cada vessel

## API Endpoints

### Dashboard Statistics
```
GET /api/dashboard/stats
```
Retorna estadísticas generales del dashboard.

### Jobs by Status
```
GET /api/dashboard/jobs-by-status
```
Retorna la distribución de jobs por estado.

### Revenue Trends
```
GET /api/dashboard/revenue-trends?months=6
```
Retorna tendencias de revenue por mes.

**Query Parameters:**
- `months` (number, default: 6): Número de meses a obtener

### Top Clients
```
GET /api/dashboard/top-clients?limit=5&sortBy=revenue
```
Retorna los clientes principales.

**Query Parameters:**
- `limit` (number, default: 5): Número de clientes a retornar
- `sortBy` (string, default: 'revenue'): Ordenar por 'revenue' o 'count'

### Jobs by Type
```
GET /api/dashboard/jobs-by-type
```
Retorna la distribución de jobs por tipo.

### Ships by Port
```
GET /api/dashboard/ships-by-port
```
Retorna la cantidad de barcos únicos por puerto.

### Recent Activity
```
GET /api/dashboard/recent-activity?limit=10
```
Retorna actividad reciente de jobs y claims.

**Query Parameters:**
- `limit` (number, default: 10): Número de items a retornar

### Invoice Overview
```
GET /api/dashboard/invoice-overview
```
Retorna resumen del estado de facturas.

### Vessel Schedule
```
GET /api/dashboard/vessel-schedule?days=7
```
Retorna próximos arribos y salidas de vessels.

**Query Parameters:**
- `days` (number, default: 7): Días hacia adelante a buscar

### Jobs Per Month
```
GET /api/dashboard/jobs-per-month?year=2024
```
Retorna jobs por mes incluyendo tipo.

**Query Parameters:**
- `year` (number, default: current year): Año a consultar

### Jobs by Client
```
GET /api/dashboard/jobs-by-client
```
Retorna todos los jobs agrupados por cliente con estadísticas detalladas.

## Componentes Frontend

### KPICard
```jsx
<KPICard
  title="Total Jobs"
  value={100}
  icon={FileText}
  color="blue"
  trend="up"
  trendValue="+10%"
  suffix=""
  loading={false}
/>
```

**Props:**
- `title` (string): Título del KPI
- `value` (number|string): Valor a mostrar
- `icon` (Component): Icono de Lucide React
- `color` (string): Color theme - blue, green, purple, orange, cyan, pink
- `trend` (string): 'up', 'down', o null
- `trendValue` (string): Texto del trend
- `suffix` (string): Sufijo del valor
- `loading` (boolean): Estado de carga

### JobsByStatusChart
```jsx
<JobsByStatusChart 
  data={jobsByStatus} 
  loading={false} 
/>
```

### RevenueTrendsChart
```jsx
<RevenueTrendsChart 
  data={revenueTrends} 
  loading={false} 
/>
```

### TopClientsChart
```jsx
<TopClientsChart 
  data={topClients} 
  loading={false}
  sortBy="revenue" 
/>
```

### JobsByTypeChart
```jsx
<JobsByTypeChart 
  data={jobsByType} 
  loading={false} 
/>
```

### ShipsByPortChart
```jsx
<ShipsByPortChart 
  data={shipsByPort} 
  loading={false} 
/>
```

### RecentActivity
```jsx
<RecentActivity 
  data={recentActivity} 
  loading={false} 
/>
```

### InvoiceOverview
```jsx
<InvoiceOverview 
  data={invoiceOverview} 
  loading={false} 
/>
```

### VesselSchedule
```jsx
<VesselSchedule 
  data={vesselSchedule} 
  loading={false} 
/>
```

### JobsPerMonthChart
```jsx
<JobsPerMonthChart 
  data={jobsPerMonth} 
  loading={false} 
/>
```

## Estructura de Datos

### Dashboard Stats Response
```json
{
  "success": true,
  "data": {
    "totalRecords": 150,
    "totalJobs": 120,
    "totalClaims": 30,
    "pendingJobs": 15,
    "totalRevenue": 250000,
    "jobsByStatus": [...],
    "issuedInvoices": 80,
    "notIssuedInvoices": 70
  }
}
```

### Jobs by Status Response
```json
{
  "success": true,
  "data": [
    {
      "_id": "pending",
      "count": 15
    },
    {
      "_id": "in progress",
      "count": 25
    },
    {
      "_id": "completed",
      "count": 80
    }
  ]
}
```

### Revenue Trends Response
```json
{
  "success": true,
  "data": [
    {
      "year": 2024,
      "month": 1,
      "revenue": 25000,
      "count": 15
    }
  ]
}
```

### Top Clients Response
```json
{
  "success": true,
  "data": [
    {
      "_id": "Client Name",
      "count": 20,
      "revenue": 50000
    }
  ]
}
```

## Características Técnicas

### Tecnologías Utilizadas
- **Recharts**: Librería de gráficos React
- **Lucide React**: Iconos
- **React Hooks**: useState, useEffect para manejo de estado
- **Tailwind CSS**: Estilos y animaciones

### Optimizaciones
- Carga paralela de datos con Promise.all()
- Estados de loading individuales por componente
- Animaciones suaves con Tailwind
- Tooltips informativos en todos los gráficos
- Responsive design para todos los tamaños de pantalla

### Paleta de Colores
```javascript
const COLORS = {
  blue: '#3b82f6',
  green: '#10b981',
  purple: '#8b5cf6',
  orange: '#f59e0b',
  cyan: '#06b6d4',
  pink: '#ec4899',
  red: '#ef4444',
  gray: '#6b7280'
}
```

## Uso en la Aplicación

### Importar en Home.jsx
```jsx
import { 
  KPICard,
  JobsByStatusChart,
  RevenueTrendsChart,
  TopClientsChart,
  JobsByTypeChart,
  ShipsByPortChart,
  RecentActivity,
  InvoiceOverview,
  VesselSchedule,
  JobsPerMonthChart
} from '../components/dashboard'
```

### Cargar Datos
```jsx
useEffect(() => {
  const fetchData = async () => {
    const statsRes = await dashboardAPI.getStats()
    setStats(statsRes.data)
  }
  fetchData()
}, [])
```

## Customización

### Agregar Nuevos KPIs
1. Agregar endpoint en el backend (dashboardController.js)
2. Agregar función en dashboardAPI (api.js)
3. Agregar KPICard en Home.jsx

### Agregar Nuevos Gráficos
1. Crear componente en `src/components/dashboard/`
2. Usar Recharts para el tipo de gráfico deseado
3. Exportar en `src/components/dashboard/index.js`
4. Importar y usar en Home.jsx

### Modificar Colores
Editar las constantes de colores en cada componente de gráfico.

## Beneficios del Dashboard

1. **Vista Centralizada**: Toda la información importante en un solo lugar
2. **Toma de Decisiones**: Datos visuales para decisiones rápidas
3. **Identificación de Tendencias**: Ver patrones en revenue, jobs, clientes
4. **Monitoreo en Tiempo Real**: Estado actual de todas las operaciones
5. **Planificación**: Calendario de vessels para mejor organización
6. **Control Financiero**: Seguimiento de facturas y revenue

## Próximas Mejoras Sugeridas

1. Filtros de fecha personalizables
2. Exportación de datos a PDF/Excel
3. Comparación año sobre año
4. Alertas automáticas para métricas críticas
5. Dashboard personalizable (drag & drop)
6. Más KPIs específicos por cliente o puerto
7. Gráficos de proyección y forecasting
8. Integración con notificaciones push

## Mantenimiento

### Actualizar Estadísticas
Las estadísticas se cargan automáticamente al montar el componente Home. Para refrescar:
- Recargar la página
- Implementar un botón de refresh (futuro)

### Performance
- Los datos se cargan en paralelo para mejor performance
- Cada componente maneja su propio estado de loading
- Se puede implementar caché en el futuro

## Soporte y Documentación

Para más información sobre componentes individuales, ver:
- `documents/QUICK_REFERENCE.md` - Referencia rápida
- `documents/PROJECT_STRUCTURE.md` - Estructura del proyecto
- Código fuente en `src/components/dashboard/`

---

**Versión**: 1.0.0  
**Última Actualización**: Octubre 2024  
**Autor**: Alcel Marine Development Team

