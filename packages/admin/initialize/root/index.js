const createIndexHtml = require('./indexHtml')
const createSrcIndex = require('./srcIndex')
const createIndexPage = require('./indexPage')
const createLayout = require('./layout')
const fs = require('fs-extra')
const {
  __remotes,
  __routes,
  __qiankun_microApps,
  __qiankun_publicPath,
} = require('@zc/shared/paths')

module.exports = function () {
  createIndexHtml()
  createSrcIndex()
  createLayout()
  createIndexPage()
  fs.outputFileSync(__remotes, `export default {}`)
  fs.outputFileSync(__qiankun_microApps, `export default []`)
  fs.outputFileSync(__qiankun_publicPath, ``)
  fs.outputFileSync(
    __routes,
    `
  export const store = { 
    trigger(){} 
  }
  export const routesMap = {}
  export const layoutsMap = {}
  `
  )
}
