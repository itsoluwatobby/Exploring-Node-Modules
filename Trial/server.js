const net = require('node:net');
const http = require('node:http');
const crypto = require('node:crypto');
const { chatApp } = require('./user.js');
const logger = require('../logger.js');
const { headerResponse } = require('./helpers.js');

const PORT = 4000
const CHATPORT = 4500
const hostname = '127.0.0.1'

let data = ''

const server = http.createServer((req, res) => {
  data = ''
  logger(req, res, async() => {
    if(req.url == '/'){
      headerResponse(res)
      res.end('Welcome all')
    }
    else if(req.url == '/login'){
      req.on('data', chunk => {
        data += chunk
      })
      req.on('end', () => {
        try{
          headerResponse(res, 201)
          res.end(JSON.stringify(data))
        }
        catch(error){
          headerResponse(res, 400)
          return res.end(`Error: ${error.message}`)
        }
      })
    }else{
     headerResponse(res, 404)
      res.end('not found')
    }
  })
})

const serverSocket = net.createServer()

let clientSockets = []

serverSocket.on('connection', async(socket) => {

  const userData = data.toString()
  const userId = userData.substring(userData.indexOf('"userId":')+10, userData.indexOf('"username":')-2)
  const username = userData.substring(userData.indexOf('"username":')+12, userData.indexOf('"password":')-2)
  const user = {username, userId}

  // console.log(`User with id ${user?.userId} connected`)
  socket.emit(`Success, welcome ${user?.username}`)
  
  clientSockets.map(cliSoc => {
    cliSoc.socket.write(`User ${user.username} joined`)
  })
  
  socket.on('data', data => {
    //socket.write(data.toString('utf-8'))
    clientSockets.map(client => {
      client.socket.write(data.toString('utf-8'))
    })
  })

  const socSub = {userId: user.userId, socket: socket}
  clientSockets.push(socSub)
  // console.log('HEEEEHHEEE: ', clientSockets.length)

  socket.on('error', () => {
    const Ids = clientSockets.filter(client => client.userId !== user?.userId)
    // clientSockets = Ids
    // console.log('HHHHHH: ', Ids.length)
    clientSockets.map(cliSoc => {
      cliSoc.socket.write(`User: ${user.username} left`)
    })
    console.log(`User ${user?.userId} left`)
  })
  
}).on('error', () => {
  console.log('Client disconnected')
})


// SERVER LISTENERS
server.listen(PORT, hostname, () => {
  console.log(`server running on port http://${hostname}/${PORT}`)
})

serverSocket.listen(CHATPORT, hostname, () => {
  console.log(`server running on port http://${hostname}/${CHATPORT}`)
})
