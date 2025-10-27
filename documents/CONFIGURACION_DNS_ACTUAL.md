# Configuración DNS - operations.alcelmarine.com.au

## ✅ Información de Digital Ocean

**Dominio**: operations.alcelmarine.com.au  
**Tipo de registro**: CNAME  
**Alias**: coral-app-verwu.ondigitalocean.app

---

## 📝 Registro DNS a Agregar en registry.com

### Datos Exactos:
```
Tipo: CNAME
Nombre: operations
Valor: coral-app-verwu.ondigitalocean.app
TTL: 3600 (o Auto)
```

### Paso a Paso:
1. Ve a registry.com
2. Inicia sesión
3. Busca dominio: alcelmarine.com.au
4. Click en "Manage" o "DNS Settings"
5. Busca opciones como:
   - "DNS Records"
   - "Advanced DNS"
   - "DNS Management"
   - "Add Record"
6. Agrega el registro:
   - Name: operations
   - Type: CNAME
   - Target: coral-app-verwu.ondigitalocean.app
7. Guarda

---

## ⏱️ Tiempos de Espera

- DNS Propagation: 10-60 minutos
- SSL Certificate: 10-30 minutos
- Total: 20-90 minutos

---

## 🔍 Verificación

### 1. Verificar DNS (en terminal):
```bash
nslookup operations.alcelmarine.com.au
```

### 2. Verificar en Digital Ocean:
- Settings → Domains → operations.alcelmarine.com.au
- Estado debe cambiar a "Active" cuando esté listo

### 3. Probar URL:
- https://operations.alcelmarine.com.au
- Debe mostrar 🔒 (SSL activo)

---

## 📊 Estados en Digital Ocean

- 🔄 **Verifying** - Esperando DNS (tu situación actual)
- 🟡 **Processing** - Generando SSL
- 🟢 **Active** - ¡Listo para usar!

---

## ✅ Cuando Esté Listo

Tu app estará disponible en:
```
https://operations.alcelmarine.com.au
```

El certificado SSL será automático y renovará solo.

---

Creado: $(date)

