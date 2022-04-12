const defineConfig = require('@zc/admin/define')

module.exports = defineConfig({
  port: 3001,
  publicPath: 'http://localhost:3001',
  webpack: {
    federation: {
      name: 'remote',
    },
    builtInExternals: false,
  },
})
