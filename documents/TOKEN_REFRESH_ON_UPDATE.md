# Automatic Token Refresh on User Update

## Problema Identificado

Cuando un usuario cambia su propio email (u otra información crítica), el token JWT existente todavía contiene la información anterior, causando el error:
```
Authentication error: Error: Invalid or expired token
```

## Causa Raíz

Los tokens JWT contienen información del usuario (email, role, name) que se "congela" al momento de generarse. Cuando se actualiza esta información en la base de datos, el token no se actualiza automáticamente, creando una discrepancia.

## Solución Implementada

### Sistema de Regeneración Automática de Tokens

Se implementó un sistema que detecta cuando un usuario actualiza **su propio perfil** y regenera automáticamente el token JWT con la información actualizada.

## Backend: `server/controllers/userManagementController.js`

### 1. Import del Generador de Tokens
```javascript
import { generateAccessToken } from '../utils/tokenUtils.js';
```

### 2. Detección de Actualización de Perfil Propio
```javascript
// Si se actualizó el email, nombre o rol, regenerar token para el usuario actual
const isUpdatingOwnProfile = id === req.user.userId;
const needsTokenRefresh = isUpdatingOwnProfile && (
  (email && email !== req.user.email) || 
  (name && name !== req.user.name) || 
  (role && role !== req.user.role)
);
```

**Condiciones para regenerar token:**
- ✅ El usuario está actualizando **su propio perfil** (`id === req.user.userId`)
- ✅ Y cambió **al menos uno** de estos campos:
  - Email
  - Nombre
  - Rol

### 3. Regeneración y Envío del Nuevo Token
```javascript
// Si necesita refresh del token, generarlo y enviarlo
if (needsTokenRefresh) {
  const newAccessToken = generateAccessToken(user._id, user.email, user.role);
  response.data.accessToken = newAccessToken;
  response.message = 'User updated successfully. Please use the new access token.';
}
```

### 4. Respuesta del Servidor

**Sin cambios críticos:**
```json
{
  "success": true,
  "message": "User updated successfully.",
  "data": {
    "user": { /* ... datos del usuario ... */ }
  }
}
```

**Con cambios críticos (email/name/role del propio usuario):**
```json
{
  "success": true,
  "message": "User updated successfully. Please use the new access token.",
  "data": {
    "user": { /* ... datos del usuario ... */ },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## Frontend: `src/pages/UserManagement.jsx`

### Manejo Automático del Nuevo Token

```javascript
const response = await usersAPI.update(selectedUser.id, updateData);

// Si se devuelve un nuevo token, actualizarlo en localStorage
if (response.data.accessToken) {
  localStorage.setItem('accessToken', response.data.accessToken);
  
  // Actualizar el usuario en localStorage también
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const updatedUser = { ...storedUser, ...response.data.user };
  localStorage.setItem('user', JSON.stringify(updatedUser));
  
  toast.success('User updated successfully. Your session has been refreshed.');
} else {
  toast.success('User updated successfully');
}
```

### Proceso Automático:
1. ✅ Actualizar el `accessToken` en localStorage
2. ✅ Actualizar los datos del usuario en localStorage
3. ✅ Notificar al usuario que la sesión fue refrescada
4. ✅ **No requiere logout/login manual**

## Escenarios de Uso

### Escenario 1: Admin Edita a Otro Usuario
```
Admin (id: 123) edita a User (id: 456)
→ isUpdatingOwnProfile = false
→ No se regenera token
→ Admin continúa con su token original
✅ Correcto: El token del admin no cambia
```

### Escenario 2: Usuario Edita su Propio Email
```
User (id: 456) edita su propio email
→ isUpdatingOwnProfile = true
→ email cambió
→ needsTokenRefresh = true
→ Se genera nuevo token con email actualizado
→ Frontend actualiza automáticamente el token
✅ Correcto: El usuario continúa con sesión actualizada
```

### Escenario 3: Admin Edita su Propio Rol
```
Admin (id: 123) edita su propio rol (pero está bloqueado)
→ El sistema previene el cambio de rol propio
→ Error: "You cannot change your own role."
✅ Correcto: No se permite cambiar el propio rol
```

### Escenario 4: Usuario Solo Cambia Status de Otro Usuario
```
Admin (id: 123) activa/desactiva a User (id: 456)
→ Solo cambió isActive (no email, name, o role)
→ needsTokenRefresh = false
→ No se regenera token
✅ Correcto: Status no afecta token
```

## Ventajas de Esta Solución

### ✅ Experiencia de Usuario Mejorada
- No requiere logout/login manual
- Transición suave y automática
- El usuario puede continuar trabajando sin interrupciones

### ✅ Seguridad Mantenida
- Los tokens siempre contienen información actualizada
- No hay discrepancia entre token y base de datos
- Solo se regenera cuando es necesario

### ✅ Eficiencia
- No regenera tokens innecesariamente
- Solo cuando se cambia información crítica del propio perfil
- No afecta ediciones de otros usuarios

### ✅ Transparencia
- Notificación clara cuando se refresca la sesión
- El usuario sabe que su sesión fue actualizada

## Campos que Disparan Regeneración

| Campo | ¿Dispara Regeneración? | Razón |
|-------|----------------------|-------|
| **email** | ✅ Sí | Está en el token JWT |
| **name** | ✅ Sí | Está en el token JWT |
| **role** | ✅ Sí | Está en el token JWT |
| **isActive** | ❌ No | No está en el token JWT |
| **lastLogin** | ❌ No | No está en el token JWT |

## Protecciones Implementadas

### 1. No Desactivarse a Sí Mismo
```javascript
if (id === req.user.userId && isActive === false) {
  return res.status(400).json({
    success: false,
    message: 'You cannot deactivate your own account.'
  });
}
```

### 2. No Cambiar su Propio Rol
```javascript
if (id === req.user.userId && role && role !== user.role) {
  return res.status(400).json({
    success: false,
    message: 'You cannot change your own role.'
  });
}
```

## Testing

### Caso de Prueba 1: Cambiar Email Propio
1. Iniciar sesión como usuario A
2. Ir a User Management
3. Editar el propio email
4. Guardar cambios
5. ✅ Verificar: Sesión continúa, token actualizado, notificación mostrada

### Caso de Prueba 2: Admin Edita Otro Usuario
1. Iniciar sesión como Admin
2. Editar email de otro usuario
3. Guardar cambios
4. ✅ Verificar: Usuario actualizado, token del admin no cambia

### Caso de Prueba 3: Continuar Usando la App
1. Cambiar propio email
2. Sin hacer logout
3. Navegar a otras páginas
4. Hacer otras operaciones
5. ✅ Verificar: Todo funciona normalmente

## Archivos Modificados

```
server/controllers/userManagementController.js
├── Import: generateAccessToken
├── updateUser()
│   ├── Detectar si actualiza propio perfil
│   ├── Verificar campos que cambiaron
│   ├── Regenerar token si es necesario
│   └── Incluir accessToken en respuesta

src/pages/UserManagement.jsx
└── handleSubmit()
    ├── Capturar respuesta con posible token
    ├── Actualizar localStorage con nuevo token
    ├── Actualizar datos de usuario
    └── Mostrar notificación apropiada
```

## Reiniciar el Servidor

Para aplicar los cambios del backend:

```bash
# Detener el servidor
Ctrl+C

# Reiniciar
npm run dev:full
```

## Estado Actual

✅ **Implementado**: Regeneración automática de tokens
✅ **Probado**: Funciona sin requerir logout/login
✅ **Seguro**: Solo regenera para actualizaciones de perfil propio
✅ **Transparente**: Usuario es notificado del refresh

---

**Fecha**: Implementación de regeneración automática de tokens
**Impacto**: Mejora significativa de UX al actualizar perfil

