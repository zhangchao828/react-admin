import { getOptimizeConfig, optimizeUrl } from './config'
import { isFunction, isNumber, isPlainObject, isUNN } from '../is'

// 编码，去undefined,null,''等优化
function optimizeParams(params) {
  const list = []
  Object.keys(params || {}).forEach((key) => {
    if (isUNN(params[key]) || params[key] === '') {
      return
    }
    list.push(`${key}=${encodeURIComponent(params[key])}`)
  })
  return list.join('&')
}
export default function (http) {
  http.interceptors.request.use(
    (config) => {
      let optimizedConfig = getOptimizeConfig(http, config)
      const { baseURL, timeout, mock } = optimizedConfig
      optimizedConfig.paramsSerializer = optimizeParams
      // 设置timeout
      const resTimeout = isFunction(timeout) ? timeout(config) : timeout
      if (isNumber(timeout)) {
        optimizedConfig.timeout = resTimeout
      }
      // 设置baseURL
      const resBaseURL = optimizeUrl(isFunction(baseURL) ? baseURL(config) : baseURL)
      const mockUrl = optimizedConfig.url
      const url = optimizeUrl(optimizedConfig.url)
      if (resBaseURL && !url.startsWith('http')) {
        optimizedConfig.url = `${resBaseURL}/${url}`
        delete optimizedConfig.baseURL
      }
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
  if (isPlainObject(mock)) {
    Object.keys(mock).forEach((key) => {
      config.headers[`mock_${key}`] = mock[key]
    })
  }
}
