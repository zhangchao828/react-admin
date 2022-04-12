const { __dist, __entry, __indexHtml } = require('@zc/shared/paths')
const { isDev, define } = require('@zc/shared/env')
const alias = require('@zc/shared/alias')
const { getConfig } = require('@zc/shared/project')
const webpack = require('webpack')
const WebpackBar = require('webpackbar')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlTransformPlugin = require('./plugins/html-transform')
const FederationPlugin = require('./plugins/federation')
const QiankunPlugin = require('./plugins/qiankun')
const { APP, RUN_TIME } = require('./constant')
const rules = require('./loaders')
const { publicPath } = getConfig()

const baseConfig = {
  entry: {
    [APP]: __entry,
  },
  output: {
    publicPath,
    path: __dist,
    pathinfo: false,
    assetModuleFilename: 'assets/[name].[hash:8][ext]',
  },
  stats: 'errors-warnings',
  cache: {
    type: 'filesystem',
  },
  resolve: {
    alias,
    symlinks: false,
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.less'],
    fallback: {
      module: false,
      dgram: false,
      dns: false,
      fs: false,
      http2: false,
      net: false,
      tls: false,
      child_process: false,
    },
  },
  module: {
    rules,
  },
  optimization: {
    runtimeChunk: {
      name: RUN_TIME,
    },
  },
  plugins: [
    new WebpackBar(),
    new FederationPlugin(),
    new QiankunPlugin(),
    new webpack.DefinePlugin(define),
    new HtmlWebpackPlugin({
      template: __indexHtml,
      inject: !isDev,
    }),
    new HtmlTransformPlugin(),
  ],
}
module.exports = baseConfig
