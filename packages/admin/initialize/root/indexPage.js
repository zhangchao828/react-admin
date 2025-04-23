const { __pages } = require('@zswl/shared/paths')
const getIndexPath = require('@zswl/shared/getIndexPath')
const fs = require('fs-extra')
const { join } = require('path')

module.exports = function createIndexPage() {
  const indexPagePath = getIndexPath(join(__pages, 'index'))
  const indexFile = getIndexPath(__pages)
  if (!indexPagePath && !indexFile) {
    fs.outputFileSync(
      join(__pages, 'index.js'),
      `export default function Index() {
  return <div>Index page</div>
}
`.trim()
    )
  }
}
