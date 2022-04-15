const defineConfig = require('@zc/admin/define')

module.exports = defineConfig({
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
