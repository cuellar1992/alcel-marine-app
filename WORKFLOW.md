# Flujo de Trabajo Diario - Guía Rápida

## 🚀 Quick Start: Del Desarrollo a Producción

### Flujo Visual
```
💻 DESARROLLO LOCAL    →    📦 GITHUB    →    🌐 DIGITAL OCEAN
   localhost                 push            auto-deploy
```

---

## 📋 Configuración Inicial (Solo una vez)

### 1. Variables de Entorno Locales

Crea tu archivo `.env` en la raíz del proyecto (si no existe):

```bash
# .env
MONGODB_URI=mongodb://localhost:27017/alcel-marine-dev
PORT=5000
NODE_ENV=development
JWT_SECRET=dev-secret-key-change-in-production
JWT_REFRESH_SECRET=dev-refresh-secret-change-in-production
SESSION_SECRET=dev-session-secret-change-in-production
```

### 2. Instalar Dependencias

```bash
npm install
```

---

## 🔄 Flujo de Trabajo Diario

### Opción 1: Desarrollo Simple (Sin Ramas)

#### Paso 1: Actualizar tu código
```bash
git pull origin main
```

#### Paso 2: Desarrollar localmente
```bash
# Inicia el servidor de desarrollo (frontend + backend)
npm run dev:full

# Abre en tu navegador:
# Frontend: http://localhost:5173
# Backend: http://localhost:5000/api/health
```

#### Paso 3: Probar tus cambios
- ✅ Verifica que el frontend cargue correctamente
- ✅ Verifica que las APIs funcionen
- ✅ Prueba las nuevas funcionalidades
- ✅ Revisa la consola en busca de errores

#### Paso 4: Probar el build de producción (Opcional pero recomendado)
```bash
# Crear build
npm run build

# Probar el build localmente
NODE_ENV=production npm run start:production

# Verificar en: http://localhost:8080
```

#### Paso 5: Commit y Push
```bash
# Ver archivos modificados
git status

# Agregar archivos
git add .

# Crear commit descriptivo
git commit -m "feat: descripción clara de los cambios"

# Ejemplos de mensajes:
# git commit -m "feat: añadir filtro de búsqueda en jobs"
# git commit -m "fix: corregir error en cálculo de timesheet"
# git commit -m "refactor: mejorar performance en dashboard"

# Push a GitHub
git push origin main
```

#### Paso 6: Monitorear Deployment
1. Ve a Digital Ocean Dashboard
2. Observa el deployment en la sección "Activity"
3. Espera a que aparezca "✅ Active"
4. Verifica tu app en producción: `https://tu-app.ondigitalocean.app`

---

### Opción 2: Desarrollo con Ramas (Recomendado para equipos)

#### Crear una nueva funcionalidad

```bash
# 1. Asegúrate de estar actualizado
git checkout main
git pull origin main

# 2. Crea una rama para tu feature
git checkout -b feature/nombre-descriptivo

# Ejemplos:
# git checkout -b feature/filtro-busqueda
# git checkout -b fix/error-timesheet
# git checkout -b refactor/dashboard-performance

# 3. Desarrolla y prueba localmente
npm run dev:full

# 4. Haz commits frecuentes
git add .
git commit -m "feat: implementar filtro de búsqueda"

# 5. Puedes hacer múltiples commits
git add .
git commit -m "feat: añadir validación al filtro"

# 6. Cuando termines, push a GitHub
git push origin feature/nombre-descriptivo
```

#### Crear Pull Request (PR)

1. Ve a GitHub
2. Verás un banner: "Compare & pull request"
3. Crea el Pull Request
4. Revisa los cambios
5. Solicita revisión (opcional)
6. **Merge a main** cuando esté listo
7. ✨ **Deployment automático se dispara**

#### Limpiar después del merge

```bash
# Volver a main
git checkout main

# Actualizar
git pull origin main

# Eliminar rama local (opcional)
git branch -d feature/nombre-descriptivo
```

---

## 🎯 Comandos Rápidos de Referencia

### Desarrollo
```bash
# Iniciar entorno de desarrollo completo
npm run dev:full

# Solo frontend (si el backend ya está corriendo)
npm run dev

# Solo backend
npm run server
```

### Build y Testing
```bash
# Crear build de producción
npm run build

# Probar build localmente
npm run start:production

# Preview del build
npm run preview
```

### Git - Comandos Comunes
```bash
# Ver estado
git status

# Ver branches
git branch -a

# Cambiar de branch
git checkout nombre-branch

# Crear nuevo branch
git checkout -b nuevo-branch

# Ver historial
git log --oneline

# Ver diferencias
git diff

# Descartar cambios
git checkout -- archivo.js

# Ver archivos modificados
git status
```

---

## 🐛 Troubleshooting Rápido

### Error: "Puerto ya en uso"

**Problema**: El puerto 5000 o 5173 ya está en uso

**Solución**:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID [PID_NUMBER] /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### Error: "Cannot connect to database"

**Problema**: No se puede conectar a MongoDB

**Solución**:
- Verifica que MongoDB esté corriendo
- Verifica la variable `MONGODB_URI` en tu `.env`
- Para desarrollo local: `mongodb://localhost:27017/alcel-marine-dev`

### Error: "npm run build fails"

**Problema**: El build falla localmente

**Solución**:
```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install

# Limpiar cache de Vite
npm run build -- --force
```

### Error: "Deployment fails en Digital Ocean"

**Problema**: El deployment falla en Digital Ocean

**Solución**:
1. Revisa los "Build Logs" en Digital Ocean
2. Verifica que todas las variables de entorno estén configuradas
3. Asegúrate de que el build funcione localmente primero
4. Verifica que `.gitignore` no ignore archivos necesarios

---

## 📝 Prefijos de Commits (Convención)

Usa estos prefijos para mensajes de commit claros:

- `feat:` - Nueva funcionalidad
  ```bash
  git commit -m "feat: añadir export a Excel en jobs"
  ```

- `fix:` - Corrección de bug
  ```bash
  git commit -m "fix: corregir cálculo de horas en timesheet"
  ```

- `refactor:` - Refactorización de código
  ```bash
  git commit -m "refactor: optimizar queries de dashboard"
  ```

- `style:` - Cambios de estilo/formato
  ```bash
  git commit -m "style: mejorar diseño de formularios"
  ```

- `docs:` - Documentación
  ```bash
  git commit -m "docs: actualizar README con instrucciones"
  ```

- `chore:` - Tareas de mantenimiento
  ```bash
  git commit -m "chore: actualizar dependencias"
  ```

---

## ⚡ Tips de Productividad

### 1. Aliases de Git (Opcional)

Agrega estos aliases a tu `.gitconfig` para comandos más rápidos:

```bash
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.unstage 'reset HEAD --'

# Ahora puedes usar:
git st      # en lugar de git status
git co main # en lugar de git checkout main
```

### 2. Scripts Personalizados

Agrega estos scripts a tu `package.json` si los necesitas:

```json
{
  "scripts": {
    "test:local": "npm run build && npm run start:production",
    "logs:prod": "echo 'Revisa logs en Digital Ocean Dashboard'",
    "db:seed": "npm run seed:superadmin"
  }
}
```

### 3. Verificación Pre-Push

Antes de cada push, verifica:

```bash
# Checklist rápido
npm run build              # ✅ Build exitoso
npm run start:production   # ✅ Servidor inicia
# Abre http://localhost:8080 y verifica que funcione
```

---

## 🎓 Mejores Prácticas

1. **Commits Pequeños y Frecuentes**
   - Mejor hacer varios commits pequeños que uno grande
   - Facilita revertir cambios si algo falla

2. **Mensajes Descriptivos**
   - Explica QUÉ cambió y POR QUÉ
   - Mala práctica: `git commit -m "cambios"`
   - Buena práctica: `git commit -m "feat: añadir validación de email en registro"`

3. **Prueba Antes de Push**
   - Siempre verifica que funcione localmente
   - Ejecuta `npm run build` antes de push

4. **Mantén .env Actualizado**
   - No commitees `.env` (debe estar en `.gitignore`)
   - Actualiza `.env.example` cuando agregues nuevas variables

5. **Monitorea Deployments**
   - Después de cada push, verifica que el deployment sea exitoso
   - Prueba la app en producción después del deployment

---

## 🆘 Obtener Ayuda

### Logs de Desarrollo
```bash
# Ver logs del backend
npm run server

# Los logs aparecerán en la terminal
```

### Logs de Producción
1. Ve a Digital Ocean Dashboard
2. Selecciona tu app
3. Click en "Runtime Logs" para ver logs en tiempo real
4. Click en "Build Logs" para ver logs del build

### Recursos
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
- [Digital Ocean Docs](https://docs.digitalocean.com/products/app-platform/)

---

## ✅ Checklist Diario

Antes de terminar tu sesión de desarrollo:

- [ ] ✅ Todos los cambios commiteados
- [ ] ✅ Push realizado a GitHub
- [ ] ✅ Deployment verificado en Digital Ocean
- [ ] ✅ App funciona correctamente en producción
- [ ] ✅ No hay errores en los logs

---

**¡Happy Coding! 🚀**
