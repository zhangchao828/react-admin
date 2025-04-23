const babelOptions = require('./babel.config')
const { isDev, admin } = require('@zswl/shared/env')
const postcssOptions = require('./postcss.config')
const project = require('@zswl/shared/project')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { __src, __temporary } = require('@zswl/shared/paths')
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
      exportLocalsConvention: 'dashes',
      namedExport: false,
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
const babelLoader = {
  loader: 'babel-loader',
  options: {
    cacheDirectory: true,
    ...babelOptions,
  },
}
// 代码行数限制500行
const lineLimitLoader = {
  loader: path.resolve(__dirname, 'lineLimit.js'),
  options: {
    limit: 500,
  },
}
const tsLoader = {
  loader: 'ts-loader',
  options: {
    transpileOnly: isDev,
  },
}
const miniCssLoader = isDev ? 'style-loader' : MiniCssExtractPlugin.loader

module.exports = [
  {
    test: /\.jsx?$/,
    include: [__src, __temporary, admin && path.join(__dirname, '../admin/src')].filter(Boolean),
    oneOf: [
      // {
      //   resourceQuery: /ignore-line-limit/,
      //   use: [babelLoader],
      // },
      {
        use: [babelLoader, lineLimitLoader],
      },
    ],
  },
  {
    test: /\.tsx?$/,
    exclude: /node_modules/,
    use: [tsLoader, lineLimitLoader],
  },
  /** css module **/
  {
    test: /\.css$/,
    exclude: /node_modules/,
    oneOf: [
      {
        // 配合auto-css-modules
        resourceQuery: /css-modules/,
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
        resourceQuery: /css-modules/,
        use: [miniCssLoader, cssModulesLoader, postcssLoader, lessLoader],
      },
      {
        use: [miniCssLoader, cssLoader, postcssLoader, lessLoader],
      },
    ],
  },
  /** node_modules中的 css**/
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
  {
    test: /\.svg$/i,
    issuer: /\.[jt]sx?$/,
    exclude: /node_modules/,
    resourceQuery: { not: [/url/] },
    use: [{ loader: '@svgr/webpack', options: { memo: true } }],
  },
  { test: /\.svg$/i, type: 'asset', resourceQuery: /url/ },
  {
    test: /\.(png|jpe?g|gif)(\?.*)?$/,
    type: 'asset',
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
