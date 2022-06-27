const { isDev } = require('zs-shared/env')
const autoCssModules = require('./plugins/auto-css-modules')

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
    autoCssModules,
  ].filter(Boolean),
}
module.exports = babelConfig
