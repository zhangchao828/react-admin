const defineConfig = require('@zc/admin/define')

module.exports = defineConfig({
  publicPath: '//localhost:3000',
  webpack: {
    builtInExternals: false,
  },
  qiankun: [
    {
      name: 'demo',
      entry: '//localhost:3001',
    },
  ],
})
