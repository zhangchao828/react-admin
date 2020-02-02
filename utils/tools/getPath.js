const { resolve } = require('path')
const resolvePath = path => resolve(process.cwd(), path)
const { projectConfigName, localConfigName } = require('./constant')
/*
这里的路径都是相对于file-cli创建的项目根目录
 */
module.exports = {
  __packageJson: resolvePath('package.json'),
  __src: resolvePath('src'),
  __nodeModules: resolvePath('node_modules'),
  __projectConfig: resolvePath(projectConfigName),
  __localConfig: resolvePath(localConfigName),
  __static: resolvePath('static'),
  __dist: resolvePath('dist'),
  __distStatic: resolvePath('dist/static'),
  __root: process.cwd(),
  __yarnLock: resolvePath('yarn.lock'),
  __packageLock: resolvePath('package-lock.json')
}
