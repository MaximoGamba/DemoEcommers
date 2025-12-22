# Especificaciones para Imágenes del Carrusel (Home Page)

## 📐 Dimensiones Recomendadas

### Resolución Base (Desktop)
- **Ancho**: 1920px (Full HD)
- **Alto**: 800px - 1000px
- **Aspecto**: 16:9 o 21:9 (landscape/panorámico)

### Resolución Óptima (Pantallas Grandes)
- **Ancho**: 2560px (2K) o 3840px (4K)
- **Alto**: 1200px - 1500px
- **Aspecto**: 16:9 o 21:9

### Resolución Mínima
- **Ancho**: 1200px
- **Alto**: 500px
- **Aspecto**: 16:9

## 🎨 Formato de Archivo

### Formatos Recomendados (en orden de preferencia):
1. **WebP** (mejor compresión, mejor calidad)
   - Calidad: 85-90%
   - Tamaño aproximado: 200-400 KB por imagen

2. **JPEG** (compatible universalmente)
   - Calidad: 85-90%
   - Tamaño aproximado: 300-600 KB por imagen
   - Progresivo: Sí (mejor experiencia de carga)

3. **PNG** (solo si necesitas transparencia)
   - Calidad: Sin pérdida
   - Tamaño aproximado: 500 KB - 2 MB por imagen

## 📱 Consideraciones Responsive

El carrusel se adapta a diferentes tamaños:
- **Desktop**: 500px de alto
- **Tablet** (≤968px): 400px de alto
- **Móvil** (≤600px): 300px de alto

Las imágenes se escalan con `background-size: cover`, por lo que:
- Se recortan automáticamente en los lados si la proporción no coincide
- La parte central de la imagen siempre será visible
- **Recomendación**: Coloca el contenido importante en el centro de la imagen

## 🎯 Puntos Importantes

1. **Calidad vs Tamaño**: 
   - Usa calidad 85-90% para balance entre calidad y velocidad
   - Evita calidad 100% (aumenta el tamaño sin beneficio visible)

2. **Optimización**:
   - Comprime las imágenes antes de subirlas
   - Usa herramientas como TinyPNG, Squoosh, o ImageOptim
   - Considera usar WebP con fallback a JPEG

3. **Contenido de la Imagen**:
   - El carrusel tiene un overlay oscuro (gradiente) que oscurece las esquinas
   - El texto se muestra en el centro
   - **Evita** colocar texto importante en las esquinas de la imagen original
   - **Coloca** el contenido principal en el centro horizontal y vertical

4. **Proporción**:
   - El carrusel es más ancho que alto (landscape)
   - Evita imágenes verticales (portrait)
   - Usa imágenes horizontales/panorámicas

## 📋 Resumen Rápido

```
Formato: WebP o JPEG
Dimensiones: 1920x800px (mínimo) a 3840x1500px (óptimo)
Calidad: 85-90%
Tamaño archivo: 200-600 KB por imagen
Aspecto: 16:9 o 21:9 (landscape)
Contenido: Centrado, evita esquinas
```

## 🔧 Herramientas Recomendadas

- **Compresión**: TinyPNG, Squoosh, ImageOptim
- **Conversión a WebP**: Squoosh, CloudConvert
- **Edición**: Photoshop, GIMP, Canva
- **Validación**: Verifica que las imágenes se vean nítidas en pantallas 4K

## ⚠️ Problemas Comunes

1. **Imágenes pixeladas**: 
   - Causa: Resolución muy baja (< 1200px de ancho)
   - Solución: Usa imágenes de al menos 1920px de ancho

2. **Carga lenta**:
   - Causa: Archivos muy pesados (> 1 MB)
   - Solución: Comprime las imágenes, usa WebP

3. **Contenido cortado**:
   - Causa: Contenido importante en los bordes
   - Solución: Coloca contenido importante en el centro

4. **Imágenes verticales**:
   - Causa: Proporción incorrecta
   - Solución: Usa imágenes horizontales/panorámicas



