const { __indexHtml } = require('@zc/dev-utils/paths')
const fs = require('fs-extra')

module.exports = function () {
  if (!fs.pathExistsSync(__indexHtml)) {
    fs.outputFileSync(
      __indexHtml,
      `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <title>admin</title>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
`
    )
  }
}
