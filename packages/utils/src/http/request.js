import { getOptimizeConfig, optimizeUrl, abortController } from './util'

// 编码，去undefined,null,''等优化
function optimizeParams(params) {
  const list = []
  Object.keys(params || {}).forEach((key) => {
    const value = params[key]
    if (value === null || value === undefined || value === '') {
      return
    }
    list.push(`${key}=${encodeURIComponent(value)}`)
  })
  return list.join('&')
}
export default function (http) {
  http.interceptors.request.use(
    (config) => {
      // 取消请求时使用
      let optimizedConfig = getOptimizeConfig(http, config)
      const { baseURL, timeout, mock, method, key, abortTime } = optimizedConfig
      optimizedConfig.paramsSerializer = optimizeParams
      // 设置timeout
      const resTimeout = typeof timeout === 'function' ? timeout(config) : timeout
      if (typeof resTimeout === 'string') {
        optimizedConfig.timeout = resTimeout
      }
      // 设置baseURL
      const resBaseURL = optimizeUrl(typeof baseURL === 'function' ? baseURL(config) : baseURL)
      const mockUrl = optimizedConfig.url
      const url = optimizeUrl(optimizedConfig.url)
      if (resBaseURL && !url.startsWith('http')) {
        optimizedConfig.url = `${resBaseURL}/${url}`
        delete optimizedConfig.baseURL
      }
      // key没传就默认是method+url组成
      const abortKey = key || method + url
      optimizedConfig.key = abortKey
      optimizedConfig.signal = abortController.generate(abortKey, abortTime).signal
      // 开发环境mock设置
      if (process.env.NODE_ENV === 'development' && mock) {
        setMock(optimizedConfig, { mock, mockUrl })
      }
      return optimizedConfig
    },
    (error) => {
      return Promise.reject(error)
    }
  )
}
function setMock(config, { mock, mockUrl }) {
  config.url = '/admin-mock:' + config.url
  config.headers.mock_url = mockUrl
  if (typeof mock === 'string') {
    config.headers['mock_name'] = mock
  }
  if (typeof mock === 'object') {
    Object.keys(mock || {}).forEach((key) => {
      config.headers[`mock_${key}`] = mock[key]
    })
  }
}
