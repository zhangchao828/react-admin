const createIndexHtml = require('./indexHtml')
const createSrcIndex = require('./srcIndex')
const createIndexPage = require('./indexPage')
const createLayout = require('./layout')
const fs = require('fs-extra')
const { getConfig } = require('zs-shared/project')
const {
  __federationApps,
  __routes,
  __event,
  __config,
  __microApps,
  __publicPath,
} = require('zs-shared/paths')

const { microApp } = getConfig()

module.exports = function () {
  createIndexHtml()
  createSrcIndex()
  createLayout()
  createIndexPage()
  fs.outputFileSync(__federationApps, `export default {}`)
  fs.outputFileSync(
    __config,
    `
  export default {
    microApp:'${typeof microApp === 'string' ? microApp : ''}'
  }`
  )
  fs.outputFileSync(__microApps, `export default ()=> null`)
  fs.outputFileSync(__publicPath, ``)
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
}
