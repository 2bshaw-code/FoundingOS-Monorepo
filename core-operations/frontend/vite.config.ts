/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': '/Users/bobbyshaw/Desktop/whatsapp-retail-os/founder-os-group/shared',
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5210,
    strictPort: true,
  },
})
