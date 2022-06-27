const createRoot = require('./root')
const createEntry = require('./entry')
const createFileRouter = require('./fileRouter')
const { isDev } = require('zs-shared/env')
const { __temporary } = require('zs-shared/paths')
const fs = require('fs-extra')

module.exports = function initialize() {
  fs.emptyDirSync(__temporary)
  createRoot()
  createEntry()
  createFileRouter()
  if (isDev) {
    require('zs-shared/mock').init()
  }
}
