process.env.NODE_ENV = 'development'
const path = require('path')
const express = require('express')
const historyConnect = require('connect-history-api-fallback')
const { __static } = require('../utils/paths')
const webpackConfig = require('../config/webpack.dev.conf')
const { error, success } = require('../utils/tools/tip')
const { createCompiler } = require('../utils/webpack')
const { port, checkVersion, proxy } = require('../utils/hlj/getHljConfig')()
const { reactAdminNpmName } = require('../utils/tools/constant')
const readyLaunch = require('../utils/tools/readyLaunch')
const createAdmin = require('../utils/hlj/createAdmin')
const setHttpProxy = require('../utils/tools/setHttpProxy')

module.exports = function() {
  createAdmin()
  readyLaunch({
    checkVersion,
    serverName: reactAdminNpmName,
    onOk() {
      start()
    }
  })
}
function start() {
  const app = express()
  const compiler = createCompiler(webpackConfig)
  const devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: '/',
    noInfo: true,
    hot: true,
    quiet: true,
    stats: 'minimal'
  })

  const hotMiddleware = require('webpack-hot-middleware')(compiler, {
    noInfo: true,
    log: false
  })
  const staticPath = path.posix.join('/', 'static')

  setHttpProxy(app, proxy)

  app.use(historyConnect())

  app.use(devMiddleware)

  app.use(hotMiddleware)

  app.use(staticPath, express.static(__static))
  app.get('*', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'index.html'))
  })
  app.listen(port, err => {
    err && error(err)
    success(`http://localhost:${port}`)
  })
}
