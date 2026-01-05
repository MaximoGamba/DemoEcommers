# Despliegue Manual a GitHub Pages

Si `gh-pages` tiene problemas de conexión, puedes desplegar manualmente con Git.

## Pasos:

1. **Asegúrate de estar en la carpeta frontend:**

   ```powershell
   cd "C:\Users\maxim\OneDrive\Escritorio\Nueva carpeta\Trabajo\DemoEcommers\Codigo\frontend"
   ```

2. **Haz el build (si no lo hiciste):**

   ```powershell
   npm run build
   ```

3. **Sube la carpeta dist a la rama gh-pages:**

   ```powershell
   cd dist
   git init
   git add .
   git commit -m "Deploy frontend to GitHub Pages"
   git branch -M gh-pages
   git remote add origin https://github.com/MaximoGamba/DemoEcommers.git
   git push -u origin gh-pages --force
   ```

4. **Activa GitHub Pages:**
   - Ve a: https://github.com/MaximoGamba/DemoEcommers/settings/pages
   - Source: `gh-pages` branch
   - Folder: `/ (root)`
   - Save

