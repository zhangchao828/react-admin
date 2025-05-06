const path = require('path')

module.exports = {
  root: true,
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      legacyDecorators: true,
    },
    babelOptions: {
      configFile: path.resolve(__dirname, 'babel.config.js'),
    },
  },
  extends: ['@glcc/eslint-config'],
}
