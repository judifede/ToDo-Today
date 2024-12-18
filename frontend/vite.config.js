import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// eslint-disable-next-line no-undef
const projectRoot = __dirname
const parentDir = path.resolve(projectRoot, '..')

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: parentDir,
    emptyOutDir: false,
    rollupOptions: {
      output: {
        entryFileNames: 'todotoday.js',
        chunkFileNames: 'todotoday.js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'todotoday[extname]'
          }
          return '[name].[extname]'
        }
      }
    }
  }
})
