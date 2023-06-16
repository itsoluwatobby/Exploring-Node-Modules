const http = require('node:http')
const logger = require('./logger')

const port = 1024
const hostname = '127.0.0.1'
//172.30.96.1
const server = http.createServer((req, res) => {{
  logger(req, res, () => {
    const data = { message: 'Hi there!' }
    if(req.url == '/'){
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Connection', 'close')
      res.statusCode = 200
      res.end(JSON.stringify(data))
    }
    else{
      res.setHeader('Content-Type', 'text/plain')
      res.setHeader('Connection', 'close')
      res.statusCode = 404
      res.end('not found')
    }
  })
}})

server.listen(port, hostname, () => {
  console.log(`server running at http://${hostname}:${port}`)
})

