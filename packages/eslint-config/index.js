module.exports = {
  plugins: ['react', 'react-hooks', '@typescript-eslint', '@glcc'],
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
  rules: {
    '@typescript-eslint/no-unused-vars': 0,
    '@typescript-eslint/no-empty-object-type': 0,
    '@glcc/no-function-in-function-component': 2,
  },
}
