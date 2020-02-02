const fs = require('fs-extra')
const { error, success, log } = require('./tip')
const ora = require('ora')
const { __dist } = require('./getPath')
module.exports = function(config) {
  const { compiler } = config
  const spinner = ora('building......')
  fs.emptyDirSync(__dist)
  spinner.start()
  compiler.run((err, stats) => {
    spinner.stop()
    err && error(err)
    success('构建成功')
    log(
      stats.toString({
        colors: true,
        modules: false,
        children: false
      })
    )
  })
}
