const { join } = require('path')
const fs = require('fs-extra')

module.exports = function getIndexPath(dirPath) {
  const jsIndex = join(dirPath, 'index.js')
  if (fs.pathExistsSync(jsIndex)) {
    return jsIndex
  }
  const jsxIndex = join(dirPath, 'index.jsx')
  if (fs.pathExistsSync(jsxIndex)) {
    return jsxIndex
  }
  const tsxIndex = join(dirPath, 'index.tsx')
  if (fs.pathExistsSync(tsxIndex)) {
    return tsxIndex
  }
  return ''
}
