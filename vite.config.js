import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Forces vite to copy images to /dist instead of trying -and failing- to inline them
    assetsInlineLimit: 0,
  },
})
