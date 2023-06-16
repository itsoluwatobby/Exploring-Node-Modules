
const crypto = require('node:crypto')

const logger = (req, res, next) => {
  next()
  const date = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'full'
  }).format(new Date())
  const uniqueId = crypto.randomBytes(10).toString('hex')
  const errStats = res.statusCode >= 400 ? res.statusMessage : ''
  const logMessage = `--${req.httpVersion} ${date} ${uniqueId} ${req.method} ${req.url} ${res.statusCode +' '+req.headers.origin} ${errStats}`
  console.info(logMessage)
}

module.exports = logger