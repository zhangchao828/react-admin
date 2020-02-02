process.env.NODE_ENV = 'development'
const { checkServerVer } = require('./checkVersion')
const { warning, info } = require('./tip')

module.exports = async function(config) {
  const { onOk, checkVersion, serverName } = config || {}
  info('正在启动,请稍等......')
  if (!checkVersion) {
    warning('不建议配置checkVersion为false，因为这样将无法检测你本地项目配置是否更新到最新')
  } else {
    const serverVersion = await checkServerVer(serverName)
    if (serverVersion) {
      const { currentVer, latestVer } = serverVersion || {}
      warning(`检测到工程配置有更新，最新版本为 ${latestVer} ,当前版本为 ${currentVer}`)
    }
  }
  onOk && onOk()
}
