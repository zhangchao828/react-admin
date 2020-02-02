const defaultConfig = require('../../config/hlj.config')
const getHljConfig = require('../tools/getHljConfig')

module.exports = function() {
  return getHljConfig(defaultConfig)
}
