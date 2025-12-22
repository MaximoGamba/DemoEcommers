# Guía de Despliegue en GitHub Pages

Esta guía te ayudará a desplegar el frontend de tu aplicación en GitHub Pages.

## Prerequisitos

1. Tener una cuenta de GitHub
2. Tener el proyecto subido a un repositorio de GitHub
3. Tener Node.js y npm instalados

## Pasos para Desplegar

### 1. Instalar gh-pages (si no lo tienes instalado)

```bash
npm install --save-dev gh-pages
```

### 2. Configurar el nombre del repositorio

**IMPORTANTE**: Debes actualizar el nombre del repositorio en dos archivos:

1. **`vite.config.js`**: Cambia `/DemoEcommers/` por el nombre de tu repositorio
   ```js
   base: process.env.NODE_ENV === 'production' ? '/TU-REPO-NAME/' : '/',
   ```

2. **`src/App.jsx`**: Cambia `/DemoEcommers` por el nombre de tu repositorio
   ```js
   const basename = import.meta.env.PROD ? '/TU-REPO-NAME' : '';
   ```

### 3. Configurar la URL del Backend

Crea un archivo `.env` en la carpeta `frontend` con la URL de tu backend:

```env
VITE_API_URL=https://tu-backend-url.com/api
```

Si no tienes backend desplegado aún, puedes usar:
```env
VITE_API_URL=http://localhost:8080/api
```

### 4. Construir y Desplegar

```bash
cd frontend
npm run deploy
```

Este comando:
- Construye la aplicación para producción
- Crea una rama `gh-pages` en tu repositorio
- Sube los archivos estáticos a GitHub Pages

### 5. Activar GitHub Pages en tu Repositorio

1. Ve a tu repositorio en GitHub
2. Click en **Settings** (Configuración)
3. En el menú lateral, click en **Pages**
4. En **Source**, selecciona la rama `gh-pages` y la carpeta `/ (root)`
5. Click en **Save**

### 6. Esperar el Despliegue

GitHub Pages puede tardar unos minutos en desplegar tu sitio. Una vez listo, tu sitio estará disponible en:

```
https://TU-USUARIO.github.io/TU-REPO-NAME/
```

## Actualizar el Despliegue

Cada vez que hagas cambios y quieras actualizar el sitio:

```bash
cd frontend
npm run deploy
```

## Solución de Problemas

### Las rutas no funcionan (404)

- Asegúrate de que el archivo `404.html` esté en la carpeta `dist` después del build
- Verifica que el `basename` en `App.jsx` coincida con el nombre de tu repositorio

### Las imágenes no se cargan

- Verifica que las rutas de las imágenes sean relativas o usen el base path correcto

### El backend no responde

- Verifica que la variable `VITE_API_URL` en `.env` tenga la URL correcta de tu backend
- Asegúrate de que tu backend tenga CORS configurado para permitir requests desde GitHub Pages

## Notas Importantes

- GitHub Pages solo sirve archivos estáticos (HTML, CSS, JS)
- El backend debe estar desplegado en otro servicio (Render, Railway, Heroku, etc.)
- Si cambias el nombre del repositorio, recuerda actualizar `vite.config.js` y `App.jsx`


