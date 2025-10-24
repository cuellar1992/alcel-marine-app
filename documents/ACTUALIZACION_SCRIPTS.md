# Actualización de Scripts - Corrección Aplicada

## Problema Resuelto

El script `npm run dev:full` estaba fallando porque ejecutaba `server/index.js` directamente, pero las variables de entorno ahora se cargan desde `server/start.js`.

## Cambios Realizados

### ✅ package.json Actualizado

**Antes:**
```json
"server": "nodemon server/index.js"
```

**Después:**
```json
"server": "nodemon server/start.js"
```

## Comandos Disponibles

### Opción 1: Desarrollo Completo (Frontend + Backend)
```bash
npm run dev:full
```
- Inicia frontend en `http://localhost:5173`
- Inicia backend en `http://localhost:5000`
- Hot-reload en ambos

### Opción 2: Solo Frontend
```bash
npm run dev
```

### Opción 3: Solo Backend (con nodemon)
```bash
npm run server
```

### Opción 4: Solo Backend (sin nodemon)
```bash
cd server
node start.js
```

## Verificación

Ahora `npm run dev:full` debería mostrar:

**Backend:**
```
✅ Environment variables loaded successfully
📝 Loaded 7 environment variables
🚀 Server running on port 5000
📡 API available at http://localhost:5000/api
✅ MongoDB Connected: ac-h2rle5o-shard-00-00.t3ocikw.mongodb.net
📊 Database: alcel-marine
```

**Frontend:**
```
VITE v5.4.20  ready in 408 ms

➜  Local:   http://localhost:5173/
➜  Network: http://192.168.3.15:5173/
```

## Credenciales de Prueba

- **Email:** admin@alcel.com
- **Password:** admin123
- **Rol:** admin

## Importante

⚠️ Siempre usa:
- `npm run dev:full` - Para desarrollo completo
- `npm run server` - Para backend con hot-reload
- `node server/start.js` - Para backend sin hot-reload

❌ NO uses:
- `node server/index.js` - No cargará las variables de entorno
- `npm run dev` en la carpeta server - No existe ese script

## Solución de Problemas

Si ves el error:
```
❌ MongoDB Connection Error: The `uri` parameter to `openUri()` must be a string, got "undefined"
```

**Causa:** Estás ejecutando `index.js` directamente sin cargar las variables de entorno.

**Solución:** Usa `npm run dev:full` o `node server/start.js`
