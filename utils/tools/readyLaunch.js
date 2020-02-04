process.env.NODE_ENV = 'development'
const { checkServerVer } = require('./checkVersion')
const { warning, info } = require('./tip')

module.exports = async function(config) {
  const { onOk, serverName } = config || {}
  info('正在启动,请稍等......')
  const serverVersion = await checkServerVer(serverName)
  if (serverVersion) {
    const { currentVer, latestVer } = serverVersion || {}
    info(`react-admin最新版本为 ${latestVer} ,当前版本为 ${currentVer}`)
  }
  onOk && onOk()
}
