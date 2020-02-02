const { __dist } = require('../utils/paths')
const { getLoaders, getAlias, getEntry } = require('../utils/webpack')
const { getPlugins } = require('../utils/plugin')
const entry = getEntry()
const alias = getAlias()
const rules = getLoaders()
const plugins = getPlugins()
module.exports = {
  entry,
  output: {
    path: __dist
  },
  resolve: {
    alias,
    extensions: ['.js', '.json', '.css', '.less', '.jsx', '.ts', '.tsx']
  },
  module: {
    rules
  },
  plugins,
  node: {
    setImmediate: false,
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}
