const lodash = require('lodash')
const { getEnv, getEXT } = require('./env')
const fs = require('fs-extra')
const env = getEnv('ENV')
const { __localConfig, __projectConfig } = require('./getPath')

module.exports = function getHljConfig(defaultHljConfig) {
  let resConfig = defaultHljConfig
  let localConfig = {}
  let hljConfig = {}
  if (fs.pathExistsSync(__localConfig)) {
    localConfig = require(__localConfig)
  }
  if (fs.pathExistsSync(__projectConfig)) {
    hljConfig = require(__projectConfig)
  }
  resConfig = Object.assign(resConfig, hljConfig, localConfig)
  // publicPath
  const publicPath = resConfig.publicPath
  resConfig.publicPath = function(...rest) {
    return lodash.isFunction(publicPath) ? publicPath(env, ...rest) : publicPath
  }
  // 端口
  const PORT = getEXT('PORT')
  resConfig.port = PORT || resConfig.port

  return resConfig
}
