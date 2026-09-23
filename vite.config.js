import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const githubPages = process.env.GITHUB_PAGES === 'true'

export default defineConfig({
  base: githubPages ? '/Peque-os-Escritores/' : '/',
  plugins: [react()],
  build: {
    sourcemap: true,
  },
})
