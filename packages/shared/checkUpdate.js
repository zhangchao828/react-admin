const { getModuleVersion } = require('./version')
const { ADMIN_NPM, COMPONENT_NPM, REMOTE_NPM, PRIVATE_NAME } = require('./constant')
const message = require('./message')
const chalk = require('chalk')
const axios = require('axios')

module.exports = async function checkUpdate() {
  const modules = [ADMIN_NPM, COMPONENT_NPM, REMOTE_NPM]
  message.info('正在检测项目配置是否有更新...')
  const promises = modules.map((name) => {
    return new Promise((resolve) => {
      const version = getModuleVersion(name)
      resolve(version && { name, ...version })
    })
  })
  let hasUpdate = false
  try {
    const res = await Promise.all(promises)
    // 是否强制更新
    const forceUpdateModules = []
    for (let item of res) {
      if (item) {
        const { name, latest } = item
        const { log, required } = await getUpdateLog(name, latest)
        if (log) {
          hasUpdate = true
          if (required) {
            forceUpdateModules.push(item)
          }
          message.warning(`检测到模块 ${name} 最新稳定版本为${latest},更新内容如下:`)
          console.log(chalk.yellow(`  ${log}\n`))
        }
      }
    }
    if (forceUpdateModules.length) {
      console.log(chalk.red('本次更新中以下模块为强制更新:\n'))
      forceUpdateModules.forEach((item) => {
        console.log(chalk.red(`${item.name} - ${item.latest}`))
      })
      console.log(chalk.red('\n请更新后再重启'))
      process.exit()
    } else if (hasUpdate) {
      message.warning('本次更新不是强制更新')
    }
  } finally {
    if (!hasUpdate) {
      message.success('当前项目配置已是最新版本')
    }
  }
}
async function getUpdateLog(name, version) {
  try {
    if (name.startsWith(PRIVATE_NAME)) {
      name = name.substring(PRIVATE_NAME.length)
    }
    const { data } = await axios.get(`http://172.16.200.27:8002/log/${name}/${version}.json`)
    let { log, required } = data
    if (Array.isArray(log)) {
      log = log.map((item, index) => `${index + 1}: ${item}`).join(`\n  `)
    } else {
      log = `* ${log}`
    }
    return {
      log,
      required,
    }
  } catch (e) {
    return {}
  }
}
