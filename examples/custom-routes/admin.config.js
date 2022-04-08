const defineConfig = require('@zc/admin/define')
const common = require('../common.config')

module.exports = defineConfig({
  ...common,
  useFileRouter: false,
})
