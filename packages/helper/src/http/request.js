import { getOptimizeConfig, optimizeUrl, abortController, omitParams } from './util'
import qs from 'qs'
import { isPlainObject, isNil } from 'lodash-es'
import setMock from './mock'

// 编码，去undefined,null,''等优化
function optimizeParams(params) {
  return Object.keys(omitParams(params))
    .map((key) => {
      return `${key}=${encodeURIComponent(params[key])}`
    })
    .join('&')
}
export default function (http) {
  http.interceptors.request.use(
    (config) => {
      // 取消请求时使用
      const optimizedConfig = getOptimizeConfig(http, config)
      const { baseURL, timeout, mock, method, key, abortTime, type, original } = optimizedConfig
      if (original) {
        return config
      }
      const data = omitParams(optimizedConfig.data)
      optimizedConfig.data = data
      switch (type) {
        case 'formData':
          // 表单提交
          optimizedConfig.headers['Content-Type'] = 'application/x-www-form-urlencoded'
          if (typeof data !== 'string') {
            optimizedConfig.data = qs.stringify(omitParams(data))
          }
          break
        case 'upload':
          // 文件上传
          optimizedConfig.headers['Content-Type'] = 'multipart/form-data'
          if (!(data instanceof FormData) && isPlainObject(data)) {
            const formData = new FormData()
            Object.keys(omitParams(data)).forEach((key) => {
              const val = data[key]
              if (Array.isArray(val)) {
                val.forEach((item, index) => {
                  if (item instanceof File || !isPlainObject(item)) {
                    formData.append(key, item)
                  } else {
                    // 数组对象场景
                    Object.keys(item).forEach((itemKey) => {
                      if (!isNil(item[itemKey])) {
                        formData.append(`${key}[${index}].${itemKey}`, item[itemKey])
                      }
                    })
                  }
                })
              } else {
                formData.append(key, val)
              }
            })
            optimizedConfig.data = formData
          }
          break
        case 'download':
          // 下载，导出
          optimizedConfig.responseType = 'blob'
      }
      optimizedConfig.paramsSerializer = optimizeParams
      // 设置timeout
      const resTimeout = typeof timeout === 'function' ? timeout(optimizedConfig) : timeout
      if (typeof resTimeout === 'string') {
        optimizedConfig.timeout = resTimeout
      }
      // 设置baseURL
      const resBaseURL = typeof baseURL === 'function' ? baseURL(optimizedConfig) : baseURL
      const originalUrl = optimizedConfig.url
      const url = optimizeUrl(
        originalUrl.startsWith('http') || !resBaseURL ? originalUrl : resBaseURL + '/' + originalUrl
      )
      optimizedConfig.url = url
      delete optimizedConfig.baseURL
      // key没传就默认是method+url组成
      const abortKey = key || method + url
      optimizedConfig.key = abortKey
      optimizedConfig.signal = abortController.generate(abortKey, abortTime).signal
      // 开发环境mock设置
      if (process.env.NODE_ENV === 'development' && mock && !originalUrl.startsWith('http')) {
        setMock(optimizedConfig, { mock, mockUrl: originalUrl })
      }
      return optimizedConfig
    },
    (error) => {
      return Promise.reject(error)
    }
  )
}
