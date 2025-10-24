# Sistema de Autenticación JWT - Alcel Marine App

## Implementación Completada

Se ha implementado un sistema completo de autenticación JWT seguro con las siguientes características:

### Backend (Node.js + Express + MongoDB)

#### 1. Nuevos Archivos Creados

**Modelos:**
- `server/models/User.js` - Modelo de usuario con hash de contraseñas

**Middleware:**
- `server/middleware/authMiddleware.js` - Verificación de JWT
- `server/middleware/roleMiddleware.js` - Control de acceso basado en roles
- `server/middleware/rateLimiter.js` - Protección contra ataques de fuerza bruta

**Controladores:**
- `server/controllers/authController.js` - Login, registro, refresh token, perfil

**Rutas:**
- `server/routes/authRoutes.js` - Endpoints de autenticación

**Utilidades:**
- `server/utils/tokenUtils.js` - Generación y verificación de tokens JWT

**Configuración:**
- `server/.env.example` - Variables de entorno necesarias

#### 2. Rutas de Autenticación (API)

**Públicas:**
- `POST /api/auth/register` - Registro de nuevo usuario
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Renovar access token

**Protegidas (requieren autenticación):**
- `GET /api/auth/profile` - Obtener perfil del usuario
- `PUT /api/auth/profile` - Actualizar perfil
- `PUT /api/auth/change-password` - Cambiar contraseña
- `POST /api/auth/logout` - Logout

#### 3. Protección de Rutas Existentes

Todas las rutas de negocios ahora requieren autenticación:
- Jobs (`/api/jobs/*`)
- Claims (`/api/claims/*`)
- Clients (`/api/clients/*`)
- Ports (`/api/ports/*`)
- Job Types (`/api/job-types/*`)
- TimeSheet (`/api/timesheet/*`)
- Dashboard (`/api/dashboard/*`)

**Permisos por Rol:**
- **viewer**: Solo lectura (GET)
- **user**: Lectura, crear y actualizar
- **admin**: Todos los permisos incluyendo eliminar

#### 4. Seguridad Implementada

- Hash de contraseñas con bcrypt (salt rounds: 10)
- JWT con expiración (Access: 15 min, Refresh: 7 días)
- Rate limiting (5 intentos de login por 15 min)
- Helmet para headers de seguridad
- CORS configurado
- Validación de inputs
- Tokens en headers Authorization (Bearer)

---

### Frontend (React + Vite)

#### 1. Nuevos Archivos Creados

**Contexto:**
- `src/context/AuthContext.jsx` - Estado global de autenticación

**Componentes:**
- `src/components/ProtectedRoute.jsx` - Protección de rutas
- `src/pages/Login.jsx` - Página de login/registro
- `src/pages/Login.css` - Estilos del login

#### 2. Archivos Modificados

- `src/App.jsx` - Rutas protegidas con AuthProvider
- `src/services/api.js` - Inclusión automática de tokens JWT
- `src/components/layout/Header.jsx` - Menú de usuario y logout

#### 3. Funcionalidades del Frontend

- Login/Registro en una sola página
- Auto-refresh de tokens cuando expiran
- Redirección automática a /login si no autenticado
- Mostrar información del usuario en el header
- Botón de logout
- Protección de todas las rutas principales

---

## Configuración Necesaria

### 1. Configurar Variables de Entorno del Backend

Crear archivo `server/.env` con:

```env
NODE_ENV=development
PORT=5000

# MongoDB
MONGODB_URI=tu_uri_de_mongodb_atlas

# JWT Secrets (generar claves seguras)
JWT_SECRET=tu_clave_secreta_super_segura_aqui
JWT_REFRESH_SECRET=otra_clave_secreta_diferente_aqui

# JWT Expiration
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
```

**Para generar claves secretas seguras, ejecuta en terminal:**

```bash
# En Linux/Mac
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# O en Windows PowerShell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Ejecuta el comando dos veces para generar `JWT_SECRET` y `JWT_REFRESH_SECRET`.

### 2. Instalar Dependencias

Las dependencias ya están instaladas. Si necesitas reinstalar:

```bash
cd server
npm install
```

### 3. Iniciar el Servidor

```bash
cd server
npm run dev
```

---

## Uso del Sistema

### 1. Crear Primer Usuario (Admin)

Puedes crear el primer usuario admin usando una herramienta como Postman o Thunder Client:

**Endpoint:** `POST http://localhost:5000/api/auth/register`

**Body (JSON):**
```json
{
  "name": "Admin User",
  "email": "admin@alcel.com",
  "password": "admin123",
  "role": "admin"
}
```

**Nota:** Para usuarios subsecuentes, el role por defecto es "user".

### 2. Login desde el Frontend

1. Iniciar frontend: `npm run dev`
2. Abrir navegador: `http://localhost:5173`
3. Serás redirigido a `/login`
4. Ingresar credenciales
5. Serás redirigido automáticamente al dashboard

### 3. Estructura de Respuesta del Login

```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "user": {
      "id": "67567890abcdef123456",
      "email": "admin@alcel.com",
      "name": "Admin User",
      "role": "admin",
      "lastLogin": "2025-10-24T10:30:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## Roles y Permisos

### Viewer
- Ver dashboard
- Ver jobs, claims, clients, etc.
- No puede crear, editar o eliminar

### User
- Todo lo de Viewer
- Crear jobs, claims, etc.
- Editar jobs, claims, etc.
- No puede eliminar

### Admin
- Todos los permisos
- Eliminar recursos
- Gestionar usuarios (futuro)

---

## Flujo de Autenticación

1. **Usuario no autenticado** → Redirigido a `/login`
2. **Login exitoso** → Tokens guardados en localStorage
3. **Navegación** → Token incluido automáticamente en todas las requests
4. **Token expira (15 min)** → Auto-refresh con refresh token
5. **Refresh falla** → Logout automático y redirigir a `/login`
6. **Logout manual** → Tokens eliminados, redirigir a `/login`

---

## Seguridad

### Mejores Prácticas Implementadas

✅ Contraseñas hasheadas con bcrypt
✅ JWT con expiración corta (15 min)
✅ Refresh tokens (7 días)
✅ Rate limiting en endpoints sensibles
✅ Helmet para headers de seguridad
✅ Validación de inputs
✅ HTTPS recomendado en producción
✅ Roles y permisos

### Recomendaciones Adicionales para Producción

- [ ] Usar HTTPS obligatorio
- [ ] Implementar 2FA (autenticación de dos factores)
- [ ] Rotar secrets periódicamente
- [ ] Implementar blacklist de tokens
- [ ] Logging de intentos de login
- [ ] Alertas de actividad sospechosa
- [ ] Política de contraseñas fuertes
- [ ] Rate limiting más estricto

---

## Testing

### Probar Endpoints con cURL

**Registro:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"test123"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

**Acceder a ruta protegida:**
```bash
curl -X GET http://localhost:5000/api/jobs \
  -H "Authorization: Bearer TU_ACCESS_TOKEN_AQUI"
```

---

## Troubleshooting

### Error: "No token provided"
- Verifica que el token esté en el header: `Authorization: Bearer <token>`

### Error: "Invalid or expired token"
- El token expiró, usa el refresh token para obtener uno nuevo

### Error: "Too many login attempts"
- Espera 15 minutos o ajusta el rate limiter

### Error: "Access denied. Insufficient permissions"
- Tu rol no tiene permisos para esa acción (necesitas ser user o admin)

---

## Próximos Pasos (Opcional)

1. Página de perfil de usuario
2. Cambio de contraseña desde UI
3. Gestión de usuarios (solo admin)
4. Recuperación de contraseña (forgot password)
5. Verificación de email
6. 2FA (Google Authenticator)
7. OAuth (Google, Microsoft)
8. Audit logs de acciones de usuarios

---

## Contacto y Soporte

Para cualquier duda o problema con la autenticación, revisar:
1. Logs del servidor
2. Console del navegador
3. Variables de entorno configuradas correctamente
4. MongoDB conectado correctamente
