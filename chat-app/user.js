const crypto = require('node:crypto')

class ChatUsers{

  constructor(){
    this.userId = ''
    this.dateTime = new Date().getTime()
    this.msgId = crypto.randomBytes(10).toString('hex')
    this.chatMessage = {}
    this.chat = []
    this._users = []
  }

  addUser(userId){
    this.userId = userId
    const newuser = {userId: this.userId}
    this._users.push(newuser)
    return this.userId
  }
  removeUser(userId){
    const others = this._users.filter(user => user.userId != userId)
    this.saveUser(others)
  }
  createMessage(userId, message){
    const newMessage = {userId, date: this.dateTime, msgId: this.msgId, message}
    this.message = {...newMessage}
    this.chat.push(this.message)

    return this.chatMessage
  }
  getUser(userId){
    const user = this._users.find(user => user.userId == userId)
    return user
  }
  saveUser(user){
    this._users = [...user]
  }
  getUsers(){
    return this._users
  }
  getMsg(){
    return this.chatMessage
  }
  getMessages(){
    return this.chat
  }
}
const chatApp = new ChatUsers() 

module.exports = { chatApp }