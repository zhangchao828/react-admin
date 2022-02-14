const defineConfig = require('@zc/admin/define')
const common = require('../common.config')

module.exports = defineConfig({
  vite: false,
  https: true,
  port: 3006,
  ...common,
})
