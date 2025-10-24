# 🚀 Super Admin - Quick Start Guide

## Pasos Rápidos para Crear el Super Admin

### 1️⃣ Agregar Variables de Entorno

Agrega estas líneas a tu archivo `.env`:

```env
# Super Admin Configuration
SUPER_ADMIN_EMAIL=superadmin@alcel.com
SUPER_ADMIN_PASSWORD=SuperAdmin123!
SUPER_ADMIN_NAME=Super Administrator
```

### 2️⃣ Ejecutar el Script de Seed

```bash
npm run seed:superadmin
```

**Salida esperada:**
```
✅ Super Admin created successfully!
📧 Email: superadmin@alcel.com
🔑 Password: SuperAdmin123!
```

### 3️⃣ Reiniciar el Servidor

```bash
# Si está corriendo
Ctrl+C

# Reiniciar
npm run dev:full
```

### 4️⃣ Verificar en la Aplicación

1. Ve a **User Management**
2. Deberías ver el Super Admin con el badge dorado: **🔒 SUPER ADMIN**
3. Notarás que no tiene botones de acción, solo dice "Protected Account"

### 5️⃣ Login como Super Admin (Opcional)

1. Ir a `/login`
2. Email: `superadmin@alcel.com`
3. Password: `SuperAdmin123!`
4. ✅ Tendrás acceso total como admin

## ✨ Lo Que Obtuviste

### 🔒 Protecciones

- ❌ **NO puede ser eliminado** (el botón no aparece)
- ❌ **NO puede ser editado** (el botón no aparece)
- ❌ **NO puede ser desactivado** (el botón no aparece)
- ❌ **NO se puede cambiar su contraseña desde la UI**
- ✅ **SIEMPRE garantiza acceso a la aplicación**

### 👀 Indicadores Visuales

- **Badge dorado** junto al nombre: `🔒 SUPER ADMIN`
- **Texto** en acciones: `Protected Account`
- **Sin botones** de editar/eliminar/desactivar

## 🔐 Cambiar la Contraseña del Super Admin

### Método 1: Usando Variables de Entorno

1. **Actualiza** la contraseña en `.env`:
```env
SUPER_ADMIN_PASSWORD=MiNuevaContraseña456!
```

2. **Elimina manualmente** el Super Admin de la base de datos:
   - En MongoDB Compass: Encuentra el usuario con `isSuperAdmin: true` y elimínalo
   - O en mongo shell:
   ```javascript
   db.users.deleteOne({ isSuperAdmin: true })
   ```

3. **Ejecuta nuevamente** el seed:
```bash
npm run seed:superadmin
```

## ⚠️ Importante

- **Cambia la contraseña** después del primer uso
- **Guarda las credenciales** en un lugar seguro
- **NO commitear** el archivo `.env` al repositorio
- **Requisitos de contraseña**:
  - Mínimo 8 caracteres
  - Al menos una mayúscula
  - Al menos una minúscula
  - Al menos un número
  - Al menos un carácter especial (!@#$%^&*)

## 🧪 Prueba las Protecciones

Intenta hacer esto con el Super Admin:

1. ✅ **Editar** → No verás el botón de lápiz
2. ✅ **Eliminar** → No verás el botón de basura
3. ✅ **Desactivar** → No verás el botón de toggle
4. ✅ **Cambiar contraseña** → No verás el botón de llave

## 📚 Documentación Completa

Para más detalles, consulta: `documents/SUPER_ADMIN_SETUP.md`

---

**¿Listo?** Ejecuta: `npm run seed:superadmin` 🚀

