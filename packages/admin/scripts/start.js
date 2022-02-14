const { getConfig } = require('@zc/dev-utils/project')

const {  vite } = getConfig()

module.exports = function start() {
  if (vite) {
    require('@zc/vite/start')()
  } else {
    require('@zc/webpack/start')()
  }
}
