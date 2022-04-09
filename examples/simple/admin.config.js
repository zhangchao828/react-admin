const defineConfig = require('@zc/admin/define')

module.exports = defineConfig({
  vite: false,
  https: false,
  port: 3006,
  eslint: false,
  webpack: {
    builtInExternals: false,
  },
})
