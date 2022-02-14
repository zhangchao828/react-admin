const babelOptions = require('./babel.config')
const { __src, __temporary, __admin } = require('@zc/dev-utils/paths')
const { isDev } = require('@zc/dev-utils/env')
const postcssOptions = require('./postcss.config')
const project = require('@zc/dev-utils/project')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')

const { lessOptions } = project.getConfig()
const cssLoader = {
  loader: 'css-loader',
  options: {
    sourceMap: false,
  },
}
const cssModulesLoader = {
  loader: 'css-loader',
  options: {
    sourceMap: false,
    // 开启 CSS Modules
    modules: {
      mode: 'local',
      localIdentName: '[name]__[local]--[hash:base64:8]',
    },
  },
}
const lessLoader = {
  loader: 'less-loader',
  options: {
    lessOptions: {
      javascriptEnabled: true,
      // 兼容 less-loader 3,否则当使用antd3版本时，会报less编译错误
      // math: 'always',
      ...lessOptions,
    },
  },
}
const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    sourceMap: false,
    postcssOptions,
  },
}
const miniCssLoader = isDev ? 'style-loader' : MiniCssExtractPlugin.loader
// 为了example能正常编译
const exampleAdminPath = path.resolve('../../node_modules/@zc/admin')
module.exports = [
  {
    test: /\.[jt]sx?$/,
    loader: 'babel-loader',
    include: [__src, __temporary, __admin, exampleAdminPath],
    options: {
      cacheDirectory: true,
      ...babelOptions,
    },
  },
  /** css module **/
  {
    test: /\.css$/,
    exclude: /node_modules/,
    oneOf: [
      {
        // 配合auto-css-modules
        resourceQuery: /css_modules/,
        use: [miniCssLoader, cssModulesLoader, postcssLoader],
      },
      {
        use: [miniCssLoader, cssLoader, postcssLoader],
      },
    ],
  },
  {
    test: /\.less$/,
    exclude: /node_modules/,
    oneOf: [
      {
        resourceQuery: /css_modules/,
        use: [miniCssLoader, cssModulesLoader, postcssLoader, lessLoader],
      },
      {
        use: [miniCssLoader, cssLoader, postcssLoader, lessLoader],
      },
    ],
  },
  /** node_modules中的 **/
  {
    test: /\.css$/,
    include: /node_modules/,
    use: [miniCssLoader, cssLoader, postcssLoader],
  },
  {
    test: /\.less$/,
    include: /node_modules/,
    use: [miniCssLoader, cssLoader, postcssLoader, lessLoader],
  },
  // {
  //   test: /\.svg$/,
  //   exclude: /node_modules/,
  //   use: ['@svgr/webpack'],
  // },
  {
    test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
    type: 'asset',
    // generator: {
    //   filename: 'assets/[name].[hash:7][ext]',
    //   // dataUrlCondition: {
    //   //   maxSize: 8 * 1024
    //   // }
    // },
  },
  {
    test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
    type: 'asset',
  },
  {
    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
    type: 'asset',
  },
  {
    test: /\.txt/,
    type: 'asset/source',
  },
]
