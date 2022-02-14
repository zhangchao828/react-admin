#!/usr/bin/env node
const script = process.argv[2]
const defaultConfig = require('../define/default.config')

function getProcessArgv() {
  const argv = process.argv
  const obj = {}
  argv.forEach((arg) => {
    if (arg.indexOf('=') > -1) {
      const [key, value] = arg.split('=')
      obj[key] = value
    }
  })
  return obj
}

function initEnv() {
  const { env } = getProcessArgv()
  process.env.admin_command = script
  process.env.admin_env = env || 'dev'
}

if (['start', 'build'].includes(script)) {
  const mode = script === 'start' ? 'development' : 'production'
  process.env.NODE_ENV = mode
  process.env.BABEL_ENV = mode
  initEnv()
  // 初始化项目配置文件
  require('@zc/dev-utils/project').initConfig(defaultConfig)
  // 根据项目配置初始化整个项目
  require('../initialize')()
  require('../scripts/' + script)(process.argv)
} else {
  console.error(`Unknown script ${script}. `)
}
