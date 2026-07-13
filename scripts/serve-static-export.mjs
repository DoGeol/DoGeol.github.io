import { createServer } from 'node:http'
import { existsSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
}

export const resolveStaticExportFile = (outputDirectory, requestUrl) => {
  const pathname = decodeURIComponent(requestUrl.split(/[?#]/, 1)[0])
  if (pathname.split('/').includes('..')) throw new Error('안전하지 않은 경로입니다.')
  const relative = pathname.replace(/^\/+|\/+$/g, '')
  const candidate =
    relative === '' ? 'index.html' : path.extname(relative) === '' ? `${relative}.html` : relative
  const absolute = path.resolve(outputDirectory, candidate)
  const root = `${path.resolve(outputDirectory)}${path.sep}`
  if (absolute !== path.resolve(outputDirectory) && !absolute.startsWith(root)) {
    throw new Error('안전하지 않은 경로입니다.')
  }
  return absolute
}

export const createStaticExportServer = (outputDirectory) =>
  createServer((request, response) => {
    try {
      let file = resolveStaticExportFile(outputDirectory, request.url ?? '/')
      let status = 200
      if (!existsSync(file) || !statSync(file).isFile()) {
        file = path.join(outputDirectory, '404.html')
        status = 404
      }
      const body = readFileSync(file)
      response.writeHead(status, {
        'content-length': body.byteLength,
        'content-type': contentTypes[path.extname(file)] ?? 'application/octet-stream',
      })
      response.end(request.method === 'HEAD' ? undefined : body)
    } catch (error) {
      response.writeHead(400, { 'content-type': 'text/plain; charset=utf-8' })
      response.end(error instanceof Error ? error.message : 'Bad Request')
    }
  })

const isMain = process.argv[1]
  ? import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
  : false

if (isMain) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
  const portFlag = process.argv.indexOf('--port')
  const port = Number(
    portFlag === -1 ? (process.env.PLAYWRIGHT_PORT ?? '3100') : process.argv[portFlag + 1],
  )
  const host = '127.0.0.1'
  createStaticExportServer(path.join(root, 'out')).listen(port, host, () => {
    console.log(`Static export server: http://${host}:${port}`)
  })
}
