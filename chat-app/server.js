const net = require('node:net')
const crypto = require('node:crypto')
const { chatApp } = require('./user')

const port = 4000
const hostname = '127.0.0.1'

const server = net.createServer()

// array of objects
const clients = []

server.on('connection', socket => {
  // console.log('server on')
  // const getuser = {}
  const uniqueId = crypto.randomBytes(10).toString('hex')
  // socket.on('username', (data) => {
  //   const username = data.toString('utf-8')
  //   const newUser = {username, userId: uniqueId}
  //   chatApp.addUser(newUser)
  //   getuser = chatApp.getUser(uniqueId)
  // })

  console.info(`user connected with ${uniqueId}`)

  socket.on('data', (data) => {
    clients.map((soc) => {
      soc.socket.write(data)
    })
  })

  const sepSocket = {socket, socketId: uniqueId}
  clients.push(sepSocket)

  socket.on('error', () => {
    //chatApp.removeUser(getuser?.userId)
    console.log('Client disconnected')
  })
})

server.listen(port, hostname, () => {
  console.log(`server running at http://${hostname}:${port}`)
})
