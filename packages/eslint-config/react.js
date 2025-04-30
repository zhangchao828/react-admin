module.exports = {
  rules: {
    'react/jsx-no-bind': 0,
    'react/prop-types': 0,
    'react/jsx-no-literals': 0,
    'react/no-did-mount-set-state': 0,
    'react/display-name': 0,
    'react/button-has-type': 0,
    'react/jsx-no-comment-textnodes': 'warn',
    'react/jsx-no-duplicate-props': ['warn', { ignoreCase: true }], // 禁止重复属性
    'react/jsx-no-target-blank': 0,
    'react/jsx-no-undef': 'error',
    'react/jsx-pascal-case': [
      'error',
      {
        allowAllCaps: true,
        ignore: [],
      },
    ],
    'react/jsx-uses-react': 0,
    'react/jsx-uses-vars': 'warn',
    'react/no-danger-with-children': 'warn',
    'react/no-deprecated': 'warn',
    'react/no-direct-mutation-state': 'warn',
    'react/no-is-mounted': 'warn',
    'react/react-in-jsx-scope': 0,
    'react/require-render-return': 'error',
    'react/style-prop-object': 'warn',
    'react/no-string-refs': 'warn',
    'react/no-unescaped-entities': 'warn',
    'react/jsx-filename-extension': 0,
    'react-hooks/rules-of-hooks': 1, // hooks 规则
    'react-hooks/exhaustive-deps': 1, // 依赖报警
    'react/jsx-closing-bracket-location': ['warn', 'tag-aligned'], // 闭合标签与 JSX 元素的开始标签的起始位置对齐
    'react/jsx-closing-tag-location': 'warn', // 要求闭合标签与起始标签对齐
    'react/jsx-boolean-value': ['warn', 'never'], // JSX 中布尔属性的书写需要省略true
    'react/jsx-child-element-spacing': 'warn', //  要求在 JSX 子元素之间始终添加空格或换行
    'react/jsx-curly-brace-presence': ['warn', 'never'], // jsx属性禁止使用不必要的花括号
    'react/jsx-space-before-closing': ['warn', 'always'], // JSX 标签的闭合尖括号前必须有一个空格
    'react/jsx-wrap-multilines': [
      'warn', // 多行 JSX 表达式中强制使用括号包裹
      {
        declaration: 'parens-new-line',
        assignment: 'parens-new-line',
        return: 'parens-new-line',
        arrow: 'parens-new-line',
        condition: 'parens-new-line',
        logical: 'parens-new-line',
        prop: 'parens-new-line',
      },
    ],
    'react/no-array-index-key': 1, // 不能用数组的index作为key
    'react/no-children-prop': 2, // 防止在 JSX 中显式地传递 `children` 属性
    'react/self-closing-comp': 1,// 在 JSX 中，没有子元素的组件使用自闭合标签

  },
}
