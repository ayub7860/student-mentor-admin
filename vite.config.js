import { defineConfig, splitVendorChunkPlugin } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const buildVersion = new Date().toISOString()

export default defineConfig({
  plugins: [
    react(),
    splitVendorChunkPlugin(),
    VitePWA({
      buildCacheId: `Aditya-Anangha-${buildVersion}`,
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Aditya-Anangha',
        short_name: 'Aditya-Anangha',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        lang: 'en',
        scope: '/',
        description: 'Aditya-Anangha',
        form_factor: 'wide',
        theme_color: '#0284c7',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'favicon-error.png',
            sizes: '16x16',
            type: 'image/png'
          }
        ],
        id: '1',
        dir: 'ltr',
        orientation: 'natural',
        display_override: [
          'fullscreen',
          'browser',
          'standalone',
          'window-controls-overlay'
        ],
        categories: [
          'productivity'
        ]
      },
      registerType: 'auto',
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true
      }
    })
  ],
  base: '/',
  resolve: {
    alias: [{ find: '@', replacement: '/src' }]
  },
  server: {
    port: 6001,
    host: '0.0.0.0',
    strictPort: true,
    origin: 'http://localhost:6001',
    watch: {}
  },
  preview: {
    port: 6001,
    strictPort: true
  }
})
