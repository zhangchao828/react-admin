const fs = require('fs-extra')
const { join } = require('path')
const getIndexPath = require('../getIndexPath')
const { __layout } = require('@zc/dev-utils/paths')

function createLayout() {
  const layoutPath = getIndexPath(__layout)
  if (!fs.pathExistsSync(layoutPath)) {
    fs.outputFileSync(
      join(__layout, 'index.jsx'),
      `
export default function Layout({ children }) {
  return <div>{children}</div>
}
    `.trim()
    )
  }
}
module.exports = createLayout
