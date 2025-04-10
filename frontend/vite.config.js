import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// eslint-disable-next-line no-undef
const projectRoot = __dirname
const finalDir = path.resolve(projectRoot, '../bundle final')

// Compila el proyecto en la carpeta bundle final

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'ignore-pem',
      transform(code, id) {
        if (id.endsWith('.pem')) {
          // Retorna un módulo vacío para los archivos .pem
          return {
            code: '',
            map: null,
          }
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
  }
})
