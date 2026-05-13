import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'docs',        // ← This is the key change
    emptyOutDir: true,
  },
  base: '/',               // Important for custom domain
})
