const shell = require('shelljs')
const fs = require('fs-extra')
const { join } = require('path')
const { __root, __packageJson, __nodeModules } = require('./paths')
const message = require('./message')
const chalk = require('chalk')
const semverGt = require('semver/functions/gt')

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
    if (hasYarnLock() && hasPkgJsonLock()) {
      message.warning('检测到当前工程中同时存在 yarn.lock 和 package-lock.json 文件')
      return message.error(
        '如果你使用 yarn，请只保留 yarn.lock 文件. 使用 npm，请只保留 package-lock.json 文件'
      )
    }
    const { dependencies, devDependencies } = require(__packageJson)
    const allDeps = {
      ...devDependencies,
      ...dependencies,
    }
    const newPackages = Object.keys(allDeps)
      .filter((item) => {
        const nmPkgJsonPath = join(__nodeModules, item, 'package.json')
        if (fs.pathExistsSync(nmPkgJsonPath)) {
          const nmPkgJson = require(nmPkgJsonPath)
          const currVersion = allDeps[item].substring(
            allDeps[item].split('').findIndex((item) => {
              return typeof +item === 'number' && !Number.isNaN(+item)
            })
          )
          return semverGt(currVersion, nmPkgJson.version)
        }
        return true
      })
      .map((item) => ({
        name: item,
        version: allDeps[item],
      }))
    if (newPackages.length) {
      message.warning('检测到你有以下依赖未安装\n')
      newPackages.forEach((item) => {
        console.log(chalk.yellow(`依赖: ${item.name}  版本: ${item.version}`))
      })
      console.log('')
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
