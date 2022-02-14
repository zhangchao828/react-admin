const createIndexHtml = require('./indexHtml')
const createSrcIndex = require('./srcIndex')
const createIndexPage = require('./indexPage')
const createLayout = require('./layout')
const fs = require('fs-extra')
const { __remotes, __routes } = require('@zc/dev-utils/paths')

module.exports = function () {
  createIndexHtml()
  createSrcIndex()
  createLayout()
  createIndexPage()
  fs.outputFileSync(__remotes, `export default {}`)
  fs.outputFileSync(
    __routes,
    `
  export const routesMap = {}
  export const layoutsMap = {}
  `
  )
}
