const { getConfig } = require('@glcc/shared/project')
const { publicPath } = getConfig()

module.exports = function ({ types: t }) {
  return {
    visitor: {
      JSXOpeningElement(path) {
        const { node } = path
        // 处理图片src
        if (node.name.name === 'img') {
          node.attributes.forEach((attr) => {
            if (attr.name.name === 'src' && t.isStringLiteral(attr.value)) {
              let srcValue = attr.value.value
              // if (srcValue.startsWith('/public/')) {
              //   attr.value = t.stringLiteral(srcValue.replace('/public', `${publicPath}public`))
              //   srcValue = `@${srcValue}`
              // }
              if (!srcValue.startsWith('http')) {
                if (srcValue.endsWith('.svg')) {
                  srcValue += '?url'
                }
                attr.value = t.memberExpression(
                  t.newExpression(t.identifier('URL'), [
                    t.stringLiteral(srcValue),
                    t.identifier('import.meta.url'),
                  ]),
                  t.identifier('href')
                )
                // const val = t.callExpression(t.identifier('require'), [t.stringLiteral(srcValue)])
                // const newAttr = t.jSXAttribute(
                //   t.jSXIdentifier('src'),
                //   t.jSXExpressionContainer(val)
                // )
                // const index = node.attributes.indexOf(attr)
                // node.attributes[index] = newAttr
              }
            }
          })
        }
      },
    },
  }
}
