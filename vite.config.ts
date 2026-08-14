import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Served as a GitHub Pages project site at github.com/a-nnurag/GIZcode ->
  // a-nnurag.github.io/GIZcode/, so assets must resolve under that subpath.
  base: '/GIZcode/',
  plugins: [react(), tailwindcss()],
})
