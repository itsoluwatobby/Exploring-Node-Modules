const { resolve } = require('node:path');
const process = require('node:process');

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
  res.statusCode = 200
}

const delay = (DELAY=1000) => new Promise(resolve => setTimeout(() => resolve(), DELAY))

module.exports = { moveCursor, clearLine, headerResponse, clear, delay }
