# Guía de Deployment - Alcel Marine App

## Flujo de Trabajo de Desarrollo y Deployment

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│  Local (Dev)    │ ───▶ │   GitHub        │ ───▶ │ Digital Ocean   │
│  localhost      │      │   Repository    │      │   Production    │
└─────────────────┘      └─────────────────┘      └─────────────────┘
  Desarrollar               Push código             Auto-deploy
  Testear                   main branch             Actualiza app
```

---

## 📋 Requisitos Previos

### 1. Cuentas Necesarias
- ✅ Cuenta de GitHub (con repositorio del proyecto)
- ✅ Cuenta de Digital Ocean
- ✅ Cuenta de MongoDB Atlas (para base de datos en la nube)

### 2. Herramientas Instaladas
- Node.js (v18 o superior)
- Git
- npm o yarn

---

## 🗄️ Configuración de MongoDB Atlas

### Paso 1: Crear Cluster en MongoDB Atlas

1. Ingresa a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea un nuevo proyecto o usa uno existente
3. Crea un cluster (opción FREE tier M0 disponible)
4. Configura las opciones:
   - Provider: AWS, Azure o GCP
   - Region: Preferiblemente cerca de tu servidor (ej: us-east-1)

### Paso 2: Configurar Acceso a la Base de Datos

1. **Database Access** (Usuarios):
   - Crea un usuario con password
   - Guarda las credenciales de forma segura
   - Permisos recomendados: `readWrite` para tu base de datos

2. **Network Access** (Whitelist):
   - Opción 1: Permitir acceso desde cualquier IP: `0.0.0.0/0` (para desarrollo)
   - Opción 2: Agregar IPs específicas de Digital Ocean después

3. **Obtener Connection String**:
   - Click en "Connect" en tu cluster
   - Selecciona "Connect your application"
   - Copia el string de conexión:
   ```
   mongodb+srv://Your string conections
   ```
   - Reemplaza `<username>`, `<password>` y `<database>` con tus valores

---

## 🔐 Variables de Entorno

### Variables Requeridas

Necesitarás generar y guardar estas variables de forma segura:

```bash
# Base de datos
MONGODB_URI=tu-connection-string

# Autenticación JWT
JWT_SECRET=tu-secret-key-segura-aqui-min-32-chars
JWT_REFRESH_SECRET=otro-secret-key-diferente-min-32-chars

# Sesiones
SESSION_SECRET=session-secret-key-min-32-chars

# Entorno
NODE_ENV=production
PORT=8080
```

### Generar Secrets Seguros

Usa este comando para generar secrets aleatorios y seguros:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Ejecuta este comando 3 veces para generar:
1. JWT_SECRET
2. JWT_REFRESH_SECRET
3. SESSION_SECRET

---

## 🚀 Configuración en Digital Ocean App Platform

### Paso 1: Conectar GitHub con Digital Ocean

1. Ingresa a [Digital Ocean](https://cloud.digitalocean.com)
2. Ve a "Apps" en el menú lateral
3. Click en "Create App"
4. Selecciona "GitHub" como source
5. **Autoriza Digital Ocean** para acceder a tu GitHub
6. Selecciona tu repositorio: `alcel-marine-app`
7. Selecciona la rama: `main`
8. Marca "Autodeploy" ✅ (importante para deployment automático)

### Paso 2: Configurar el Servicio

#### Opción A: Usando el archivo de configuración (Recomendado)

1. Digital Ocean detectará automáticamente el archivo `.do/app.yaml`
2. Revisa la configuración sugerida
3. Continúa al siguiente paso

#### Opción B: Configuración Manual

1. **Tipo de recurso**: Web Service
2. **Nombre**: alcel-marine-app
3. **Environment**: Node.js
4. **Build Command**:
   ```bash
   npm install && npm run build
   ```
5. **Run Command**:
   ```bash
   npm run start:production
   ```
6. **HTTP Port**: 8080
7. **Health Check Path**: `/api/health`

### Paso 3: Configurar Variables de Entorno

En la sección de "Environment Variables":

1. Click en "Edit" o "Add Variable"
2. Agrega cada variable:

| Variable Name         | Value                              | Encrypted |
|-----------------------|------------------------------------|-----------|
| NODE_ENV              | production                         | ❌        |
| PORT                  | 8080                               | ❌        |
| MONGODB_URI           | [tu-connection-string]             | ✅        |
| JWT_SECRET            | [generado-con-crypto]              | ✅        |
| JWT_REFRESH_SECRET    | [generado-con-crypto]              | ✅        |
| SESSION_SECRET        | [generado-con-crypto]              | ✅        |

**Importante**: Marca las variables sensibles como "Encrypted" ✅

### Paso 4: Configurar Plan y Recursos

1. **Plan**: Basic (para empezar)
2. **Size**: Basic - $5/month
   - 512 MB RAM
   - 1 vCPU
   - Ideal para empezar, puedes escalar después

3. **Configuración Regional**:
   - Selecciona la región más cercana a tus usuarios
   - Recomendado: NYC (New York) o SFO (San Francisco)

### Paso 5: Crear la App

1. Revisa toda la configuración
2. Click en "Create Resources"
3. Digital Ocean comenzará el deployment inicial
4. Espera de 5-10 minutos para el primer deployment

---

## 🔄 Proceso de Desarrollo Diario

### Flujo de Trabajo Local

```bash
# 1. Asegúrate de estar en la rama main
git checkout main

# 2. Actualiza tu código local
git pull origin main

# 3. Desarrolla y testea localmente
npm run dev:full

# 4. Prueba que todo funcione correctamente
# - Verifica frontend: http://localhost:5173
# - Verifica backend: http://localhost:5000/api/health
```

### Proceso de Deploy a Producción

Una vez que hayas probado todo localmente:

```bash
# 1. Agrega los cambios
git add .

# 2. Crea un commit descriptivo
git commit -m "feat: descripción de los cambios realizados"

# 3. Push a GitHub
git push origin main

# ✨ Digital Ocean detectará el push automáticamente y comenzará el deployment
```

### Monitorear el Deployment

1. Ve a tu app en Digital Ocean Dashboard
2. En la pestaña "Activity", verás el deployment en progreso
3. Estados:
   - 🔵 **Building**: Instalando dependencias y construyendo
   - 🟡 **Deploying**: Desplegando la nueva versión
   - 🟢 **Active**: Deployment exitoso
   - 🔴 **Failed**: Error en el deployment (revisa los logs)

4. Para ver logs en tiempo real:
   - Click en "Runtime Logs" o "Build Logs"
   - Identifica cualquier error

---

## 🌿 Estrategia de Branching (Opcional pero Recomendada)

Para proyectos más grandes, considera usar ramas:

### Estructura de Ramas

```
main (producción - auto-deploy)
  └── develop (desarrollo)
       └── feature/nueva-funcionalidad
```

### Flujo de Trabajo con Ramas

```bash
# Crear rama para nueva funcionalidad
git checkout -b feature/nombre-funcionalidad

# Desarrollar y hacer commits
git add .
git commit -m "feat: nueva funcionalidad"

# Mergear a develop para testing
git checkout develop
git merge feature/nombre-funcionalidad

# Cuando todo esté listo, mergear a main para deployment
git checkout main
git merge develop
git push origin main  # ← Esto dispara el auto-deploy
```

---

## 🧪 Testing Antes de Deploy

### Checklist Pre-Deploy

Antes de hacer push a `main`, verifica:

- [ ] ✅ La app corre localmente sin errores (`npm run dev:full`)
- [ ] ✅ El build de producción funciona (`npm run build`)
- [ ] ✅ Las pruebas pasan (si tienes tests)
- [ ] ✅ No hay errores en la consola del navegador
- [ ] ✅ Las APIs responden correctamente
- [ ] ✅ La autenticación funciona
- [ ] ✅ No hay credenciales hardcodeadas en el código

### Probar Build de Producción Localmente

```bash
# 1. Crear build de producción
npm run build

# 2. Probar el build localmente
NODE_ENV=production npm run start:production

# 3. Verificar en: http://localhost:8080
# - Frontend debe cargar desde archivos estáticos
# - API debe responder en /api/*
```

---

## 🔍 Troubleshooting

### Problema: Deployment Falla

**Solución**:
1. Revisa los "Build Logs" en Digital Ocean
2. Errores comunes:
   - Dependencias faltantes → Verifica `package.json`
   - Variables de entorno incorrectas → Revisa configuración
   - Error de build → Prueba `npm run build` localmente

### Problema: App Desplegada pero no Carga

**Solución**:
1. Verifica "Runtime Logs"
2. Verifica que el health check responda: `https://tu-app.ondigitalocean.app/api/health`
3. Verifica variables de entorno en Digital Ocean
4. Verifica conexión a MongoDB Atlas (whitelisting de IPs)

### Problema: MongoDB Connection Error

**Solución**:
1. Verifica que `MONGODB_URI` esté correctamente configurada
2. En MongoDB Atlas, verifica "Network Access":
   - Agrega `0.0.0.0/0` para permitir todas las IPs
   - O agrega las IPs específicas de Digital Ocean
3. Verifica usuario/password de MongoDB
4. Verifica que el cluster esté activo

### Problema: 500 Internal Server Error

**Solución**:
1. Revisa Runtime Logs en Digital Ocean
2. Verifica que todas las variables de entorno estén configuradas
3. Verifica que `JWT_SECRET`, `JWT_REFRESH_SECRET` estén definidos
4. Prueba el endpoint de health: `/api/health`

---

## 📊 Monitoreo Post-Deployment

### Verificar que Todo Funcione

Después de cada deployment:

1. ✅ **Health Check**: `https://tu-app.ondigitalocean.app/api/health`
   ```json
   {
     "status": "ok",
     "message": "Alcel Marine API is running",
     "timestamp": "2024-10-27T...",
     "environment": "production"
   }
   ```

2. ✅ **Frontend**: Carga la página principal
3. ✅ **Login**: Prueba autenticación
4. ✅ **Funcionalidad crítica**: Prueba las features principales

### Métricas en Digital Ocean

Digital Ocean proporciona:
- 📈 CPU Usage
- 💾 Memory Usage
- 🌐 Bandwidth
- 🔄 Request count
- ⚡ Response time

Accede a estas métricas en: App → Insights

---

## 💰 Costos Estimados

### Digital Ocean App Platform
- **Basic Plan**: $5-12/mes
  - 512 MB RAM
  - 1 vCPU
  - Suficiente para empezar

### MongoDB Atlas
- **Free Tier (M0)**: $0/mes
  - 512 MB storage
  - Shared CPU
  - Ideal para desarrollo/testing

- **Dedicated (M10)**: ~$57/mes
  - 10 GB storage
  - Dedicated CPU
  - Recomendado para producción

### Total Estimado
- **Desarrollo/Testing**: $5-12/mes
- **Producción**: $62-69/mes

---

## 🎯 Mejores Prácticas

1. **Commits Descriptivos**: Usa prefijos como `feat:`, `fix:`, `docs:`
2. **Testing Local**: Siempre prueba antes de push
3. **Variables de Entorno**: Nunca commitees archivos `.env`
4. **Monitoreo**: Revisa logs después de cada deployment
5. **Backups**: MongoDB Atlas hace backups automáticos (verifica configuración)
6. **SSL/HTTPS**: Digital Ocean lo provee automáticamente
7. **Dominio Personalizado**: Puedes agregar tu dominio en Settings → Domains

---

## 🔄 Rollback (Volver a Versión Anterior)

Si algo sale mal:

### Opción 1: Desde Digital Ocean Dashboard
1. Ve a tu app
2. Click en "Activity"
3. Encuentra el deployment anterior exitoso
4. Click en "..." → "Redeploy"

### Opción 2: Desde Git
```bash
# Ver historial de commits
git log --oneline

# Revertir al commit anterior
git revert HEAD

# Push para deployar
git push origin main
```

---

## 📞 Soporte y Recursos

- **Digital Ocean Docs**: https://docs.digitalocean.com/products/app-platform/
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com/
- **Node.js Best Practices**: https://github.com/goldbergyoni/nodebestpractices

---

## ✅ Checklist Final

Antes del primer deployment:

- [ ] ✅ Cuenta de Digital Ocean creada
- [ ] ✅ MongoDB Atlas configurado y connection string obtenido
- [ ] ✅ Todas las variables de entorno generadas
- [ ] ✅ Repositorio GitHub conectado a Digital Ocean
- [ ] ✅ Auto-deploy habilitado
- [ ] ✅ Variables de entorno configuradas en Digital Ocean
- [ ] ✅ Health check configurado
- [ ] ✅ Build local exitoso
- [ ] ✅ Primer deployment realizado
- [ ] ✅ Health check responde OK
- [ ] ✅ App funciona correctamente en producción

---

**¡Listo para el deployment! 🚀**

Cualquier duda, revisa los logs y el troubleshooting de este documento.
