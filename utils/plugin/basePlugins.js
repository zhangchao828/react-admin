const { getEnv, isBuildMode } = require('../tools/env')
const webpack = require('webpack')
const { join } = require('path')
const { outputHash } = require('../hlj/getHljConfig')()
const ReplaceHtmlPlugin = require('./replaceHtmlPlugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = function() {
  const isBuild = isBuildMode()
  const { ENV, EXT } = getEnv()
  return [
    new webpack.DefinePlugin({
      __ENV__: JSON.stringify(ENV),
      __MODE__: JSON.stringify(isBuild ? 'build' : 'start'),
      __EXT__: JSON.stringify(EXT)
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: join(process.cwd(), 'index.html'),
      inject: true,
      hash: !outputHash,
      ...(isBuild
        ? {
            minify: {
              removeComments: true,
              collapseWhitespace: true,
              removeAttributeQuotes: true
            }
          }
        : {})
    }),
    new ReplaceHtmlPlugin()
  ]
}
