# 🔒 Sistema de Tokens de Seguridad - Mejoras Implementadas

## 📋 Problema Original

Después de 10+ horas sin usar la aplicación:
- Los tokens JWT expiraban
- El navegador mantenía tokens expirados en cache
- La UI mostraba al usuario como autenticado
- Las peticiones al servidor fallaban con error `Invalid or expired token`
- El usuario veía la aplicación pero no podía interactuar

## ✅ Soluciones Implementadas

### 1. **Validación de Tokens al Iniciar** ✨

**Archivo**: `src/utils/tokenUtils.js` (NUEVO)

Funciones creadas:
- `decodeToken()` - Decodifica tokens JWT sin verificar firma
- `isTokenExpired()` - Verifica si un token está expirado
- `validateStoredTokens()` - Valida todos los tokens almacenados
- `clearAuthData()` - Limpia datos de autenticación
- `getTokenExpirationTime()` - Obtiene tiempo restante del token

**Flujo de validación**:
```
1. Al cargar la app, se verifican los tokens almacenados
2. Si ambos están expirados → Limpiar y mostrar login
3. Si access token expiró pero refresh es válido → Refrescar automáticamente
4. Si ambos son válidos → Cargar usuario
```

### 2. **Refresh Automático al Iniciar** 🔄

**Archivo**: `src/context/AuthContext.jsx`

- Se agregó lógica al `useEffect` inicial para verificar tokens
- Si el access token expiró pero el refresh token es válido:
  - Se intenta refrescar automáticamente
  - Se muestra mensaje: "Sesión renovada automáticamente"
  - El usuario puede continuar sin hacer login
- Si ambos tokens expiraron:
  - Se limpia el almacenamiento local
  - El usuario es redirigido a login

**Nueva función**: `refreshTokenSilent()`
- Refresca el token sin mostrar notificaciones
- No hace logout automático en caso de error
- Usada durante la carga inicial de la app

### 3. **Duración Extendida de Tokens** ⏰

**Archivo**: `server/utils/tokenUtils.js`

**Antes**:
- Access Token: 15 minutos
- Refresh Token: 7 días

**Ahora**:
- Access Token: **1 hora** (4x más tiempo)
- Refresh Token: **30 días** (4x más tiempo)

**Beneficios**:
- Menos interrupciones durante uso activo
- Mejor experiencia de usuario
- Menos llamadas al servidor para refrescar tokens
- Mantiene seguridad al tener refresh token con expiración

### 4. **Manejo Mejorado de Errores 401** 🛡️

**Archivo**: `src/services/api.js`

**Mejoras implementadas**:

1. **Prevención de múltiples refreshes simultáneos**:
   ```javascript
   let isRefreshing = false;
   let refreshPromise = null;
   ```
   Si múltiples peticiones fallan al mismo tiempo, solo se hace un refresh.

2. **Retry automático tras refresh**:
   - Cuando un 401 indica token expirado
   - Se refresca el token automáticamente
   - Se reintenta la petición original
   - El usuario no nota la interrupción

3. **Mensajes de consola informativos**:
   ```
   🔄 Access token expirado, intentando refrescar...
   ❌ Tokens expirados, limpiando sesión...
   ⚠️ Sesión expirada, redirigiendo a login...
   ```

## 🔄 Flujo Completo del Sistema

### Escenario 1: Usuario vuelve después de 30 minutos
```
1. Usuario abre la app
2. AuthContext verifica tokens
3. Access token expiró (>1h)
4. Refresh token válido (<30d)
5. Se refresca automáticamente
6. Toast: "Sesión renovada automáticamente"
7. Usuario continúa normalmente
```

### Escenario 2: Usuario vuelve después de 31 días
```
1. Usuario abre la app
2. AuthContext verifica tokens
3. Ambos tokens expirados
4. Se limpia localStorage
5. Usuario ve pantalla de login
6. Debe hacer login de nuevo
```

### Escenario 3: Usuario usa la app activamente
```
1. Usuario hace una petición
2. Access token válido
3. Petición exitosa
4. Si access token expira durante el uso:
   - api.js detecta 401
   - Refresca automáticamente
   - Reintenta petición
   - Usuario no nota nada
```

## 🧪 Cómo Probar

### Test 1: Token Expirado al Iniciar

1. Hacer login normal
2. Ir a DevTools → Application → Local Storage
3. Copiar el `accessToken` actual
4. Modificar manualmente el token (cambiar algunos caracteres)
5. Recargar la página
6. **Resultado esperado**: Se limpia la sesión y aparece login

### Test 2: Refresh Automático

1. Hacer login normal
2. Esperar 1+ hora (o modificar el token para simular expiración)
3. Recargar la página
4. **Resultado esperado**: 
   - Si el refresh token es válido: "Sesión renovada automáticamente"
   - Usuario puede continuar usando la app

### Test 3: Refresh Durante Uso

1. Hacer login
2. Usar la app normalmente
3. Cuando el access token expire (después de 1 hora):
4. Hacer cualquier operación (crear job, ver dashboard, etc.)
5. **Resultado esperado**: La operación funciona sin problemas

### Test 4: Session Expired

1. Hacer login
2. Eliminar el `refreshToken` de localStorage
3. Hacer cualquier operación
4. **Resultado esperado**: Redirige a login con mensaje de sesión expirada

## 📊 Configuración de Variables de Entorno

Si necesitas ajustar las duraciones, puedes usar variables de entorno:

```env
# En tu archivo .env (si existe)
JWT_ACCESS_EXPIRATION=1h    # Duración del access token
JWT_REFRESH_EXPIRATION=30d  # Duración del refresh token
```

Valores permitidos:
- `15m` = 15 minutos
- `1h` = 1 hora
- `24h` = 24 horas
- `7d` = 7 días
- `30d` = 30 días

## 🔐 Consideraciones de Seguridad

### ¿Por qué dos tokens?

1. **Access Token (corto)**: 
   - Se envía en cada petición
   - Si es comprometido, expira rápido (1h)
   - Riesgo limitado

2. **Refresh Token (largo)**:
   - Solo se usa para obtener nuevos access tokens
   - No se envía en peticiones normales
   - Si es comprometido, el atacante necesita usarlo antes que expire (30d)

### Mejores Prácticas Implementadas

✅ **Tokens en localStorage**: Persistencia entre sesiones
✅ **Expiración automática**: Los tokens expiran sin necesidad de revocación
✅ **Refresh automático**: Experiencia de usuario fluida
✅ **Validación al iniciar**: Limpia tokens expirados inmediatamente
✅ **Retry automático**: Maneja expiración durante uso activo
✅ **Prevención de race conditions**: Un solo refresh a la vez

## 🚀 Próximas Mejoras Sugeridas (Opcional)

1. **Refresh Token Rotation**: 
   - Al refrescar, generar nuevo refresh token
   - Invalidar el anterior
   - Mayor seguridad

2. **Blacklist de Tokens**:
   - Almacenar tokens revocados en Redis
   - Verificar en cada petición
   - Para logout forzoso

3. **Device Tracking**:
   - Asociar refresh tokens a dispositivos
   - Permitir logout remoto
   - Ver sesiones activas

4. **Token en HttpOnly Cookies**:
   - Más seguro que localStorage
   - Protege contra XSS
   - Requiere configuración CORS adicional

## 📝 Notas Importantes

- Los tokens antiguos (de sesiones previas) quedan automáticamente invalidados
- No es necesario limpiar la base de datos o hacer migraciones
- Los usuarios existentes necesitarán hacer login de nuevo una vez
- Después del primer login, el sistema funcionará automáticamente

## 🔍 Troubleshooting

### Error: "Invalid or expired token"

**Causa**: Token expirado y refresh token también expiró
**Solución**: Hacer login de nuevo

### Error: "Session expired"

**Causa**: Refresh token no disponible o inválido
**Solución**: Hacer login de nuevo

### La app muestra contenido pero no responde

**Causa**: Tokens en cache pero expirados (problema resuelto con esta actualización)
**Solución**: Recargar la página, el sistema limpiará automáticamente

### Refresh infinito

**Causa**: Problema con el servidor o tokens malformados
**Solución**: 
1. Limpiar localStorage manualmente
2. Verificar que el servidor esté corriendo
3. Verificar variables JWT_SECRET en el servidor

---

**Última actualización**: 24 de Octubre, 2025
**Versión**: 2.0
**Estado**: ✅ Implementado y Testeado

