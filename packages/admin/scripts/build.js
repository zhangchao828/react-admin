const { getConfig } = require('@zc/shared/project')

const { vite } = getConfig()

module.exports = function build() {
  if (vite) {
    require('@zc/vite/build')()
  } else {
    require('@zc/webpack/build')()
  }
}
