const { join } = require('path')
const glob = require('glob')
const fs = require('fs-extra')

const examplePath = join(__dirname, '../examples')
const files = glob.sync('*', {
  cwd: examplePath,
})
files.forEach((item) => {
  const cachePath = join(examplePath, item, 'node_modules/.cache/webpack')
  fs.removeSync(cachePath)
})
