const { merge } = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.config')
const { env } = require('zs-shared/env')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

const webpackProdConfig = merge(baseWebpackConfig, {
  mode: 'production',
  devtool: false,
  output: {
    filename: 'js/[name].[contenthash].js',
    chunkFilename: 'js/[name].[contenthash].js',
    hashDigestLength: 10,
  },
  performance: {
    hints: false,
  },
  cache: {
    buildDependencies: {
      config: [__filename],
    },
    name: `build/${env}`,
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
      chunkFilename: 'css/[name].[contenthash].css',
      ignoreOrder: true,
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          // safari10: true,
          // ie8: false,
          output: {
            comments: false,
          },
        },
        extractComments: false,
      }),
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        antd: {
          name: 'chunk-antd',
          test: (module) =>
            [/antd/, /rc-/, /@ant-design/].some((item) => item.test(module.context)),
          enforce: true,
          priority: 1,
        },
        admin: {
          name: 'chunk-admin',
          test: /@sd\/admin/,
          enforce: true,
          priority: 1,
        },
        vendors: {
          name: 'vendors',
          test: /[\\/]node_modules[\\/]/,
          enforce: true,
          priority: 0,
        },
      },
    },
  },
})

module.exports = webpackProdConfig
