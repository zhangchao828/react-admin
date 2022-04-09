const cheerio = require('cheerio')
const { __entryRelative, __indexHtml } = require('@zc/shared/paths')
const { isDev } = require('@zc/shared/env')
const { join } = require('path')

function transformHtml(html) {
  const $ = cheerio.load(html)
  const body = $('body')
  if (!$('#app').length) {
    body.prepend('<div id="app"></div>')
  }
  body.append(`<script type="module" src="${__entryRelative}"></script>`)
  return $.html()
}
function htmlTransformPlugin() {
  const res = {
    name: 'html-transform',
    enforce: 'pre',
  }
  if (isDev) {
    res.transformIndexHtml = transformHtml
  } else {
    res.transform = (src, id) => {
      if (join(id) === __indexHtml) {
        return {
          code: transformHtml(src),
          map: null,
        }
      }
    }
  }
  return res
}

module.exports = htmlTransformPlugin
