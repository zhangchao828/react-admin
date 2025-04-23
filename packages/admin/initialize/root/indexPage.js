const { __pages } = require('@glcc/shared/paths')
const getIndexPath = require('@glcc/shared/getIndexPath')
const fs = require('fs-extra')
const { join } = require('path')

module.exports = function createIndexPage() {
  const indexPagePath = getIndexPath(join(__pages, 'index'))
  const indexFile = getIndexPath(__pages)
  if (!indexPagePath && !indexFile) {
    fs.outputFileSync(
      join(__pages, 'index.js'),
      `function Index() {
  return <div>Index page</div>
}

export default Index
`.trim()
    )
  }
}
