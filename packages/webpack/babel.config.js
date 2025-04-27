const { isDev } = require('@glcc/shared/env')
const autoCssModules = require('@glcc/plugins/auto-css-modules')
const moduleWhiteList = require('@glcc/plugins/module-white-list')
const assets = require('@glcc/plugins/assets')
const { __packageJson } = require('@glcc/shared/paths')
const { getConfig } = require('@glcc/shared/project')
const { doctor } = getConfig()

const { browserslist } = require(__packageJson)
let browsers = browserslist
if (!browsers) {
  browsers = isDev
    ? ['last 1 chrome version', 'last 1 firefox version', 'last 1 safari version']
    : ['> 2%', 'last 2 versions', 'ie >= 10']
}
const babelConfig = {
  presets: [
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
      },
    ],
    [
      '@babel/preset-env',
      {
        modules: false,
        targets: {
          browsers,
        },
        useBuiltIns: 'usage',
        corejs: 3,
      },
    ],
    // '@babel/typescript',
  ],
  plugins: [
    isDev && 'react-refresh/babel',
    // ['@babel/plugin-proposal-decorators', { legacy: true }],
    // ['@babel/plugin-proposal-class-properties', { loose: false }],
    autoCssModules,
    assets,
    isDev && doctor && moduleWhiteList,
  ].filter(Boolean),
}
module.exports = babelConfig
