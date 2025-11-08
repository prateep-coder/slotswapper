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
          copyFileSync('public/redirects.txt', 'dist/_redirects')
          console.log('✅ _redirects file copied to dist/')
        } catch (e) {
          console.error('⚠️ Failed to copy _redirects:', e)
        }
      }
    }
  ],
})
