# Configuración de Dominio Personalizado - operations.alcelmarine.com.au

## 🎯 Objetivo
Configurar el subdominio `operations.alcelmarine.com.au` para que apunte a la aplicación en Digital Ocean.

---

## 📋 Información General

### Dominio Actual:
- **Dominio principal**: `alcelmarine.com.au`
- **Registrador**: registry.com
- **Subdominio deseado**: `operations.alcelmarine.com.au`
- **Hosting**: Digital Ocean App Platform

---

## 🚀 Paso a Paso

### Parte 1: Configurar en Digital Ocean (5 minutos)

#### Paso 1: Ingresar a tu App
1. Ve a: https://cloud.digitalocean.com
2. Inicia sesión
3. Ve a tu app: `alcel-marine-app`

#### Paso 2: Agregar Dominio
1. En el menú lateral de tu app, click en **"Settings"**
2. Desplázate hasta la sección **"Domains"**
3. Click en **"Add Domain"**

#### Paso 3: Ingresar el Subdominio
1. En el campo "Domain", ingresa:
   ```
   operations.alcelmarine.com.au
   ```
2. Click en **"Continue"**

#### Paso 4: SELECCIONA "You manage your domain" ⚠️ IMPORTANTE
Verás dos opciones:

- ❌ "We manage your domain" - NO seleccionar esta
- ✅ **"You manage your domain"** - ✅ SELECCIONA ESTA

**Selecciona "You manage your domain"** porque:
- Tu dominio está en registry.com y quieres mantenerlo ahí
- Solo necesitas agregar un registro DNS adicional
- No necesitas cambiar los nameservers

3. Click en **"Continue"** o **"Next"**

#### Paso 5: Copiar las Instrucciones DNS
Digital Ocean te mostrará algo como:

```
⚠️ You need to add a CNAME record pointing to: app-xxxxx.ondigitalocean.app
```

O puede pedir un registro A que apunte a una IP.

**IMPORTANTE**: Copia exactamente el valor que te da:
- Puede ser un CNAME (ej: `app-xxxxx.ondigitalocean.app`)
- O una IP (ej: `143.xxx.xxx.xxx`)

Este valor lo necesitarás en registry.com.

#### Paso 6: Finalizar en Digital Ocean
1. Click en **"Add Domain"** o **"Finalize"**
2. Una vez agregado el dominio en Digital Ocean
3. El estado inicial será: **"Verifying..."**
4. NO estará activo hasta que configures DNS en registry.com

---

### Parte 2: Configurar DNS en registry.com (10 minutos)

#### Paso 1: Ingresar a tu Panel
1. Ve a: https://www.registry.com
2. Inicia sesión con tus credenciales
3. Ve al panel de administración de dominios

#### Paso 2: Administrar DNS
1. Busca el dominio: `alcelmarine.com.au`
2. Click en **"Manage"** o **"DNS Settings"**

**Nota**: Si no encuentras esta opción, busca:
- "DNS Records"
- "Advanced DNS"
- "DNS Management"
- "DNS Settings"

#### Paso 3: Agregar Registro DNS

Digital Ocean te habrá dado una de estas dos opciones:

**Opción A: Si te da un CNAME** (más común)
```
Type: CNAME
Name/Host: operations
Value/Target: [el valor que te dio Digital Ocean]
TTL: 3600 (o auto)
```

**Opción B: Si te da una IP**
```
Type: A
Name/Host: operations
Value/Target: [IP que te dio Digital Ocean]
TTL: 3600 (o auto)
```

#### Paso 4: Guardar los Cambios
1. Click en **"Save"** o **"Update"**
2. Los cambios pueden tardar unos minutos en procesarse

---

### Parte 3: Esperar Propagación (5-30 minutos)

#### Qué Esperar:
1. **Digital Ocean** comenzará a generar el certificado SSL automáticamente
2. El tiempo típico es de **10-30 minutos**
3. Puedes verificar el estado en Digital Ocean:
   - Settings → Domains → operations.alcelmarine.com.au
   - El estado cambiará de "Verifying..." a "Active" cuando esté listo

#### Verificar el Estado:
En Digital Ocean, verás:
- 🔄 **Verifying** - Esperando configuración DNS
- 🟡 **Processing** - Generando certificado SSL
- 🟢 **Active** - ¡Listo para usar!

---

## ✅ Verificar que Todo Funcione

### Paso 1: Verificar DNS (opcional)
Ejecuta en terminal:
```bash
nslookup operations.alcelmarine.com.au
```
Deberías ver la IP de Digital Ocean o el CNAME.

### Paso 2: Probar la URL
1. Espera a que el estado en Digital Ocean sea "Active"
2. Ve a: https://operations.alcelmarine.com.au
3. ¡Tu app debería cargar!

### Paso 3: Verificar SSL
1. El certificado SSL se genera automáticamente
2. Debe mostrar 🔒 en el navegador
3. La conexión debe ser segura (HTTPS)

---

## 📊 Estados en Digital Ocean

### Estado: Pending
**Significa**: Digital Ocean está esperando que agregues el registro DNS en registry.com
**Solución**: Ve a registry.com y agrega el registro CNAME

### Estado: Configuring 🔄
**Significa**: Digital Ocean detectó el DNS y está generando el certificado SSL
**Solución**: Espera 10-30 minutos, todo va bien

### Estado: Processing
**Significa**: Finalizando la generación del certificado SSL
**Solución**: Espera 10-30 minutos, casi listo

### Estado: Active ✅
**Significa**: ¡Todo configurado! El dominio funciona
**Solución**: Ninguna, ya está listo

---

## 🔄 Después de Configurar

### La App Ahora Está Disponible en:
- **URL anterior (Digital Ocean)**: 
  ```
  https://alcel-marine-app-xxxxx.ondigitalocean.app
  ```
- **URL nueva (personalizada)**: 
  ```
  https://operations.alcelmarine.com.au
  ```

### Ambas URLs Funcionarán:
- La URL de Digital Ocean seguirá funcionando
- La URL personalizada también funcionará
- Puedes usar cualquiera de las dos
- **Recomendado**: Usa la URL personalizada para producción

---

## 🐛 Troubleshooting

### Problema 1: "Domain Verification Failed"

**Síntomas**:
- Digital Ocean no puede verificar el dominio
- Estado se mantiene en "Verifying..."

**Soluciones**:
1. Verifica que el registro DNS esté correcto:
   ```bash
   nslookup operations.alcelmarine.com.au
   ```
2. Asegúrate de que:
   - El registro CNAME/A esté apuntando a lo que te dio Digital Ocean
   - El TTL no sea muy alto (3600 o menos)
3. Espera 30-60 minutos para la propagación DNS
4. En Digital Ocean: Settings → Domains → Click en "Retry Verification"

---

### Problema 2: "SSL Certificate Generation Failed"

**Síntomas**:
- El dominio se verifica pero SSL falla

**Soluciones**:
1. Espera 30-60 minutos (la generación puede tardar)
2. En Digital Ocean: Settings → Domains → Click en "Regenerate Certificate"
3. Si sigue fallando, verifica que:
   - El DNS esté correcto
   - El dominio no tenga otros registros CAA que bloqueen Let's Encrypt

---

### Problema 3: "App No Carga"

**Síntomas**:
- El dominio está "Active" pero la app no carga
- Error 502 o timeout

**Soluciones**:
1. Verifica que la app en Digital Ocean esté "Active"
2. Revisa los Runtime Logs en Digital Ocean
3. Prueba la URL original de Digital Ocean (debe funcionar)
4. Si la URL original funciona pero la personalizada no:
   - Espera 10 minutos más
   - Verifica que el DNS esté propagado completamente

---

### Problema 4: "404 Not Found" en Subdirectorios

**Síntomas**:
- La página principal carga
- Pero rutas como `/api/health` dan 404

**Soluciones**:
1. Verifica la configuración del build en Digital Ocean
2. Asegúrate de que el servidor responda en todas las rutas
3. Revisa la configuración de publicPath en vite.config.js

---

## 📝 Notas Importantes

### Cambios en registry.com
1. **No elimines** la configuración de DNS
2. Si cambias el registro, espera 30-60 minutos
3. Siempre copia los valores exactos que da Digital Ocean

### Cambios en Digital Ocean
1. Una vez configurado, **NO necesitas** cambiar nada más
2. El certificado SSL se renueva automáticamente
3. El auto-deploy seguirá funcionando normalmente

### Mantenimiento
- No hay mantenimiento adicional necesario
- Digital Ocean maneja automáticamente:
  - Renovación de certificados SSL
  - Actualización de DNS
  - Monitoreo de dominio

---

## 🎉 ¡Configuración Completa!

Una vez que el estado en Digital Ocean sea **"Active"**, tu app estará disponible en:

### 🌐 URL de Producción:
```
https://operations.alcelmarine.com.au
```

### ✅ Beneficios:
- URL profesional y personalizada
- SSL automático (HTTPS seguro)
- Fácil de recordar
- Sin costo adicional
- Fácil mantenimiento

---

## 📞 ¿Necesitas Ayuda?

### Si no puedes configurar DNS en registry.com:
1. Contacta a registry.com support
2. Pídeles que agreguen el registro CNAME/A
3. Proporciónales:
   - Tipo: CNAME (o A)
   - Name: operations
   - Target: [valor de Digital Ocean]

### Recursos:
- **Digital Ocean Docs**: https://docs.digitalocean.com/products/app-platform/how-to/manage-domains/
- **registry.com Support**: https://www.registry.com/support

---

## 🔄 Próximos Pasos Sugeridos

1. **Actualizar** enlaces internos de la app a la nueva URL
2. **Configurar** redirecciones (opcional) de la URL anterior a la nueva
3. **Actualizar** documentación con la nueva URL
4. **Comunicar** a usuarios la nueva URL de acceso

¡Buena suerte con la configuración! 🚀

