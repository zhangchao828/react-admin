module.exports = {
  rules: {
    'import/named': 0,
    'import/no-unresolved': 0,
    'import/export': 0,
    'import/order': [
      'error', // 导入顺序：内置模块，再第三方模块，再相对路径模块
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        pathGroups: [
          {
            pattern: 'react',
            group: 'builtin',
            position: 'before',
          },
        ],
      },
    ],
    'import/no-extraneous-dependencies': 0,
    'import/prefer-default-export': 0,
    'import/newline-after-import': 2, // 最后一行import后需要空一行
    'import/extensions': 0,
    'import/first': 'error',
    'import/no-amd': 'error',
    'import/no-dynamic-require': 0,
    'import/no-webpack-loader-syntax': 'error',
    'import/no-cycle': 0,
    'import/dynamic-import-chunkname': 0,
    // 不允许导出匿名
    'import/no-anonymous-default-export': [
      'error',
      {
        allowArray: true,
        allowArrowFunction: false,
        allowAnonymousClass: false,
        allowAnonymousFunction: false,
        allowCallExpression: true,
        allowLiteral: true,
        allowObject: true,
      },
    ],
  },
}
