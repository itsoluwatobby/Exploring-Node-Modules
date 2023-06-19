const fs = require('node:fs')
const fsPromises = require('node:fs/promises')
const path = require('node:path')

async function start(){
  console.time('Running-Process: ')

  //const file = await fsPromises.open('./file.txt', 'w')
  const stream = fs.createWriteStream(path.join(__dirname, 'file.txt'))
  // const streamR = fs.createReadStream('./file.txt')
  // console.log(stream.writableHighWaterMark / 1000 + 'kb')
  // console.log(stream.writableLength)

  // bit = 1 | 0
  // 8bit = 1byte
  // 1000bytes = 1kb
  // 1000 kb = 1mb
  
  // const buff = Buffer.alloc(16383, 'ab ')
  // console.log(stream.write(buff))
  // console.log(stream.write(Buffer.alloc(1, 'a')))
  
  // stream.on('drain', () => {
  //   console.log('safe to write more')
  //   console.log(stream.write(buff))
  //   console.log(stream.writableLength)
  // })
  // console.log(stream.writableLength) 
  let i = 0
  let count = 1
  const writeMany = () => {

    while(i < 100_000){
      const buff = Buffer.from(` ${i} `, 'utf-8')
      if(i == 99999) return stream.end(buff)
      if(!stream.write(` ${buff} `)) break

      i++
    }
  }  
  writeMany()
  
  stream.on('drain', () => {
    count++
    writeMany()
  })
  
  stream.on('finish', () => {
    console.timeEnd('Running-Process: ')
    console.log(`\nTotal drained ${count}`) 
  })
}

start()