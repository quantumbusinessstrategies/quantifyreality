import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'docs',      // ← Change this line
    emptyOutDir: true,
  },
  base: '/',             // Keep this
})
