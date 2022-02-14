const { createServer } = require('vite')
const react = require('@vitejs/plugin-react')
const rollupEslint = require('@rollup/plugin-eslint')
const eslintFormatter = require('eslint-friendly-formatter')
const { getConfig } = require('@zc/dev-utils/project')
const { define } = require('@zc/dev-utils/env')
const postcss = require('./postcss.config')
const htmlTransform = require('./plugins/html-transform')
const mock = require('./plugins/mock')
const eslintConfig = require('./eslint.config')
const alias = require('@zc/dev-utils/alias')
const { __root } = require('@zc/dev-utils/paths')

const { port, eslint, proxy, lessOptions, https } = getConfig()

async function start() {
  const server = await createServer({
    root: __root,
    configFile: false,
    resolve: { alias },
    server: { port, proxy, open: false, host: true, https },
    define,
    css: {
      postcss,
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          ...lessOptions,
        },
      },
    },
    plugins: [
      mock(),
      htmlTransform(),
      eslint && {
        enforce: 'pre',
        ...rollupEslint({
          include: /src\/.*\.[jt]sx?$/,
          exclude: /node_modules/,
          formatter: eslintFormatter,
          baseConfig: eslintConfig,
        }),
      },
      react(),
    ].filter(Boolean),
  })
  await server.listen()
  server.printUrls()
}
module.exports = start
