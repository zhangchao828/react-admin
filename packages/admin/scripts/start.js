const { getConfig } = require('@zc/shared/project')

const {  vite } = getConfig()

module.exports = function start() {
  if (vite) {
    require('@zc/vite/start')()
  } else {
    require('@zc/webpack/start')()
  }
}
