const readline = require('node:readline/promises');
const process = require('process');
const net = require('node:net');

//const http from 'node:http'
const { clear, delay, moveCursor } = require('./helpers.js');
const { chatApp, allUsersDB, ChatUsers } = require('./user.js');

const PORT = 4000
const CHATPORT = 4500
const hostname = '127.0.0.1'

const endMessage = ['exit', 'quit', 'bye', 'logout']
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

let user = {}

let isLoading = false

const start = async() => {
  let username;

  console.info('Welcome, Enter your username Or Enter No/n to register')
  //console.log('-----------------------------------------------------')
  username = (await rl.question('Enter username > ')).toLowerCase()
  user = chatApp.getUserByUsername(username.trim())
 
  if(!user || username[0].toLowerCase() == 'n'){
    let password;
    await clear()
    console.log('You do not have an account, Pls sign up')
    username = (await rl.question('Enter username > ')).toLowerCase()
    user = chatApp.getUserByUsername(username.trim())

    while(user){
      await clear(null, null, -2)
      //await clear()
      console.log('USERNAME ALREADY TAKEN')
      username = (await rl.question('Enter username > ')).toLowerCase()
      user = chatApp.getUserByUsername(username.trim())
    }
    password = await rl.question('Enter password > ')

    user = await chatApp.addUser(username, password)
    isLoading = true
    isLoading && console.log('\nLoading...')
    await delay(2000)
    await clear(null, null, -2)
    fetch('http:127.0.0.1:4000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
    .then(response => response.json())
    .then(async(data) => {
      const res = JSON.parse(data)
      chatAppInit(res)
    })
    .catch(error => {
      console.log(`\nServer is currently down: Error > ${error.message}`)
    }).finally(() => isLoading = false)
  }
  else{
    const password = await rl.question('Enter password > ')
    if(user?.password === password){
      const res = await fetch('http:127.0.0.1:4000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      })
      if(res.ok){
        /*START CHAT APP APPLICATION */
        chatAppInit(user)
      }
      else{
        console.log('\nServer is currently down')
      }
    }
    else{
      console.error('\nBad credentials')
      process.exit(1)
    }
  }
}
start()

function chatAppInit(user){
  const client = net.createConnection({ 
    port: CHATPORT, host: hostname }, async() => {
    
    await clear(null, null, -5)
    console.log(`\nWelcome ${user?.username} your Id: ${user?.userId}`)
    
    const message = async () =>{
      const entry = await rl.question('Enter your message > ')
      await clear()
      if(endMessage.includes(entry.toLowerCase())){
        console.log('Logging out...')
        await delay(2500)
        await clear(null, null, -2)
        console.log('\nByeee')
        await clear()
        console.log('See you again soon🥳')
        process.exit(1)
      }
      else{
        client.write(`${user.username.toUpperCase()}: ${entry}`)
      }
    }
    message()

    client.on('data', async(data) => {
      console.log()
      await clear()
      const messageReceived =  data.toString('utf-8').split(':')[1]
      const name = data.toString('utf-8').split(':')[0] === user.username.toUpperCase() ? 'You' : data.toString('utf-8').split(':')[0]

      if(!name.startsWith('User')){
        if(name == 'You') await moveCursor(35, 0)
        console.log(`${name}: ${messageReceived}`)
      }else{
        console.log()
        console.log(data.toString('utf-8'))
        console.log()
      }

      message()
    })
    
    client.on('close', () => {
      console.log('Server disconnected')
    })
    
  }).on('error', (error) => {
    console.log('\nServer is currently down')
  })
}



