const defineConfig = require('@zc/admin/define')

module.exports = defineConfig({
  useFileRouter: false,
  webpack: {
    builtInExternals: false,
  },
})
