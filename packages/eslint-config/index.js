module.exports = {
  plugins: ['react', 'react-hooks', '@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  extends: [
    'airbnb-base',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
  ].concat(['./import', './no', './react', './base'].map(require.resolve)),
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    jest: true,
    node: true,
  },
  globals: {
    __ENV__: true,
    __DATA__: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {},
}
