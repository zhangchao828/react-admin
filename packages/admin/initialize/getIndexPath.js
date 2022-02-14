const { join } = require('path')
const fs = require('fs-extra')

module.exports = function getIndexPath(dirPath) {
  const jsIndex = join(dirPath, 'index.js')
  const jsxIndex = join(dirPath, 'index.jsx')
  const tsxIndex = join(dirPath, 'index.tsx')
  if (fs.pathExistsSync(jsIndex)) {
    return jsIndex
  }
  if (fs.pathExistsSync(jsxIndex)) {
    return jsxIndex
  }
  if (fs.pathExistsSync(tsxIndex)) {
    return tsxIndex
  }
  return ''
}
