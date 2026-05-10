import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        editor: resolve(__dirname, 'src/pages/editor.html'),
        signup: resolve(__dirname, 'src/pages/signup.html'),
      }
    }
  },
  server: {
    port: 3000,
    strictPort: false,
    open: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})