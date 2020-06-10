const chalk = require('chalk')
const inquirer = require('inquirer')

inquirer.prompt([
  {
    type: 'list',
    name: 'ans',
    message: chalk.yellow('Who are you?'),
    choices: ['client', 'server']
  }
]).then(async(answer) => {
  const { ans } = answer
  if (ans == 'client') {
    inquirer.prompt([
      {
        name: 'host',
        message: chalk.yellow('Host'),
        default: 'localhost'
      },
      {
        name: 'port',
        message: chalk.yellow('Port'),
        default: 8000
      }
    ]).then(({ host, port }) => {
      if (isNaN(port)) return process.exit(0)
      require('./client')(host, port)
    })
  } else if (ans == 'server') {
    inquirer.prompt([
      {
        name: 'port',
        message: chalk.yellow('Port'),
        default: 8000
      }
    ]).then(({ port }) => {
      if (isNaN(port)) return process.exit(0)
      require('./server')(port)
    })
  }
})