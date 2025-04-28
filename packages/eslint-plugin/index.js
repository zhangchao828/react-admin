function isReactFunctionComponent(node) {
  // 处理函数声明 (function MyComponent() {})
  if (node.type === 'FunctionDeclaration') {
    return node.id?.name?.[0] === node.id?.name?.[0]?.toUpperCase()
  }

  // 处理变量声明的组件 (const MyComponent = () => {})
  if (
    node.type === 'VariableDeclarator' &&
    node.id.type === 'Identifier' &&
    node.id.name?.[0] === node.id.name?.[0]?.toUpperCase()
  ) {
    const init = node.init
    return (
      init?.type === 'ArrowFunctionExpression' || // 箭头函数
      init?.type === 'FunctionExpression' || // 普通函数表达式
      (init?.type === 'CallExpression' && // 可能的高阶组件（如 memo）
        init.callee?.name === 'memo')
    )
  }

  // 处理直接导出的函数 (export default function() {})
  if (node.parent?.type === 'ExportDefaultDeclaration' && node.type === 'FunctionDeclaration') {
    // 检查是否有 displayName 或上下文暗示这是一个组件
    // 这里可能需要更复杂的上下文分析
  }

  return false
}
module.exports = {
  rules: {
    'no-function-in-function-component': {
      meta: {
        type: 'problem',
        docs: {
          description: '组件内部不要使用function声明函数，请使用箭头函数',
          category: 'Possible Errors',
          recommended: true,
        },
        schema: [], // No options
      },
      create(context) {
        return {
          FunctionDeclaration(node) {
            let current = node.parent
            while (current) {
              if (isReactFunctionComponent(current)) {
                context.report({
                  node,
                  message: `在组件内部不要使用 function 声明函数:${node.id?.name}，请使用箭头函数`,
                })
                break
              }
              current = current.parent
            }
          },
        }
      },
    },
  },
}
