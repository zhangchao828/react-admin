process.env.NODE_ENV = 'production'
const webpackConfig = require('../config/webpack.prod.conf')
const { createCompiler } = require('../utils/webpack')
const compiler = createCompiler(webpackConfig)
const build = require('../utils/tools/build')
const createAdmin = require('../utils/hlj/createAdmin')

module.exports = function() {
  createAdmin()
  build({
    compiler
  })
}
