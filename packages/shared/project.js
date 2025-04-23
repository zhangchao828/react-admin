const fs = require('fs-extra')
const { __projectConfig, __localConfig, __root, __packageJson } = require('./paths')
const { mergeWith, isObject } = require('lodash')
const message = require('./message')
const { join } = require('path')
const isDev = process.env.NODE_ENV === 'development'
const env = process.env.admin_env
const command = process.env.admin_command

let projectConfig = null
function mergeConfig(source, other) {
  return mergeWith(source, other, (objValue, srcValue) => {
    if (Array.isArray(objValue)) {
      return objValue.concat(srcValue || [])
    }
    if (isObject(objValue) && isObject(srcValue)) {
      return Object.assign(objValue, srcValue)
    }
  })
}
function optimizePublicPath(path) {
  return typeof path === 'string' && !path.endsWith('/') ? path + '/' : path
}
function optimizeFederation(config) {
  let name = ''
  let list = []
  let layout = false
  if (typeof config === 'string') {
    name = config
  } else if (Array.isArray(config)) {
    list = config
  } else {
    name = config.name || ''
    list = config.list || []
    layout = config.layout ?? false
  }
  if (name && !/^[A-Za-z]+$/.test(name)) {
    message.error(
      'federation: 模块联邦name必须是大小写字母组成，不能包含空格、汉字、数字等特殊字符'
    )
  }
  return {
    name,
    layout,
    list: list
      .map((item) => {
        return {
          ...item,
          entry: optimizePublicPath(item.entry),
        }
      })
      .filter((item) => item.name && item.entry),
  }
}
function initConfig(defaultConfig) {
  projectConfig = defaultConfig || {}
  let tailwindConfig = false
  const { name, dependencies, devDependencies } = require(__packageJson)
  const allDep = {
    ...dependencies,
    ...devDependencies,
  }
  projectConfig.name = name
  const __tailwindConfig = join(__root, 'tailwind.config.js')
  if (fs.pathExistsSync(__tailwindConfig)) {
    if (!allDep.tailwindcss) {
      message.error('请先安装依赖 tailwindcss')
    }
    tailwindConfig = require(__tailwindConfig)
  }
  if (fs.pathExistsSync(__projectConfig)) {
    let adminConfig = require(__projectConfig)
    adminConfig = typeof adminConfig === 'function' ? adminConfig({ command, env }) : adminConfig
    projectConfig = mergeConfig(projectConfig, adminConfig)
  }
  // 只有开发环境才去合并local.config.js,所以该配置只能用于开发环境
  if (isDev && fs.pathExistsSync(__localConfig)) {
    let localConfig = require(__localConfig)
    localConfig = typeof localConfig === 'function' ? localConfig({ command, env }) : localConfig
    projectConfig = mergeConfig(projectConfig, localConfig)
  }
  let { publicPath, federation, base } = projectConfig
  federation = optimizeFederation(federation)
  publicPath = optimizePublicPath(publicPath) || '/'
  projectConfig.publicPath = publicPath
  projectConfig.federation = federation
  projectConfig.tailwindConfig = tailwindConfig
  if (typeof base === 'string') {
    const baseSplit = base.split('/').filter(Boolean)
    projectConfig.base = baseSplit.length ? '/' + baseSplit.join('/') : ''
  } else {
    projectConfig.base = ''
  }
  return projectConfig
}
function getConfig(name) {
  return name ? projectConfig[name] : projectConfig
}

module.exports = {
  initConfig,
  getConfig,
}
