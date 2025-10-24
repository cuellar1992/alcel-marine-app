# Invoice Overview Fix - Dashboard

## Problema Identificado

El componente `InvoiceOverview` mostraba:
- **Total Invoices**: 4
- **Issued**: 2
- **Not Issued**: 0 ❌ (Debería ser 2)

## Causa del Problema

1. **Valores Inconsistentes en la BD**: El campo `invoiceIssue` podía tener valores como:
   - `"issued"` 
   - `"not issued"`
   - `null`
   - `undefined`
   - Variaciones de capitalización

2. **Mapeo Incorrecto**: El backend no estaba normalizando estos valores antes de agruparlos

3. **Frontend Sensible**: El componente buscaba coincidencias exactas de strings

## Solución Implementada

### Backend (`dashboardController.js`)

#### Antes:
```javascript
jobsInvoiceStatus.forEach(item => {
  invoiceMap.set(item._id || 'not issued', {
    status: item._id || 'not issued',
    count: item.count,
    amount: item.amount
  })
})
```

#### Después:
```javascript
// 1. Función de normalización
const normalizeStatus = (status) => {
  if (!status) return 'not issued'
  const normalized = status.toLowerCase().trim()
  
  if (normalized === 'issued') return 'issued'
  if (normalized === 'paid') return 'paid'
  return 'not issued'  // Default para valores null, vacíos, etc.
}

// 2. Inicializar Map con todas las categorías
const invoiceMap = new Map([
  ['not issued', { status: 'not issued', count: 0, amount: 0 }],
  ['issued', { status: 'issued', count: 0, amount: 0 }],
  ['paid', { status: 'paid', count: 0, amount: 0 }]
])

// 3. Agregar datos normalizados
jobsInvoiceStatus.forEach(item => {
  const status = normalizeStatus(item._id)
  const existing = invoiceMap.get(status)
  existing.count += item.count
  existing.amount += item.amount
})
```

### Frontend (`InvoiceOverview.jsx`)

#### Mejoras:

1. **Validación de Datos**:
```javascript
const invoiceData = Array.isArray(data) ? data : []
```

2. **Búsqueda Normalizada**:
```javascript
const getStatusData = (status) => {
  const normalizedStatus = status.toLowerCase().trim()
  return invoiceData.find(item => 
    item.status && item.status.toLowerCase().trim() === normalizedStatus
  ) || { count: 0, amount: 0 }
}
```

3. **Debug Console**:
```javascript
console.log('Invoice Overview Data:', {
  raw: data,
  normalized: invoiceData,
  notIssued,
  issued,
  paid,
  totals
})
```

4. **Badge de Total**:
```javascript
<span className="text-xs text-gray-500 bg-gray-800/50 px-2 py-1 rounded">
  {totals.count} total
</span>
```

## Resultado

Ahora el componente muestra correctamente:
- **Total Invoices**: 4 ✅
- **Not Issued**: 2 ✅ (Todas las facturas sin estado, null, o "not issued")
- **Issued**: 2 ✅
- **Paid**: 0 ✅

## Casos Manejados

La solución ahora maneja correctamente:

| Valor en BD | Normalizado a |
|-------------|---------------|
| `null` | `"not issued"` |
| `undefined` | `"not issued"` |
| `""` (vacío) | `"not issued"` |
| `"not issued"` | `"not issued"` |
| `"Not Issued"` | `"not issued"` |
| `"issued"` | `"issued"` |
| `"Issued"` | `"issued"` |
| `"paid"` | `"paid"` |
| `"Paid"` | `"paid"` |
| Cualquier otro | `"not issued"` |

## Ventajas

1. ✅ **Datos Siempre Consistentes**: Map inicializado con todas las categorías
2. ✅ **Maneja Valores Nulos**: Normalización robusta
3. ✅ **Case Insensitive**: No importa la capitalización
4. ✅ **Default Seguro**: Valores desconocidos van a "not issued"
5. ✅ **Debug Fácil**: Console log para troubleshooting
6. ✅ **Visual Mejorado**: Badge con total de invoices

## Testing

Para verificar que funciona:

1. Abrir http://localhost:5174 (o 5173)
2. Ver el Dashboard
3. Revisar la consola del navegador para ver los datos
4. Verificar que los números coincidan:
   - Total = Not Issued + Issued + Paid ✅

## Código de Debug

Para ver qué datos está recibiendo el componente, revisa la consola del navegador:

```javascript
Invoice Overview Data: {
  raw: [...],           // Datos crudos del API
  normalized: [...],    // Datos procesados
  notIssued: {...},     // Objeto "not issued"
  issued: {...},        // Objeto "issued"
  paid: {...},          // Objeto "paid"
  totals: {...}        // Totales calculados
}
```

## Archivos Modificados

1. ✅ `server/controllers/dashboardController.js` - Normalización en backend
2. ✅ `src/components/dashboard/InvoiceOverview.jsx` - Búsqueda mejorada en frontend

## Próximos Pasos (Opcional)

Para mejorar aún más:

1. **Remover Console Log**: Una vez verificado que funciona
2. **Agregar Más Estados**: Si se necesitan más categorías de invoice
3. **Validación en Forms**: Asegurar que solo se guarden valores válidos
4. **Migration Script**: Normalizar datos antiguos en la BD

---

## Fix Adicional: KPI Card "Issued Invoices"

### Problema Secundario
El KPI card "Issued Invoices" mostraba:
- Valor principal: 2 ✅
- Trend value: "0 not issued" ❌ (Debería ser "2 not issued")

### Causa del Problema
Los modelos de MongoDB usan **guiones** en los valores del enum:
- `'not-issued'` (con guión)
- `'issued'`
- `'paid'`

Pero el código del dashboard estaba buscando:
- `'not issued'` (con espacio) ❌

### Solución
Corregido el endpoint `GET /api/dashboard/stats` para buscar con el valor correcto del modelo:

```javascript
// Antes (INCORRECTO):
const notIssuedInvoices = 
  await Job.countDocuments({ invoiceIssue: 'not issued' }) + 
  await Claim.countDocuments({ invoiceIssue: 'not issued' })

// Después (CORRECTO):
const notIssuedInvoices = await Job.countDocuments({ 
  $or: [
    { invoiceIssue: { $exists: false } },
    { invoiceIssue: null },
    { invoiceIssue: '' },
    { invoiceIssue: 'not-issued' },  // ✅ Con guión (como en el modelo)
    { invoiceIssue: 'not issued' }   // Soporte legacy
  ]
}) + await Claim.countDocuments({ 
  $or: [
    { invoiceIssue: { $exists: false } },
    { invoiceIssue: null },
    { invoiceIssue: '' },
    { invoiceIssue: 'not-issued' },  // ✅ Con guión (como en el modelo)
    { invoiceIssue: 'not issued' }   // Soporte legacy
  ]
})
```

También se actualizó `getInvoiceOverview()` para normalizar guiones a espacios:
```javascript
const normalizeStatus = (status) => {
  if (!status) return 'not issued'
  const normalized = status.toLowerCase().trim().replace(/-/g, ' ')  // ✅ Reemplaza guiones
  
  if (normalized === 'issued') return 'issued'
  if (normalized === 'paid') return 'paid'
  if (normalized === 'not issued') return 'not issued'
  return 'not issued'
}
```

### Resultado
Ahora el KPI card muestra correctamente:
- Valor: 2 (issued) ✅
- Trend: "2 not issued" ✅

---

**Estado**: ✅ CORREGIDO  
**Fecha**: Octubre 2024  
**Versión**: 1.0.2 (Fix completo para Invoice Overview y KPI Card)

