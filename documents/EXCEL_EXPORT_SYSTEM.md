# 📊 Excel Export System - Premium

## ✅ Professional Excel Export with ExcelJS

El sistema tiene **dos funciones de exportación** separadas, una para Jobs y otra para Claims, cada una con sus columnas específicas pero con el mismo diseño premium.

---

## 📦 Funciones de Exportación

### 1. `exportJobsToExcel()` - Marine Non-Claims
**Ubicación:** `src/utils/excelExport.js`

Exporta trabajos de Marine Non-Claims con todos sus campos específicos.

**Columnas:**
- Job Number
- Vessel Name
- Date & Time
- ETB (Estimated Time of Berthing)
- ETD (Estimated Time of Departure)
- Port
- Job Type
- Client
- Status
- Invoice Status
- Invoice Amount (AUD) - condicional
- Subcontract Amount (AUD) - condicional
- Net Profit (AUD) - condicional
- Remark

### 2. `exportClaimsToExcel()` - Marine Claims
**Ubicación:** `src/utils/excelExport.js`

Exporta reclamos de Marine Claims con sus campos específicos.

**Columnas:**
- Job Number
- Claim Name
- Registration Date
- Client Ref
- Location
- Site Inspection
- Invoice Status
- Invoice Amount (AUD) - condicional
- Subcontract Amount (AUD) - condicional
- Net Profit (AUD) - condicional

---

## 🎨 Diseño Premium Compartido

Ambas funciones comparten el mismo diseño elegante:

### Header Row (Navy Blue):
```
┌─────────────────────────────────────────────────────────────┐
│ Job Number │ Vessel/Claim │ Date │ Port/Location │ ... │    │
│ (Navy Blue #1E3A8A Background with White Text, Bold)        │
└─────────────────────────────────────────────────────────────┘
```

### Data Rows (Alternating Colors):
```
┌─────────────────────────────────────────────────────────────┐
│ ALCEL-25-001 │ MV Ocean Star │ Oct 14, 2025 │ Sydney │     │ ← White
├─────────────────────────────────────────────────────────────┤
│ ALCEL-25-002 │ Container Dmg │ Oct 15, 2025 │ Melb.  │     │ ← Light Gray
├─────────────────────────────────────────────────────────────┤
│ ALCEL-25-003 │ MV Atlantic   │ Oct 16, 2025 │ Sydney │     │ ← White
└─────────────────────────────────────────────────────────────┘
```

### Summary Row:
```
┌─────────────────────────────────────────────────────────────┐
│ Total Jobs/Claims: 45    │ $125,000.00 │ $85,000.00 │ $40,000.00 │
│ (Totals for financial columns when applicable)              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Características Premium

### 1. **Header Styling**
- **Background:** Navy Blue (#1E3A8A)
- **Text:** White, Bold, 12pt Calibri
- **Alignment:** Center
- **Height:** 30px
- **Frozen:** Primera fila congelada para scroll

### 2. **Alternating Row Colors**
- **Even rows:** Light gray (#F8FAFC)
- **Odd rows:** White (#FFFFFF)
- **Height:** 25px
- **Font:** 11pt Calibri, Dark Slate (#1E293B)

### 3. **Color-Coded Status**

#### Para Jobs (Status column):
- 🟢 **Completed:** Green (#059669)
- 🔵 **In Progress:** Blue (#3B82F6)
- 🟡 **Pending:** Yellow (#F59E0B)
- 🔴 **Cancelled:** Red (#EF4444)

#### Para Invoice Status (ambos):
- 🟢 **Paid:** Green (#059669)
- 🔵 **Issued:** Blue (#3B82F6)
- 🔴 **Not Issued:** Red (#EF4444)

### 4. **Financial Formatting**
- **Format:** `$#,##0.00` (Currency with 2 decimals)
- **Net Profit:** Bold, Green (#059669)
- **Auto-calculation:** Only sums "Issued" and "Paid" invoices

### 5. **Column Widths**
Optimizadas para legibilidad:
- Job Number: 18
- Vessel/Claim Name: 25-30
- Dates: 20-22
- Financial: 18-22
- Remarks: 35

### 6. **Professional Details**
- ✅ No gridlines (clean design)
- ✅ Tab color: Navy Blue
- ✅ Generation timestamp
- ✅ Total counters
- ✅ Workbook properties (Creator: Alcel Marine)

---

## 💻 Uso en el Código

### Para Marine Non-Claims (Jobs):

```javascript
import { exportJobsToExcel } from '../utils'

const handleExportToExcel = async () => {
  if (jobs.length === 0) {
    toast.error('No jobs to export')
    return
  }

  try {
    const loadingToast = toast.loading('Generating Excel file...')
    
    await exportJobsToExcel(jobs, 'Alcel_Marine_Jobs')
    
    toast.dismiss(loadingToast)
    toast.success(`Successfully exported ${jobs.length} jobs to Excel!`)
  } catch (error) {
    toast.error('Failed to export to Excel')
    console.error('Export error:', error)
  }
}
```

**Archivo generado:** `Alcel_Marine_Jobs_2025-10-21.xlsx`

### Para Marine Claims:

```javascript
import { exportClaimsToExcel } from '../utils'

const handleExportToExcel = async () => {
  if (claims.length === 0) {
    toast.error('No claims to export')
    return
  }

  try {
    const loadingToast = toast.loading('Generating Excel file...')
    
    await exportClaimsToExcel(claims, 'Alcel_Marine_Claims')
    
    toast.dismiss(loadingToast)
    toast.success(`Successfully exported ${claims.length} claims to Excel!`)
  } catch (error) {
    toast.error('Failed to export to Excel')
    console.error('Export error:', error)
  }
}
```

**Archivo generado:** `Alcel_Marine_Claims_2025-10-21.xlsx`

---

## 📋 Campos Exportados Detallados

### Marine Non-Claims (Jobs)

| Campo | Tipo | Formato | Notas |
|-------|------|---------|-------|
| Job Number | String | ALCEL-YY-XXX | Monospace font, cyan |
| Vessel Name | String | Text | Bold |
| Date & Time | DateTime | MMM DD, YYYY HH:MM | 24hr format |
| ETB | DateTime | MMM DD, YYYY HH:MM | Optional |
| ETD | DateTime | MMM DD, YYYY HH:MM | Optional |
| Port | String | Text | - |
| Job Type | String | Formatted | Capitalized |
| Client | String | Text | - |
| Status | Enum | Formatted | Color-coded |
| Invoice Status | Enum | Formatted | Color-coded |
| Invoice Amount | Number | $#,##0.00 | Condicional |
| Subcontract Amount | Number | $#,##0.00 | Condicional |
| Net Profit | Number | $#,##0.00 | Calculated, Bold, Green |
| Remark | String | Text | Wrapped text |

### Marine Claims

| Campo | Tipo | Formato | Notas |
|-------|------|---------|-------|
| Job Number | String | ALCEL-YY-XXX | Monospace font, cyan |
| Claim Name | String | Text | Bold |
| Registration Date | Date | MMM DD, YYYY | Date only |
| Client Ref | String | Text | - |
| Location | String | Text | - |
| Site Inspection | DateTime | MMM DD, YYYY HH:MM | Optional |
| Invoice Status | Enum | Formatted | Color-coded |
| Invoice Amount | Number | $#,##0.00 | Condicional |
| Subcontract Amount | Number | $#,##0.00 | Condicional |
| Net Profit | Number | $#,##0.00 | Calculated, Bold, Green |

---

## 🔧 Implementación Técnica

### Dependencias Necesarias:

```json
{
  "exceljs": "^4.4.0",
  "file-saver": "^2.0.5"
}
```

### Estructura del Código:

```javascript
// src/utils/excelExport.js

import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'

export const exportJobsToExcel = async (jobs, filename) => {
  // 1. Crear workbook
  const workbook = new ExcelJS.Workbook()
  
  // 2. Configurar properties
  workbook.creator = 'Alcel Marine'
  
  // 3. Crear worksheet
  const worksheet = workbook.addWorksheet('Jobs Report', {
    properties: { tabColor: { argb: '1E3A8A' } },
    views: [{ state: 'frozen', ySplit: 1 }]
  })
  
  // 4. Definir columnas
  worksheet.columns = [...]
  
  // 5. Estilizar header
  const headerRow = worksheet.getRow(1)
  headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1E3A8A' } }
  headerRow.font = { bold: true, color: { argb: 'FFFFFF' } }
  
  // 6. Agregar datos
  jobs.forEach((job, index) => {
    const row = worksheet.addRow(...)
    // Aplicar estilos alternados
    // Color-code status
    // Format financials
  })
  
  // 7. Agregar summary
  const summaryRow = worksheet.addRow({...})
  
  // 8. Generar y descargar
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], { type: 'application/vnd...' })
  saveAs(blob, `${filename}_${date}.xlsx`)
}
```

---

## 🎨 Columnas Condicionales

### Lógica de Columnas Financieras:

```javascript
// Verificar si algún record tiene datos financieros
const hasFinancialData = items.some(item => 
  item.invoiceIssue === 'issued' || item.invoiceIssue === 'paid'
)

// Agregar columnas solo si es necesario
if (hasFinancialData) {
  columns.push(
    { header: 'Invoice Amount (AUD)', key: 'invoiceAmount', width: 20 },
    { header: 'Subcontract Amount (AUD)', key: 'subcontractAmount', width: 22 },
    { header: 'Net Profit (AUD)', key: 'netProfit', width: 18 }
  )
}
```

**Ventaja:** El Excel solo incluye columnas financieras si al menos un record las tiene, manteniendo el archivo limpio.

---

## 📊 Fila de Totales

### Cálculo de Totales:

```javascript
// Solo suma records con invoice "Issued" o "Paid"
const totalInvoice = items
  .filter(item => item.invoiceIssue === 'issued' || item.invoiceIssue === 'paid')
  .reduce((sum, item) => sum + (item.invoiceAmount || 0), 0)

const totalSubcontract = items
  .filter(item => item.invoiceIssue === 'issued' || item.invoiceIssue === 'paid')
  .reduce((sum, item) => sum + (item.subcontractAmount || 0), 0)

const totalProfit = items
  .filter(item => item.invoiceIssue === 'issued' || item.invoiceIssue === 'paid')
  .reduce((sum, item) => sum + (item.netProfit || 0), 0)
```

**Formato de Totales:**
- Background: Light gray (#F1F5F9)
- Font: Bold para números, Italic para labels
- Net Profit: Bold, Green (#059669)

---

## 🔍 Formateo de Datos

### Helper Functions:

```javascript
// Formatear Job Type / Status
const formatJobType = (type) => {
  return type
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
// 'ballast-water' → 'Ballast Water'

// Formatear fechas
const formatDateTime = (date) => {
  return `${date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: '2-digit', 
    year: 'numeric' 
  })} ${date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false
  })}`
}
// Oct 21, 2025 14:30
```

---

## 📥 Ejemplo de Archivo Generado

### Marine Non-Claims Excel:

```
┌──────────────┬─────────────┬──────────────────┬──────────────────┬──────────────────┬──────────┬──────────────┬───────────┬────────────┬──────────────┬──────────────┬────────────────┬──────────────┬─────────────────────┐
│ Job Number   │ Vessel Name │ Date & Time      │ ETB              │ ETD              │ Port     │ Job Type     │ Client    │ Status     │ Invoice St.  │ Invoice Amt  │ Subcontract Amt│ Net Profit   │ Remark              │
├──────────────┼─────────────┼──────────────────┼──────────────────┼──────────────────┼──────────┼──────────────┼───────────┼────────────┼──────────────┼──────────────┼────────────────┼──────────────┼─────────────────────┤
│ ALCEL-25-001 │ MV Ocean    │ Oct 21, 14:30    │ Oct 22, 08:00    │ Oct 23, 16:00    │ Sydney   │ Ballast Water│ Marine Co │ Completed  │ Paid         │ $8,500.00    │ $3,200.00      │ $5,300.00    │ Successful survey   │
│ ALCEL-25-002 │ MV Pacific  │ Oct 20, 10:15    │                  │                  │ Melbourne│ Bunker Survey│ Ship Corp │ In Progress│ Issued       │ $6,200.00    │ $2,800.00      │ $3,400.00    │ Awaiting final docs │
├──────────────┼─────────────┼──────────────────┼──────────────────┼──────────────────┼──────────┼──────────────┼───────────┼────────────┼──────────────┼──────────────┼────────────────┼──────────────┼─────────────────────┤
│              │Total Jobs: 2│                  │                  │                  │          │              │           │            │              │ $14,700.00   │ $6,000.00      │ $8,700.00    │Generated on Oct 21  │
└──────────────┴─────────────┴──────────────────┴──────────────────┴──────────────────┴──────────┴──────────────┴───────────┴────────────┴──────────────┴──────────────┴────────────────┴──────────────┴─────────────────────┘
```

### Marine Claims Excel:

```
┌──────────────┬──────────────────────┬──────────────────┬──────────────┬───────────────┬─────────────────┬───────────────┬──────────────┬─────────────────┬──────────────┐
│ Job Number   │ Claim Name           │ Registration     │ Client Ref   │ Location      │ Site Inspection │ Invoice Status│ Invoice Amt  │ Subcontract Amt │ Net Profit   │
├──────────────┼──────────────────────┼──────────────────┼──────────────┼───────────────┼─────────────────┼───────────────┼──────────────┼─────────────────┼──────────────┤
│ ALCEL-25-003 │ Cargo Damage Insp.   │ Oct 21, 2025     │ REF-12345    │ Sydney Port   │ Oct 22, 10:00   │ Issued        │ $5,000.00    │ $2,000.00       │ $3,000.00    │
│ ALCEL-25-004 │ Container Survey     │ Oct 20, 2025     │ REF-12346    │ Melbourne Port│                 │ Not Issued    │              │                 │              │
├──────────────┼──────────────────────┼──────────────────┼──────────────┼───────────────┼─────────────────┼───────────────┼──────────────┼─────────────────┼──────────────┤
│              │ Total Claims: 2      │                  │              │               │                 │               │ $5,000.00    │ $2,000.00       │ $3,000.00    │
│              │                      │                  │              │               │                 │Generated on Oct 21, 2025 3:45 PM                              │
└──────────────┴──────────────────────┴──────────────────┴──────────────┴───────────────┴─────────────────┴───────────────┴──────────────┴─────────────────┴──────────────┘
```

---

## ⚡ Performance

### Optimizaciones:
- ✅ **Streaming:** ExcelJS usa streams para archivos grandes
- ✅ **Async/Await:** Operaciones no bloqueantes
- ✅ **Buffering:** Genera en memoria y descarga una sola vez
- ✅ **Lazy Loading:** Solo carga columnas necesarias

### Límites Recomendados:
- **Óptimo:** < 1,000 registros (instantáneo)
- **Bueno:** 1,000 - 5,000 registros (< 5 segundos)
- **Aceptable:** 5,000 - 10,000 registros (< 15 segundos)
- **Considerar paginación:** > 10,000 registros

---

## 🐛 Troubleshooting

### Problema: Excel no descarga
**Causas posibles:**
1. Popup blocker activo
2. Sin datos para exportar
3. Error en formato de datos

**Solución:**
```javascript
// Verificar datos antes de exportar
if (!items || items.length === 0) {
  toast.error('No data to export')
  return
}

// Verificar que saveAs funcione
try {
  saveAs(blob, filename)
} catch (error) {
  console.error('Download error:', error)
  toast.error('Download failed. Check browser settings.')
}
```

### Problema: Formato incorrecto en celdas financieras
**Causa:** Datos no son números

**Solución:**
```javascript
// Asegurar que son números
rowData.invoiceAmount = parseFloat(item.invoiceAmount) || 0
rowData.subcontractAmount = parseFloat(item.subcontractAmount) || 0
rowData.netProfit = parseFloat(item.netProfit) || 0
```

### Problema: Excel se abre en modo protegido
**Causa:** Archivo descargado de internet

**Solución:** Normal en Windows. Usuario debe hacer clic en "Enable Editing".

---

## 🔐 Seguridad

### Sanitización de Datos:
```javascript
// Limpiar strings antes de exportar
const sanitize = (str) => {
  if (!str) return ''
  return String(str)
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .trim()
}
```

### Validación:
```javascript
// Validar antes de exportar
const validateData = (items) => {
  return items.every(item => 
    item.jobNumber && 
    item.dateTime &&
    typeof item.invoiceAmount === 'number'
  )
}
```

---

## 📚 Referencias

### ExcelJS Documentation:
- [Official Docs](https://github.com/exceljs/exceljs)
- [Cell Styles](https://github.com/exceljs/exceljs#styles)
- [Number Formats](https://github.com/exceljs/exceljs#number-formats)

### File-Saver:
- [GitHub Repo](https://github.com/eligrey/FileSaver.js/)

---

## 🎓 Mejores Prácticas

1. **Siempre mostrar loading toast** mientras se genera el archivo
2. **Validar datos** antes de exportar
3. **Usar try-catch** para manejo de errores
4. **Incluir timestamp** en nombre de archivo
5. **Mantener diseño consistente** entre diferentes exports
6. **Documentar columnas** en comentarios del código
7. **Testear con datasets grandes** para verificar performance
8. **Sanitizar user input** antes de escribir al Excel

---

## 🚀 Futuras Mejoras

### Sugerencias:
1. **Múltiples hojas** - Jobs y Claims en un solo archivo
2. **Gráficos** - Charts con ExcelJS
3. **Filtros nativos** - Excel AutoFilter
4. **Templates** - Plantillas pre-diseñadas
5. **Customización** - Permitir usuario seleccionar columnas
6. **Email export** - Enviar por email directamente
7. **Schedule exports** - Exports automáticos programados

---

**Última Actualización:** Octubre 2025  
**Versión:** 2.0.0 (Dual Export Functions)  
**Autor:** Alcel Marine Development Team
