const defineConfig = require('@zc/admin/define')
const common = require('../common.config')

module.exports = defineConfig({
  vite: false,
  https: false,
  port: 3006,
  eslint: false,
  ...common,
})
