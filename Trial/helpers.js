const process = require('node:process');
const fsPromises = require('node:fs/promises')
const path = require('node:path')

const endMessage = ['exit', 'quit', 'bye', 'logout']

const moveCursor = (dx, dy) => {
  return new Promise((resolve) => {
    process.stdout.moveCursor(dx, dy, () => {
      resolve()
    })
  })
}

const clearLine = (dir) => {
  return new Promise((resolve) => {
    process.stdout.clearLine(dir, () => {
      resolve()
    })
  })
}

const clear = async(line=0, dx=0, dy=-1) => {
  await moveCursor(dx, dy)
  await clearLine(line)
}

const headerResponse = (res, code=200) => {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Connection', 'close')
  res.statusCode = code
}

const clientSockets = {
  sockets: require('./socketsDB.json'),
  addSocket: async function(socket){
    await fsPromises.writeFile(path.join(__dirname, './socketsDB.json'), JSON.stringify(socket), (err) => {
      if(err) console.log('unable to save file')
    })
  },
  removeSocket: async function(socketId){
    const otherSockets = this.socket.filter(socket => socket.userId != socketId)
    await fsPromises.writeFile(path.join(__dirname, './socketsDB.json'), JSON.stringify(otherSockets), (err) => {
      if(err) console.log('unable to save file')
    })
    return socketId
  },
  closeSocket: async function(){
    await fsPromises.writeFile(path.join(__dirname, './socketsDB.json'), JSON.stringify([]), (err) => {
      if(err) console.log('unable to save file')
    })
  },
  getSocket: function(socketId){
    const soc = this.socket.filter(socket => socket.userId == socketId)
    return soc
  },
  getAllSockets(){
    return this.sockets
  }
}


const delay = (DELAY=1000) => new Promise(resolve => setTimeout(() => resolve(), DELAY))

module.exports = { moveCursor, clearLine, headerResponse, clear, delay, clientSockets }
