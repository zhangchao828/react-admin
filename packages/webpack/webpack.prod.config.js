const { merge } = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.config')
const { env } = require('@glcc/shared/env')
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
          compress: {
            drop_console: true,
          },
        },
        extractComments: false,
      }),
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          enforce: true,
          priority: 0,
          name(module) {
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)
            let name = packageName?.[1]
            if (name) {
              name = name.replace('@', '')
              if (['.admin', 'glcc'].includes(name)) {
                return 'glcc'
              }
              return name
            }
          },
        },
        // antd: {
        //   name: 'chunk-antd',
        //   test: (module) =>
        //     [/antd/, /rc-/, /@ant-design/].some((item) => item.test(module.context)),
        //   enforce: true,
        //   priority: 1,
        // },
        // vendor: {
        //   name: 'vendors',
        //   test: /[\\/]node_modules[\\/]/,
        //   enforce: true,
        //   priority: 0,
        // },
      },
    },
  },
})

module.exports = webpackProdConfig
