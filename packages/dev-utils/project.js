const fs = require('fs-extra')
const { __projectConfig, __localConfig } = require('./paths')
const { env, isDev, command } = require('./env')
const mergeWith = require('lodash/mergeWith')
const message = require('./message')

let projectConfig = null
function mergeConfig(source, other) {
  return mergeWith(source, other, (objValue, srcValue) => {
    if (Array.isArray(objValue)) {
      return objValue.concat(srcValue || [])
    }
  })
}
function optimizePublicPath(path) {
  return typeof path === 'string' && !path.endsWith('/') ? path + '/' : path
}
function initConfig(defaultConfig) {
  projectConfig = defaultConfig || {}
  if (fs.pathExistsSync(__projectConfig)) {
    delete require.cache[require.resolve(__projectConfig)]
    let adminConfig = require(__projectConfig)
    adminConfig = typeof adminConfig === 'function' ? adminConfig({ command, env }) : adminConfig
    projectConfig = mergeConfig(projectConfig, adminConfig)
  }
  // 只有开发环境才去合并local.config.js,所以该配置只能用于开发环境
  if (isDev && fs.pathExistsSync(__localConfig)) {
    delete require.cache[require.resolve(__localConfig)]
    let localConfig = require(__localConfig)
    localConfig = typeof localConfig === 'function' ? localConfig({ command, env }) : localConfig
    projectConfig = mergeConfig(projectConfig, localConfig)
  }
  const { publicPath, proxy, webpack } = projectConfig
  const { name: mfName, remotes } = webpack?.mf || {}
  /* publicPath */
  projectConfig.publicPath = optimizePublicPath(publicPath) || '/'

  /* proxy */
  const proxyObj = {}
  Object.keys(proxy || {}).forEach((context) => {
    let options = proxy[context]
    if (typeof options === 'string') {
      options = { target: options }
    }
    proxyObj[context] = {
      ...options,
      changeOrigin: true,
    }
  })
  projectConfig.proxy = proxyObj

  /* mf模块联邦 */
  if (mfName) {
    if (typeof publicPath !== 'string' || !publicPath.startsWith('http')) {
      message.error('mf: 必须配置一个有效的以http开头的publicPath')
    }
    if (typeof mfName !== 'string' || !/^[A-Za-z]+$/.test(mfName)) {
      message.error('mf: name必须是大小写字母组成，不能包含空格、汉字、数字等特殊字符')
    }
  }
  if (Array.isArray(remotes) && remotes.length > 0) {
    const appList = []
    // 去重微应用，每个微应用的名称和publicPath必须唯一
    remotes.forEach((item) => {
      const { name } = item || {}
      const remotePublicPath = optimizePublicPath(item.publicPath)
      if (name && remotePublicPath) {
        const match = appList.find(
          (node) => node.name === name || node.publicPath === remotePublicPath
        )
        if (!match) {
          appList.push({ name, publicPath: remotePublicPath })
        } else {
          message.error(`mf: name重复'${match.name}'`)
        }
      } else {
        message.error('mf: 必须配置name和publicPath属性')
      }
    })
    projectConfig.webpack.mf.remotes = appList
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
