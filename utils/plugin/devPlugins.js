const getBasePlugins = require('./basePlugins')
const webpack = require('webpack')
module.exports = function() {
  return [new webpack.HotModuleReplacementPlugin(), ...getBasePlugins()]
}
