# Scripts de Base de Datos - ALCEL Marine App

Este directorio contiene scripts para insertar datos en la base de datos por año, manteniendo la secuencia correcta de Job Numbers.

## 📋 Tabla de Contenidos

- [Scripts Disponibles](#scripts-disponibles)
- [Requisitos Previos](#requisitos-previos)
- [Configuración](#configuración)
- [Uso](#uso)
- [Ejemplos](#ejemplos)
- [Resolución de Problemas](#resolución-de-problemas)

---

## 🗂️ Scripts Disponibles

### 1. `seed-jobs-by-year.js`
Inserta múltiples **Jobs** (Marine Non-Claims) para un año específico.

**Características:**
- Auto-genera Job Numbers en formato `ALCEL-YY-XXX`
- Detecta automáticamente el siguiente número disponible
- Mantiene secuencia compartida con Claims
- Previene duplicados

### 2. `seed-claims-by-year.js`
Inserta múltiples **Claims** (Marine Claims) para un año específico.

**Características:**
- Auto-genera Job Numbers en formato `ALCEL-YY-XXX`
- Detecta automáticamente el siguiente número disponible
- Mantiene secuencia compartida con Jobs
- Previene duplicados

---

## ✅ Requisitos Previos

1. **Node.js** instalado (v14 o superior)
2. **MongoDB** configurado y accesible
3. Archivo `.env` configurado con `MONGODB_URI`

---

## ⚙️ Configuración

### 1. Verifica tu archivo `.env`

Asegúrate de que tu archivo `.env` en la raíz del proyecto tenga la conexión a MongoDB:

```env
MONGODB_URI= Your conection
```

### 2. Instala dependencias (si no lo has hecho)

```bash
npm install
```

---

## 🚀 Uso

### Paso 1: Selecciona el script apropiado

- Para insertar **Jobs**: usa `seed-jobs-by-year.js`
- Para insertar **Claims**: usa `seed-claims-by-year.js`

### Paso 2: Edita el script

Abre el script y modifica la sección de **CONFIGURATION**:

```javascript
// ========================================
// CONFIGURATION - MODIFY THIS SECTION
// ========================================

// Año objetivo (2 dígitos: '23', '24', '25', etc.)
const TARGET_YEAR = '24' // Cambia esto al año deseado

// Define tus datos aquí
const jobsData = [
  {
    vesselName: 'Tu Barco',
    dateTime: new Date('2024-03-15T08:00:00'),
    // ... resto de datos
  }
  // Agrega más registros...
]
```

### Paso 3: Ejecuta el script

```bash
# Para Jobs
node server/scripts/seed-jobs-by-year.js

# Para Claims
node server/scripts/seed-claims-by-year.js
```

---

## 📝 Ejemplos

### Ejemplo 1: Insertar Jobs del año 2024

**Archivo:** `seed-jobs-by-year.js`

```javascript
const TARGET_YEAR = '24'

const jobsData = [
  {
    vesselName: 'Pacific Glory',
    dateTime: new Date('2024-01-15T08:00:00'),
    etb: new Date('2024-01-15T06:00:00'),
    etd: new Date('2024-01-15T18:00:00'),
    port: 'Puerto Cortes',
    jobType: 'Ballast Water Survey',
    clientName: 'Ocean Freight Ltd',
    subcontractName: 'Technical Services SA',
    invoiceIssue: 'paid',
    invoiceAmount: 5000,
    subcontractAmount: 2000,
    netProfit: 3000,
    status: 'completed',
    remark: 'Completed successfully'
  },
  {
    vesselName: 'Atlantic Star',
    dateTime: new Date('2024-02-20T10:00:00'),
    etb: new Date('2024-02-20T08:00:00'),
    etd: new Date('2024-02-20T20:00:00'),
    port: 'Puerto Castilla',
    jobType: 'Bunker Survey',
    clientName: 'Maritime Solutions',
    subcontractName: '',
    invoiceIssue: 'issued',
    invoiceAmount: 4500,
    subcontractAmount: 1500,
    netProfit: 3000,
    status: 'completed',
    remark: 'Regular bunker survey'
  }
]
```

**Ejecutar:**
```bash
node server/scripts/seed-jobs-by-year.js
```

**Salida esperada:**
```
✅ MongoDB Connected
🚀 Starting Job Insertion Process...

📅 Target Year: 2024
📊 Number of jobs to insert: 2

🔢 Starting from job number: ALCEL-24-001

✅ [1/2] Created: ALCEL-24-001 - Pacific Glory
✅ [2/2] Created: ALCEL-24-002 - Atlantic Star

============================================================
✅ SUCCESS! All jobs inserted successfully
============================================================

📊 Summary:
   - Year: 2024
   - Jobs inserted: 2
   - Job Numbers: ALCEL-24-001 to ALCEL-24-002
   - Next available: ALCEL-24-003
```

---

### Ejemplo 2: Insertar Claims del año 2023

**Archivo:** `seed-claims-by-year.js`

```javascript
const TARGET_YEAR = '23'

const claimsData = [
  {
    clientName: 'Global Shipping Inc',
    subcontractName: 'Expert Surveyors Ltd',
    registrationDate: new Date('2023-06-10'),
    clientRef: 'GSI-2023-050',
    claimName: 'Cargo Damage - Container Loss',
    location: 'Puerto Cortes',
    siteInspectionDateTime: new Date('2023-06-12T09:00:00'),
    invoiceIssue: 'paid',
    invoiceAmount: 8000,
    subcontractAmount: 3000,
    netProfit: 5000
  }
]
```

**Ejecutar:**
```bash
node server/scripts/seed-claims-by-year.js
```

**Salida esperada:**
```
✅ MongoDB Connected
🚀 Starting Claim Insertion Process...

📅 Target Year: 2023
📊 Number of claims to insert: 1

🔢 Starting from job number: ALCEL-23-001

✅ [1/1] Created: ALCEL-23-001 - Cargo Damage - Container Loss

============================================================
✅ SUCCESS! All claims inserted successfully
============================================================

📊 Summary:
   - Year: 2023
   - Claims inserted: 1
   - Job Numbers: ALCEL-23-001 to ALCEL-23-001
   - Next available: ALCEL-23-002
```

---

### Ejemplo 3: Mezclar Jobs y Claims del mismo año

Si ya tienes registros del año 2024 y quieres agregar más:

**Escenario:**
- Base de datos ya tiene: `ALCEL-24-001`, `ALCEL-24-002`, `ALCEL-24-003`
- Quieres agregar 2 Jobs más

**El script detecta automáticamente:**
```
🔢 Starting from job number: ALCEL-24-004

✅ [1/2] Created: ALCEL-24-004 - New Vessel
✅ [2/2] Created: ALCEL-24-005 - Another Vessel
```

---

## 🔧 Campos Requeridos

### Para Jobs (seed-jobs-by-year.js)

| Campo | Tipo | Requerido | Valores Permitidos |
|-------|------|-----------|-------------------|
| `vesselName` | String | ✅ | Cualquier texto |
| `dateTime` | Date | ✅ | Fecha válida |
| `etb` | Date | ❌ | Fecha válida |
| `etd` | Date | ❌ | Fecha válida |
| `port` | String | ✅ | Cualquier texto |
| `jobType` | String | ✅ | Cualquier texto |
| `clientName` | String | ✅ | Cualquier texto |
| `subcontractName` | String | ❌ | Cualquier texto |
| `invoiceIssue` | String | ✅ | `'not-issued'`, `'issued'`, `'paid'` |
| `invoiceAmount` | Number | ❌ | Número (default: 0) |
| `subcontractAmount` | Number | ❌ | Número (default: 0) |
| `netProfit` | Number | ❌ | Número (default: 0) |
| `status` | String | ✅ | `'pending'`, `'in-progress'`, `'completed'`, `'cancelled'` |
| `remark` | String | ❌ | Cualquier texto |

### Para Claims (seed-claims-by-year.js)

| Campo | Tipo | Requerido | Valores Permitidos |
|-------|------|-----------|-------------------|
| `clientName` | String | ✅ | Cualquier texto |
| `subcontractName` | String | ❌ | Cualquier texto |
| `registrationDate` | Date | ✅ | Fecha válida |
| `clientRef` | String | ✅ | Cualquier texto |
| `claimName` | String | ✅ | Cualquier texto |
| `location` | String | ✅ | Cualquier texto |
| `siteInspectionDateTime` | Date | ❌ | Fecha válida |
| `invoiceIssue` | String | ✅ | `'not-issued'`, `'issued'`, `'paid'` |
| `invoiceAmount` | Number | ❌ | Número (default: 0) |
| `subcontractAmount` | Number | ❌ | Número (default: 0) |
| `netProfit` | Number | ❌ | Número (default: 0) |

---

## ⚠️ Resolución de Problemas

### Error: "Duplicate job number detected"

**Causa:** Estás intentando insertar un Job Number que ya existe en la base de datos.

**Solución:**
- El script detecta automáticamente el siguiente número disponible
- Este error solo ocurre si ejecutas el script dos veces seguidas sin modificar los datos
- Simplemente ejecuta el script de nuevo, detectará el siguiente número disponible

### Error: "MongoDB Connection Error"

**Causa:** No se puede conectar a la base de datos.

**Soluciones:**
1. Verifica que tu archivo `.env` tenga el `MONGODB_URI` correcto
2. Verifica que tienes conexión a internet
3. Verifica que tus credenciales de MongoDB sean correctas

### Error: "Year must be a 2-digit number"

**Causa:** El formato del año es incorrecto.

**Solución:**
- Usa formato de 2 dígitos: `'23'`, `'24'`, `'25'`
- NO uses: `23`, `'2024'`, `2024`

### Los Job Numbers no son secuenciales

**Esto es normal si:**
- Ya existen registros de ese año en la base de datos
- Has mezclado Jobs y Claims
- El script detecta el último número y continúa desde ahí

**Ejemplo:**
```
Existentes: ALCEL-24-001 (Job), ALCEL-24-002 (Claim)
Nuevos: ALCEL-24-003, ALCEL-24-004 ✅ Correcto
```

---

## 💡 Consejos y Mejores Prácticas

### 1. Backup antes de ejecutar
Siempre haz un backup de tu base de datos antes de ejecutar scripts masivos:

```bash
# Usando MongoDB Compass o mongodump
mongodump --uri="your-mongodb-uri" --out=backup-folder
```

### 2. Prueba con pocos registros primero
Antes de insertar 100 registros, prueba con 2-3 para verificar que todo funciona correctamente.

### 3. Formato de fechas
Usa siempre el formato ISO para fechas:
```javascript
new Date('2024-03-15T08:00:00') // ✅ Correcto
new Date('2024-03-15') // ✅ También funciona (hora 00:00:00)
```

### 4. Revisa los valores enum
Los campos `invoiceIssue` y `status` solo aceptan valores específicos:

```javascript
invoiceIssue: 'paid' // ✅ Correcto
invoiceIssue: 'pagado' // ❌ Error

status: 'completed' // ✅ Correcto
status: 'done' // ❌ Error
```

### 5. Ejecuta un script a la vez
No ejecutes múltiples scripts simultáneamente para el mismo año, podrías generar Job Numbers duplicados.

---

## 📚 Recursos Adicionales

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Node.js Documentation](https://nodejs.org/)

---

## 🆘 Soporte

Si tienes problemas con los scripts:

1. Verifica los logs de error en la consola
2. Revisa que todos los campos requeridos estén presentes
3. Verifica la conexión a la base de datos
4. Consulta la sección de Resolución de Problemas arriba

---

**Última actualización:** Octubre 2025
