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

module.exports = (port) => {
  const net = require("net")
  let sockets = []
  const Server = net.createServer()

  log('log', 'running server...')

  Server.on('connection', (socket) => {
    const write = (data) => {
      const clients = sockets.length
      for (let i=0; i < clients; i++) {
        if(sockets[i] === socket) continue
        sockets[i].write(data)
      }
    }

    log('log', `New connection: ${sockets.length + 1}`)
    
    socket.username = `Guest ${sockets.length + 1}`
    socket.setEncoding('utf8')
    sockets.push(socket)
    write(chalk.cyan(`${socket.username} has joined!\n`))

    socket.on('data', async data => {
      if(data.startsWith('/eval')) {
        const _eval = require('eval')
        const eval = await _eval(data.replace('/eval', ''))
        write(`[${chalk.green(socket.username)}]: ${chalk.yellow(data)}`)
        write(eval)
        return
      }
      write(`[${chalk.green(socket.username)}]: ${chalk.yellow(data)}`)
    });

    socket.on('end', () => {
      log(`log`, `${socket.username} has leaved...`)
      write(chalk.cyan(`${socket.username} has leaved!\n`))
      sockets.splice(sockets.indexOf(socket), 1)
    });
  });

  Server.listen(port, () => {
    log('ready', 'Server is ready!')
    log('log', `Port: ${port}`)
  });
}