const { __dist, __entry, __indexHtml } = require('@glcc/shared/paths')
const { isDev, define } = require('@glcc/shared/env')
const alias = require('@glcc/shared/alias')
const { merge } = require('webpack-merge')
const webpack = require('webpack')
const WebpackBar = require('webpackbar')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlTransformPlugin = require('@glcc/plugins/html-transform')
const FederationPlugin = require('@glcc/plugins/federation')
const { APP, RUN_TIME } = require('@glcc/shared/constant')
const rules = require('./loaders')
const { getConfig } = require('@glcc/shared/project')
const { publicPath, webpack: override } = getConfig()

const baseConfig = merge(
  {
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
      new WebpackBar({ name: '浙商未来' }),
      new FederationPlugin(),
      new webpack.DefinePlugin(define),
      new HtmlWebpackPlugin({
        template: __indexHtml,
        inject: !isDev,
      }),
      new HtmlTransformPlugin(),
    ],
  },
  override
)
module.exports = baseConfig
