const HtmlWebpackPlugin = require('html-webpack-plugin')
const cheerio = require('cheerio')
const { isDev } = require('@zswl/shared/env')
const { getConfig } = require('@zswl/shared/project')
const optimizeExternals = require('./optimizeExternals')
const { RUN_TIME, REACT_REFRESH, APP } = require('@zswl/shared/constant')

const { federation } = getConfig()
class HtmlTransform {
  scripts = []
  css = []
  apply(compiler) {
    if (federation.name) {
      // todo 当是qiankun应用或者模块联邦的时候不设置externals，如果设置externals不知道会不会有问题，待验证
    }
    const { path: outputPath, publicPath } = compiler.options.output
    const { webpackExternals, scripts, css } = optimizeExternals({
      outputPath,
      publicPath,
    })
    this.scripts = scripts
    this.css = css
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
            this.injectCss($)
            this.injectExternalScripts($)
            this.injectAppTag($, htmlPluginData)
          } else {
            this.injectCss($)
            this.injectExternalScripts($)
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
  injectExternalScripts($) {
    this.scripts?.forEach(({ src, async }) => {
      if (src) {
        $('body').append(
          async ? `<script src="${src}" async="async"></script>` : `<script src="${src}"></script>`
        )
      }
    })
  }
  injectCss($) {
    this.css?.forEach((href) => {
      $('head').append(`<link rel="stylesheet" href="${href}">`)
    })
  }
}
module.exports = HtmlTransform
