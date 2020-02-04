const HtmlWebpackPlugin = require('html-webpack-plugin')
const cheerio = require('cheerio')
const { isBuildMode } = require('../tools/env')
/**
 * 这里主要是自动注入和初始化一些重要的资源
 */
const { injectExternals } = require('./inject')
function ReplaceHtmlPlugin() {}
ReplaceHtmlPlugin.prototype.apply = function(compiler) {
  compiler.hooks.compilation.tap('ReplaceHtmlPlugin', compilation => {
    HtmlWebpackPlugin.getHooks(compilation).afterTemplateExecution.tapAsync(
      'ReplaceHtmlPlugin',
      (htmlPluginData, callback) => {
        const $ = cheerio.load(htmlPluginData.html)
        // 注入初始化的css样式
        // injectResetStyle($)
        if (isBuildMode()) {
          injectExternals($)
        }
        htmlPluginData.html = $.html()
        callback(null, htmlPluginData)
      }
    )
  })
}
module.exports = ReplaceHtmlPlugin
