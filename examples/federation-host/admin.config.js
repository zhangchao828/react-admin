const defineConfig = require('@zc/admin/define')

module.exports = defineConfig({
  webpack: {
    federation: {
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
