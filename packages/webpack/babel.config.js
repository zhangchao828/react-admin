const { isDev } = require('@zc/dev-utils/env')
const autoCssModules = require('./plugins/auto-css-modules')

// 现在基本都支持基于 ES modules 的 tree shaking,会慢慢去掉了babel-plugin-import
// const imports = {
//   antd: {
//     style: true,
//     libraryDirectory: 'es',
//   },
//   ...babelImport,
// }
// const importPlugins = []
// Object.keys(imports).forEach((key) => {
//   const config = imports[key]
//   if (config && !externals[key]) {
//     importPlugins.push(['import', { libraryName: key, ...config }, key])
//   }
// })
const babelConfig = {
  presets: [
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
      },
    ],
    [
      '@babel/preset-env',
      {
        modules: false,
        targets: {
          browsers: isDev
            ? ['last 1 chrome version', 'last 1 firefox version', 'last 1 safari version']
            : ['> 2%', 'last 2 versions', 'ie >= 10'],
        },
        useBuiltIns: 'usage',
        corejs: 3,
      },
    ],
    '@babel/typescript',
  ],
  plugins: [
    isDev && 'react-refresh/babel',
    // ['@babel/plugin-proposal-decorators', { legacy: true }],
    // ['@babel/plugin-proposal-class-properties', { loose: false }],
    autoCssModules,
    // ...importPlugins,
  ].filter(Boolean),
}
module.exports = babelConfig
