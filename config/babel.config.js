const { babel, babelImport } = require('../utils/hlj/getHljConfig')()
const lodash = require('lodash')
const { isBuildMode } = require('../utils/tools/env')

const defaultImport = {
  antd: {
    style: true
  },
  'react-admin-core/components': {
    libraryDirectory: '',
    camel2DashComponentName: false
  },
  ...babelImport
}
const defaultImportPlugins = []
Object.keys(defaultImport).forEach(key => {
  const config = defaultImport[key]
  if (lodash.isPlainObject(config)) {
    defaultImportPlugins.push(['import', { libraryName: key, ...config }, key])
  }
})
const babelPlugins = [
  ...(isBuildMode() ? [] : ['react-hot-loader/babel']),
  // babel/core7.8.0之后以下两项默认开启了
  // '@babel/plugin-syntax-dynamic-import',
  // '@babel/plugin-proposal-optional-chaining',
  ['@babel/plugin-proposal-decorators', { legacy: true }],
  ['@babel/plugin-proposal-class-properties', { loose: true }]
].concat(defaultImportPlugins)
const options = {
  babelrc: false,
  cacheDirectory: true,
  presets: [
    '@babel/preset-react',
    [
      '@babel/preset-env',
      {
        modules: false,
        targets: {
          browsers: ['> 1%', 'last 2 versions', 'not ie <= 8']
        },
        useBuiltIns: 'usage',
        corejs: 2
      }
    ],
    '@babel/typescript'
  ],
  plugins: babelPlugins
}
module.exports = lodash.isFunction(babel) ? babel(options) : options
