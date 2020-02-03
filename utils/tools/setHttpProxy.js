const proxyMiddleware = require('http-proxy-middleware')

module.exports = function(app, proxy) {
  // 静态代理
  Object.keys(proxy || {}).forEach(context => {
    let options = proxy[context]
    if (typeof options === 'string') {
      options = { target: options }
    }
    app.use(
      proxyMiddleware(context, {
        ...options,
        changeOrigin: true
      })
    )
  })
  /*
   自定义根据请求来动态代理所有以/HLJ-API开头的接口
   约定/HLJ-API_/_target_/_api,以_/_分割
    */
  app.use(
    proxyMiddleware(
      pathname => {
        return pathname.indexOf('/HLJ-API') === 0
      },
      {
        target: 'http://www.example.com',
        changeOrigin: true,
        pathRewrite(path) {
          const [s, t, ...rest] = path.split('_/_')
          return rest.join('_/_')
        },
        router(req) {
          const { originalUrl } = req
          return originalUrl.split('_/_')[1]
        }
      }
    )
  )
}
