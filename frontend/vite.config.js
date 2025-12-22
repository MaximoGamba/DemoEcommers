import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Configuración para GitHub Pages
  // Si tu repo se llama "DemoEcommers", el base será "/DemoEcommers/"
  // Si usas un dominio personalizado o repo con nombre diferente, cambia esto
  base: process.env.NODE_ENV === 'production' ? '/DemoEcommers/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
