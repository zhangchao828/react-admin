const fs = require('fs-extra')
const { join } = require('path')
const getIndexPath = require('zs-shared/getIndexPath')
const { __layout } = require('zs-shared/paths')

function createLayout() {
  const layoutPath = getIndexPath(__layout)
  if (!fs.pathExistsSync(layoutPath)) {
    fs.outputFileSync(
      join(__layout, 'index.js'),
      `export default function Layout({ children }) {
  return <div>{children}</div>
}
    `.trim()
    )
  }
}
module.exports = createLayout
