import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        triangle: resolve(__dirname, 'lib/scenes/triangle/page.html')
      }
    }
  }
})
