# Fix: User ID Mapping Issue

## Problema Identificado

Los usuarios no podían ser editados ni eliminados después de crearlos. El error era:
```
CastError: Cast to ObjectId failed for value "undefined" (type string) at path "_id"
```

## Causa Raíz

MongoDB utiliza `_id` como el identificador único de los documentos, pero el frontend esperaba un campo `id`. El backend devolvía los usuarios con `_id`, pero cuando el frontend intentaba editar o eliminar, enviaba `user.id` que era `undefined`.

## Solución Implementada

### Backend: `server/controllers/userManagementController.js`

Se agregó mapeo explícito de `_id` a `id` en todas las respuestas del controlador:

#### 1. **getAllUsers** (Listar usuarios)
```javascript
// Mapear _id a id para el frontend
const mappedUsers = users.map(user => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  isActive: user.isActive,
  lastLogin: user.lastLogin,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
}));
```

#### 2. **getUserById** (Obtener usuario específico)
```javascript
// Mapear _id a id para el frontend
const mappedUser = {
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  isActive: user.isActive,
  lastLogin: user.lastLogin,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
};
```

#### 3. **createUser** (Crear usuario)
```javascript
res.status(201).json({
  success: true,
  message: 'User created successfully.',
  data: { 
    user: {
      id: user._id,  // Mapeo explícito
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  }
});
```

#### 4. **updateUser** (Actualizar usuario)
```javascript
res.status(200).json({
  success: true,
  message: 'User updated successfully.',
  data: { 
    user: {
      id: user._id,  // Mapeo explícito
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  }
});
```

## Mejoras Adicionales

### Validación de Contraseña Reforzada

Se agregó validación completa de contraseña en:

1. **createUser** - Al crear nuevos usuarios
2. **changeUserPassword** - Al cambiar contraseñas

```javascript
// Validar fortaleza de contraseña
if (password.length < 8) {
  return res.status(400).json({
    success: false,
    message: 'Password must be at least 8 characters long.'
  });
}

const hasUpperCase = /[A-Z]/.test(password);
const hasLowerCase = /[a-z]/.test(password);
const hasNumber = /[0-9]/.test(password);
const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
  return res.status(400).json({
    success: false,
    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
  });
}
```

## Consistencia Frontend-Backend

### Frontend espera:
```javascript
user.id  // Campo id
```

### Backend ahora devuelve:
```javascript
{
  id: "507f1f77bcf86cd799439011",  // Mapeado desde _id
  name: "John Doe",
  email: "john@example.com",
  // ... otros campos
}
```

### Backend recibe en params:
```javascript
req.params.id  // "507f1f77bcf86cd799439011"
// Se usa con: User.findById(id)
```

## Archivos Modificados

```
server/controllers/userManagementController.js
├── getAllUsers()         → Mapea users array
├── getUserById()         → Mapea single user
├── createUser()          → Devuelve id mapeado + validación contraseña
├── updateUser()          → Devuelve id mapeado
└── changeUserPassword()  → Validación contraseña reforzada
```

## Verificación

Para verificar que el fix funciona:

1. ✅ Crear un nuevo usuario → Debería crearse sin problemas
2. ✅ Ver el usuario en la tabla → Debería aparecer con su información
3. ✅ Editar el usuario → Debería abrir el modal y guardar cambios
4. ✅ Cambiar contraseña → Debería funcionar con validación
5. ✅ Activar/Desactivar → Debería cambiar el estado
6. ✅ Eliminar usuario → Debería eliminar correctamente

## Reiniciar el Servidor

Los cambios requieren reiniciar el servidor Node.js:

```bash
# Si está corriendo con npm run dev:full
Ctrl+C (detener)
npm run dev:full (reiniciar)

# O solo el backend
Ctrl+C (detener)
npm run server (reiniciar)
```

## Prevención de Futuros Problemas

### Patrón a Seguir

Siempre mapear `_id` a `id` en las respuestas del backend cuando se envíen al frontend:

```javascript
// ✅ Correcto
const mappedData = data.map(item => ({
  id: item._id,
  // ... otros campos
}));

// ❌ Incorrecto - No mapear
res.json({ data: rawMongooseData });
```

### Alternativa con Mongoose Virtuals

Otra opción es usar Mongoose virtuals en el modelo:

```javascript
// En el modelo User.js
userSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

userSchema.set('toJSON', {
  virtuals: true
});
```

Esto automáticamente agrega el campo `id` cuando se convierte a JSON.

## Estado Actual

✅ **Resuelto**: Los usuarios ahora pueden ser creados, editados y eliminados sin problemas.
✅ **Validación**: Contraseñas con requisitos completos en backend.
✅ **Consistencia**: Frontend y backend usan el mismo campo `id`.

---

**Fecha**: Actualización del sistema de gestión de usuarios
**Impacto**: Crítico - Funcionalidad completa restaurada

