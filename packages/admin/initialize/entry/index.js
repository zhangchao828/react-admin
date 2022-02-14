const { join } = require('path')
const { __entryDir } = require('@zc/dev-utils/paths')
const fs = require('fs-extra')
const { getConfig } = require('@zc/dev-utils/project')

const { mf } = getConfig().webpack

module.exports = function createEntry() {
  if (mf?.remotes) {
    fs.outputFileSync(join(__entryDir, 'index.jsx'), `import('./bootstrap')`)
    fs.copySync(join(__dirname, 'bootstrap.jsx'), join(__entryDir, 'bootstrap.jsx'))
  } else {
    fs.copySync(join(__dirname, 'bootstrap.jsx'), join(__entryDir, 'index.jsx'))
  }
}
