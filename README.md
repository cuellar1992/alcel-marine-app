# ⚓ Alcel Marine App

Sistema de gestión integral para operaciones marítimas de Alcel Marine.

Sistema web moderno construido con **React**, **Node.js** y **MongoDB** usando una **arquitectura modular y escalable**.

## 🚀 Stack Tecnológico

### Frontend
- **React 18** - Librería UI moderna
- **Tailwind CSS 3** - Framework CSS utility-first
- **Vite** - Build tool y dev server ultrarrápido
- **ECharts** - Gráficos y visualizaciones
- **React Router** - Navegación

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación segura

## ✨ Features Principales

- ⚓ **Gestión de Jobs** - Control completo de trabajos marítimos
- 👥 **Gestión de Clientes** - Base de datos de clientes y contactos
- 🏢 **Control de Puertos** - Administración de puertos y ubicaciones
- ⏱️ **Timesheet** - Seguimiento de horas de empleados
- 📋 **Claims** - Gestión de reclamos y seguimiento
- 📊 **Dashboard** - Métricas y gráficos en tiempo real
- 🔐 **Autenticación JWT** - Sistema seguro de login con 2FA
- 👨‍💼 **Gestión de Usuarios** - Control de roles y permisos
- 📤 **Exportación Excel** - Reportes descargables
- 📱 **QR Codes** - Generación automática para jobs

## 📦 Quick Start

### Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Edita .env con tus credenciales
```

### Desarrollo

```bash
# Iniciar frontend + backend
npm run dev:full

# O por separado:
npm run dev      # Solo frontend
npm run server   # Solo backend
```

Accede a:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Health Check: http://localhost:5000/api/health

### Build de Producción

```bash
npm run build
npm run start:production
```

## 📁 Estructura del Proyecto

```
alcel-marine-app/
├── .do/                    # Configuración Digital Ocean
│   ├── app.yaml           # Config detallada
│   └── deploy.template.yaml
├── server/                 # Backend
│   ├── config/            # Configuraciones
│   ├── controllers/       # Lógica de negocio
│   ├── middleware/        # Autenticación, etc.
│   ├── models/            # Modelos MongoDB
│   ├── routes/            # Rutas API
│   ├── utils/             # Utilidades
│   ├── index.js          # Servidor Express
│   └── start.js          # Script de inicio
├── src/                   # Frontend
│   ├── components/       # Componentes React
│   ├── pages/           # Páginas principales
│   ├── services/        # API calls
│   └── App.jsx          # App principal
├── DEPLOYMENT.md         # Guía de deployment
├── WORKFLOW.md          # Flujo de trabajo
└── DIGITAL-OCEAN-SETUP.md # Setup Digital Ocean
```

## 📚 Documentación

### Guías de Deployment y Desarrollo:

- 🚀 **[WORKFLOW.md](./WORKFLOW.md)** - Guía rápida del flujo de trabajo diario
- 📖 **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Documentación completa de deployment
- ⚙️ **[DIGITAL-OCEAN-SETUP.md](./DIGITAL-OCEAN-SETUP.md)** - Setup paso a paso en Digital Ocean

### Documentación Técnica:

- 📁 **[documents/INDEX.md](documents/INDEX.md)** - Índice completo de documentación
- 🛠️ **[documents/DEVELOPMENT_GUIDE.md](documents/DEVELOPMENT_GUIDE.md)** - Guía de desarrollo
- 🔧 **[documents/BACKEND_SETUP.md](documents/BACKEND_SETUP.md)** - Configuración backend

## 🔄 Flujo de Deployment

```
Desarrollo Local → GitHub (push) → Digital Ocean → Producción
  (localhost)        (main)         (auto-deploy)     (live)
```

1. Desarrolla y prueba localmente: `npm run dev:full`
2. Haz push a `main`: `git push origin main`
3. Digital Ocean detecta el cambio automáticamente
4. Build y deploy automático (3-5 minutos)
5. App actualizada en producción ✅

**Ver [WORKFLOW.md](./WORKFLOW.md) para guía detallada del flujo diario.**

## 🛠️ Scripts Disponibles

### Desarrollo
```bash
npm run dev              # Solo frontend
npm run server           # Solo backend
npm run dev:full         # Frontend + Backend
```

### Producción
```bash
npm run build               # Build de producción
npm run start:production    # Servidor en producción
npm run preview            # Preview del build
```

### Utilidades
```bash
npm run seed:superadmin     # Crear usuario admin
```

## 🔐 Variables de Entorno

### Desarrollo (.env)
```bash
MONGODB_URI=mongodb://localhost:27017/alcel-marine-dev
PORT=5000
NODE_ENV=development
JWT_SECRET=tu-secret-key
JWT_REFRESH_SECRET=tu-refresh-secret
SESSION_SECRET=tu-session-secret
```

Ver [DEPLOYMENT.md](./DEPLOYMENT.md) para configuración en producción.

## 🔒 Seguridad

- ✅ Autenticación JWT con refresh tokens
- ✅ 2FA opcional para usuarios
- ✅ Rate limiting en API endpoints
- ✅ Helmet.js para headers HTTP seguros
- ✅ Passwords hasheados con bcrypt
- ✅ Variables de entorno encriptadas en producción

## 🐛 Troubleshooting

### Puerto en uso
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID [PID] /F
```

### Error de MongoDB
- Verifica que MongoDB esté corriendo
- Verifica `MONGODB_URI` en `.env`

### Build falla
```bash
rm -rf node_modules package-lock.json
npm install
```

Ver más en [DEPLOYMENT.md](./DEPLOYMENT.md#troubleshooting)

## 💡 Mejores Prácticas

1. ✅ Prueba localmente antes de hacer push
2. ✅ Usa commits descriptivos (`feat:`, `fix:`, `refactor:`)
3. ✅ Revisa los logs después de cada deployment
4. ✅ Mantén las dependencias actualizadas
5. ✅ No commitees archivos `.env`
6. ✅ Documenta cambios importantes

## 📈 Roadmap

- [ ] Tests unitarios y de integración
- [ ] CI/CD con GitHub Actions
- [ ] Logs centralizados
- [ ] Monitoring avanzado
- [ ] Notificaciones push
- [ ] App móvil (React Native)

## 👥 Contribuir

1. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
2. Haz commit: `git commit -m 'feat: añadir nueva funcionalidad'`
3. Push: `git push origin feature/nueva-funcionalidad`
4. Crea un Pull Request

## 📝 Licencia

Proyecto privado y confidencial - Alcel Marine © 2024

---

## 📞 Soporte

- Revisa [WORKFLOW.md](./WORKFLOW.md) para flujo de trabajo diario
- Consulta [DEPLOYMENT.md](./DEPLOYMENT.md) para deployment
- Sigue [DIGITAL-OCEAN-SETUP.md](./DIGITAL-OCEAN-SETUP.md) para configuración

---

**Desarrollado con ❤️ para Alcel Marine**

