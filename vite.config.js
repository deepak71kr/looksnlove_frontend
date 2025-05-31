import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }]
        ]
      }
    })
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  base: '/',
  headers: {
    source: '/:path*',
    headers: [
      {
        key: 'Content-Security-Policy',
        value: "font-src 'self' *.vercel.com *.gstatic.com vercel.live data:;"
      }
    ]
  }
})
