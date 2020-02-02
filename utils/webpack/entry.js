const { isBuildMode, getEnv } = require('../tools/env')
const { join } = require('path')
const { entry } = require('../hlj/getHljConfig')()
const lodash = require('lodash')

exports.getEntry = function() {
  const isBuild = isBuildMode()
  const entryObj = {}
  const entryConf = []
  if (!isBuild) {
    entryConf.push('webpack-hot-middleware/client?noInfo=true&reload=true')
  }
  let entryPath = join(__dirname, '../../admin/index')
  if (lodash.isFunction(entry)) {
    entryPath = entry(getEnv(), isBuild)
  }
  entryConf.push(entryPath)
  entryObj.app = entryConf
  return entryObj
}
