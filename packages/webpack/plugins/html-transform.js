const HtmlWebpackPlugin = require('html-webpack-plugin')
const cheerio = require('cheerio')
const { isDev } = require('@zc/dev-utils/env')
const optimizeExternals = require('../optimizeExternals')
const { RUN_TIME, REACT_REFRESH, APP } = require('../constant')

class HtmlTransform {
  apply(compiler) {
    const { path: outputPath, publicPath } = compiler.options.output
    const { externals: webpackExternals, scripts } = optimizeExternals({
      outputPath,
      publicPath,
    })
    compiler.options.externals = webpackExternals
    compiler.hooks.compilation.tap('HtmlTransform', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).afterTemplateExecution.tapAsync(
        'HtmlTransform',
        (htmlPluginData, callback) => {
          const $ = cheerio.load(htmlPluginData.html)
          this.initRootNode($)
          if (isDev) {
            /*
          注入ReactRefresh和runtime，因为使用external时，必须将ReactRefresh也external化
          并且必须在react和react-dom之前运行，所以要在injectExternalScripts之前注入
          以下注入必须按照这样的先后顺序,否则热更新会失效
           */
            this.injectRuntime($, htmlPluginData)
            this.injectExternalScripts($, scripts)
            this.injectAppTag($, htmlPluginData)
          } else {
            this.injectExternalScripts($, scripts)
          }
          htmlPluginData.html = $.html()
          callback(null, htmlPluginData)
        }
      )
    })
  }
  initRootNode($) {
    if (!$('#app').length) {
      $('body').prepend('<div id="app"></div>')
    }
  }
  findTag(htmlPluginData, tagName) {
    const match = htmlPluginData.headTags.find((item) => {
      const { src } = item.attributes
      return src && src.endsWith(`/${tagName}.js`)
    })
    if (match) {
      return `<script src="${match.attributes.src}"></script>`
    }
  }
  injectRuntime($, htmlPluginData) {
    const runtime = this.findTag(htmlPluginData, RUN_TIME)
    const refresh = this.findTag(htmlPluginData, REACT_REFRESH)
    if (runtime) {
      $('#app').before(runtime)
    }
    if (refresh) {
      $('#app').after(refresh)
    }
  }
  injectAppTag($, htmlPluginData) {
    const entry = this.findTag(htmlPluginData, APP)
    if (entry) {
      $('body').append(entry)
    }
  }
  injectExternalScripts($, scripts) {
    scripts.forEach(({ src, async }) => {
      if (src) {
        $('body').append(
          async ? `<script src="${src}" async="async"></script>` : `<script src="${src}"></script>`
        )
      }
    })
  }
}
module.exports = HtmlTransform
