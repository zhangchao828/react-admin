const { extname } = require('path')
const suffix = ['.css', '.less', '.scss']

module.exports = () => {
  return {
    visitor: {
      ImportDeclaration(path) {
        const { specifiers, source } = path.node
        const { value } = source
        if (specifiers.length > 0 && suffix.includes(extname(value))) {
          // 在路径末尾加上 css-modules 用于 webpack 匹配该文件
          source.value = `${value}?css-modules`
        }
      },
    },
  }
}
