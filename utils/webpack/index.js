const createCompiler = require('./createCompiler')
const getAlias = require('./getAlias')
const { getEntry } = require('./entry')
const getLoaders = require('./getLoaders')
const getExternals = require('./getExternals')
module.exports = {
  createCompiler,
  getAlias,
  getEntry,
  getLoaders,
  getExternals
}
