const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  output: {
    filename: '[name].js',
    chunkFilename: '[id].js',
    publicPath: '/'
  },
  devtool: '#cheap-module-eval-source-map'
})
