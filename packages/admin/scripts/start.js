const { getConfig } = require('@glcc/shared/project')
const webpackStart = require('@glcc/webpack/start')
const checkUpdate = require('@glcc/shared/checkUpdate')

const { doctor } = getConfig()
module.exports = async function start() {
  if (doctor) {
    await checkUpdate()
  }
  webpackStart()
}
