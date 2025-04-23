const fs = require('fs-extra')
const webpack = require('webpack')
const beautifyStats = require('./beautifyStats')
const webpackProdConfig = require('./webpack.prod.config')
const { __static, __dist, __distDataJson } = require('@zswl/shared/paths')
const message = require('@zswl/shared/message')
const { define } = require('@zswl/shared/env')
const path = require('path')

module.exports = function () {
  message.info('正在打包构建......')
  fs.emptyDirSync(webpackProdConfig.output.path)
  const compiler = webpack(webpackProdConfig)
  compiler.run((err, statsInfo) => {
    compiler.close((err2) => {
      err2 && message.error(String(err2))
    })
    if (err) {
      message.error(String(err))
    } else {
      const { errors = [], warnings = [] } = statsInfo.toJson({
        all: false,
        warnings: true,
        errors: true,
      })
      if (warnings.length) {
        message.warning(warnings.map((item) => item.message).join('\n\n'))
      }
      if (errors.length) {
        message.error(errors.map((item) => item.message).join('\n\n'))
      }
      beautifyStats(statsInfo)
      if (fs.pathExistsSync(__static)) {
        fs.copySync(__static, path.join(__dist, path.basename(__static)))
      }
      fs.outputFileSync(__distDataJson, JSON.stringify(define.__DATA__, null, 2))
      message.success('构建成功')
    }
  })
}
