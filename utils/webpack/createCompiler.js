const webpack = require('webpack')
const opn = require('opn')
const mergeWebpack = require('../tools/mergeWebpack')
const localIp = require('../tools/getLocalIp')()
const { isBuildMode, getEnv } = require('../tools/env')
const copyStatic = require('../tools/copyStatic')
const hljConfig = require('../hlj/getHljConfig')()

const { port, onAfterBuild } = hljConfig
let isFirst = true

const openOnceBrowser = function() {
  if (isFirst) {
    opn(`http://${localIp}:${port}`)
    isFirst = false
  }
}
module.exports = function(defaultWebpackConfig) {
  const isBuild = isBuildMode()
  const compiler = webpack(mergeWebpack(hljConfig.webpack, defaultWebpackConfig))
  compiler.hooks.done.tap('done', () => {
    if (isBuild) {
      copyStatic()
      onAfterBuild && onAfterBuild(getEnv('ENV'))
    }
  })
  if (!isBuild) {
    openOnceBrowser()
  }
  return compiler
}
