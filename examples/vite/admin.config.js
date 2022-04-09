const defineConfig = require('@zc/admin/define')

module.exports = defineConfig({
  vite: true,
  webpack: {
    builtInExternals: false,
  },
})
