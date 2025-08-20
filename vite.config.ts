import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const BASE = process.env.VITE_BASE || '/fitness-coach/'

export default defineConfig({
  plugins: [react()],
  base: BASE,
})
