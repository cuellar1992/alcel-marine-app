# 📋 Marine Claims System - Complete Guide

## Tabla de Contenidos
1. [Descripción General](#descripción-general)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Backend - API](#backend-api)
4. [Frontend - Componentes](#frontend-componentes)
5. [Funcionalidades](#funcionalidades)
6. [Diferencias con Marine Non-Claims](#diferencias-con-marine-non-claims)
7. [Exportación a Excel](#exportación-a-excel)

---

## Descripción General

El **Marine Claims System** es un módulo completo para gestionar reclamos e inspecciones de carga marítima. Este sistema trabaja independientemente de Marine Non-Claims pero comparte la secuencia de numeración de trabajos (Job Numbers).

### Características Principales
- ✅ Formulario completo con validaciones
- ✅ Job Number compartido con Non-Claims
- ✅ DatePicker con botón "Today" para fecha actual
- ✅ Campos financieros condicionales
- ✅ Cálculo automático de Net Profit
- ✅ Tabla con paginación y búsqueda
- ✅ Sistema de historial de cambios
- ✅ Exportación a Excel específica
- ✅ View/Edit/Delete funcionalidad

---

## Arquitectura del Sistema

### Stack Tecnológico
- **Backend**: Node.js + Express + MongoDB
- **Frontend**: React + Vite
- **Estilos**: TailwindCSS
- **Exportación**: ExcelJS
- **Notificaciones**: React Hot Toast

### Estructura de Archivos

```
alcel-marine-app/
├── server/
│   ├── models/
│   │   ├── Claim.js                 # Modelo de Claims
│   │   └── ClaimHistory.js          # Historial de cambios
│   ├── controllers/
│   │   └── claimController.js       # Lógica de negocio
│   └── routes/
│       └── claimRoutes.js           # Rutas API
├── src/
│   ├── components/ui/
│   │   └── DatePicker.jsx           # Selector de fecha con botón "Today"
│   ├── pages/
│   │   └── MarineClaims.jsx         # Página principal
│   ├── services/
│   │   └── api.js                   # claimsAPI
│   └── utils/
│       └── excelExport.js           # exportClaimsToExcel()
```

---

## Backend - API

### 1. Modelo de Datos (Claim.js)

```javascript
{
  jobNumber: String,              // ALCEL-25-XXX (compartido con Jobs)
  registrationDate: Date,         // Fecha de registro
  clientRef: String,              // Referencia del cliente
  claimName: String,              // Nombre del reclamo
  location: String,               // Ubicación
  siteInspectionDateTime: Date,   // Fecha/hora de inspección (opcional)
  invoiceIssue: String,           // 'not-issued', 'issued', 'paid'
  invoiceAmount: Number,          // Monto de factura (AUD)
  subcontractAmount: Number,      // Monto de subcontrato (AUD)
  netProfit: Number,              // Ganancia neta calculada
  createdAt: Date,                // Timestamp de creación
  updatedAt: Date                 // Timestamp de actualización
}
```

### 2. Endpoints API

**Base URL**: `/api/claims`

#### GET `/api/claims/generate-number`
Genera el siguiente número de trabajo (compartido con Jobs)

**Response:**
```json
{
  "success": true,
  "data": {
    "jobNumber": "ALCEL-25-001"
  }
}
```

#### POST `/api/claims`
Crea un nuevo claim

**Request Body:**
```json
{
  "jobNumber": "ALCEL-25-001",
  "registrationDate": "2025-10-21T00:00:00.000Z",
  "clientRef": "REF-12345",
  "claimName": "Cargo Damage Inspection",
  "location": "Sydney Port",
  "siteInspectionDateTime": "2025-10-22T10:00:00.000Z",
  "invoiceIssue": "issued",
  "invoiceAmount": 5000,
  "subcontractAmount": 2000,
  "netProfit": 3000
}
```

#### GET `/api/claims`
Obtiene todos los claims con paginación y filtros

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)
- `search` - Búsqueda en múltiples campos
- `searchField` - Campo específico de búsqueda
- `location` - Filtrar por ubicación
- `invoiceIssue` - Filtrar por estado de factura
- `dateFrom` - Fecha desde (YYYY-MM-DD)
- `dateTo` - Fecha hasta (YYYY-MM-DD)

**Response:**
```json
{
  "success": true,
  "data": [...claims],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 45,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

#### GET `/api/claims/:id`
Obtiene un claim específico

#### PUT `/api/claims/:id`
Actualiza un claim existente (crea entrada en historial)

#### DELETE `/api/claims/:id`
Elimina un claim

#### GET `/api/claims/:id/history`
Obtiene el historial de cambios de un claim

---

## Frontend - Componentes

### 1. Componente DatePicker

Nuevo componente para selección de fecha (sin hora) con botón "Today".

**Props:**
```javascript
{
  label: String,           // Etiqueta del campo
  selected: Date,          // Fecha seleccionada
  onChange: Function,      // Callback al cambiar
  required: Boolean,       // Si es campo requerido
  showTodayButton: Boolean // Mostrar botón "Today"
}
```

**Uso:**
```jsx
<DatePicker
  label="Registration Date"
  selected={formData.registrationDate}
  onChange={(date) => setFormData({ ...formData, registrationDate: date })}
  showTodayButton={true}
  required
/>
```

### 2. Página MarineClaims.jsx

Página principal con formulario y tabla completa.

**Características:**
- Formulario con 8 campos principales
- Validación de campos requeridos
- Cálculo automático de Net Profit
- Campos financieros condicionales
- Tabla con sorting y paginación
- Búsqueda en tiempo real
- Modal de detalles con historial
- Confirmación para eliminar

---

## Funcionalidades

### 1. Job Number Compartido ✅ CORREGIDO

Los Claims y Jobs comparten la misma secuencia de numeración. **Ambos controladores** verifican ambas colecciones:

```javascript
// Backend: jobController.js Y claimController.js (AMBOS)
const generateJobNumber = async (req, res) => {
  // Import dinámico para evitar dependencias circulares
  const { default: Claim } = await import('../models/Claim.js')
  
  // Obtiene el último Job y el último Claim
  const latestJob = await Job.findOne().sort({ createdAt: -1 })
  const latestClaim = await Claim.findOne().sort({ createdAt: -1 })
  
  let nextNumber = 1
  
  // Extrae número del último Job
  if (latestJob && latestJob.jobNumber) {
    const jobMatch = latestJob.jobNumber.match(/ALCEL-\d{2}-(\d{3})/)
    if (jobMatch) {
      nextNumber = Math.max(nextNumber, parseInt(jobMatch[1], 10) + 1)
    }
  }
  
  // Extrae número del último Claim
  if (latestClaim && latestClaim.jobNumber) {
    const claimMatch = latestClaim.jobNumber.match(/ALCEL-\d{2}-(\d{3})/)
    if (claimMatch) {
      nextNumber = Math.max(nextNumber, parseInt(claimMatch[1], 10) + 1)
    }
  }
  
  return `ALCEL-${year}-${padNumber(nextNumber)}`
}
```

**⚠️ Corrección Aplicada:** Ahora AMBOS controladores (Jobs y Claims) verifican ambas colecciones para garantizar numeración única.

### 2. Botón "Today" en Registration Date

El campo Registration Date tiene un botón especial para establecer la fecha actual:

```jsx
// Implementación en DatePicker.jsx
const handleTodayClick = (e) => {
  e.preventDefault()
  e.stopPropagation()
  onChange(new Date()) // Establece fecha actual
}
```

**Ubicación:** Arriba a la derecha del label, junto al nombre del campo.

### 3. Campos Financieros Condicionales

Los campos financieros solo aparecen cuando `invoiceIssue` es "Issued" o "Paid":

```jsx
{(formData.invoiceIssue === 'issued' || formData.invoiceIssue === 'paid') && (
  <>
    <Input label="Invoice Amount (AUD)" />
    <Input label="Subcontract Amount (AUD)" />
    <Input label="Net Profit (AUD)" readOnly /> {/* Calculado */}
  </>
)}
```

### 4. Cálculo Automático de Net Profit

```javascript
useEffect(() => {
  const invoice = parseFloat(formData.invoiceAmount) || 0
  const subcontract = parseFloat(formData.subcontractAmount) || 0
  const calculatedProfit = invoice - subcontract
  
  setFormData(prev => ({
    ...prev,
    netProfit: calculatedProfit
  }))
}, [formData.invoiceAmount, formData.subcontractAmount])
```

### 5. Búsqueda Inteligente

Búsqueda con debounce de 500ms en múltiples campos:
- Job Number
- Claim Name
- Location
- Client Ref

```javascript
// Debounce implementation
useEffect(() => {
  const timer = setTimeout(() => {
    setSearchDebounce(searchTerm)
    setCurrentPage(1)
  }, 500)
  
  return () => clearTimeout(timer)
}, [searchTerm])
```

### 6. Sistema de Historial

Cada cambio en un claim se registra automáticamente:

```javascript
// Backend: claimController.js
const updateClaim = async (req, res) => {
  // Compara campos cambiados
  const changedFields = []
  for (const key in req.body) {
    if (oldClaim[key] !== req.body[key]) {
      changedFields.push(key)
    }
  }
  
  // Crea entrada en historial
  await ClaimHistory.create({
    claimId: claim._id,
    action: 'updated',
    changedFields,
    modifiedBy: 'System'
  })
}
```

---

## Diferencias con Marine Non-Claims

| Característica | Marine Non-Claims (Jobs) | Marine Claims |
|---------------|--------------------------|---------------|
| **Job Number** | ALCEL-25-XXX (compartido) | ALCEL-25-XXX (compartido) |
| **Fecha Principal** | Date & Time (con hora) | Registration Date (solo fecha) |
| **Campos Específicos** | Vessel Name, ETB, ETD, Port, Job Type | Claim Name, Client Ref, Location, Site Inspection |
| **Status** | Pending, In Progress, Completed, Cancelled | No tiene campo Status |
| **Remark** | Sí, campo de texto largo | No |
| **Client** | Selector dropdown desde BD | Client Ref (texto libre) |
| **Botón "Today"** | No | Sí, en Registration Date |
| **Exportación** | `exportJobsToExcel()` | `exportClaimsToExcel()` |

---

## Exportación a Excel

### Función: exportClaimsToExcel()

**Ubicación:** `src/utils/excelExport.js`

**Columnas Exportadas:**
1. Job Number
2. Claim Name
3. Registration Date
4. Client Ref
5. Location
6. Site Inspection (si existe)
7. Invoice Status
8. Invoice Amount (AUD) - si aplicable
9. Subcontract Amount (AUD) - si aplicable
10. Net Profit (AUD) - si aplicable

**Características:**
- ✅ Header azul marino con texto blanco
- ✅ Filas alternadas (gris claro / blanco)
- ✅ Formato de moneda: `$#,##0.00`
- ✅ Colores para estados de invoice
- ✅ Fila de totales financieros
- ✅ Contador de claims totales
- ✅ Fecha de generación
- ✅ Sin gridlines (diseño limpio)
- ✅ Freeze header row

**Uso:**
```javascript
import { exportClaimsToExcel } from '../utils'

const handleExport = async () => {
  await exportClaimsToExcel(claims, 'Alcel_Marine_Claims')
  // Genera: Alcel_Marine_Claims_2025-10-21.xlsx
}
```

**Ejemplo de Salida:**

```
┌──────────────┬─────────────────────┬──────────────────┬──────────────┬───────────────┬─────────────────┬───────────────┬──────────────┬─────────────────┬──────────────┐
│ Job Number   │ Claim Name          │ Registration     │ Client Ref   │ Location      │ Site Inspection │ Invoice Status│ Invoice Amt  │ Subcontract Amt │ Net Profit   │
├──────────────┼─────────────────────┼──────────────────┼──────────────┼───────────────┼─────────────────┼───────────────┼──────────────┼─────────────────┼──────────────┤
│ ALCEL-25-001 │ Cargo Damage Insp.  │ Oct 21, 2025     │ REF-12345    │ Sydney Port   │ Oct 22, 10:00   │ Issued        │ $5,000.00    │ $2,000.00       │ $3,000.00    │
│ ALCEL-25-002 │ Container Survey    │ Oct 20, 2025     │ REF-12346    │ Melbourne Port│                 │ Not Issued    │              │                 │              │
├──────────────┼─────────────────────┼──────────────────┼──────────────┼───────────────┼─────────────────┼───────────────┼──────────────┼─────────────────┼──────────────┤
│              │ Total Claims: 2     │                  │              │               │                 │               │ $5,000.00    │ $2,000.00       │ $3,000.00    │
└──────────────┴─────────────────────┴──────────────────┴──────────────┴───────────────┴─────────────────┴───────────────┴──────────────┴─────────────────┴──────────────┘
```

---

## Flujo de Trabajo Completo

### 1. Crear un Nuevo Claim

```
Usuario → Ingresa Claim Name → Auto-genera Job Number → 
Selecciona Registration Date (botón Today) → 
Completa Client Ref, Location → 
Opcionalmente Site Inspection → 
Selecciona Invoice Issue → 
Si es Issued/Paid: Ingresa montos → 
Net Profit se calcula automáticamente → 
Submit → Claim guardado en BD
```

### 2. Editar un Claim

```
Usuario → Hace clic en ícono Edit → 
Formulario se llena con datos existentes → 
Modifica campos necesarios → 
Submit → Backend detecta cambios → 
Crea entrada en ClaimHistory → 
Claim actualizado
```

### 3. Ver Detalles

```
Usuario → Hace clic en ícono View → 
Modal se abre con información completa → 
Incluye historial de cambios → 
Usuario puede editar desde el modal → 
O cerrar para volver a la tabla
```

### 4. Exportar a Excel

```
Usuario → Hace clic en "Export to Excel" → 
Sistema filtra datos visibles (con búsqueda/filtros) → 
Genera archivo Excel con diseño premium → 
Descarga automática con nombre:
  Alcel_Marine_Claims_YYYY-MM-DD.xlsx
```

---

## API Frontend - claimsAPI

**Ubicación:** `src/services/api.js`

```javascript
export const claimsAPI = {
  // Generar número de claim
  generateNumber: () => apiCall('/claims/generate-number'),
  
  // Obtener todos los claims
  getAll: (page, limit, search, filters) => apiCall(url),
  
  // Obtener claim por ID
  getById: (id) => apiCall(`/claims/${id}`),
  
  // Crear claim
  create: (claimData) => apiCall('/claims', {
    method: 'POST',
    body: JSON.stringify(claimData)
  }),
  
  // Actualizar claim
  update: (id, claimData) => apiCall(`/claims/${id}`, {
    method: 'PUT',
    body: JSON.stringify(claimData)
  }),
  
  // Eliminar claim
  delete: (id) => apiCall(`/claims/${id}`, {
    method: 'DELETE'
  }),
  
  // Obtener historial
  getHistory: (claimId) => apiCall(`/claims/${claimId}/history`)
}
```

---

## Validaciones

### Frontend
- ✅ Job Number: Requerido (auto-generado)
- ✅ Registration Date: Requerido
- ✅ Client Ref: Requerido
- ✅ Claim Name: Requerido
- ✅ Location: Requerido
- ✅ Site Inspection: Opcional
- ✅ Invoice Issue: Requerido
- ✅ Invoice Amount: Requerido si invoice es "Issued" o "Paid"

### Backend
- ✅ Job Number único en base de datos
- ✅ Formato de fecha válido
- ✅ Campos requeridos no vacíos
- ✅ Números financieros >= 0

---

## Notificaciones Toast

El sistema usa `react-hot-toast` para feedback:

```javascript
// Success
toast.success('Claim created successfully!')

// Error
toast.error('Failed to create claim')

// Loading
const loadingToast = toast.loading('Saving...')
toast.dismiss(loadingToast)

// Info
toast.info('Edit cancelled')
```

---

## Estilos y Diseño

### Colores del Sistema
- **Primary**: Cyan (#06B6D4)
- **Background**: Dark Slate (#0F172A)
- **Cards**: Slate 800 con transparencia
- **Success**: Green (#059669)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)
- **Info**: Blue (#3B82F6)

### Componentes UI Reutilizables
- `DatePicker` - Selector de fecha con botón Today
- `DateTimePicker` - Selector de fecha y hora
- `Input` - Campo de texto con estilos
- `Select` - Dropdown con estilos
- `Button` - Botones con variantes
- `Card` - Contenedores con gradientes
- `Table` - Tabla con acciones
- `Modal` - Ventanas modales
- `ConfirmDialog` - Diálogos de confirmación
- `Pagination` - Control de paginación
- `SearchBar` - Barra de búsqueda

---

## Mejores Prácticas

### 1. Siempre usar el botón "Today"
El botón "Today" está diseñado para facilitar el ingreso de la fecha actual. Usarlo garantiza la fecha correcta sin errores de tipeo.

### 2. Verificar datos antes de exportar
Antes de exportar a Excel, asegúrate de que los filtros y búsquedas estén correctos para exportar exactamente lo que necesitas.

### 3. Revisar Net Profit calculado
Aunque se calcula automáticamente, siempre verifica que los montos de Invoice y Subcontract sean correctos.

### 4. Usar historial para auditoría
El historial de cambios es útil para auditorías. Revisa el historial regularmente.

### 5. Mantener datos consistentes
Usa formatos consistentes para Client Ref y Location para facilitar búsquedas y reportes.

---

## Troubleshooting

### Problema: Job Number no se genera
**Solución:** Verifica que el backend esté corriendo y la conexión a MongoDB sea exitosa.

### Problema: Net Profit no se calcula
**Solución:** Asegúrate de que Invoice Issue sea "Issued" o "Paid" y que los montos sean números válidos.

### Problema: Excel no descarga
**Solución:** Verifica que haya datos en la tabla y que el navegador permita descargas.

### Problema: Búsqueda no funciona
**Solución:** Espera 500ms después de escribir (debounce). Verifica la conexión al backend.

---

## Mantenimiento y Actualizaciones Futuras

### Próximas Mejoras Sugeridas
1. **Filtros avanzados** - Similar a Marine Non-Claims
2. **Upload de archivos** - Adjuntar documentos a claims
3. **Estados personalizados** - Sistema de estados similar a Jobs
4. **Reportes PDF** - Generar reportes en PDF además de Excel
5. **Multi-usuario** - Sistema de permisos y roles
6. **Dashboard** - Gráficos y estadísticas de claims
7. **Email notifications** - Notificaciones por email

---

## Conclusión

El **Marine Claims System** es un módulo robusto y completo que permite gestionar reclamos marítimos de manera profesional. Con su integración con Marine Non-Claims (compartiendo Job Numbers) y su diseño premium, proporciona una experiencia de usuario excelente y funcionalidades empresariales.

Para más información sobre otros módulos del sistema, consulta:
- [Marine Non-Claims (Jobs)](./MANAGE_SYSTEM_COMPLETE.md)
- [Excel Export System](./EXCEL_EXPORT_SYSTEM.md)
- [Backend Complete Guide](./BACKEND_COMPLETE_GUIDE.md)

## Troubleshooting

### Job Numbers Duplicados (SOLUCIONADO ✅)

**Problema:** Si creas un Claim con Job Number 004, luego un Job también obtiene 004.

**Causa:** Los controladores no verificaban ambas colecciones.

**Solución Aplicada:**
```javascript
// AMBOS controladores ahora verifican ambas colecciones
const latestJob = await Job.findOne().sort({ createdAt: -1 })
const latestClaim = await Claim.findOne().sort({ createdAt: -1 })

// Usa Math.max() para obtener el número más alto
nextNumber = Math.max(
  extractNumber(latestJob?.jobNumber) || 0,
  extractNumber(latestClaim?.jobNumber) || 0
) + 1
```

**Resultado:** Numeración única garantizada entre Jobs y Claims.

---

**Última Actualización:** Octubre 2025  
**Versión:** 1.0.1 (Job Numbers Fixed)  
**Autor:** Alcel Marine Development Team

