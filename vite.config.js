import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'docs',        // ← This is what was missing
    emptyOutDir: true,
  },
  base: '/', 
})
