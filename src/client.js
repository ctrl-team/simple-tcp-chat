process.stdout.write('\x1Bc')
 
const myRL = require('serverline')
const chalk = require('chalk')

log = (type, message) => {
  switch(type) {
    case 'log':
      console.log(chalk.cyan('[INFO]'), message)
      break
    
    case 'err':
      console.log(chalk.red('[ERROR]'), message)
      break;
    
    case 'ready':
      console.log(chalk.green('[READY]'), message)
      break;
  }
}

module.exports = (host, port) => {
  const net = require("net")
  const client = new net.Socket()
  myRL.init()
  myRL.setPrompt('> ')

  console.clear()
  log('log', `Connecting to ${host}:${port}...`)

  client.connect({ port: port, host: host}, () => {
    client.setEncoding('utf8')
    const promp = async () => {
      myRL.on('line', (line) => {
        client.write(`${line}\n`)
      })
    }
    promp()
    client.on('data', (data) => {
      console.log(data.replace('\n', ''))
    })
  })
}