const { getConfig } = require('@zswl/shared/project')
const webpackStart = require('@zswl/webpack/start')
const checkUpdate = require('@zswl/shared/checkUpdate')

const { doctor } = getConfig()
module.exports = async function start() {
  if (doctor) {
    await checkUpdate()
  }
  webpackStart()
}
