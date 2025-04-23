const { join } = require('path')
const shell = require('shelljs')
const { __packageJson, __nodeModules } = require('./paths')
const { CLI_SCRIPT, CLI_NPM, NPM_REGISTRY } = require('./constant')
const fs = require('fs-extra')

const { dependencies, devDependencies } = require(__packageJson)
function getModuleVersionInNodeModules(moduleName) {
  const pkgJsonPath = join(__nodeModules, moduleName, 'package.json')
  if (fs.pathExistsSync(pkgJsonPath)) {
    return require(pkgJsonPath).version
  }
}
function getModuleVersionInPkgJson(moduleName) {
  return { ...dependencies, ...devDependencies }[moduleName]
}
function getCliVersion() {
  try {
    let { stdout, code } = shell.exec(`${CLI_SCRIPT} -v`, { silent: true })
    if (code !== 0) {
      return false
    }
    stdout = stdout.replace(/\s|[\r\n]/g, '')
    const latestVersion = getModuleVersion(CLI_NPM)
    if (!latestVersion) {
      return false
    }
    if (latestVersion !== stdout) {
      return { currentVersion: stdout, latestVersion }
    }
    return false
  } catch (e) {
    return false
  }
}

/**
 * 获取版本中的大版本号
 * 1.2.0  ->   1
 */
function getLgVersion(version) {
  if (!version) {
    return null
  }
  const num = +version[0]
  if (typeof num === 'number' && !Number.isNaN(num)) {
    return num
  }
  return getLgVersion(version.substring(1))
}
function getModuleVersion(name) {
  try {
    // 检查工程的package.json里的版本
    const versionInPkgJson = getModuleVersionInPkgJson(name)
    if (!versionInPkgJson) {
      return null
    }
    const latest = getModuleVersionInNpm(name)
    if (!latest) {
      return null
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
        // lgVersion: getLgVersion(versionInPkgJson),
        latest,
      }
    }
    // 检查node_modules里的package.json版本
    const versionInNodeModules = getModuleVersionInNodeModules(name)
    if (latest !== versionInNodeModules) {
      return {
        current: versionInNodeModules,
        // lgVersion: getLgVersion(versionInNodeModules),
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

/**
 * 对比模块在package.json和node_modules中的版本是否一致
 */
function compareVersionInPkgJsonAndNodeModules(name) {
  const versionInPackageJson = getModuleVersionInPkgJson(name)
  const versionInNodeModules = getModuleVersionInNodeModules(name)
  return {
    name,
    versionInPackageJson,
    versionInNodeModules,
    isEqual:
      versionInPackageJson === versionInNodeModules &&
      versionInPackageJson !== undefined &&
      versionInNodeModules !== undefined,
  }
}

module.exports = {
  getCliVersion,
  getModuleVersion,
  getModuleVersionInNpm,
  getModuleVersionInNodeModules,
  compareVersionInPkgJsonAndNodeModules,
}
