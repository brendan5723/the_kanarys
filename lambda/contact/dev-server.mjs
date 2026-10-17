import http from 'node:http'
import { handler } from './index.mjs'

const port = Number(process.env.PORT || 3001)

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'content-type')
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  if (url.pathname !== '/contact') {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ ok: false, error: 'Not found' }))
    return
  }

  const body = await readBody(req)
  const result = await handler({
    requestContext: { http: { method: req.method } },
    body,
  })

  res.writeHead(result.statusCode, result.headers)
  res.end(result.body || '')
})

server.listen(port, '127.0.0.1', () => {
  console.log(`Contact stub listening on http://127.0.0.1:${port}/contact`)
})
