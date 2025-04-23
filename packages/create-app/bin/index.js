#!/usr/bin/env node --harmony
'use strict'
process.env.NODE_PATH = __dirname + '/../node_modules/'
const program = require('commander')
program.version(require('../package').version, '-v, --version')
program.usage('<command>')
program
  .command('create')
  .description('创建一个新工程')
  .action(() => {
    require('../command/create')()
  })
program
  .command('init')
  .description('初始化一个已存在的空的工程')
  .action(() => {
    require('../command/init')()
  })

program.parse(process.argv)
if (!program.args.length) {
  program.help()
}
