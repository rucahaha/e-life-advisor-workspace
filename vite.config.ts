import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repository = process.env.GITHUB_REPOSITORY?.split('/')[1]
const owner = process.env.GITHUB_REPOSITORY?.split('/')[0]
const inferredBase = repository && owner
  ? (repository === `${owner}.github.io` ? '/' : `/${repository}/`)
  : '/'

export default defineConfig({
  base: process.env.VITE_BASE_PATH || inferredBase,
  plugins: [react()],
})
