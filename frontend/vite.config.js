import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import fs from 'fs'

// eslint-disable-next-line no-undef
const projectRoot = __dirname
const finalDir = path.resolve(projectRoot, '../bundle-final')

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'ignore-pem',
      transform(code, id) {
        if (id.endsWith('.pem')) {
          // Devuelve un módulo vacío para los archivos .pem
          return {
            code: '',
            map: null,
          }
        }
      },
    },
    {
      name: 'rename-index-html',
      closeBundle() {
        const indexPath = path.join(finalDir, 'index.html')
        const appPath = path.join(finalDir, 'app.html')

        if (fs.existsSync(indexPath)) {
          fs.renameSync(indexPath, appPath)
          console.log('index.html se cambia a app.html')
        } else {
          console.log('index.html no existe')
        }
      },
    },
  ],
  build: {
    outDir: finalDir,
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
  },
})
