import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'fs'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-redirects',
      closeBundle() {
        try {
          copyFileSync('public/_redirects', 'dist/_redirects')
          console.log('✅ _redirects file copied to dist/')
        } catch (e) {
          console.warn('⚠️ Could not copy _redirects file:', e)
        }
      }
    }
  ]
})
