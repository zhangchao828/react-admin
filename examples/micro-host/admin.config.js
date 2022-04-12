const defineConfig = require('@zc/admin/define')

module.exports = defineConfig({
  publicPath: 'http://localhost:3000',
  webpack: {
    mf: {
      remotes: [
        {
          name: 'remote',
          publicPath: 'http://localhost:3001',
        },
      ],
    },
    builtInExternals: false,
  },
})
