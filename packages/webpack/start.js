const { __static, __nodeModules } = require('@glcc/shared/paths')
const webpack = require('webpack')
// const open = require('open')
const webpackDevConfig = require('./webpack.dev.config')
const getUnusedPort = require('@glcc/shared/getUnusedPort')
const message = require('@glcc/shared/message')
const { getConfig } = require('@glcc/shared/project')
const mock = require('@glcc/plugins/mock')
const WebpackDevServer = require('webpack-dev-server')
const express = require('express')

let { proxy, port, https, base } = getConfig()
async function start() {
  message.info('正在启动,请稍等...')
  port = await getUnusedPort(port)
  const httpType = https ? 'https' : 'http'
  const devOptions = {
    port,
    host: '0.0.0.0',
    hot: true,
    allowedHosts: 'all',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'PUT, GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Custom-Header',
    },
    server: {
      type: httpType,
    },
    client: {
      overlay: {
        errors: true,
        warnings: false,
        runtimeErrors: false,
      },
    },
    proxy,
    historyApiFallback: true,
    static: [
      {
        directory: __static,
        publicPath: '/public',
        watch: true,
      },
      {
        directory: __nodeModules,
        publicPath: '/node_modules',
        watch: false,
      },
    ],
    setupMiddlewares(middlewares) {
      return middlewares.concat([express.json(), express.urlencoded({ extended: true }), mock])
    },
  }
  const compiler = webpack(webpackDevConfig)
  const devServer = new WebpackDevServer(devOptions, compiler)
  let opened = false
  compiler.hooks.done.tap('done', async () => {
    if (!opened) {
      opened = true
      const hostname = await WebpackDevServer.getHostname('local-ip')
      const ipUrl = `${httpType}://${hostname}:${port}${base}`
      const localUrl = `${httpType}://localhost:${port}${base}`
      message.info(`可通过以下地址打开应用:\n ${ipUrl}\n ${localUrl}`)
      // open(url)
    }
  })
  devServer.start()
}

module.exports = start
