module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    ecmaFeatures: {
      jsx: true,
      legacyDecorators: true
    }
  },
  parser: 'babel-eslint',
  plugins: ['react', 'react-hooks'],
  extends: ['plugin:react/recommended', 'airbnb-base'],
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    jest: true,
    node: true
  },
  globals: {
    __ENV__: true,
    __MODE__: true
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    'generator-star-spacing': 'off',
    'func-names': 0,
    'linebreak-style': 0,
    'no-new': 0,
    'no-debugger': 0,
    'no-console': 0,
    'no-alert': 0,
    'no-param-reassign': 0,
    'import/named': 0,
    'import/no-unresolved': 0,
    'import/export': 0,
    'import/order': 0,
    'import/no-extraneous-dependencies': 0,
    'import/prefer-default-export': 0,
    'import/newline-after-import': 1,
    'import/extensions': 0,
    semi: ['error', 'never', { beforeStatementContinuationChars: 'never' }],
    'comma-dangle': 0,
    'space-before-function-paren': 0,
    'arrow-parens': 0,
    quotes: 0,
    'no-plusplus': 0,
    'space-unary-ops': 0,
    'no-underscore-dangle': 0,
    'class-methods-use-this': 0,
    radix: 0,
    'object-curly-newline': 0,
    'no-tabs': 0,
    'no-multi-assign': 0,
    'operator-linebreak': 0,
    'implicit-arrow-linebreak': 0,
    'spaced-comment': 0,
    'no-unused-vars': 1,
    'consistent-return': 1,
    'no-extra-boolean-cast': 1,
    'prefer-const': 1,
    'no-else-return': 1,
    'max-len': ['warn', { code: 200 }],
    indent: 0,
    'prefer-template': 0,
    camelcase: 0,
    'eol-last': 0,
    'lines-between-class-members': 0,
    /* React相关 */
    'react/jsx-no-bind': 0,
    'react/prop-types': 0,
    'react/jsx-no-literals': 0,
    'react/no-did-mount-set-state': 0,
    'react/display-name': 0,
    'react/button-has-type': 0,
    'array-callback-return': 'warn',
    'default-case': 0,
    'dot-location': ['warn', 'property'],
    eqeqeq: 0,
    'new-parens': 'warn',
    'no-array-constructor': 'warn',
    'no-caller': 'warn',
    'no-cond-assign': ['warn', 'always'],
    'no-const-assign': 'warn',
    'no-control-regex': 'warn',
    'no-delete-var': 'warn',
    'no-dupe-args': 'warn',
    'no-dupe-class-members': 'warn',
    'no-dupe-keys': 'warn',
    'no-duplicate-case': 'warn',
    'no-empty-character-class': 'warn',
    'no-empty-pattern': 'warn',
    'no-eval': 'warn',
    'no-ex-assign': 'warn',
    'no-extend-native': 'warn',
    'no-extra-bind': 'warn',
    'no-extra-label': 'warn',
    'no-fallthrough': 'warn',
    'no-func-assign': 'warn',
    'no-implied-eval': 'warn',
    'no-invalid-regexp': 'warn',
    'no-iterator': 'warn',
    'no-label-var': 'warn',
    'no-labels': ['warn', { allowLoop: true, allowSwitch: false }],
    'no-lone-blocks': 'warn',
    'no-loop-func': 'warn',
    'no-return-await': 'warn',
    'no-mixed-operators': [
      'warn',
      {
        groups: [
          ['&', '|', '^', '~', '<<', '>>', '>>>'],
          ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
          ['&&', '||'],
          ['in', 'instanceof']
        ],
        allowSamePrecedence: false
      }
    ],
    'no-multi-str': 'warn',
    'no-native-reassign': 'warn',
    'no-negated-in-lhs': 'warn',
    'no-new-func': 'warn',
    'no-new-object': 'warn',
    'no-new-symbol': 'warn',
    'no-new-wrappers': 'warn',
    'no-obj-calls': 'warn',
    'no-octal': 'warn',
    'no-octal-escape': 'warn',
    'no-redeclare': 'warn',
    'no-regex-spaces': 'warn',
    'no-restricted-syntax': ['warn', 'WithStatement'],
    'no-script-url': 0,
    'no-self-assign': 'warn',
    'no-self-compare': 'warn',
    'no-sequences': 'warn',
    'no-shadow-restricted-names': 'warn',
    'no-sparse-arrays': 'warn',
    'no-template-curly-in-string': 'warn',
    'no-this-before-super': 'warn',
    'no-throw-literal': 'warn',
    'no-undef': 'error',
    // 'no-restricted-globals': ['error'].concat(restrictedGlobals),
    'no-unexpected-multiline': 'warn',
    'no-unreachable': 'warn',
    'no-unused-expressions': [
      'warn',
      {
        allowShortCircuit: true,
        allowTernary: true,
        allowTaggedTemplates: true
      }
    ],
    'no-unused-labels': 'warn',
    'no-use-before-define': [
      'warn',
      {
        functions: false,
        classes: false,
        variables: false
      }
    ],
    'no-useless-computed-key': 'warn',
    'no-useless-concat': 'warn',
    'no-useless-constructor': 'warn',
    'no-useless-escape': 'warn',
    'no-useless-rename': [
      'warn',
      {
        ignoreDestructuring: false,
        ignoreImport: false,
        ignoreExport: false
      }
    ],
    'no-with': 'warn',
    'no-whitespace-before-property': 'warn',
    'require-yield': 'warn',
    'rest-spread-spacing': ['warn', 'never'],
    strict: ['warn', 'never'],
    'unicode-bom': ['warn', 'never'],
    'use-isnan': 'warn',
    'valid-typeof': 'warn',
    'no-restricted-properties': [
      'error',
      {
        object: 'System',
        property: 'import',
        message:
            'Please use import() instead. More info: https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#code-splitting'
      }
    ],
    // 一个const，let 定义一个变量
    'one-var': ['warn', 'never'],
    // 不使用 var
    'no-var': 'warn',
    'no-confusing-arrow': 0,
    'arrow-body-style': 0,
    'function-paren-newline': 0,
    // 对象解构，数组不强制解构
    'prefer-destructuring': ['warn', { object: true, array: false }],
    'no-trailing-spaces': 'warn',
    // https://github.com/benmosher/eslint-plugin-import/tree/master/docs/rules
    'import/first': 'error',
    'import/no-amd': 'error',
    'import/no-webpack-loader-syntax': 'error',

    // https://github.com/yannickcr/eslint-plugin-react/tree/master/docs/rules
    'react/jsx-no-comment-textnodes': 'warn',
    'react/jsx-no-duplicate-props': ['warn', { ignoreCase: true }],
    'react/jsx-no-target-blank': 'warn',
    'react/jsx-no-undef': 'error',
    'react/jsx-pascal-case': [
      'warn',
      {
        allowAllCaps: true,
        ignore: []
      }
    ],
    'react/jsx-uses-react': 'warn',
    'react/jsx-uses-vars': 'warn',
    'react/no-danger-with-children': 'warn',
    'react/no-deprecated': 'warn',
    'react/no-direct-mutation-state': 'warn',
    'react/no-is-mounted': 'warn',
    'react/react-in-jsx-scope': 'error',
    'react/require-render-return': 'error',
    'react/style-prop-object': 'warn',
    'react/no-string-refs': 'warn',
    'react/no-unescaped-entities': 'warn',
    'react/jsx-filename-extension': 0,
    // hooks
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn'
  }
}
