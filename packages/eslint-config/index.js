module.exports = {
  plugins: ['react', 'react-hooks'],
  extends: ['plugin:react/recommended', 'airbnb-base'].concat(
    ['./import', './no', './react', './base'].map(require.resolve)
  ),
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    jest: true,
    node: true,
  },
  globals: {
    __ENV__: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {},
}
