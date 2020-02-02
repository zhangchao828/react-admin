const getBuildPlugins = require('./buildPlugins')
const getDevPlugins = require('./devPlugins')
const { isBuildMode } = require('../tools/env')
module.exports = {
  getPlugins() {
    return isBuildMode() ? getBuildPlugins() : getDevPlugins()
  }
}
