import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/directivas_viz/',
  server: {
    allowedHosts: [
      'lylip8-ip-80-28-53-229.tunnelmole.net'
    ]
  }
})