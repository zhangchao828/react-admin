const { resolve } = require('path')
const { PROJECT_CONFIG, LOCAL_CONFIG } = require('./constant')
const resolvePath = (...path) => resolve(process.cwd(), ...path)

// 构建时生成的临时文件的存放路径
const temporary = '.admin'
module.exports = {
  __packageJson: resolvePath('package.json'),
  __nodeModules: resolvePath('node_modules'),
  __static: resolvePath('public'),
  __root: process.cwd(),
  __projectConfig: resolvePath(PROJECT_CONFIG),
  __localConfig: resolvePath(LOCAL_CONFIG),
  __dist: resolvePath('dist'),
  __src: resolvePath('src'),
  __indexHtml: resolvePath('index.html'),
  __env: resolvePath('src/env'),
  __pages: resolvePath('src/pages'),
  __layout: resolvePath('src/layout'),
  __temporary: resolvePath(temporary),
  __admin: resolvePath('node_modules/@zc/admin'),
  __entryDir: resolvePath(`${temporary}/entry`),
  __entry: resolvePath(temporary, 'entry/index.jsx'),
  __entryRelative: `/${temporary}/entry/index.jsx`,
  __routes: resolvePath(`${temporary}/routes.jsx`),
  __remotes: resolvePath(`${temporary}/remotes.js`),
  __mock: resolvePath('mock'),
}
