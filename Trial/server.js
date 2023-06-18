const net = require('node:net');
const http = require('node:http');
const crypto = require('node:crypto');
const { chatApp } = require('./user.js');
const logger = require('../logger.js');
const { headerResponse } = require('./helpers.js');

const PORT = 4000
const hostname = '127.0.0.1'

const server = http.createServer((req, res) => {
  logger(req, res, async() => {
    if(req.url == '/'){
      headerResponse(res)
      res.end('Welcome all')
    }
    else if(req.url == '/login'){
      let data = ''
      req.on('data', chunk => {
        data += chunk
      })
      req.on('end', () => {
        console.log(data)
        headerResponse(res, 201)
        res.end(JSON.stringify(data))
      })
    }else{
     headerResponse(res, 404)
      res.end('not found')
    }
  })
})

//const server = http.createServer((req, res) => {

  
//})

// server.on(async(req, res) => {
//   if(req.url == '/login'){
//     const user = await req.body
//     console.log(user)
//   }
//})

const clientSockets = []
let user = {};

// server.on('connect', (socket) => {
//   const uniqueId = crypto.randomBytes(5).toString('hex')

//   socket.on('data', data => {
//     const userString = data.toString('utf-8').replace('{}', '')
//     const username = userString.substring(userString.indexOf('username')+10)
//     user = chatApp.addUser(uniqueId, username)
//     console.log(`Registration successful\nYour credential is ${user}`)
    
//     console.log(`User with id ${user?.userId} connected`)
//     socket.emit(`Success, welcome ${user?.username}`)
  
//     //const userString = data.toString('utf-8').replace('{}', '')
//     const id = userString.split(' ')[1]
//     user = chatApp.getUser(id)
//     console.log(`User with id ${user?.userId} connected`)

//     clientSockets.map(client => {
//       client.socket.write(`User ${user?.username} joined`)
//     })
//   })

//   // socket.on('data', data => {

//   //   clientSockets.map(client => {
//   //     client.socket
//   //   })
//   // }
//   const socSub = {userId: user?.userId, socket: socket}
//   clientSockets.push(socSub)
// }).on('error', () => {
//   console.log('Client disconnected')
// })

server.listen(PORT, hostname, () => {
  console.log('server running on port', PORT)
})