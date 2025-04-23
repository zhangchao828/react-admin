const shell = require('shelljs')
const fs = require('fs-extra')
const { join } = require('path')
const { __root, __packageJson } = require('./paths')
const message = require('./message')
const chalk = require('chalk')
const { compareVersionInPkgJsonAndNodeModules } = require('./version')

function hasYarn() {
  try {
    const { code } = shell.exec('yarnpkg --version', { silent: true })
    return code === 0
  } catch {
    return false
  }
}
function hasYarnLock() {
  return fs.pathExistsSync(join(__root, 'yarn.lock'))
}
function hasPkgJsonLock() {
  return fs.pathExistsSync(join(__root, 'package-lock.json'))
}
function hasNewDep() {
  try {
    // if (hasYarnLock() && hasPkgJsonLock()) {
    //   message.warning('检测到当前工程中同时存在 yarn.lock 和 package-lock.json 文件')
    //   return message.error(
    //     '如果你使用 yarn，请只保留 yarn.lock 文件. 使用 npm，请只保留 package-lock.json 文件'
    //   )
    // }
    const { dependencies, devDependencies } = require(__packageJson)
    const allDeps = {
      ...devDependencies,
      ...dependencies,
    }
    const newPackages = Object.keys(allDeps)
      .map((name) => {
        const v = allDeps[name]
        const index = +v[0]
        if (typeof index !== 'number' || isNaN(index)) {
          message.warning(`模块 ${name} 版本号 ${v} 未锁定`)
        }
        return compareVersionInPkgJsonAndNodeModules(name)
      })
      .filter((item) => !item.isEqual)
    if (newPackages.length) {
      message.warning('检测到你有以下依赖未安装或版本与node_modules中的不一致')
      newPackages.forEach((item) => {
        if (item.versionInNodeModules) {
          message.warning(
            chalk.yellow(
              `依赖 ${chalk.red(item.name)} 版本不一致, package.json中的版本: ${chalk.red(
                item.versionInPackageJson
              )}, 在node_modules中的版本:${chalk.red(item.versionInNodeModules)}`
            )
          )
        } else {
          message.warning(`依赖 ${chalk.red(item.name)} 未安装 `)
        }
      })
      message.error('请先安装后再启动')
    }
  } catch {}
}

module.exports = {
  hasYarn,
  hasYarnLock,
  hasPkgJsonLock,
  hasNewDep,
}
