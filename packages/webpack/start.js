const { __static, __nodeModules } = require('@zc/shared/paths')
const webpack = require('webpack')
// const open = require('open')
const webpackDevConfig = require('./webpack.dev.config')
const getUnusedPort = require('@zc/shared/getUnusedPort')
const message = require('@zc/shared/message')
const { getConfig } = require('@zc/shared/project')
const mock = require('./plugins/mock')
const WebpackDevServer = require('webpack-dev-server')

let { proxy, port, https } = getConfig()
async function start() {
  message.info('正在启动,请稍等...')
  port = await getUnusedPort(port)
  const httpType = https ? 'https' : 'http'
  const devOptions = {
    port,
    host: '0.0.0.0',
    hot: true,
    // allowedHosts: 'all',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    server: {
      type: httpType,
    },
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    proxy,
    historyApiFallback: true,
    static: [
      {
        directory: __static,
        publicPath: '/',
        watch: true,
      },
      {
        directory: __nodeModules,
        publicPath: '/node_modules',
        watch: false,
      },
    ],
    setupMiddlewares(middlewares) {
      middlewares.push(mock)
      return middlewares
    },
  }
  const compiler = webpack(webpackDevConfig)
  const devServer = new WebpackDevServer(devOptions, compiler)
  let opened = false
  compiler.hooks.done.tap('done', async () => {
    if (!opened) {
      opened = true
      const hostname = await WebpackDevServer.getHostname('local-ip')
      const ipUrl = `${httpType}://${hostname}:${port}`
      const localUrl = `${httpType}://localhost:${port}`
      message.success(`${ipUrl}\n  ${localUrl}`)
      // open(url)
    }
  })
  devServer.start()
}

module.exports = start
