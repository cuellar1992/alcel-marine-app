# Inicio Rápido - Sistema de Autenticación

## Pasos para Poner en Marcha

### 1. Configurar Variables de Entorno

El archivo `server/.env` ya ha sido creado con claves JWT seguras.

**IMPORTANTE:** Debes actualizar la URI de MongoDB:

```bash
# Edita server/.env y reemplaza esta línea:
MONGODB_URI=tu_uri_real_de_mongodb_atlas
```

Si no tienes la URI, búscala en:
- MongoDB Atlas Dashboard
- Archivo de configuración anterior
- Variables de entorno del sistema

### 2. Iniciar la Aplicación Completa

**Opción A - Frontend + Backend juntos (Recomendado):**
```bash
npm run dev:full
```

**Opción B - Backend solo:**
```bash
npm run server
# O alternativamente:
cd server
node start.js
```

**Opción C - Frontend solo:**
```bash
npm run dev
```

Deberías ver en el backend:
```
✅ Environment variables loaded successfully
📝 Loaded 7 environment variables
🚀 Server running on port 5000
📡 API available at http://localhost:5000/api
✅ MongoDB Connected Successfully!
```

Y en el frontend:
```
VITE v5.4.20  ready in 408 ms
➜  Local:   http://localhost:5173/
```

**IMPORTANTE:**
- ✅ Usa `npm run dev:full` o `npm run server`
- ❌ NO uses `node server/index.js` directamente (no cargará las variables de entorno)

### 3. Crear Primer Usuario Admin

Opción A - Usando cURL (Windows PowerShell):
```powershell
curl.exe -X POST http://localhost:5000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{\"name\":\"Admin\",\"email\":\"admin@alcel.com\",\"password\":\"admin123\",\"role\":\"admin\"}'
```

Opción B - Usando Postman/Thunder Client:
- URL: `POST http://localhost:5000/api/auth/register`
- Headers: `Content-Type: application/json`
- Body (JSON):
```json
{
  "name": "Admin",
  "email": "admin@alcel.com",
  "password": "admin123",
  "role": "admin"
}
```

### 4. Iniciar el Frontend

```bash
# En otra terminal
npm run dev
```

### 5. Hacer Login

1. Abre el navegador en `http://localhost:5173`
2. Serás redirigido a `/login`
3. Ingresa las credenciales:
   - Email: `admin@alcel.com`
   - Password: `admin123`
4. Click en "Sign In"
5. Serás redirigido al dashboard

## Credenciales de Prueba

**Admin:**
- Email: `admin@alcel.com`
- Password: `admin123`
- Permisos: Todos (crear, editar, eliminar)

Puedes crear más usuarios desde el endpoint de registro.

## Verificar que Funciona

### Test 1: Login desde UI
✅ Deberías poder hacer login y ver el dashboard
✅ Ver tu nombre y rol en el header
✅ Click en "Logout" debería cerrar sesión

### Test 2: API con Token
```bash
# Hacer login y copiar el accessToken de la respuesta
curl -X GET http://localhost:5000/api/jobs \
  -H "Authorization: Bearer TU_ACCESS_TOKEN_AQUI"
```

### Test 3: API sin Token (debe fallar)
```bash
curl -X GET http://localhost:5000/api/jobs
# Respuesta esperada: {"success":false,"message":"Access denied. No token provided."}
```

## Solución de Problemas

### Error: "MongoDB connection failed"
- Verifica que `MONGODB_URI` en `server/.env` esté correcta
- Verifica que tu IP esté en la whitelist de MongoDB Atlas

### Error: "No token provided" en el frontend
- Abre DevTools → Application → Local Storage
- Verifica que existan: `accessToken`, `refreshToken`, `user`
- Si no existen, haz logout y login de nuevo

### Error: Rate limit (Too many login attempts)
- Espera 15 minutos
- O reinicia el servidor

### Frontend no redirige al login
- Verifica que el servidor esté corriendo
- Verifica la consola del navegador para errores
- Verifica que `VITE_API_URL` en `.env` del frontend (si existe) apunte a `http://localhost:5000`

## Estructura de Permisos

| Acción | Viewer | User | Admin |
|--------|--------|------|-------|
| Ver datos | ✅ | ✅ | ✅ |
| Crear | ❌ | ✅ | ✅ |
| Editar | ❌ | ✅ | ✅ |
| Eliminar | ❌ | ❌ | ✅ |

## Próximos Pasos

1. Crear usuarios adicionales con diferentes roles
2. Probar crear/editar/eliminar recursos
3. Verificar que los permisos funcionen correctamente
4. Personalizar tiempo de expiración de tokens si es necesario

## Documentación Completa

Ver [INSTRUCCIONES_AUTENTICACION.md](./INSTRUCCIONES_AUTENTICACION.md) para documentación detallada.
