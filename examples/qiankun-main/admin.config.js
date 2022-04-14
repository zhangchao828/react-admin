const defineConfig = require('@zc/admin/define')

module.exports = defineConfig({
  webpack: {
    builtInExternals: false,
    federation: {
      remotes: [
        {
          name: 'test',
          publicPath: '//localhost:3001',
        },
      ],
    },
  },
  qiankun: [
    {
      name: 'demo',
      activeRule: '/demo',
      entry: '//localhost:3001',
    },
  ],
})
