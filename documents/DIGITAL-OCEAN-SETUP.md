# Guía Paso a Paso: Configuración de Digital Ocean

## 🎯 Objetivo
Conectar tu repositorio de GitHub con Digital Ocean para deployment automático.

---

## 📋 Antes de Comenzar

### Requisitos:
- ✅ Cuenta de Digital Ocean
- ✅ Código en GitHub (repositorio: alcel-marine-app)
- ✅ MongoDB Atlas configurado
- ✅ Variables de entorno generadas

---

## 🚀 Parte 1: Configuración en Digital Ocean

### Paso 1: Crear una App

1. **Ingresa a Digital Ocean**
   - Ve a: https://cloud.digitalocean.com
   - Inicia sesión con tu cuenta

2. **Navega a Apps**
   - En el menú lateral izquierdo, busca "Apps"
   - Click en "Apps"

3. **Crear Nueva App**
   - Click en el botón azul "Create App" (parte superior derecha)

---

### Paso 2: Conectar GitHub

1. **Seleccionar Source**
   - Verás opciones: GitHub, GitLab, Container Registry
   - Selecciona "GitHub"

2. **Autorizar Digital Ocean**
   - Click en "Authorize Digital Ocean"
   - Se abrirá una ventana de GitHub
   - Inicia sesión en GitHub si es necesario
   - Selecciona qué repositorios puede acceder Digital Ocean:
     - Opción A: "All repositories" (todos)
     - Opción B: "Only select repositories" → selecciona "alcel-marine-app"
   - Click en "Install & Authorize"

3. **Seleccionar Repositorio**
   - De vuelta en Digital Ocean
   - En "Repository", selecciona: `tu-usuario/alcel-marine-app`
   - En "Branch", selecciona: `main`
   - **Importante**: Marca la casilla "Autodeploy" ✅
     - Esto habilita el deployment automático con cada push

4. **Source Directory**
   - Deja en blanco (a menos que tu app esté en un subdirectorio)

5. **Click en "Next"**

---

### Paso 3: Configurar el Servicio

Digital Ocean analizará tu repositorio y detectará que es una app Node.js.

#### Detectará o debes configurar:

1. **Environment**:
   - Debe mostrar "Node.js"
   - Si no, selecciónalo manualmente

2. **Build Command**:
   ```bash
   npm install && npm run build
   ```

3. **Run Command**:
   ```bash
   npm run start:production
   ```

4. **HTTP Port**:
   ```
   8080
   ```

5. **Health Check Path**:
   ```
   /api/health
   ```

6. **Click en "Next"**

---

### Paso 4: Configurar Variables de Entorno

**MUY IMPORTANTE**: Sin estas variables, tu app no funcionará.

1. **En la sección "Environment Variables"**
   - Click en "Edit" o "Add Variable"

2. **Agregar cada variable una por una**:

#### Variable 1: NODE_ENV
```
Key: NODE_ENV
Value: production
Encrypt: ❌ (no)
```

#### Variable 2: PORT
```
Key: PORT
Value: 8080
Encrypt: ❌ (no)
```

#### Variable 3: MONGODB_URI (IMPORTANTE)
```
Key: MONGODB_URI
Value: [pega aquí tu connection string de MongoDB Atlas]
Encrypt: ✅ (sí) - marca esta casilla
```

#### Variable 4: JWT_SECRET
```
Key: JWT_SECRET
Value: [pega aquí el secret generado]
Encrypt: ✅ (sí) - marca esta casilla
```

#### Variable 5: JWT_REFRESH_SECRET
```
Key: JWT_REFRESH_SECRET
Value: [pega aquí el secret generado]
Encrypt: ✅ (sí) - marca esta casilla
```

#### Variable 6: SESSION_SECRET
```
Key: SESSION_SECRET
Value: [pega aquí el secret generado]
Encrypt: ✅ (sí) - marca esta casilla
```

3. **Verificar que todas estén agregadas**
   - Deberías ver 6 variables en total
   - 3 sin encriptar (NODE_ENV, PORT)
   - 3 encriptadas (MONGODB_URI, JWT_SECRET, JWT_REFRESH_SECRET, SESSION_SECRET)

4. **Click en "Save"**

---

### Paso 5: Seleccionar Plan y Región

1. **Name Your App**:
   ```
   alcel-marine-app
   ```

2. **Select Region**:
   - Selecciona la región más cercana a tus usuarios
   - Opciones recomendadas:
     - `NYC (New York)` - Costa este de USA
     - `SFO (San Francisco)` - Costa oeste de USA
     - `TOR (Toronto)` - Canadá
     - `AMS (Amsterdam)` - Europa

3. **Select Plan**:
   - Para empezar, selecciona "Basic"
   - Plan recomendado: **$5/month**
     - 512 MB RAM
     - 1 vCPU
     - Ideal para iniciar

4. **Advanced Options** (opcional):
   - Puedes dejar los valores por defecto
   - O ajustar:
     - Instance Count: 1 (para empezar)
     - HTTP Routes: dejar por defecto

---

### Paso 6: Revisión Final

1. **Review Your App**
   - Verifica toda la configuración:
     - ✅ Repositorio correcto
     - ✅ Branch: main
     - ✅ Autodeploy habilitado
     - ✅ 6 variables de entorno configuradas
     - ✅ Plan seleccionado

2. **Información de costos**
   - Verás el costo mensual estimado
   - Basic: ~$5/month

3. **Click en "Create Resources"**

---

### Paso 7: Primer Deployment

Digital Ocean comenzará a deployar tu app:

1. **Build Phase** (3-5 minutos)
   - Clonando repositorio
   - Instalando dependencias (`npm install`)
   - Construyendo la app (`npm run build`)
   - Puedes ver los logs en tiempo real

2. **Deploy Phase** (1-2 minutos)
   - Iniciando la app
   - Verificando health check

3. **Status**:
   - 🔵 Building...
   - 🟡 Deploying...
   - 🟢 Active (¡Éxito!)

---

### Paso 8: Verificar el Deployment

1. **Obtener URL de tu App**
   - En el dashboard, verás tu URL:
   ```
   https://alcel-marine-app-xxxxx.ondigitalocean.app
   ```

2. **Probar la App**
   - Click en la URL o cópiala
   - Abre en tu navegador

3. **Verificar Health Check**
   - Ve a: `https://tu-app-url.ondigitalocean.app/api/health`
   - Deberías ver:
   ```json
   {
     "status": "ok",
     "message": "Alcel Marine API is running",
     "timestamp": "2024-10-27T...",
     "environment": "production"
   }
   ```

4. **Probar Frontend**
   - Ve a la URL principal
   - La app debe cargar correctamente
   - Prueba el login

---

## 🔧 Parte 2: Configuración Adicional

### A. Agregar Dominio Personalizado (Opcional)

Si tienes tu propio dominio (ej: alcel-marine.com):

1. **En tu app de Digital Ocean**
   - Ve a "Settings"
   - Sección "Domains"
   - Click en "Add Domain"

2. **Configurar DNS**
   - Ingresa tu dominio: `alcel-marine.com`
   - Digital Ocean te dará instrucciones para:
     - Agregar registro CNAME en tu proveedor de dominio
     - Apuntar a tu app de Digital Ocean

3. **SSL Automático**
   - Digital Ocean configurará HTTPS automáticamente
   - Espera 5-10 minutos para que el certificado SSL se active

---

### B. Configurar Alertas

1. **En tu app**
   - Ve a "Settings"
   - Sección "Alerts"

2. **Alertas Recomendadas**:
   - Deployment failed
   - High CPU usage (> 80%)
   - High Memory usage (> 80%)
   - App crashed

3. **Canales de Notificación**:
   - Email
   - Slack (si usas)

---

### C. Revisar Logs en Tiempo Real

1. **Runtime Logs** (logs de la app corriendo):
   - En tu app, click en "Runtime Logs"
   - Verás todos los `console.log()` de tu aplicación
   - Útil para debugging

2. **Build Logs** (logs del build):
   - Click en "Deployments"
   - Selecciona un deployment
   - Click en "Build Logs"
   - Verás el proceso de instalación y build

3. **Filtrar Logs**:
   - Puedes buscar por texto
   - Filtrar por nivel (error, warning, info)
   - Descargar logs

---

## 🔄 Parte 3: Flujo de Deployment Automático

### Cómo Funciona el Auto-Deploy

```
┌─────────────────────────────────────────────────────┐
│  1. Haces cambios localmente                        │
│  2. git push origin main                            │
│  3. GitHub recibe el push                           │
│  4. Digital Ocean detecta el cambio (webhook)       │
│  5. Digital Ocean inicia nuevo deployment           │
│  6. Build → Deploy → Active                         │
│  7. Tu app se actualiza automáticamente             │
└─────────────────────────────────────────────────────┘
```

### Probar el Auto-Deploy

1. **Hacer un cambio pequeño**:
   ```javascript
   // En server/index.js, actualiza el health check:
   app.get('/api/health', (req, res) => {
     res.json({
       status: 'ok',
       message: 'Alcel Marine API is running - Version 1.1',
       timestamp: new Date().toISOString(),
       environment: process.env.NODE_ENV
     })
   })
   ```

2. **Commit y Push**:
   ```bash
   git add .
   git commit -m "test: verificar auto-deploy"
   git push origin main
   ```

3. **Monitorear en Digital Ocean**:
   - Ve a tu app
   - En "Activity", verás un nuevo deployment iniciarse
   - Espera a que cambie a "Active"

4. **Verificar**:
   - Refresca tu app en el navegador
   - Ve a `/api/health`
   - Deberías ver "Version 1.1"

---

## 🐛 Troubleshooting

### Problema 1: Build Fails

**Síntomas**:
- Deployment muestra estado "Failed"
- En Build Logs ves errores

**Solución**:
1. Revisa los Build Logs completos
2. Errores comunes:
   ```
   Error: Cannot find module 'xxx'
   → Verifica package.json y reinstala localmente

   npm ERR! code ELIFECYCLE
   → El script de build falló
   → Prueba npm run build localmente

   Error: ENOENT: no such file or directory
   → Archivo faltante
   → Verifica .gitignore
   ```

---

### Problema 2: App se Deploya pero no Responde

**Síntomas**:
- Build exitoso
- Deployment muestra "Active"
- Pero la app no carga o muestra 502/503

**Solución**:
1. Revisa Runtime Logs
2. Verifica que el servidor escuche en el puerto correcto:
   ```javascript
   const PORT = process.env.PORT || 8080
   ```
3. Verifica health check: debe responder en `/api/health`

---

### Problema 3: Database Connection Error

**Síntomas**:
- App inicia pero muestra errores de base de datos
- En Runtime Logs: "MongoError" o "connection refused"

**Solución**:
1. Verifica `MONGODB_URI` en variables de entorno
2. En MongoDB Atlas:
   - Ve a "Network Access"
   - Agrega IP: `0.0.0.0/0` (permitir todas)
3. Verifica usuario/password en connection string
4. Redeploy la app después de cambios

---

### Problema 4: Variables de Entorno no se Cargan

**Síntomas**:
- Errores sobre variables undefined
- `JWT_SECRET is not defined`

**Solución**:
1. Ve a Settings → Environment Variables
2. Verifica que TODAS las variables estén configuradas
3. Si faltan, agrégalas
4. **Importante**: Después de agregar variables, debes hacer un nuevo deployment:
   - Click en "Actions" → "Force Rebuild and Deploy"

---

### Problema 5: Auto-Deploy no Funciona

**Síntomas**:
- Haces push a GitHub
- Digital Ocean no inicia deployment

**Solución**:
1. Verifica que "Autodeploy" esté habilitado:
   - Ve a Settings → Source Code
   - "Auto Deploy" debe estar "On"
2. Verifica el branch correcto:
   - Debe ser "main" (o el que uses)
3. Revisa webhooks en GitHub:
   - Ve a tu repo → Settings → Webhooks
   - Debe haber un webhook de Digital Ocean
   - Si no, reconecta la app

---

## 📊 Monitoreo y Mantenimiento

### Métricas a Monitorear

1. **CPU Usage**
   - Normal: < 50%
   - Alerta: > 80%
   - Acción: Escalar a plan superior

2. **Memory Usage**
   - Normal: < 70%
   - Alerta: > 85%
   - Acción: Escalar a plan superior

3. **Request Count**
   - Monitorear picos inusuales
   - Puede indicar tráfico alto o ataques

4. **Response Time**
   - Normal: < 500ms
   - Alerta: > 2000ms
   - Acción: Optimizar código/queries

### Escalar tu App

Si necesitas más recursos:

1. Ve a Settings → Resources
2. Selecciona nuevo plan:
   - Basic: $5-12/month
   - Professional: $12+/month
3. Cambio es instantáneo (sin downtime)

---

## ✅ Checklist de Configuración Exitosa

- [ ] ✅ App creada en Digital Ocean
- [ ] ✅ GitHub conectado con autodeploy habilitado
- [ ] ✅ 6 variables de entorno configuradas
- [ ] ✅ Primer deployment exitoso (status: Active)
- [ ] ✅ Health check responde OK
- [ ] ✅ Frontend carga correctamente
- [ ] ✅ Login funciona
- [ ] ✅ Probado auto-deploy con un cambio
- [ ] ✅ Alertas configuradas
- [ ] ✅ Logs revisados

---

## 📞 Recursos Adicionales

- **Digital Ocean Docs**: https://docs.digitalocean.com/products/app-platform/
- **Community Tutorials**: https://www.digitalocean.com/community/tags/app-platform
- **Support**: https://www.digitalocean.com/support

---

## 🎉 ¡Felicidades!

Tu app ahora está en producción con deployment automático.

**Próximos pasos**:
1. Haz cambios localmente
2. Push a GitHub
3. Digital Ocean despliega automáticamente
4. Disfruta del desarrollo sin preocuparte por el deployment manual

**¡Happy Deploying! 🚀**
