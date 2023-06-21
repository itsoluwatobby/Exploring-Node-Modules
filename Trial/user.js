const crypto = require('crypto')
const fsPromises = require('fs').promises
const path = require('path')

const DB = {
  users: require('./usersDB.json'),
  setUsers: function(data) { this.users = data }
}

const messageDB = {
  messages: require('./messageDB.json'),
  setMessage: function(data) { this.messages = data }
}

class ChatUsers{

  static users = []

  constructor(){
    this.userId = crypto?.randomBytes(5).toString('hex')
    this.username = ''
    this.password = ''
    this.date = new Date().getTime().toString()
    this.msgId = crypto?.randomBytes(8).toString('hex')
    this.chatMessage = {}
    this.chat = []
  }

  async addUser(username, password){
    this.password = password
    this.username = username
    const newuser = {userId: this.userId, username: this.username, password: this.password}
    DB.setUsers([...DB.users, newuser])
    await fsPromises.writeFile(path.join(__dirname, './usersDB.json'), JSON.stringify(DB.users), (err) => {
      if(err) console.log('unable to save file')
    })
    return newuser
  }

  async removeUser(userId){
    const others = DB.users.filter(user => user.userId != userId)
    DB.setUsers([...others])
    await fsPromises.writeFile(path.join(__dirname, './usersDB.json'), SON.stringify(others), (err) => {
      if(err) console.log('unable to save file')
    })
  }
  
  async createMessage(userId, message){
    const newMessage = {userId, date: this.date, msgId: this.msgId, message}
    this.chatMessage = {...newMessage}
    messageDB.setMessage([...messageDB.messages, newMessage])
    await fsPromises.writeFile(path.join(__dirname, './messageDB.json'), JSON.stringify(messageDB.messages), (err) => {
      if(err) console.log('unable to save file')
    })
    return this.chatMessage
  }

  getUser(userId){
    const user = DB.users.find(user => user.userId == userId)
    return user
  }

  getUserByPassword(password){
    const user = DB.users.find(user => user.password == password)
    return user
  }

  getUserByUsername(username){
    const user = DB.users.find(user => user.username == username)
    return user
  }

  getUsers(){
    ChatUsers.users = DB.users
    return ChatUsers.users
  }

  getMsg(msgId){
    const message = messageDB.messages.find(msg => msg.id == msgId)
    return message
  }
  
  async getMessages(){
   this.chat = messageDB.messages
    return this.chat
  }
}

const chatApp = new ChatUsers() 

module.exports = {chatApp, ChatUsers} 