#!/usr/bin/env node
const script = process.argv[2]
const defaultConfig = require('./default.config')
const { prompt } = require('enquirer')

function getProcessArgv() {
  const argv = process.argv.slice(2)
  const obj = {}
  argv.forEach((arg) => {
    if (arg.indexOf('=') > 0) {
      let [key, value] = arg.split('=')
      if (key.startsWith('--')) {
        key = key.substring(2)
      }
      if (key && value) {
        obj[key] = value
      }
    } else if (arg.startsWith('--')) {
      obj[arg.substring(2)] = true
    }
  })
  return obj
}

async function initEnv() {
  let { env, ...extra } = getProcessArgv()
  if (!env && process.env.NODE_ENV === 'production') {
    const select = await prompt({
      type: 'select',
      message: '请选择当前打包环境:',
      name: 'env',
      required: true,
      choices: [
        { message: '测试环境 (test)', name: 'test' },
        { message: '预发环境 (pre)', name: 'pre' },
        { message: '正式环境 (pro)', name: 'pro' },
        { message: '自定义环境变量', name: '-' },
      ],
    })
    if (select.env === '-') {
      const input = await prompt({
        type: 'input',
        message: '请输入环境变量:',
        name: 'env',
        required: true,
      })
      env = input.env
    } else {
      env = select.env
    }
  }
  process.env.admin_command = script
  process.env.admin_env = env || 'dev'
  process.env.admin_extra = JSON.stringify(extra)
}

async function init() {
  if (['start', 'build', 'api'].includes(script)) {
    const mode = script === 'build' ? 'production' : 'development'
    process.env.NODE_ENV = mode
    process.env.BABEL_ENV = mode
    await initEnv()
    // 初始化项目配置文件
    require('@zswl/shared/project').initConfig(defaultConfig)
    // 根据项目配置初始化整个项目
    await require('../initialize')()
    require('../scripts/' + script)(process.argv)
  } else {
    console.error(`Unknown script ${script}. `)
  }
}
init()
