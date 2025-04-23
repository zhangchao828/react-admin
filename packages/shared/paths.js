const { resolve } = require('path')
const { PROJECT_CONFIG, LOCAL_CONFIG } = require('./constant')
const resolvePath = (...path) => resolve(process.cwd(), ...path)

// 构建时生成的临时文件的存放路径
const temporary = 'node_modules/.admin'
module.exports = {
  __packageJson: resolvePath('package.json'),
  __nodeModules: resolvePath('node_modules'),
  __static: resolvePath('public'),
  __root: process.cwd(),
  __projectConfig: resolvePath(PROJECT_CONFIG),
  __localConfig: resolvePath(LOCAL_CONFIG),
  __dist: resolvePath('dist'),
  __distDataJson: resolvePath('dist/data.json'),
  __distFederationVersion: resolvePath('dist/federation-version.js'),
  __src: resolvePath('src'),
  __indexHtml: resolvePath('index.html'),
  __env: resolvePath('src/env'),
  __pages: resolvePath('src/pages'),
  __layout: resolvePath('src/layout'),
  __api: resolvePath('src/api'),
  __temporary: resolvePath(temporary),
  __admin: resolvePath('node_modules/@glcc/admin'),
  __entryDir: resolvePath(`${temporary}/entry`),
  __entry: resolvePath(temporary, 'entry/index.js'),
  __federationExpose: resolvePath(temporary, 'entry/federation-expose.js'),
  __routes: resolvePath(`${temporary}/routes.js`),
  __federationApps: resolvePath(`${temporary}/federation-apps.js`),
  __config: resolvePath(temporary, 'config.js'),
  __mock: resolvePath('mock'),
  __mockUrls: resolvePath(temporary, 'has-local-mock.js'),
  __updateLog: resolvePath('node_modules/.admin-update-log'),
  __whiteList: resolvePath(`${temporary}/whiteList.js`),
  __externals: resolvePath(`${temporary}/externals.js`),
  __routeModules: resolvePath(`${temporary}/route-modules.js`),
  __remoteRouteModules: resolvePath(`${temporary}/remote-route-modules.js`),
  __remoteComponents: resolvePath(`${temporary}/remote-components.js`),
}
