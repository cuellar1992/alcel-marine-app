# Arquitectura de Autenticación - Alcel Marine App

## Diagrama de Flujo de Autenticación

```
┌─────────────────────────────────────────────────────────────────────┐
│                          FRONTEND (React)                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐          │
│  │  Login Page  │───▶│ AuthContext  │───▶│ localStorage │          │
│  └──────────────┘    └──────────────┘    └──────────────┘          │
│         │                    │                    │                  │
│         │                    ▼                    ▼                  │
│         │            ┌───────────────┐    ┌──────────────┐          │
│         └───────────▶│  API Service  │───▶│ Access Token │          │
│                      └───────────────┘    │Refresh Token │          │
│                             │             └──────────────┘          │
│                             │                                        │
│                             ▼                                        │
│                    ┌─────────────────┐                              │
│                    │ Protected Routes│                              │
│                    │  - Dashboard    │                              │
│                    │  - Jobs         │                              │
│                    │  - Claims       │                              │
│                    └─────────────────┘                              │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             │ HTTP Request
                             │ Authorization: Bearer <token>
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      BACKEND (Node.js/Express)                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────────────────────────────────────┐       │
│  │                    Middleware Stack                       │       │
│  ├──────────────────────────────────────────────────────────┤       │
│  │  1. Helmet (Security Headers)                            │       │
│  │  2. CORS                                                 │       │
│  │  3. Rate Limiter (100 req/15min general)                │       │
│  │  4. Auth Limiter (5 req/15min en /auth)                 │       │
│  └──────────────────────────────────────────────────────────┘       │
│                             │                                        │
│                             ▼                                        │
│  ┌──────────────────────────────────────────────────────────┐       │
│  │                    Route Handler                          │       │
│  ├──────────────────────────────────────────────────────────┤       │
│  │  Public Routes:                                          │       │
│  │    POST /api/auth/register                               │       │
│  │    POST /api/auth/login                                  │       │
│  │    POST /api/auth/refresh                                │       │
│  │                                                           │       │
│  │  Protected Routes (require authenticate middleware):     │       │
│  │    GET  /api/auth/profile                                │       │
│  │    PUT  /api/auth/profile                                │       │
│  │    POST /api/auth/logout                                 │       │
│  │    ALL  /api/jobs/*                                      │       │
│  │    ALL  /api/claims/*                                    │       │
│  │    ALL  /api/clients/*                                   │       │
│  │    ALL  /api/dashboard/*                                 │       │
│  └──────────────────────────────────────────────────────────┘       │
│                             │                                        │
│                             ▼                                        │
│  ┌──────────────────────────────────────────────────────────┐       │
│  │              Authentication Middleware                    │       │
│  ├──────────────────────────────────────────────────────────┤       │
│  │  1. Extract token from Authorization header              │       │
│  │  2. Verify JWT signature                                 │       │
│  │  3. Check expiration                                     │       │
│  │  4. Find user in database                                │       │
│  │  5. Check if user is active                              │       │
│  │  6. Attach user to req.user                              │       │
│  └──────────────────────────────────────────────────────────┘       │
│                             │                                        │
│                             ▼                                        │
│  ┌──────────────────────────────────────────────────────────┐       │
│  │               Role Middleware (optional)                  │       │
│  ├──────────────────────────────────────────────────────────┤       │
│  │  - requireAdmin (only admin)                             │       │
│  │  - requireUserOrAdmin (user or admin)                    │       │
│  │  - requireRole([...roles])                               │       │
│  └──────────────────────────────────────────────────────────┘       │
│                             │                                        │
│                             ▼                                        │
│  ┌──────────────────────────────────────────────────────────┐       │
│  │                    Controller Logic                       │       │
│  └──────────────────────────────────────────────────────────┘       │
│                             │                                        │
│                             ▼                                        │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      DATABASE (MongoDB)                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────┐   ┌──────────────────┐   ┌────────────────┐  │
│  │   User Model     │   │    Job Model     │   │  Claim Model   │  │
│  ├──────────────────┤   ├──────────────────┤   ├────────────────┤  │
│  │ - _id            │   │ - jobNumber      │   │ - claimNumber  │  │
│  │ - email (unique) │   │ - shipName       │   │ - vesselName   │  │
│  │ - password (hash)│   │ - clientName     │   │ - location     │  │
│  │ - name           │   │ - portName       │   │ - description  │  │
│  │ - role           │   │ - jobType        │   │ - invoiceIssue │  │
│  │ - isActive       │   │ - jobStatus      │   │ - createdAt    │  │
│  │ - lastLogin      │   │ - invoiceIssue   │   └────────────────┘  │
│  │ - createdAt      │   │ - createdAt      │                        │
│  └──────────────────┘   └──────────────────┘                        │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

## Flujo de Login

```
1. Usuario ingresa email/password en Login Page
   │
   ▼
2. AuthContext.login() envía POST /api/auth/login
   │
   ▼
3. Backend:
   ├─ Valida campos requeridos
   ├─ Busca usuario por email
   ├─ Verifica que esté activo
   ├─ Compara password con hash (bcrypt)
   ├─ Genera Access Token (15min)
   ├─ Genera Refresh Token (7 días)
   └─ Retorna tokens + datos de usuario
   │
   ▼
4. Frontend guarda en localStorage:
   ├─ accessToken
   ├─ refreshToken
   └─ user (JSON)
   │
   ▼
5. Usuario es redirigido al Dashboard
```

## Flujo de Request Autenticado

```
1. Usuario navega a página protegida (ej: /ballast-bunker)
   │
   ▼
2. ProtectedRoute verifica si user existe en AuthContext
   │
   ├─ NO: Redirige a /login
   │
   └─ SÍ: Renderiza componente
           │
           ▼
3. Componente hace request a API (ej: jobsAPI.getAll())
   │
   ▼
4. api.js (apiCall) automáticamente:
   ├─ Lee accessToken de localStorage
   ├─ Agrega header: Authorization: Bearer <token>
   └─ Envía request
   │
   ▼
5. Backend middleware authenticate:
   ├─ Extrae token del header
   ├─ Verifica firma JWT
   ├─ Verifica expiración
   ├─ Busca usuario en DB
   ├─ Verifica que esté activo
   └─ Adjunta user a req.user
   │
   ▼
6. Backend role middleware (si aplica):
   ├─ Verifica que req.user.role esté en roles permitidos
   └─ Permite o niega acceso
   │
   ▼
7. Controller ejecuta lógica de negocio
   │
   ▼
8. Retorna respuesta al frontend
```

## Flujo de Token Refresh

```
1. Token expira (después de 15 minutos)
   │
   ▼
2. API retorna 401 con mensaje "expired"
   │
   ▼
3. api.js detecta error 401 + "expired"
   │
   ▼
4. Llama a refreshAccessToken():
   ├─ Lee refreshToken de localStorage
   ├─ Envía POST /api/auth/refresh
   │
   ▼
5. Backend verifica refresh token:
   ├─ Válido: Genera nuevo accessToken
   └─ Inválido/expirado: Error 401
   │
   ▼
6. Frontend:
   ├─ Éxito: Guarda nuevo accessToken y reintenta request original
   └─ Error: Logout automático y redirige a /login
```

## Estructura de Archivos

```
alcel-marine-app/
├── server/
│   ├── models/
│   │   └── User.js                 ✨ Nuevo
│   ├── controllers/
│   │   └── authController.js       ✨ Nuevo
│   ├── routes/
│   │   └── authRoutes.js           ✨ Nuevo
│   ├── middleware/
│   │   ├── authMiddleware.js       ✨ Nuevo
│   │   ├── roleMiddleware.js       ✨ Nuevo
│   │   └── rateLimiter.js          ✨ Nuevo
│   ├── utils/
│   │   └── tokenUtils.js           ✨ Nuevo
│   ├── index.js                    📝 Modificado
│   ├── .env                        ✨ Nuevo
│   ├── .env.example                ✨ Nuevo
│   └── generate-secrets.js         ✨ Nuevo
│
└── src/
    ├── context/
    │   └── AuthContext.jsx         ✨ Nuevo
    ├── components/
    │   ├── ProtectedRoute.jsx      ✨ Nuevo
    │   └── layout/
    │       └── Header.jsx          📝 Modificado
    ├── pages/
    │   ├── Login.jsx               ✨ Nuevo
    │   └── Login.css               ✨ Nuevo
    ├── services/
    │   └── api.js                  📝 Modificado
    └── App.jsx                     📝 Modificado
```

## Seguridad en Capas

```
Capa 1: Rate Limiting
└─ Previene ataques de fuerza bruta (5 intentos/15min en login)

Capa 2: Helmet
└─ Headers de seguridad HTTP

Capa 3: Password Hashing
└─ Bcrypt con salt rounds 10

Capa 4: JWT con expiración corta
└─ Access token: 15 minutos

Capa 5: Refresh Token
└─ 7 días, permite renovar sesión sin re-login

Capa 6: Role-Based Access Control (RBAC)
└─ Permisos granulares por rol (viewer/user/admin)

Capa 7: Input Validation
└─ Email format, password length, required fields

Capa 8: User Status Check
└─ isActive field permite desactivar cuentas
```

## Tokens JWT

### Access Token
```json
{
  "userId": "67567890abcdef123456",
  "email": "admin@alcel.com",
  "role": "admin",
  "iat": 1729766400,
  "exp": 1729767300
}
```
- Duración: 15 minutos
- Uso: Todas las requests autenticadas
- Almacenamiento: localStorage

### Refresh Token
```json
{
  "userId": "67567890abcdef123456",
  "iat": 1729766400,
  "exp": 1730371200
}
```
- Duración: 7 días
- Uso: Renovar access token
- Almacenamiento: localStorage

## Endpoints de Autenticación

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| POST | /api/auth/register | No | Registro de nuevo usuario |
| POST | /api/auth/login | No | Login |
| POST | /api/auth/refresh | No | Renovar access token |
| GET | /api/auth/profile | Sí | Obtener perfil |
| PUT | /api/auth/profile | Sí | Actualizar perfil |
| PUT | /api/auth/change-password | Sí | Cambiar contraseña |
| POST | /api/auth/logout | Sí | Logout |

## Roles y Permisos por Endpoint

| Endpoint | Viewer | User | Admin |
|----------|--------|------|-------|
| GET /api/jobs | ✅ | ✅ | ✅ |
| POST /api/jobs | ❌ | ✅ | ✅ |
| PUT /api/jobs/:id | ❌ | ✅ | ✅ |
| DELETE /api/jobs/:id | ❌ | ❌ | ✅ |
| GET /api/dashboard/* | ✅ | ✅ | ✅ |

*Mismo patrón para claims, clients, ports, job-types, timesheet

## Variables de Entorno Requeridas

```env
# Backend (server/.env)
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<generated-secret>
JWT_REFRESH_SECRET=<generated-secret>
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Frontend (opcional, .env en raíz)
VITE_API_URL=http://localhost:5000
```
