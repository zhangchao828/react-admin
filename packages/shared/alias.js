const { __temporary, __root } = require('./paths')
const { admin } = require('./env')
const path = require('path')

const alias = {
  '@': __root,
  '~admin': __temporary,
  lodash: 'lodash-es',
}
if (admin) {
  alias['@glcc/admin'] = path.join(__dirname, '../admin/src/index.js')
}
module.exports = alias
