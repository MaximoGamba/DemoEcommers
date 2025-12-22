# 📋 Lista de Archivos a Subir en GitHub

## ⚠️ IMPORTANTE: Cómo Crear las Carpetas

**NO crees archivos llamados "demo" o "frontend"**
**En su lugar, crea archivos con rutas como "demo/pom.xml"**

Cuando escribas el nombre del archivo en GitHub, incluye la carpeta:
- ✅ Correcto: `demo/pom.xml`
- ❌ Incorrecto: `demo` (esto crea un archivo, no una carpeta)

---

## 📁 Estructura a Crear

### Raíz del Repositorio
1. `.gitignore`
2. `GUIA_DESPLIEGUE_COMPLETA.md`
3. `README_DESPLIEGUE.md`
4. `CHECKLIST_DESPLIEGUE.md`
5. `ESPECIFICACIONES_IMAGENES_CARRUSEL.md`

### Carpeta `demo/`
1. `demo/.gitignore`
2. `demo/pom.xml`
3. `demo/mvnw`
4. `demo/mvnw.cmd`
5. `demo/render.yaml`
6. `demo/HELP.md` (si existe)

### Carpeta `demo/src/main/resources/`
1. `demo/src/main/resources/application.properties`
2. `demo/src/main/resources/application-prod.properties`
3. `demo/src/main/resources/data.sql`

### Carpeta `demo/src/main/java/ecommersDemo/demo/`
1. `demo/src/main/java/ecommersDemo/demo/BackendApplication.java`

### Carpeta `demo/src/main/java/ecommersDemo/demo/config/`
1. `demo/src/main/java/ecommersDemo/demo/config/SecurityConfig.java`

### Carpeta `demo/src/main/java/ecommersDemo/demo/controller/`
- Todos los archivos `.java` de esta carpeta

### Carpeta `demo/src/main/java/ecommersDemo/demo/model/`
- Todos los archivos `.java` de esta carpeta

### Carpeta `demo/src/main/java/ecommersDemo/demo/service/`
- Todos los archivos `.java` de esta carpeta

### Carpeta `demo/src/main/java/ecommersDemo/demo/repository/`
- Todos los archivos `.java` de esta carpeta

### Carpeta `demo/src/main/java/ecommersDemo/demo/dto/`
- Todos los archivos `.java` de esta carpeta (incluye subcarpetas)

### Carpeta `demo/src/main/java/ecommersDemo/demo/exception/`
- Todos los archivos `.java` de esta carpeta

### Carpeta `demo/src/test/`
- Todos los archivos de prueba

---

### Carpeta `frontend/`
1. `frontend/.gitignore`
2. `frontend/package.json`
3. `frontend/package-lock.json`
4. `frontend/vite.config.js`
5. `frontend/eslint.config.js`
6. `frontend/index.html`
7. `frontend/404.html`
8. `frontend/README.md`
9. `frontend/DEPLOY_GITHUB_PAGES.md`

### Carpeta `frontend/src/`
1. `frontend/src/main.jsx`
2. `frontend/src/App.jsx`
3. `frontend/src/index.css`
4. `frontend/src/App.css`

### Carpeta `frontend/src/components/`
- Todos los archivos `.jsx` y `.css` de componentes

### Carpeta `frontend/src/pages/`
- Todos los archivos `.jsx` y `.css` de páginas

### Carpeta `frontend/src/context/`
- Todos los archivos `.jsx` de contexto

### Carpeta `frontend/src/services/`
- Todos los archivos `.js` de servicios

### Carpeta `frontend/src/assets/`
- Todos los archivos de imágenes/assets

### Carpeta `frontend/public/`
- Todos los archivos públicos (como `vite.svg`)

---

## 💡 Tips

1. **Empieza con los archivos principales** para crear la estructura:
   - `demo/pom.xml`
   - `frontend/package.json`
   - `.gitignore` (en la raíz)

2. **Luego sube el código fuente** archivo por archivo

3. **GitHub crea las carpetas automáticamente** cuando subes un archivo con ruta como `demo/src/main/...`

4. **Para archivos dentro de carpetas anidadas**, escribe la ruta completa:
   - Ejemplo: `demo/src/main/java/ecommersDemo/demo/BackendApplication.java`
   - GitHub creará todas las carpetas necesarias: `demo/` → `src/` → `main/` → `java/` → etc.

---

## ⚡ Alternativa Rápida: Usar Git desde Terminal

Si tienes muchos archivos, es MÁS RÁPIDO usar Git desde la terminal. Ejecuta:

```powershell
cd "C:\Users\maxim\OneDrive\Escritorio\Nueva carpeta\Trabajo\DemoEcommers\Codigo"
git init
git remote add origin https://github.com/MaximoGamba/DemoEcommers.git
git add .
git commit -m "Initial commit"
git branch -M main
git push -u origin main
```

Esto subirá TODO automáticamente manteniendo la estructura correcta de carpetas.


