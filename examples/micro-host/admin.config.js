const defineConfig = require('@zc/admin/define')
const common = require('../common.config')

module.exports = defineConfig({
  publicPath: 'http://localhost:3000',
  webpack: {
    ...common.webpack,
    mf: {
      remotes: [
        {
          name: 'remote',
          publicPath: 'http://localhost:3001',
        },
      ],
    },
  },
})
