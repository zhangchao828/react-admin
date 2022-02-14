const { __src } = require('@zc/dev-utils/paths')
const fs = require('fs-extra')
const { join } = require('path')
const getIndexPath = require('../getIndexPath')

function createSrcIndex() {
  const rootPath = getIndexPath(__src)
  if (!fs.pathExistsSync(rootPath)) {
    fs.outputFileSync(
      join(__src, 'index.jsx'),
      `
import { BrowserRouter } from 'react-router-dom'

export default function App({ children }) {
  return <BrowserRouter>{children}</BrowserRouter>
}
    `.trim()
    )
  }
}
module.exports = createSrcIndex
