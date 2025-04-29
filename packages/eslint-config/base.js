module.exports = {
  rules: {
    'generator-star-spacing': 0,
    'func-names': 0,
    'linebreak-style': 0,
    semi: ['error', 'never'], // 语句末位禁止使用分号
    'comma-dangle': [
      'error', // 拖尾逗号
      {
        // 当最后一个元素或属性与结束的 ] 或 } 不同行时，要求尾随逗号；在同一行时，禁止尾随逗号
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'never',
        exports: 'never',
        functions: 'never',
      },
    ],
    'space-before-function-paren': [
      'error', // 函数定义的左括号之前保持一致的空格使用
      {
        anonymous: 'always', // 匿名函数表达式需要空格
        named: 'never', // 命名函数表达式不需要空格
        asyncArrow: 'always', // 异步箭头函数表达式需要空格
      },
    ],
    'arrow-parens': ['error', 'always'], // 箭头函数的参数都需要用圆括号括起来
    'object-shorthand': ['error', 'always'], // 在对象字面量中使用简写语法
    quotes: ['error', 'single', { avoidEscape: true }], // 字符串使用单引号
    'space-unary-ops': 0,
    'class-methods-use-this': 0,
    radix: 0,
    'object-curly-newline': 0, // 在对象字面量的大括号 {} 内部换行
    'operator-linebreak': 0,
    'implicit-arrow-linebreak': 0,
    'spaced-comment': 1,
    'consistent-return': 2, // 函数在所有可能的执行路径中都返回值，或者在任何路径中都不返回值
    'prefer-const': 0,
    'max-len': [
      'error', // 限制代码中每一行的最大长度为100
      100,
      {
        tabWidth: 2,
        ignoreComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
      },
    ],
    'prefer-template': 1, // 使用模板字符串，而不是传统的字符串拼接
    indent: ['error', 2, { SwitchCase: 1 }], // 缩进为2
    camelcase: [
      'error', // 驼峰命名
      {
        properties: 'always',
        ignoreDestructuring: false,
        ignoreImports: false,
        ignoreGlobals: false,
        allow: ['^_'],
      },
    ],
    'eol-last': 0,
    'lines-between-class-members': 0,
    'array-callback-return': 2, // 强制在一些需要有返回值的数组方法的回调函数中使用 return 语句
    'default-case': 0,
    'dot-location': ['error', 'property'], // 点号（.）在多行链式调用中位于属性的开头（即新的一行）
    eqeqeq: 2, // 使用===或!==
    'new-parens': 2, // 强制在无参数的构造函数调用中使用括号
    'require-yield': 2,
    'rest-spread-spacing': ['error', 'never'],
    strict: 0,
    'unicode-bom': 0,
    'use-isnan': 'warn',
    'valid-typeof': 'warn',
    'max-classes-per-file': 0,
    'arrow-body-style': 0,
    'function-paren-newline': 0,
    'prefer-destructuring': ['warn', { object: true, array: false }], // 对象解构，数组不强制解构
    'space-before-blocks': 2, // 在块级语句（如函数声明、if 语句、for 循环等）的左大括号 { 之前需要一个空格
    'space-infix-ops': 2, //  在中缀运算符（如 +、-、*、/、? : 等）前后添加一个空格
    'prefer-promise-reject-errors': 0,
  },
}
