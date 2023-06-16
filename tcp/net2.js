const net = require('node:net')

const port = 4080
const hostname = '127.0.0.1'

const socket = net.createConnection({
   host: hostname, port: port 
  }, () => {{
    const buff = Buffer.alloc(2)
    buff[0] = 12
    buff[1] = 34
  //socket.write('This is a simple message')
  socket.write(buff)

  socket.on('error', err => {
    console.error('ERROR FROM SERVER')
  })
}})

// server.listen(port, hostname, () => {
//   console.log(`server running at http://${hostname}:${port}`)
// })

