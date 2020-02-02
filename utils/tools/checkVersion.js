const { shellSync } = require('execa')
const { __packageJson, __nodeModules } = require('./getPath')
const { cliScriptName, cliNpmName } = require('./constant')
const { join } = require('path')
const fs = require('fs-extra')

function isAlpha(ver) {
  return ver.indexOf('alpha') !== -1
}
function isBeta(ver) {
  return ver.indexOf('beta') !== -1
}
function isRc(ver) {
  return ver.indexOf('rc') !== -1
}
// 获取最后一个稳定版本号
function getLastStableVer(pkgName) {
  try {
    const { stdout } = shellSync(`npm view ${pkgName} versions --json`)
    const versions = JSON.parse(stdout).reverse()
    const lastStable = versions.find(item => !isAlpha(item) && !isBeta(item) && !isRc(item))
    return lastStable ? lastStable.trim() : null
  } catch (e) {
    return null
  }
}
function getServerVerInNodeModules(serverNpmName) {
  const pkgJsonPath = join(__nodeModules, serverNpmName, 'package.json')
  if (fs.pathExistsSync(pkgJsonPath)) {
    return require(pkgJsonPath).version
  }
  return null
}
async function checkCliVer() {
  try {
    const currentVer = shellSync(`${cliScriptName} -v`)
    const lastStableVer = getLastStableVer(cliNpmName)
    if (!lastStableVer) {
      return false
    }
    if (lastStableVer !== currentVer.stdout) {
      return { currentVer: currentVer.stdout, latestVer: lastStableVer }
    }
    return false
  } catch (e) {
    return false
  }
}
async function checkServerVer(serverNpmName) {
  // 检查node_modules里的package.json版本
  const currentVer = getServerVerInNodeModules(serverNpmName)
  // 检查工程的package.json里的版本
  const pkgJson = require(__packageJson)
  const { dependencies = {}, devDependencies = {} } = pkgJson
  let pkgServerVer = null
  if (serverNpmName in dependencies) {
    pkgServerVer = dependencies[serverNpmName]
  } else if (serverNpmName in devDependencies) {
    pkgServerVer = devDependencies[serverNpmName]
  }
  try {
    const lastStableVer = getLastStableVer(serverNpmName)
    if (!lastStableVer) {
      return false
    }
    if (lastStableVer !== currentVer) {
      return {
        currentVer,
        latestVer: lastStableVer
      }
    } else if (lastStableVer !== pkgServerVer) {
      /*
       如果工程的package.json里的版本和stdout不同，也要提示升级
       主要因为如果在a分支升级了版本，然后切换到b分支，这个时候
       node_modules里的package.json版本和stdout相同的，如果不提示升级的话
       就会造成b分支在jenkins上安装的是旧版本的包，这样就可能出问题
        */
      return {
        currentVer: pkgServerVer,
        latestVer: lastStableVer
      }
    }
    return false
  } catch (e) {
    return false
  }
}
module.exports = {
  checkCliVer,
  checkServerVer,
  getLastStableVer
}
