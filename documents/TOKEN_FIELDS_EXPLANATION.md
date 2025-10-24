# JWT Token Fields & Update Behavior

## Contenido del Token JWT

El token JWT contiene **únicamente** estos campos:

```javascript
{
  userId: "507f1f77bcf86cd799439011",
  email: "user@example.com",
  role: "admin"
}
```

**Duración**: 15 minutos (configurable)

## ¿Por qué algunos campos NO están en el token?

### Campos que SÍ están en el token:
- ✅ **userId**: Identificador único e inmutable
- ✅ **email**: Usado para autenticación y comunicación
- ✅ **role**: Determina permisos y accesos

### Campos que NO están en el token:
- ❌ **name**: Se obtiene de la DB en cada request (puede cambiar frecuentemente)
- ❌ **password**: NUNCA debe estar en un token (seguridad)
- ❌ **isActive**: Se verifica en la DB en cada request (cambio inmediato)
- ❌ **lastLogin**: Información de auditoría, no afecta autenticación
- ❌ **createdAt/updatedAt**: Metadata, no relevante para autenticación

## Comportamiento al Modificar Cada Campo

### 1. 📧 Modificar EMAIL

```javascript
Cambiar: admin@old.com → admin@new.com
```

**¿Está en el token?** ✅ Sí

**¿Qué pasa?**
- Si editas **tu propio email**: ✅ Token se regenera automáticamente
- Si un admin edita **el email de otro usuario**: ❌ Token del otro usuario NO se regenera (se invalidará en 15 min cuando expire)

**Impacto:**
- 🔄 **Propio**: Sesión continúa sin problemas con nuevo token
- ⏱️ **Otro usuario**: Su sesión actual funciona hasta que expire el token (15 min), luego debe re-login

**Recomendación**: Si cambias el email de otro usuario, considera notificarle que debe re-login.

---

### 2. 👤 Modificar NOMBRE

```javascript
Cambiar: "John Doe" → "Jonathan Doe"
```

**¿Está en el token?** ❌ No

**¿Qué pasa?**
- Token NO se regenera (no es necesario)
- El nombre se obtiene de la base de datos en cada request
- El cambio se refleja **inmediatamente** en toda la aplicación

**Impacto:**
- ✅ Cambio instantáneo, sin regeneración de token
- ✅ No afecta la sesión activa
- ✅ Se ve reflejado en el siguiente request

**Flujo:**
```
1. Usuario hace request → Token se valida
2. Backend busca usuario en DB: User.findById(token.userId)
3. Backend obtiene nombre actualizado de la DB
4. req.user = { userId, email, role, name: user.name }
```

---

### 3. 🔑 Modificar CONTRASEÑA

```javascript
Cambiar: "OldPass123!" → "NewPass456!"
```

**¿Está en el token?** ❌ No (y NUNCA debería estar)

**¿Qué pasa?**
- Token NO se regenera
- La contraseña NO está almacenada en ningún token
- Solo el **hash** está en la base de datos

**Impacto:**
- ⚠️ **Sesiones actuales permanecen activas** (el token es válido hasta que expire)
- ✅ Próximo login requerirá la nueva contraseña
- 🔐 Cambio de contraseña NO invalida sesiones existentes

**Consideraciones de Seguridad:**

**Escenario de Riesgo:**
```
1. Usuario sospecha que su cuenta fue comprometida
2. Cambia su contraseña inmediatamente
3. Atacante con token válido puede seguir accediendo ❌
```

**Opciones de Mejora:**

#### Opción A: Logout Automático al Cambiar Contraseña
```javascript
// En changeUserPassword
if (isChangingOwnPassword) {
  // Invalidar token actual
  // Forzar re-login
  return res.status(200).json({
    success: true,
    message: 'Password changed. Please login again.',
    requiresReauth: true
  });
}
```

#### Opción B: Lista Negra de Tokens (Token Blacklist)
```javascript
// Guardar tokens invalidados en Redis/DB
blacklistedTokens.add(currentToken);

// En authMiddleware, verificar blacklist
if (isTokenBlacklisted(token)) {
  throw new Error('Token has been revoked');
}
```

#### Opción C: Token Version (Recomendado para producción)
```javascript
// En User model, agregar:
tokenVersion: { type: Number, default: 0 }

// En token:
jwt.sign({ userId, email, role, tokenVersion: user.tokenVersion })

// Al cambiar contraseña:
user.tokenVersion += 1; // Invalida todos los tokens anteriores
```

**Estado Actual:**
- ⚠️ Cambiar contraseña NO invalida sesiones activas
- ✅ Funciona para cambios rutinarios
- ❌ No ideal para casos de seguridad comprometida

---

### 4. 🎭 Modificar ROL

```javascript
Cambiar: "user" → "admin"
```

**¿Está en el token?** ✅ Sí

**¿Qué pasa?**
- Si editas **tu propio rol**: 🚫 BLOQUEADO por seguridad
- Si un admin edita **el rol de otro usuario**: ❌ Token del otro usuario NO se regenera

**Impacto:**
- ⏱️ Usuario con rol cambiado: Su sesión actual mantiene rol antiguo hasta que expire token (15 min)
- 🔄 Después de 15 min: Token expira, re-login automático con refresh token obtiene nuevo rol

**Protección:**
```javascript
// No puedes cambiar tu propio rol
if (id === req.user.userId && role && role !== user.role) {
  return res.status(400).json({
    message: 'You cannot change your own role.'
  });
}
```

---

### 5. ✅ Modificar STATUS (isActive)

```javascript
Cambiar: isActive: true → false
```

**¿Está en el token?** ❌ No

**¿Qué pasa?**
- Token NO se regenera
- El estado se verifica en **cada request** en authMiddleware
- Cambio es **inmediato**

**Impacto:**
- ✅ Desactivar usuario → Su próximo request es rechazado inmediatamente
- ✅ Activar usuario → Puede hacer requests inmediatamente

**Flujo:**
```javascript
// En authMiddleware
const user = await User.findById(decoded.userId);
if (!user.isActive) {
  return res.status(403).json({
    message: 'User account is deactivated.'
  });
}
```

**Protección:**
```javascript
// No puedes desactivarte a ti mismo
if (id === req.user.userId && isActive === false) {
  return res.status(400).json({
    message: 'You cannot deactivate your own account.'
  });
}
```

---

## Tabla Resumen

| Campo | En Token | Regenera Token | Cambio Inmediato | Consideraciones |
|-------|----------|----------------|------------------|-----------------|
| **userId** | ✅ | N/A | N/A | Inmutable |
| **email** | ✅ | ✅ Solo si es propio | ✅ Si regenera | Otros usuarios: espera expiración |
| **role** | ✅ | 🚫 Propio bloqueado | ❌ Espera expiración | 15 min delay para otros usuarios |
| **name** | ❌ | ❌ | ✅ | Se obtiene de DB cada vez |
| **password** | ❌ | ❌ | ⚠️ Parcial | Sesiones activas persisten |
| **isActive** | ❌ | ❌ | ✅ | Verificación en cada request |

## Recomendaciones de Seguridad

### Para Producción:

1. **Implementar Token Versioning**
   - Invalida todos los tokens al cambiar contraseña
   - Más seguro que blacklist
   - Más eficiente en memoria

2. **Logout Forzado en Cambio de Contraseña**
   - Para el usuario que cambia su propia contraseña
   - Requiere re-login inmediato
   - Previene uso de sesiones comprometidas

3. **Notificaciones**
   - Enviar email cuando se cambia contraseña
   - Enviar email cuando se cambia email
   - Enviar email cuando se cambia rol

4. **Audit Log**
   - Registrar todos los cambios de seguridad
   - Timestamp, IP, usuario que hizo el cambio
   - Útil para investigaciones

## Estado Actual de la Implementación

### ✅ Implementado:
- Regeneración automática de token para cambios de email/rol propio
- Verificación de isActive en cada request
- Protecciones contra auto-desactivación y auto-cambio de rol
- Obtención de nombre desde DB en cada request

### ⚠️ Pendiente (Opcionales para Producción):
- Token versioning para invalidar sesiones al cambiar contraseña
- Logout forzado en cambio de contraseña
- Notificaciones por email de cambios de seguridad
- Audit log de cambios críticos

---

**Última actualización**: Optimización de regeneración de tokens
**Impacto**: Solo regenera cuando es absolutamente necesario (email/rol)

