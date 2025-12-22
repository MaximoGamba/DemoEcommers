# 🚀 Guía Completa de Despliegue - Paso a Paso

Esta guía te llevará paso a paso para desplegar tu aplicación completa (backend + frontend).

## 📋 Índice
1. [Preparar el Proyecto](#1-preparar-el-proyecto)
2. [Subir el Backend a Render.com](#2-subir-el-backend-a-rendercom)
3. [Subir el Frontend a GitHub Pages](#3-subir-el-frontend-a-github-pages)
4. [Conectar Frontend con Backend](#4-conectar-frontend-con-backend)
5. [Verificar que Todo Funcione](#5-verificar-que-todo-funcione)

---

## 1. Preparar el Proyecto

### 1.1 Subir tu código a GitHub

Si aún no tienes tu código en GitHub:

1. **Crea un repositorio en GitHub:**
   - Ve a [github.com](https://github.com)
   - Click en "New repository"
   - Nombre: `DemoEcommers` (o el que prefieras)
   - Público o Privado (público es gratis para GitHub Pages)
   - NO marques "Initialize with README" (si ya tienes código)
   - Click en "Create repository"

2. **Sube tu código:**
   ```bash
   # En la raíz de tu proyecto
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
   git push -u origin main
   ```

   ⚠️ **IMPORTANTE**: Reemplaza `TU-USUARIO` y `TU-REPO` con tus datos reales.

---

## 2. Subir el Backend a Render.com

### 2.1 Crear cuenta en Render

1. Ve a [render.com](https://render.com)
2. Click en "Get Started for Free"
3. Regístrate con GitHub (recomendado) o email

### 2.2 Crear un nuevo Web Service

1. En el dashboard de Render, click en **"New +"** → **"Web Service"**
2. Conecta tu repositorio de GitHub (si no está conectado, autoriza Render)
3. Selecciona tu repositorio `DemoEcommers`

### 2.3 Configurar el Backend

Completa el formulario con estos datos:

- **Name**: `demo-ecommerce-backend` (o el nombre que prefieras)
- **Environment**: `Java`
- **Build Command**: `cd demo && ./mvnw clean package -DskipTests`
- **Start Command**: `cd demo && java -jar target/demo-0.0.1-SNAPSHOT.jar`
- **Plan**: `Free` (gratis)

### 2.4 Variables de Entorno

En la sección "Environment Variables", agrega:

```
JAVA_VERSION=21
```

### 2.5 Crear el Servicio

1. Click en **"Create Web Service"**
2. Render comenzará a construir y desplegar tu backend
3. Esto puede tardar 5-10 minutos la primera vez

### 2.6 Obtener la URL del Backend

Una vez desplegado, Render te dará una URL como:
```
https://demo-ecommerce-backend.onrender.com
```

**⚠️ IMPORTANTE**: Guarda esta URL, la necesitarás para el frontend.

### 2.7 Notas sobre el Backend

- El backend usa H2 en memoria, así que los datos se recargan cada vez que se reinicia
- Render puede "dormir" servicios gratuitos después de 15 minutos de inactividad
- La primera petición después de dormir puede tardar ~30 segundos (está "despertando")

---

## 3. Subir el Frontend a GitHub Pages

### 3.1 Instalar gh-pages

```bash
cd frontend
npm install --save-dev gh-pages
```

### 3.2 Actualizar el Nombre del Repositorio

**IMPORTANTE**: Si tu repositorio NO se llama "DemoEcommers", actualiza estos archivos:

1. **`frontend/vite.config.js`** (línea 10):
   ```js
   base: process.env.NODE_ENV === 'production' ? '/TU-REPO-NAME/' : '/',
   ```

2. **`frontend/src/App.jsx`** (línea 26):
   ```js
   const basename = import.meta.env.PROD ? '/TU-REPO-NAME' : '';
   ```

3. **`frontend/404.html`** (línea 12):
   ```js
   var repoName = '/TU-REPO-NAME';
   ```

### 3.3 Configurar la URL del Backend

Crea un archivo `.env` en la carpeta `frontend`:

```bash
cd frontend
```

Crea el archivo `.env` con este contenido:

```env
VITE_API_URL=https://TU-BACKEND-URL.onrender.com/api
```

**⚠️ IMPORTANTE**: Reemplaza `TU-BACKEND-URL` con la URL real de tu backend de Render.

### 3.4 Construir y Desplegar

```bash
npm run deploy
```

Este comando:
- Construye la aplicación para producción
- Crea una rama `gh-pages` en tu repositorio
- Sube los archivos estáticos a GitHub Pages

### 3.5 Activar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Click en **Settings** (Configuración)
3. En el menú lateral, click en **Pages**
4. En **Source**, selecciona:
   - Branch: `gh-pages`
   - Folder: `/ (root)`
5. Click en **Save**

### 3.6 Obtener la URL del Frontend

Tu sitio estará disponible en:
```
https://TU-USUARIO.github.io/TU-REPO-NAME/
```

Esto puede tardar 1-2 minutos en estar disponible.

---

## 4. Conectar Frontend con Backend

### 4.1 Verificar que el Backend Funcione

Abre en tu navegador:
```
https://TU-BACKEND-URL.onrender.com/api/productos
```

Deberías ver una respuesta JSON con los productos.

### 4.2 Actualizar el Frontend si es Necesario

Si cambiaste la URL del backend después de desplegar el frontend:

1. Actualiza el archivo `.env` en `frontend`:
   ```env
   VITE_API_URL=https://TU-BACKEND-URL.onrender.com/api
   ```

2. Vuelve a desplegar:
   ```bash
   cd frontend
   npm run deploy
   ```

### 4.3 Verificar CORS

El backend ya tiene CORS configurado con `@CrossOrigin(origins = "*")`, así que debería funcionar sin problemas.

---

## 5. Verificar que Todo Funcione

### 5.1 Probar el Frontend

1. Abre tu sitio en GitHub Pages
2. Deberías ver la página de inicio
3. Intenta navegar por las categorías
4. Verifica que los productos se carguen

### 5.2 Probar la Conexión Backend-Frontend

1. Abre las **Developer Tools** (F12)
2. Ve a la pestaña **Network** (Red)
3. Navega por el sitio
4. Deberías ver peticiones a `TU-BACKEND-URL.onrender.com/api/...`
5. Verifica que las respuestas sean exitosas (código 200)

### 5.3 Solución de Problemas Comunes

#### El frontend no carga productos
- Verifica que la URL del backend en `.env` sea correcta
- Verifica que el backend esté desplegado y funcionando
- Revisa la consola del navegador (F12) para ver errores

#### Error de CORS
- El backend ya tiene CORS configurado, pero si hay problemas, verifica que la URL del backend sea correcta

#### El backend está "dormido"
- Si el backend está en plan gratuito de Render, puede tardar ~30 segundos en responder la primera vez
- Esto es normal, solo espera un momento

#### Las rutas del frontend dan 404
- Verifica que el nombre del repositorio en `vite.config.js`, `App.jsx` y `404.html` sea correcto
- Asegúrate de que el archivo `404.html` esté en la carpeta `dist` después del build

---

## 📝 Resumen de URLs

Después de completar todos los pasos, tendrás:

- **Backend**: `https://TU-BACKEND-URL.onrender.com`
- **Frontend**: `https://TU-USUARIO.github.io/TU-REPO-NAME/`
- **API Base**: `https://TU-BACKEND-URL.onrender.com/api`

---

## 🔄 Actualizar el Despliegue

### Para actualizar el Backend:
1. Haz cambios en tu código
2. Haz commit y push a GitHub
3. Render detectará los cambios automáticamente y redesplegará

### Para actualizar el Frontend:
1. Haz cambios en tu código
2. Haz commit y push a GitHub
3. Ejecuta: `cd frontend && npm run deploy`
4. GitHub Pages se actualizará automáticamente

---

## 💡 Tips

- **Render Free Plan**: El backend puede "dormir" después de 15 min de inactividad. La primera petición puede tardar ~30 segundos.
- **GitHub Pages**: Es completamente gratis y muy rápido.
- **Variables de Entorno**: Usa `.env` para configuraciones que cambian entre desarrollo y producción.
- **Logs**: En Render puedes ver los logs del backend en tiempo real.

---

## 🎉 ¡Listo!

Tu aplicación debería estar funcionando completamente. Si tienes problemas, revisa la sección de "Solución de Problemas" o los logs en Render.


