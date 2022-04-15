const createIndexHtml = require('./indexHtml')
const createSrcIndex = require('./srcIndex')
const createIndexPage = require('./indexPage')
const createLayout = require('./layout')
const fs = require('fs-extra')
const { getConfig } = require('@zc/shared/project')
const {
  __remotes,
  __routes,
  __event,
  __router,
  __qiankun_microApps,
  __qiankun_publicPath,
} = require('@zc/shared/paths')

const { router, qiankun } = getConfig()

module.exports = function () {
  createIndexHtml()
  createSrcIndex()
  createLayout()
  createIndexPage()
  fs.outputFileSync(__remotes, `export default {}`)
  fs.outputFileSync(__qiankun_microApps, `export default []`)
  fs.outputFileSync(__qiankun_publicPath, ``)
  fs.outputFileSync(__qiankun_publicPath, ``)
  fs.outputFileSync(
    __routes,
    `
  export const routesMap = {}
  export const layoutsMap = {}
  `
  )
  fs.outputFileSync(
    __event,
    `
const event = {
  modules: {},
  callback: null,
  resolve(path, m) {
    event.modules[path] = m
    if (event.callback) {
      event.callback(m)
    }
  },
  trigger(path, callback) {
    event.callback = null
    if (event.modules[path]) {
      callback(event.modules[path])
    } else {
      event.callback = callback
    }
  },
}
export default event
  `
  )
  const basename = typeof qiankun === 'string' ? `/${qiankun}` : '/'
  fs.outputFileSync(
    __router,
    `
import { ${router} } from 'react-router-dom'

const basename = window.__POWERED_BY_QIANKUN__ ? '${basename}':undefined
export default ({ children }) => <${router} basename={basename}>{children}</${router}>
  `
  )
}
