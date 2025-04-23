const fs = require('fs-extra')
const { isDev } = require('@glcc/shared/env')
const ip = require('ip')
const {
  __federationApps,
  __config,
  __routes,
  __remoteComponents,
  __remoteRouteModules,
  __mockUrls,
} = require('@glcc/shared/paths')
const { getConfig } = require('@glcc/shared/project')
const { federation, publicPath, base, name } = getConfig()

function config() {
  const extraArgv = process.argv.reduce((previousValue, currentValue) => {
    if (currentValue.indexOf('=') > -1) {
      const [key, value] = currentValue.split('=')
      return {
        ...previousValue,
        [key]: value,
      }
    }
    return previousValue
  }, {})
  fs.outputFileSync(__federationApps, `export default {}`)
  // 向外暴露的配置信息
  fs.outputFileSync(
    __config,
    `
  export default {
    name:'${name}',
    localIp: '${isDev ? ip.address() : ''}',
    publicPath: '${publicPath}',
    base: '${base}',
    argv: ${JSON.stringify(extraArgv, null, 2)},
    federation: ${JSON.stringify(federation, null, 2)}
  }`.trim()
  )
  fs.outputFileSync(
    __routes,
    `
  export const routesMap = {}
  export const layoutsMap = {}
  `
  )
  fs.outputFileSync(__remoteRouteModules, 'export default {}')
  fs.outputFileSync(__remoteComponents, 'export default {}')
  fs.outputFileSync(__mockUrls, 'export default function(){}')
}
module.exports = config
