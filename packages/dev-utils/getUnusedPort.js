const detectPort = require('detect-port')
const message = require('./message')

function getUnusedPort(port = 3000) {
  return new Promise((resolve) => {
    detectPort(port, (err, _port) => {
      if (err) {
        message.error(err)
      }
      if (port !== _port) {
        message.success(`端口 ${port} 已被占用，已切换到${_port}端口`)
      }
      resolve(_port)
    })
  })
}
module.exports = getUnusedPort
