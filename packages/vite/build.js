const { build } = require('vite')
const legacy = require('@vitejs/plugin-legacy')
const react = require('@vitejs/plugin-react')
const { getConfig } = require('@zc/dev-utils/project')
const { define } = require('@zc/dev-utils/env')
const postcss = require('./postcss.config')
const htmlTransform = require('./plugins/html-transform')
const alias = require('@zc/dev-utils/alias')
const { __root } = require('@zc/dev-utils/paths')

const { lessOptions, publicPath } = getConfig()

async function buildApp() {
  await build({
    root: __root,
    base: publicPath,
    configFile: false,
    resolve: { alias },
    define,
    build: {
      reportCompressedSize: false,
    },
    css: {
      postcss,
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          ...lessOptions,
        },
      },
    },
    plugins: [htmlTransform(), react(), legacy()],
  })
}
module.exports = buildApp
