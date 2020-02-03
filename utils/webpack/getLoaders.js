const { publicPath, eslint } = require('../hlj/getHljConfig')()
const babelOptions = require('../../config/babel.config')
const styleLoaders = require('./styleLoaders')()
const { join } = require('path')
const { isBuildMode } = require('../tools/env')
const { reactAdminNpmName } = require('../tools/constant')
const adminPath = join(reactAdminNpmName)
const adminNMPath = join(reactAdminNpmName + '/node_modules')
const isBuild = isBuildMode()
module.exports = function() {
  return [
    ...(isBuild || !eslint
      ? []
      : [
          {
            test: /\.(jsx?)$/,
            loader: 'eslint-loader',
            enforce: 'pre',
            exclude: /node_modules/,
            options: {
              formatter: require('eslint-friendly-formatter'),
              configFile: join(__dirname, '../../config/eslint.config.js'),
              fix: false,
              useEslintrc: false
            }
          }
        ]),
    {
      test: /\.(js|ts)x?$/,
      loader: 'babel-loader',
      exclude: file => {
        return (
          (/node_modules/.test(file) && !file.includes(adminPath)) || file.includes(adminNMPath)
        )
      },
      options: babelOptions
    },
    {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 5000,
        name: 'images/[name].[hash:7].[ext]',
        publicPath: publicPath('image')
      }
    },
    {
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 5000,
        name: 'media/[name].[hash:7].[ext]',
        publicPath: publicPath('media')
      }
    },
    {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 5000,
        name: 'fonts/[name].[hash:7].[ext]',
        publicPath: publicPath('font')
      }
    },
    ...styleLoaders
  ]
}
