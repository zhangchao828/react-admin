const { join } = require('path')
const { __entryDir, __entry, __federationExpose } = require('@zswl/shared/paths')
const fs = require('fs-extra')
const { getConfig } = require('@zswl/shared/project')

const { federation } = getConfig()

module.exports = function createEntry() {
  fs.copySync(join(__dirname, 'app.css'), join(__entryDir, 'app.css'))
  if (federation.list.length) {
    fs.outputFileSync(__entry, `import('./bootstrap')`)
    fs.copySync(join(__dirname, 'bootstrap.js'), join(__entryDir, 'bootstrap.js'))
  } else {
    fs.copySync(join(__dirname, 'bootstrap.js'), __entry)
  }
  if (federation.name) {
    fs.copySync(join(__dirname, 'expose.js'), __federationExpose)
  }
}
