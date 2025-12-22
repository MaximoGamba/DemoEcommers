# 🚀 Guía Rápida de Despliegue

## Resumen

Esta aplicación tiene dos partes:
- **Backend**: Spring Boot (Java) - Se despliega en Render.com
- **Frontend**: React + Vite - Se despliega en GitHub Pages

## ⚡ Inicio Rápido

### 1. Backend en Render.com

1. Ve a [render.com](https://render.com) y crea una cuenta
2. Click en "New +" → "Web Service"
3. Conecta tu repositorio de GitHub
4. Configura:
   - **Name**: `demo-ecommerce-backend`
   - **Build Command**: `cd demo && ./mvnw clean package -DskipTests`
   - **Start Command**: `cd demo && java -jar target/demo-0.0.1-SNAPSHOT.jar`
   - **Environment Variable**: `JAVA_VERSION=21`
5. Guarda la URL del backend (ej: `https://demo-ecommerce-backend.onrender.com`)

### 2. Frontend en GitHub Pages

1. Instala gh-pages:
   ```bash
   cd frontend
   npm install --save-dev gh-pages
   ```

2. Crea `.env` en `frontend/`:
   ```env
   VITE_API_URL=https://TU-BACKEND-URL.onrender.com/api
   ```

3. Actualiza el nombre del repo en:
   - `frontend/vite.config.js` (línea 10)
   - `frontend/src/App.jsx` (línea 26)
   - `frontend/404.html` (línea 12)

4. Despliega:
   ```bash
   npm run deploy
   ```

5. Activa GitHub Pages en Settings → Pages (rama `gh-pages`)

## 📚 Documentación Completa

Para una guía detallada paso a paso, consulta:
- **[GUIA_DESPLIEGUE_COMPLETA.md](./GUIA_DESPLIEGUE_COMPLETA.md)** - Guía completa con todos los detalles

## 🔗 URLs Después del Despliegue

- **Backend**: `https://TU-BACKEND-URL.onrender.com`
- **Frontend**: `https://TU-USUARIO.github.io/TU-REPO-NAME/`
- **API**: `https://TU-BACKEND-URL.onrender.com/api`

## ⚠️ Notas Importantes

- El backend usa H2 en memoria (datos se recargan al reiniciar)
- Render Free Plan puede "dormir" el backend después de 15 min de inactividad
- La primera petición después de dormir puede tardar ~30 segundos


