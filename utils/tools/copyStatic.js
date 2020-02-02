const { __static } = require('./getPath')
const fs = require('fs-extra')
module.exports = function copyStatic(distStatic) {
  if (fs.pathExistsSync(__static)) {
    fs.copySync(__static, distStatic)
  }
}
