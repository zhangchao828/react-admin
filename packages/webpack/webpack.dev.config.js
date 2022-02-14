const { merge } = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.config')
const { getConfig } = require('@zc/dev-utils/project')
const { env } = require('@zc/dev-utils/env')
const { REACT_REFRESH } = require('./constant')
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const eslintFormatter = require('eslint-friendly-formatter')
// const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const { join } = require('path')
const eslintConfig = require('./eslint.config')

const {
  eslint,
  webpack: { lazyCompilation },
} = getConfig()
const webpackDevConfig = merge(baseWebpackConfig, {
  mode: 'development',
  entry: {
    [REACT_REFRESH]: '@pmmmwh/react-refresh-webpack-plugin/client/ReactRefreshEntry.js',
  },
  devtool: 'eval-cheap-module-source-map',
  infrastructureLogging: {
    level: 'warn',
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
  },
  cache: {
    buildDependencies: {
      config: [__filename],
    },
    name: `start/${env}`,
  },
  experiments: {
    // buildHttp: true,
    // topLevelAwait: true,
    lazyCompilation: lazyCompilation && {
      // entries设置为true可能会导致首次打开页面空白需要手动刷新一次页面才行
      entries: false,
      ...lazyCompilation,
    },
  },
  plugins: [
    eslint &&
      new ESLintPlugin({
        overrideConfig: eslintConfig,
        formatter: eslintFormatter,
        fix: false,
        useEslintrc: false,
        extensions: ['js', 'jsx', 'tsx', 'ts'],
      }),
    // new CaseSensitivePathsPlugin(),
    new ReactRefreshPlugin({
      overlay: { entry: false },
    }),
  ].filter(Boolean),
})
module.exports = webpackDevConfig
