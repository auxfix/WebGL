import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        triangle: resolve(__dirname, 'triangle/index.html'),
        cube: resolve(__dirname, 'cube/index.html')
      }
    }
  }
})
