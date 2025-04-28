module.exports = {
  rules: {
    'no-function-in-function-component': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Disallow function declarations inside React function components',
          category: 'Possible Errors',
          recommended: true,
        },
        schema: [], // No options
      },
      create(context) {
        return {
          ArrowFunctionExpression(node) {
            if (
              node.params.length === 1 &&
              node.params[0].type === 'Identifier' &&
              node.params[0].name === 'props'
            ) {
              const body = node.body
              if (body.type === 'BlockStatement') {
                body.body.forEach((stmt) => {
                  if (stmt.type === 'FunctionDeclaration') {
                    context.report({
                      node: stmt,
                      message: '组件内部不要使用function声明函数，请使用箭头函数',
                    })
                  }
                })
              }
            }
          },
        }
      },
    },
  },
}
