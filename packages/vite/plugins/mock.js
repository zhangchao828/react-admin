const { getResponse } = require('@zc/dev-utils/mock')

function mockPlugin() {
  return {
    name: 'mock',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const { mock_url } = req.headers
        if (mock_url) {
          const { status, delay, data } = getResponse(req)
          if (delay) {
            setTimeout(() => {
              res.statusCode = status
              res.end(JSON.stringify(data))
            }, delay)
          } else {
            res.statusCode = status
            res.end(JSON.stringify(data))
          }
        } else {
          next()
        }
      })
    },
  }
}
module.exports = mockPlugin
