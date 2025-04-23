const fs = require('fs-extra')
const { join } = require('path')
const { __src } = require('@zswl/shared/paths')
const getIndexPath = require('@zswl/shared/getIndexPath')

function createSrcIndex() {
  const rootPath = getIndexPath(__src)
  if (!fs.pathExistsSync(rootPath)) {
    fs.outputFileSync(
      join(__src, 'index.js'),
      `
export default function App({ children }) {
  return children
}
    `.trim()
    )
  }
}
module.exports = createSrcIndex
