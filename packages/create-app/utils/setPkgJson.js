const fs = require('fs-extra')
const { join } = require('path')
const shell = require('shelljs')
const message = require('@glcc/shared/message')
const { ADMIN_NPM } = require('@glcc/shared/constant')
const { getModuleVersionInNpm } = require('@glcc/shared/version')

module.exports = function setPackageJson(projectName) {
  message.info(`获取最新版本...`)
  const latestVer = getModuleVersionInNpm(ADMIN_NPM)
  message.info(latestVer)
  let { stdout, code } = shell.exec('git config user.name', { silent: true })
  stdout = stdout.replace(/\s|[\r\n]/g, '')
  if (code !== 0) {
    stdout = 'admin'
  }
  const packagePath = join(process.cwd(), projectName, 'package.json')
  const pkgJson = require(packagePath)
  if (projectName) {
    pkgJson.name = projectName
    pkgJson.author = stdout
  }
  if (!pkgJson.devDependencies) {
    pkgJson.devDependencies = {}
  }
  if (!pkgJson.dependencies) {
    pkgJson.dependencies = {}
  }
  pkgJson.dependencies[ADMIN_NPM] = latestVer
  if (pkgJson.devDependencies[ADMIN_NPM]) {
    delete pkgJson.devDependencies[ADMIN_NPM]
  }
  fs.outputFileSync(packagePath, JSON.stringify(pkgJson, null, 2))
}
