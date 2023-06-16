const net = require('node:net')
const readline = require('node:readline/promises')
const process = require('process')
const { chatApp } = require('./user')

const port = process.env.PORT || 4000
const hostname = '127.0.0.1'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const clearLine = (dir) => {
  // dir: direction {0: clear currentline, -1: clears to the left, 1: clears to the right}
  return new Promise((resolve, reject) => {
    process.stdout.clearLine(dir, () => {
      resolve()
    })
  })
}

const moveCursor = (dx, dy) => {
  /**
   * dir: --------------------------- DIRECTIONS ----------------------------
   * dx = {0: doesn't move, -1: moves one char to the left, 1: moves one char to the right}
   * dy = {0: doesn't move, -1: moves one line up, 1: moves one line down}
  */
  return new Promise((resolve, reject) => {
    process.stdout.moveCursor(dx, dy, () => {
      resolve()
    })
  })
}

let id;

const client = net.createConnection({host: hostname, port}, async () => {
  console.log('connected to server')
  
  const ask = async() => {
    const message = await rl.question('Enter your message > ')
    // moves cursor up
    await moveCursor(0, -1)
    // clears the current line
    await clearLine(0)
    client.write(`id: ${id} message: ${message}`)
  }
  ask()

  client.on('data', async(data) => {
    console.log()
    // moves cursor up
    await moveCursor(0, -1)
    // clears the current line
    await clearLine(0)
    
    if(data.toString('utf-8').substring(0, 2) === 'id'){
      id = chatApp.addUser(data.toString('utf-8').substring(3))

      console.log(`Your id is ${id}\n`)
    }else{
      
      console.log(data.toString('utf-8'))
    }
    
    ask()
  })

  client.on('close', () => {
    console.log('server disconnected')
  })

}).on('error', () => {
  console.error({status: 500, message: 'SERVER DOWN'})
})


