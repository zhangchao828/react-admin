const { join } = require('path')
const { __entryDir, __entry, __federationExpose } = require('zs-shared/paths')
const fs = require('fs-extra')
const { getConfig } = require('zs-shared/project')

const { federation } = getConfig()

module.exports = function createEntry() {
  if (Array.isArray(federation)) {
    fs.outputFileSync(__entry, `import('./bootstrap')`)
    fs.copySync(join(__dirname, 'bootstrap.js'), join(__entryDir, 'bootstrap.js'))
  } else {
    fs.copySync(join(__dirname, 'bootstrap.js'), __entry)
  }
  if (typeof federation === 'string') {
    fs.copySync(join(__dirname, 'federationExpose.js'), __federationExpose)
  }
}
