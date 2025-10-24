# Super Admin Setup Guide

## 🔒 Descripción

El **Super Admin** es una cuenta protegida especial que garantiza siempre el acceso a la aplicación. Esta cuenta no puede ser eliminada, modificada ni desactivada por ningún usuario, incluyendo otros administradores.

## ✨ Características del Super Admin

### Protecciones Implementadas

| Acción | Estado | Mensaje |
|--------|--------|---------|
| **Eliminar** | 🚫 Bloqueado | "Super Admin cannot be deleted. This account is protected." |
| **Editar** | 🚫 Bloqueado | "Super Admin cannot be modified. This account is protected." |
| **Desactivar** | 🚫 Bloqueado | "Super Admin cannot be deactivated. This account is protected." |
| **Cambiar Contraseña** | 🚫 Bloqueado desde UI | "Super Admin password can only be changed through direct database access..." |
| **Cambiar Rol** | 🔒 Siempre Admin | El campo `isSuperAdmin` es `immutable` en el modelo |

### Indicadores Visuales

- ✅ Badge dorado **"🔒 SUPER ADMIN"** junto al nombre
- ✅ Texto "Protected Account" en lugar de botones de acción
- ✅ No aparecen botones de editar, eliminar, cambiar contraseña, etc.

## 🚀 Configuración Inicial

### 1. Variables de Entorno

Agrega estas variables a tu archivo `.env`:

```env
# Super Admin Configuration
SUPER_ADMIN_EMAIL=superadmin@alcel.com
SUPER_ADMIN_PASSWORD=SuperAdmin123!
SUPER_ADMIN_NAME=Super Administrator
```

**⚠️ IMPORTANTE**: 
- Cambia el password después del primer uso
- Usa una contraseña fuerte que cumpla los requisitos:
  - Mínimo 8 caracteres
  - Al menos una mayúscula
  - Al menos una minúscula
  - Al menos un número
  - Al menos un carácter especial

### 2. Ejecutar el Script de Seed

```bash
npm run seed:superadmin
```

**Salida esperada:**
```
MongoDB connected successfully
✅ Super Admin created successfully!
📧 Email: superadmin@alcel.com
🔑 Password: SuperAdmin123!

⚠️  IMPORTANT: Change the password after first login!
✅ Seed completed successfully
```

### 3. Verificar la Creación

1. Inicia la aplicación: `npm run dev:full`
2. Ve a User Management
3. Deberías ver el Super Admin con el badge dorado **🔒 SUPER ADMIN**

## 📋 Estructura Implementada

### Backend

#### 1. Modelo User (`server/models/User.js`)
```javascript
{
  isSuperAdmin: {
    type: Boolean,
    default: false,
    immutable: true  // ← No se puede cambiar después de crear
  }
}
```

#### 2. Controlador (`server/controllers/userManagementController.js`)

**Protección en updateUser:**
```javascript
if (user.isSuperAdmin) {
  return res.status(403).json({
    message: 'Super Admin cannot be modified.'
  });
}
```

**Protección en deleteUser:**
```javascript
if (user.isSuperAdmin) {
  return res.status(403).json({
    message: 'Super Admin cannot be deleted.'
  });
}
```

**Protección en toggleUserStatus:**
```javascript
if (user.isSuperAdmin) {
  return res.status(403).json({
    message: 'Super Admin cannot be deactivated.'
  });
}
```

**Protección en changeUserPassword:**
```javascript
if (user.isSuperAdmin) {
  return res.status(403).json({
    message: 'Super Admin password can only be changed through direct database access...'
  });
}
```

#### 3. Script de Seed (`server/seed-superadmin.js`)
- Crea el Super Admin si no existe
- Verifica y corrige propiedades si ya existe
- Usa variables de entorno para configuración

### Frontend

#### UserManagement.jsx

**Badge Visual:**
```jsx
{user.isSuperAdmin && (
  <span className="px-2 py-0.5 bg-gradient-to-r from-yellow-500 to-orange-500...">
    🔒 SUPER ADMIN
  </span>
)}
```

**Ocultar Acciones:**
```jsx
{user.isSuperAdmin ? (
  <span className="text-gray-500 text-xs italic">Protected Account</span>
) : (
  // ... botones de editar, eliminar, etc.
)}
```

## 🔐 Cambiar Contraseña del Super Admin

### Opción 1: Variables de Entorno (Recomendado para desarrollo)

1. Actualiza la contraseña en `.env`:
```env
SUPER_ADMIN_PASSWORD=NuevaContraseñaSegura123!
```

2. Elimina el Super Admin actual de la base de datos
3. Ejecuta nuevamente el seed:
```bash
npm run seed:superadmin
```

### Opción 2: Acceso Directo a la Base de Datos (Producción)

**Usando MongoDB Compass o mongo shell:**

```javascript
// Conectar a la base de datos
use alcel-marine-app

// Hashear la nueva contraseña (usa bcryptjs)
// En Node.js:
const bcrypt = require('bcryptjs');
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash('NuevaContraseña123!', salt);

// Actualizar en MongoDB
db.users.updateOne(
  { isSuperAdmin: true },
  { $set: { password: hashedPassword } }
)
```

### Opción 3: Script Temporal

Crear un archivo temporal `change-superadmin-password.js`:

```javascript
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './server/models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const changePassword = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const newPassword = 'NuevaContraseña123!';
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  
  const result = await User.updateOne(
    { isSuperAdmin: true },
    { password: hashedPassword }
  );
  
  console.log('Password updated:', result);
  process.exit(0);
};

changePassword();
```

## 📊 Casos de Uso

### Escenario 1: Pérdida de Acceso Admin

```
Problema: Todos los admins perdieron acceso
Solución: ✅ El Super Admin siempre está disponible
Acción: Login con credenciales del Super Admin
```

### Escenario 2: Admin Accidentalmente se Elimina

```
Problema: Admin intenta eliminarse a sí mismo
Protección: ✅ Ya existe (no puedes eliminar tu propia cuenta)
Backup: ✅ Super Admin puede crear nuevo admin
```

### Escenario 3: Todos los Usuarios Desactivados

```
Problema: Scripts/errores desactivan usuarios
Solución: ✅ Super Admin no puede ser desactivado
Acción: Login con Super Admin → Reactivar usuarios
```

### Escenario 4: Compromiso de Seguridad

```
Problema: Cuenta admin comprometida
Solución: ✅ Super Admin puede:
  - Desactivar cuenta comprometida
  - Cambiar passwords
  - Crear nuevo admin limpio
```

## ⚠️ Consideraciones de Seguridad

### ✅ Recomendaciones

1. **Contraseña Fuerte**: Usa un gestor de contraseñas
2. **Email Único**: No uses un email personal
3. **Variables de Entorno**: Nunca commitear `.env` al repositorio
4. **Acceso Limitado**: Solo personas autorizadas deben conocer las credenciales
5. **Auditoría**: Monitorear logins del Super Admin

### ⚠️ Advertencias

- El Super Admin tiene acceso total e inmutable
- No se puede eliminar desde la UI (protección intencional)
- Para eliminar, se requiere acceso directo a la base de datos
- Mantén las credenciales del Super Admin en un lugar seguro

## 🔄 Re-ejecutar el Seed

El script es **idempotente**, puedes ejecutarlo múltiples veces:

```bash
npm run seed:superadmin
```

**Si el Super Admin ya existe:**
```
✅ Super Admin already exists: superadmin@alcel.com
✅ Super Admin properties updated
```

**Si no existe:**
```
✅ Super Admin created successfully!
```

## 🧪 Testing

### Verificar Protecciones

1. **Intenta editar el Super Admin** → Debería ver "Protected Account"
2. **Intenta eliminar el Super Admin** → Botón no debería aparecer
3. **Intenta desactivar el Super Admin** → No debería permitirlo
4. **Intenta cambiar contraseña** → No debería permitirlo desde UI

### Login como Super Admin

1. Ir a `/login`
2. Email: `superadmin@alcel.com` (o tu configuración)
3. Password: `SuperAdmin123!` (o tu configuración)
4. ✅ Deberías tener acceso total como admin

## 📝 Logs y Monitoreo

El sistema registra intentos de modificar el Super Admin:

```javascript
console.log('Attempt to modify Super Admin blocked', {
  userId: req.user.userId,
  action: 'update',
  timestamp: new Date()
});
```

**Recomendación**: Implementar sistema de alertas para estos eventos.

## 🔧 Mantenimiento

### Actualizar Email del Super Admin

1. Actualizar `.env`:
```env
SUPER_ADMIN_EMAIL=nuevo-email@alcel.com
```

2. Actualizar en la base de datos:
```javascript
db.users.updateOne(
  { isSuperAdmin: true },
  { $set: { email: 'nuevo-email@alcel.com' } }
)
```

### Backup del Super Admin

**Script de Backup:**
```bash
mongodump --db alcel-marine-app --collection users --query '{"isSuperAdmin":true}' --out ./backups/
```

## 📚 Archivos Relacionados

```
server/
├── models/User.js                    # Campo isSuperAdmin
├── controllers/userManagementController.js  # Protecciones
├── seed-superadmin.js               # Script de inicialización

src/pages/
└── UserManagement.jsx               # UI con indicadores visuales

documents/
└── SUPER_ADMIN_SETUP.md            # Esta documentación
```

## ✅ Checklist de Implementación

- [x] Campo `isSuperAdmin` en modelo User
- [x] Script de seed para crear Super Admin
- [x] Protección contra eliminación
- [x] Protección contra edición
- [x] Protección contra desactivación
- [x] Protección contra cambio de contraseña desde UI
- [x] Badge visual en frontend
- [x] Ocultar botones de acción para Super Admin
- [x] Documentación completa
- [x] Script npm para ejecutar seed
- [x] Variables de entorno configurables

---

**Última actualización**: Implementación completa del sistema Super Admin
**Estado**: ✅ Producción Ready

