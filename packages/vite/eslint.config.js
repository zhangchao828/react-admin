const { resolve } = require('path')

module.exports = {
  root: true,
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      legacyDecorators: true,
    },
    babelOptions: {
      configFile: resolve(__dirname, 'babel.config.js'),
    },
  },
  parser: '@babel/eslint-parser',
  extends: ['@zc/eslint-config'],
}
