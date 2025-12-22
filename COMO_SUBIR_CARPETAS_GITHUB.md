# 📁 Cómo Subir Carpetas y Archivos a GitHub

## ⚠️ Importante
GitHub NO permite crear carpetas vacías. Las carpetas se crean automáticamente cuando subes archivos dentro de ellas.

## Método 1: Crear Archivo con Ruta Completa (Recomendado)

### Paso 1: Crear el archivo con la ruta completa

1. Ve a tu repositorio: https://github.com/MaximoGamba/DemoEcommers
2. Click en **"Add file"** → **"Create new file"**
3. En el campo de nombre, escribe la **ruta completa** incluyendo la carpeta:

**Ejemplo para crear `demo/pom.xml`:**
```
demo/pom.xml
```

GitHub creará automáticamente la carpeta `demo/` si no existe.

### Paso 2: Agregar el contenido

4. Pega el contenido del archivo en el editor
5. Scroll hacia abajo y click en **"Commit new file"**
6. Repite para cada archivo

---

## Método 2: Upload Files con Estructura (Más Rápido)

### Si tienes muchos archivos:

1. Click en **"Add file"** → **"Upload files"**
2. Para cada archivo, GitHub te permite escribir la ruta antes del nombre:

**Ejemplo:**
- Escribe en el nombre: `demo/pom.xml`
- O arrastra el archivo y luego edita la ruta

---

## Método 3: Usar Git desde la Terminal (Más Profesional)

Si prefieres usar comandos (más rápido para muchos archivos):

```powershell
# 1. Inicializar git (si no lo hiciste)
cd "C:\Users\maxim\OneDrive\Escritorio\Nueva carpeta\Trabajo\DemoEcommers\Codigo"
git init

# 2. Conectar con tu repositorio
git remote add origin https://github.com/MaximoGamba/DemoEcommers.git

# 3. Agregar todos los archivos (respeta .gitignore)
git add .

# 4. Hacer commit
git commit -m "Initial commit - subir proyecto completo"

# 5. Subir a GitHub
git branch -M main
git push -u origin main
```

---

## 📝 Ejemplo Paso a Paso: Crear la Estructura `demo/src/main/java/`

Si quieres crear `demo/src/main/java/ecommersDemo/demo/BackendApplication.java`:

1. Click en **"Add file"** → **"Create new file"**
2. Escribe en el nombre:
   ```
   demo/src/main/java/ecommersDemo/demo/BackendApplication.java
   ```
3. GitHub creará automáticamente todas las carpetas: `demo/` → `src/` → `main/` → `java/` → `ecommersDemo/` → `demo/`
4. Pega el contenido del archivo
5. Click en **"Commit new file"**

---

## 🎯 Recomendación

Para tu proyecto, te recomiendo:

1. **Empezar con los archivos de configuración importantes:**
   - `.gitignore` (en la raíz)
   - `demo/pom.xml`
   - `frontend/package.json`

2. **Luego subir los archivos fuente uno por uno o usar Git desde terminal**

3. **Si tienes muchos archivos, usar Git desde terminal es más eficiente**

---

## ⚡ Atajo Rápido

Si ya tienes Git instalado y configurado, usa estos comandos desde PowerShell en tu carpeta del proyecto:

```powershell
git init
git remote add origin https://github.com/MaximoGamba/DemoEcommers.git
git add .
git commit -m "Initial commit"
git branch -M main
git push -u origin main
```

Esto subirá TODO automáticamente respetando los `.gitignore`.


