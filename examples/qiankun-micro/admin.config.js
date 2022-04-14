const defineConfig = require('@zc/admin/define')

module.exports = defineConfig({
  publicPath: 'http://localhost:3001',
  webpack: {
    builtInExternals: false,
    federation: {
      name: 'test',
    },
  },
  qiankun: 'demo',
})
