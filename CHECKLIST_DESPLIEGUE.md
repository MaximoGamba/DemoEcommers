# ✅ Checklist de Despliegue

Usa este checklist para asegurarte de completar todos los pasos.

## 📦 Preparación

- [ ] Código subido a GitHub
- [ ] Repositorio creado en GitHub
- [ ] Tienes acceso a tu cuenta de GitHub

## 🔧 Backend (Render.com)

- [ ] Cuenta creada en [render.com](https://render.com)
- [ ] Repositorio conectado en Render
- [ ] Web Service creado con estos datos:
  - [ ] Name: `demo-ecommerce-backend`
  - [ ] Build Command: `cd demo && ./mvnw clean package -DskipTests`
  - [ ] Start Command: `cd demo && java -jar target/demo-0.0.1-SNAPSHOT.jar`
  - [ ] Environment Variable: `JAVA_VERSION=21`
- [ ] Backend desplegado exitosamente
- [ ] URL del backend guardada: `https://________________.onrender.com`
- [ ] Backend probado (abrir `/api/productos` en navegador)

## 🎨 Frontend (GitHub Pages)

- [ ] `gh-pages` instalado: `npm install --save-dev gh-pages` (en carpeta frontend)
- [ ] Archivo `.env` creado en `frontend/` con:
  ```env
  VITE_API_URL=https://TU-BACKEND-URL.onrender.com/api
  ```
- [ ] Nombre del repositorio actualizado en:
  - [ ] `frontend/vite.config.js` (línea 10)
  - [ ] `frontend/src/App.jsx` (línea 26)
  - [ ] `frontend/404.html` (línea 12)
- [ ] Frontend desplegado: `npm run deploy` (en carpeta frontend)
- [ ] GitHub Pages activado en Settings → Pages
- [ ] Rama `gh-pages` seleccionada como fuente
- [ ] URL del frontend guardada: `https://________________.github.io/________________/`

## 🔗 Conexión

- [ ] Frontend puede comunicarse con el backend
- [ ] Productos se cargan correctamente en el frontend
- [ ] Navegación funciona (rutas no dan 404)
- [ ] Consola del navegador sin errores de CORS

## ✨ Verificación Final

- [ ] Sitio completo funciona end-to-end
- [ ] Puedes navegar por categorías
- [ ] Puedes ver detalles de productos
- [ ] Carrito funciona (si está implementado)
- [ ] Todo se ve bien en móvil y desktop

## 📝 URLs Finales

**Backend:**
```
https://________________.onrender.com
```

**Frontend:**
```
https://________________.github.io/________________/
```

**API Base:**
```
https://________________.onrender.com/api
```

---

## 🆘 Si algo no funciona

1. Revisa los logs en Render (dashboard → tu servicio → Logs)
2. Revisa la consola del navegador (F12)
3. Verifica que las URLs sean correctas
4. Consulta [GUIA_DESPLIEGUE_COMPLETA.md](./GUIA_DESPLIEGUE_COMPLETA.md) para más detalles


