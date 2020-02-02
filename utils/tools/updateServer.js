const fs = require('fs-extra')
const { join } = require('path')
const { warning, success, error, info, log } = require('./tip')
const { __packageJson } = require('./getPath')
const { checkServerVer } = require('./checkVersion')
const installDep = require('./installDep')
const ora = require('ora')
module.exports = async function(serverNpmName) {
  const serverVersion = await checkServerVer(serverNpmName)
  if (!serverVersion) {
    return warning('项目配置已经是最新的了，不需要升级了')
  }
  const updateSpinner = ora('正在更新...')
  updateSpinner.start()
  const { latestVer } = serverVersion
  try {
    const pkgJson = require(__packageJson)
    if (pkgJson.dependencies && pkgJson.dependencies[serverNpmName]) {
      delete pkgJson.dependencies[serverNpmName]
    }
    if (!pkgJson.devDependencies) {
      pkgJson.devDependencies = {}
    }
    pkgJson.devDependencies[serverNpmName] = latestVer
    await fs.writeFile(__packageJson, JSON.stringify(pkgJson, null, 2))
    await installDep()
    updateSpinner.stop()
    success(`更新成功，此次更新到 ${latestVer} 版本，更新内容如下：`)
    const updateLogPath = join(process.cwd(), `node_modules/${serverNpmName}/update-log`)
    if (fs.pathExistsSync(updateLogPath)) {
      const res = fs.readFileSync(updateLogPath, 'utf8')
      log(res)
    }
  } catch (e) {
    if (serverVersion) {
      warning(`更新失败，请尝试以下步骤来修复`)
      info(`  1：将项目根目录下package.json中的依赖 ${serverNpmName} 的版本号改为 ${latestVer}`)
      info(`  2：在工程根目录下执行 npm i 或 yarn 命令`)
    } else {
      error(e)
    }
  }
}
