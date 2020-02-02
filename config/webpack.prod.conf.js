const { sourceMap, publicPath, outputHash } = require('../utils/hlj/getHljConfig')()
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { getExternals } = require('../utils/webpack')
const { externalsMap } = getExternals()

module.exports = merge(baseWebpackConfig, {
  mode: 'production',
  devtool: sourceMap ? '#source-map' : false,
  output: {
    publicPath: publicPath('output'),
    filename: outputHash ? '[name].[contenthash:8].js' : '[name].js',
    chunkFilename: outputHash ? '[name].[contenthash:8].js' : '[name].js?[contenthash:8]'
  },
  performance: {
    hints: false
  },
  externals: externalsMap,
  optimization: {
    minimize: true,
    namedChunks: true,
    runtimeChunk: 'single',
    minimizer: [
      new TerserPlugin({
        sourceMap,
        parallel: true,
        terserOptions: {
          safari10: true
        },
        cache: true,
        extractComments: false
      }),
      new OptimizeCSSAssetsPlugin({
        /*
         指定cssnano,如果这里不指定，那么css中背景图会被额外处理，
         七牛参数中的/会被转译为%2f,导致图片加载失败
          */
        cssProcessor: require('cssnano'),
        cssProcessorOptions: {
          safe: true,
          autoprefixer: { remove: false },
          ...(sourceMap ? { map: { inline: false } } : {})
        }
      })
    ],
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      name: false,
      cacheGroups: {
        vendor: {
          name: 'vendor',
          chunks: 'initial',
          priority: -10,
          reuseExistingChunk: false,
          test: /[\\/]node_modules[\\/]/
        }
        // TODO: 打包到一个css文件中
        // styles: {
        //   name: 'styles',
        //   test: /\.css|\.less$/,
        //   chunks: 'all',
        //   priority: 30,
        //   enforce: true
        // }
      }
    }
  }
})
