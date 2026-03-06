import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',          // 🔴 ESTO ES CLAVE
  plugins: [react()],
  build: {
    outDir: 'dist'
  }
})
