import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import markdownEvents from './src/plugins/markdown-events.js'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    markdownEvents(),
  ],
})
