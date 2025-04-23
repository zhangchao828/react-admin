const { __nodeModules, __api } = require('@zswl/shared/paths')

module.exports = function (source) {
  const options = this.getOptions()
  const { limit = 500 } = options || {}
  const lineCount = source.trim().split('\n').length
  const exclude = [__nodeModules, __api].some((path) => this.resourcePath.includes(path))
  if (!exclude && lineCount > limit) {
    return this.callback(new Error(`代码行数超过${limit}行,请合理组织代码结构`))
  }
  return source
}
