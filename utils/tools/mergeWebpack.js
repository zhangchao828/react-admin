const lodash = require('lodash')
const mergeWebpack = require('webpack-merge')
module.exports = function(hljWebpackConfig, defaultWebpackConfig) {
  if (lodash.isFunction(hljWebpackConfig)) {
    return mergeWebpack(defaultWebpackConfig, hljWebpackConfig())
  }
  return defaultWebpackConfig
}
