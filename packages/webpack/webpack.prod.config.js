const { merge } = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.config')
const { env } = require('@zswl/shared/env')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

function sizeBetween(value, f) {
  const step = 0.5 // 数值越大，打包出来的js数量越少，但体积更大
  return value >= f * step * 1024 && value < (f + 1) * step * 1024
}
// 为了将node_modules中的js打包到一起，并按照体积分成多个，避免一个文件太大
function getBundleName(size) {
  for (let index = 0; index <= 50; index++) {
    if (sizeBetween(size, index)) {
      return `module-${index}`
    }
  }
  return null
}
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
        // vendor: {
        //   test: /[\\/]node_modules[\\/]/,
        //   enforce: true,
        //   priority: 0,
        //   name(module) {
        //     const size = module.size()
        //     const bundleName = getBundleName(size)
        //     if (bundleName) {
        //       return bundleName
        //     }
        //     const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)
        //     let name = packageName?.[1]
        //     if (name) {
        //       name = name.replace('@', '')
        //       if (['.admin', 'zswl'].includes(name)) {
        //         return 'zswl'
        //       }
        //       return name
        //     }
        //   },
        // },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          enforce: true,
          priority: 0,
          name(module) {
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)
            let name = packageName?.[1]
            if (name) {
              name = name.replace('@', '')
              if (['.admin', 'zswl'].includes(name)) {
                return 'zswl'
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
