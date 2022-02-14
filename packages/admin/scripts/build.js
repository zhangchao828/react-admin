const { getConfig } = require('@zc/dev-utils/project')

const { vite } = getConfig()

module.exports = function build() {
  if (vite) {
    require('@zc/vite/build')()
  } else {
    require('@zc/webpack/build')()
  }
}
