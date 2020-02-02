const { isBuildMode } = require('../tools/env')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { join } = require('path')
const { reactAdminNpmName } = require('../tools/constant')
const { sourceMap, globalLessVars, modifyLessVars } = require('../hlj/getHljConfig')()
const adminPath = join(reactAdminNpmName)
const cssLoader = {
  loader: 'css-loader',
  options: {
    sourceMap
  }
}
const cssModulesLoader = {
  loader: 'css-loader',
  options: {
    sourceMap,
    // 开启 CSS Modules
    modules: {
      mode: 'local',
      // localIdentName: "[path][name]__[local]--[hash:base64:5]",
      localIdentName: '[name]__[local]--[hash:base64:8]'
    }
  }
}
const lessLoader = {
  loader: 'less-loader',
  options: {
    modifyVars: modifyLessVars,
    globalVars: globalLessVars,
    javascriptEnabled: true
  }
}
const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    sourceMap,
    config: {
      path: join(__dirname, '../../config/postcss.config.js')
    }
  }
}
const matchFile = file => /node_modules/.test(file) && !file.includes(adminPath)
module.exports = function() {
  const isBuild = isBuildMode()
  const miniCssLoader = isBuild ? MiniCssExtractPlugin.loader : 'style-loader'
  return [
    /** css module **/
    {
      test: /\.css$/,
      exclude: file => matchFile(file),
      use: [miniCssLoader, cssModulesLoader, postcssLoader]
    },
    {
      test: /\.less$/,
      exclude: file => matchFile(file),
      use: [miniCssLoader, cssModulesLoader, postcssLoader, lessLoader]
    },
    /** node_modules中的 **/
    {
      test: /\.css$/,
      include: file => matchFile(file),
      use: [miniCssLoader, cssLoader]
    },
    {
      test: /\.less$/,
      include: file => matchFile(file),
      use: [miniCssLoader, cssLoader, lessLoader]
    }
  ]
}
