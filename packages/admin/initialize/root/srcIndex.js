const fs = require('fs-extra')
const { join } = require('path')
const { __src } = require('zs-shared/paths')
const getIndexPath = require('zs-shared/getIndexPath')

function createSrcIndex() {
  const rootPath = getIndexPath(__src)
  if (!fs.pathExistsSync(rootPath)) {
    fs.outputFileSync(
      join(__src, 'index.js'),
      `
import { BrowserRouter } from 'zs-admin'

export default function App({ children }) {
  return <BrowserRouter>{children}</BrowserRouter>
}
    `.trim()
    )
  }
}
module.exports = createSrcIndex
