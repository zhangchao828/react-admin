const createRoot = require('./root')
const createEntry = require('./entry')
const { isDev } = require('@zc/shared/env')
const fs = require('fs-extra')
const { join } = require('path')
const { __customRoutes } = require('@zc/shared/paths')

module.exports = function initialize() {
  createRoot()
  createEntry()
  if (fs.pathExistsSync(join(__customRoutes, 'index.js'))) {
    // 存在routes文件就使用自定义配置路由
    require('./customRouter')()
  } else {
    // 文件式路由
    require('./fileRouter')()
  }
  if (isDev) {
    require('@zc/shared/mock').init()
  }
}
