const { __root, __pages, __layout, __src } = require('../paths')
const { isBuildMode } = require('../tools/env')
const { alias } = require('../hlj/getHljConfig')()

module.exports = function() {
  const _alias = {
    ...alias,
    '@root': __root,
    '@src': __src,
    '@pages': __pages,
    '@layout': __layout
  }
  if (!isBuildMode()) {
    _alias['@hlj/share/Http'] = '@hlj/share/Http/mock'
  }
  return _alias
}
