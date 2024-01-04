import react from '@vitejs/plugin-react'
import { promises as fs } from 'node:fs'
import { defineConfig, Plugin } from 'vite'

const base = process.env.BASE || '/'

function ssrPlugin(): Plugin {
  return {
    name: 'ssrPlugin',

    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url !== '/') {
          return next()
        }

        const { renderStream } = await server.ssrLoadModule('/src/entry-server')

        const indexHtml = await fs.readFile('./index.html', 'utf-8')
        const url = req.originalUrl.replace(base, '')
        const template = await server.transformIndexHtml(url.toString(), indexHtml)

        /**
         * Scrape out `head` contents injected by Vite. This is used for React runtime and fast refresh.
         * It will be injected into the `<Html>` React component shell in the server entrypoint.
         */
        const head = template.match(/<head>(.+?)<\/head>/s)[1]

        return renderStream({ res, head })
      })
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ssrPlugin(),
  ]
})
