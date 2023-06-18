const readline = require('node:readline/promises');
const process = require('process');
const net = require('node:net');

//const http from 'node:http'
const { clearLine, moveCursor, clear, delay } = require('./helpers.js');
const { chatApp, allUsersDB, ChatUsers } = require('./user.js');

const PORT = 4000
const hostname = '127.0.0.1'

const endMessage = ['exit', 'quit', 'bye', 'logout']
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

let user = {}

let loading = false

const start = async() => {
  console.info('Welcome, Enter your username Or Enter No/n to register')
  console.log('-----------------------------------------------------\n')
  const username = await rl.question('Enter username > ')
  user = chatApp.getUserByUsername(username.trim())
  
  if(!user || username[0].toLowerCase() == 'n'){
    await clear()
    console.log('You do not have an account, Pls sign up')
    const username = await rl.question('Enter username > ')
    const password = await rl.question('Enter password > ')

    const info = {username, password}
    loading = true
    loading && console.log('\nLoading...')
    await delay(2000)
    await clear(null, null, -2)
    fetch('http:127.0.0.1:4000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(info)
    })
    .then(response => response.json())
    .then(async(data) => {
      const res = JSON.parse(data)
      user = await chatApp.addUser(res?.username, res?.password)
      console.log(`\nWelcome ${user?.username}, your Id: ${user?.userId}`)
      chatAppInit(user)
    })
    .catch(error => {
      console.log(`\nServer is currently down: Error > ${error.message}`)
    }).finally(() => loading = false)
  }
  else{
    const password = await rl.question('Enter password > ')
    user = chatApp.getUserByPassword(password.trim())
    if(user){
      console.log(`\nWelcome ${user?.username} your Id: ${user?.userId}`)
      chatAppInit(user)
    }
    else{
      console.error('\nBad credentials')
      process.exit(1)
    }
  }
}
start()


const message = async () =>{
  const entry = await rl.question('Enter your message > ')
  await clear()
  console.log(entry)
  if(endMessage.includes(entry.toLowerCase())){
    console.log('\nByeee')
    process.exit(1)
  }
  message()
}
message()

function chatAppInit(user){
  const client = net.createConnection({ 
    port: PORT, host: hostname }, () => {
  
    
    client.on('close', () => {
      console.log('Server disconnected')
    })
    
  }).on('error', (error) => {
    console.log('\nServer is currently down')
  })
}



