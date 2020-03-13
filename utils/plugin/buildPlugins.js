const getBasePlugins = require('./basePlugins')
const webpack = require('webpack')
const { outputHash } = require('../hlj/getHljConfig')()
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = function() {
  return [
    new MiniCssExtractPlugin({
      filename: outputHash ? '[name].[contenthash:8].css' : '[name].css',
      chunkFilename: outputHash ? '[name].[contenthash:8].css' : '[name].css',
      ignoreOrder: false
    }),
    new webpack.HashedModuleIdsPlugin(),
    ...getBasePlugins()
  ]
}
