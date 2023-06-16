const net = require('net')
const crypto = require('crypto')

const port = 4000
const hostname = '127.0.0.1'

const server = net.createServer()

// array of socket objects
const clients = []

server.on('connection', socket => {
  const uniqueId = crypto.randomBytes(5).toString('hex')

  console.info(`user connected with ${uniqueId}`)

  clients.map((soc) => {
    soc.socket.write(`> User ${uniqueId} joined`)
  })
  socket.write(`id-${uniqueId}`)

  socket.on('data', (data) => {
    const stringed = data.toString('utf-8')
    const id = stringed.split(' ')[1]
    const message = data.toString('utf-8').substring(stringed.indexOf('message: ') + 9)
    clients.map((soc) => {
      soc.socket.write(`> id-${id}: ${message}`)
    })
  })

  const sepSocket = {socket, id: uniqueId}
  clients.push(sepSocket)

  socket.on('error', () => {
    clients.map((soc) => {
      soc.socket.write(`> User ${uniqueId} left`)
    })
    //console.log('Client disconnected')
  })
})

server.listen(port, hostname, () => {
  console.log(`server running at http://${hostname}:${port}`)
})
