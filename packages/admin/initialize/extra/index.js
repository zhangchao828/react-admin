const { __whiteList, __externals } = require('@glcc/shared/paths')
const fs = require('fs-extra')
const { isDev } = require('@glcc/shared/env')
const axios = require('axios')

// 创建模块白名单
async function createModuleWhiteList() {
  if (isDev) {
    try {
      const { data } = await axios.get('http://172.16.200.27:8002/module-white-list.json', {
        timeout: 5000,
      })
      fs.outputFileSync(__whiteList, `module.exports = ${JSON.stringify(data)}`)
    } catch {}
  }
}
// 创建开发环境的Externals，为了提高开发环境的构建速度
async function createExternals() {
  if (isDev) {
    try {
      const { data } = await axios.get('http://172.16.200.27:8002/externals.json', {
        timeout: 5000,
      })
      fs.outputFileSync(__externals, `module.exports = ${JSON.stringify(data)}`)
    } catch {}
  }
}

async function initExtra() {
  await createModuleWhiteList()
  await createExternals()
}
module.exports = initExtra
