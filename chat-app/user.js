
class ChatUsers{

  constructor(){
    this.username = ''
    this.userId = ''
    this.dateTime = new Date().getTime()
    this.chatMessage = {}
    this.chat = []
    this._users = []
  }

  addUser(username, userId){
    this.username = username
    this.userId = userId
    const newuser = {username: this.username, userId: this.userId}
    this._users.push(newuser)
  }
  removeUser(userId){
    const others = this._users.filter(user => user.userId != userId)
    this.saveUser(others)
  }
  createMessage(userId, message){
    const newMessage = {userId, date: this.dateTime, message}
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