const defineConfig = require('@zc/admin/define')
const common = require('../common.config')

module.exports = defineConfig({
  port: 3001,
  publicPath: 'http://localhost:3001',
  webpack: {
    ...common.webpack,
    mf: {
      name: 'remote',
    },
  },
})
