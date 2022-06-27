const { join } = require('path')
const shell = require('shelljs')
const { __packageJson, __nodeModules } = require('./paths')
const { NPM_REGISTRY } = require('./constant')
const fs = require('fs-extra')

function getModuleVersionInNodeModules(module) {
  const pkgJsonPath = join(__nodeModules, module, 'package.json')
  if (fs.pathExistsSync(pkgJsonPath)) {
    return require(pkgJsonPath).version
  }
}
function getModuleVersion(name) {
  try {
    // 检查node_modules里的package.json版本
    const versionInNodeModules = getModuleVersionInNodeModules(name)
    // 检查工程的package.json里的版本
    const pkgJson = require(__packageJson)
    const versionInPkgJson = (pkgJson.dependencies || pkgJson.devDependencies)[name]
    if (!versionInPkgJson) {
      return null
    }
    const latest = getModuleVersionInNpm(name)
    if (!latest) {
      return null
    }
    if (latest !== versionInNodeModules) {
      return {
        current: versionInNodeModules,
        latest,
      }
    }

    if (latest !== versionInPkgJson) {
      /*
       如果工程的package.json里的版本和stdout不同，也要提示升级
       主要因为如果在a分支升级了版本，然后切换到b分支，这个时候
       node_modules里的package.json版本和stdout相同的，如果不提示升级的话
       就会造成b分支在jenkins上安装的是旧版本的包，这样就可能出问题
        */
      return {
        current: versionInPkgJson,
        latest,
      }
    }
    return null
  } catch (e) {
    return null
  }
}
function getModuleVersionInNpm(name) {
  const { stdout, code } = shell.exec(`npm view ${name} version --registry ${NPM_REGISTRY}`, {
    silent: true,
  })
  return code === 0 ? stdout.replace(/\s|[\r\n]/g, '') : undefined
}
module.exports = {
  getModuleVersion,
  getModuleVersionInNpm,
  getModuleVersionInNodeModules,
}
