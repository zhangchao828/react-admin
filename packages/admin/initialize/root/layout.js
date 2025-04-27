const fs = require('fs-extra')
const { join } = require('path')
const getIndexPath = require('@glcc/shared/getIndexPath')
const { __layout } = require('@glcc/shared/paths')

function createLayout() {
  const layoutPath = getIndexPath(__layout)
  if (!fs.pathExistsSync(layoutPath)) {
    fs.outputFileSync(
      join(__layout, 'index.js'),
      `
function Layout({ children }) {
  return <div>{children}</div>
}

export default Layout
    `.trim()
    )
  }
}
module.exports = createLayout
