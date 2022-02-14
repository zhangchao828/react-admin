const { __src, __temporary, __env } = require('./paths')
const { env } = require('./env')
const path = require('path')

module.exports = {
  '@': __src,
  '@env': path.join(__env, env),
  '~admin': __temporary,
}
