# Guía del Backend y Autenticación con PostgreSQL, Google, Hotmail y Correo

Este backend provee autenticación protegida (login y registro) y guardado de progreso para la **Plataforma de Juegos**.

Soporta:
1. **Google** (Google Identity Services / OAuth2)
2. **Microsoft / Hotmail / Outlook** (Microsoft Identity / OAuth2)
3. **Cualquier correo electrónico** (Hotmail, Gmail, Yahoo, institucional o privado) con contraseña protegida.

---

## 🛡️ Seguridad implementada
1. **Hash de contraseñas:** Implementado con `bcryptjs` (10 rondas de sal).
2. **Consultas parametrizadas:** Evitan ataques de **Inyección SQL (SQL Injection)** usando `$1, $2, ...` con la librería `pg`.
3. **Tokens JWT (JSON Web Tokens):** Sesiones firmadas criptográficamente con clave secreta y expiración de 7 días.
4. **Verificación de firmas de terceros:** Se verifican los tokens de Google y Microsoft antes de crear o autenticar al usuario en PostgreSQL.

---

## ⚙️ Estructura del Backend (`/server`)

* [server/index.js](file:///c:/PLATAFORMA%20DE%20JUEGOS/server/index.js): Servidor Express y configuración de rutas.
* [server/db.js](file:///c:/PLATAFORMA%20DE%20JUEGOS/server/db.js): Conexión a PostgreSQL (Pool) y creación/migración automática de tablas.
* [server/routes/auth.js](file:///c:/PLATAFORMA%20DE%20JUEGOS/server/routes/auth.js): Rutas `/register`, `/login`, `/google`, `/microsoft`, `/me`, `/progress`.
* [server/authMiddleware.js](file:///c:/PLATAFORMA%20DE%20JUEGOS/server/authMiddleware.js): Middleware para validar sesiones con JWT.
* [server/schema.sql](file:///c:/PLATAFORMA%20DE%20JUEGOS/server/schema.sql): Script SQL manual con la estructura completa.
* [server/.env](file:///c:/PLATAFORMA%20DE%20JUEGOS/server/.env): Variables de entorno locales y de producción.

---

## 🔑 Configuración de Google y Microsoft (Opcional para botones de 1 clic)

Para que los botones de **"Continuar con Google"** y **"Continuar con Hotmail / Outlook"** funcionen con un solo clic:

### 1. Google Client ID:
1. Ve a [Google Cloud Console](https://console.cloud.google.com/).
2. Crea un proyecto (o usa uno existente) y entra a **APIs & Services > Credentials**.
3. Crea una **OAuth client ID** de tipo **Web Application**.
4. Agrega los orígenes autorizados: `http://localhost:5173` (para local) y tu dominio en producción (ej. `https://tudominio.com`).
5. Copia el **Client ID** y colócalo en tu archivo `.env`:
   - En el backend (`server/.env`): `GOOGLE_CLIENT_ID=tu_cliente_id.apps.googleusercontent.com`
   - En el frontend (`.env`): `VITE_GOOGLE_CLIENT_ID=tu_cliente_id.apps.googleusercontent.com`

### 2. Microsoft / Hotmail Client ID:
1. Ve a [Azure Portal (Entra ID)](https://portal.azure.com/).
2. Entra a **App registrations** > **New registration**.
3. En tipos de cuenta, selecciona: **"Accounts in any organizational directory and personal Microsoft accounts (e.g. Skype, Xbox, Outlook.com, Hotmail.com)"**.
4. Agrega en **Redirect URIs** (Single-page application): `http://localhost:5173` y tu dominio en el VPS.
5. Copia el **Application (client) ID** y colócalo en el frontend `.env`:
   - `VITE_MICROSOFT_CLIENT_ID=tu_client_id_de_azure`

> **Nota:** Incluso antes de crear estas claves en Google/Microsoft, los usuarios pueden registrarse e iniciar sesión de inmediato escribiendo su dirección de correo (Hotmail, Gmail, etc.) y una contraseña en el formulario.

---

## 🚀 Cómo ejecutar en desarrollo local

1. **Configurar tu base de datos en `server/.env`:**
   ```env
   PORT=5000
   JWT_SECRET=tu_clave_secreta_aqui
   PGHOST=localhost
   PGPORT=5432
   PGUSER=postgres
   PGPASSWORD=tu_contraseña_local
   PGDATABASE=plataforma_juegos
   ```

2. **Iniciar el backend:**
   ```bash
   npm run server
   ```

3. **Iniciar el frontend en otra terminal:**
   ```bash
   npm run dev
   ```

---

## 🌐 Guía de Despliegue en tu VPS (Ubuntu/Debian)

### 1. Instalar PostgreSQL en el VPS
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib -y
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

### 2. Crear la base de datos y usuario en PostgreSQL
```bash
sudo -u postgres psql
```
Ejecuta:
```sql
CREATE DATABASE plataforma_juegos;
CREATE USER admin_juegos WITH ENCRYPTED PASSWORD 'tu_contraseña_segura';
GRANT ALL PRIVILEGES ON DATABASE plataforma_juegos TO admin_juegos;
\q
```

### 3. Configurar `.env` en el VPS
En `server/.env`:
```env
PORT=5000
JWT_SECRET=cadena_aleatoria_muy_larga_y_segura_para_produccion
PGHOST=localhost
PGPORT=5432
PGUSER=admin_juegos
PGPASSWORD=tu_contraseña_segura
PGDATABASE=plataforma_juegos
NODE_ENV=production
```

### 4. Mantener el backend corriendo con PM2
```bash
npm install -g pm2
cd /ruta/al/proyecto/server
npm install
pm2 start index.js --name "juegos-backend"
pm2 save
pm2 startup
```

### 5. Compilar el Frontend y servirlo con Nginx
```bash
cd /ruta/al/proyecto
npm install
npm run build
```
Configuración en Nginx (`/etc/nginx/sites-available/tudominio.conf`):
```nginx
server {
    server_name tudominio.com;

    location / {
        root /ruta/al/proyecto/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
```bash
sudo ln -s /etc/nginx/sites-available/tudominio.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```
