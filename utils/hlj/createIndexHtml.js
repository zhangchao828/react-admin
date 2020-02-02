const { __root } = require('../paths')
const { join } = require('path')
const fs = require('fs-extra')

module.exports = function() {
  const htmlPath = join(__root, 'index.html')
  if (!fs.pathExistsSync(htmlPath)) {
    fs.copySync(join(__dirname, '../../admin/index.html'), htmlPath)
  }
}
