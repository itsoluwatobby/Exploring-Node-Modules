const readline = require('node:readline/promises')
const process = require('process')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const message = rl.question('Enter your message > ')