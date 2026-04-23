import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import markdownEvents from './src/plugins/markdown-events.js'
import { execSync } from 'node:child_process'

function resolveLastUpdatedAt() {
  if (process.env.LAST_UPDATED_AT) return process.env.LAST_UPDATED_AT

  try {
    return execSync('git log -1 --format=%cI', { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
  } catch {
    return new Date().toISOString()
  }
}

export default defineConfig({
  define: {
    __LAST_UPDATED_AT__: JSON.stringify(resolveLastUpdatedAt()),
  },
  plugins: [
    vue(),
    tailwindcss(),
    markdownEvents(),
  ],
})
