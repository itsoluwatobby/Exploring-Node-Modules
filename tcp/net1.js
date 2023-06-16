
const net = require('node:net')

const port = 4080
const hostname = '127.0.0.1'

const server = net.createServer(socket => {{
  console.log('client connected')
  socket.on('data', (data) => {
    console.log(data)
  })

  socket.on('error', err => {
    console.error('ERROR FROM CLIENT')
  })

}})

server.listen(port, hostname, () => {
  console.log(`server running at ${JSON.stringify(server.address())}`)
})

