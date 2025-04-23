const fs = require('fs-extra')
const { join } = require('path')
const { __src } = require('@glcc/shared/paths')
const getIndexPath = require('@glcc/shared/getIndexPath')

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
