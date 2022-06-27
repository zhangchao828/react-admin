import { abortController } from './util'

export default function (http) {
  http.interceptors.response.use(
    (res) => interceptorResponse(http, res),
    (err) => interceptorError(http, err)
  )
}

function interceptorResponse(http, res) {
  const { config } = res
  const { transformResult, key } = config
  abortController.remove(key)
  if (typeof transformResult === 'function') {
    return transformResult(res)
  }
  return res
}
function interceptorError(http, info) {
  const { config } = info
  if (!config) {
    return Promise.reject(info)
  }
  const { error, key, retry } = config
  abortController.remove(key)
  // 重新请求
  if (retry) {
    const { delay = 200, count = 1, when } = typeof retry === 'number' ? { count: retry } : retry
    if (count > 0) {
      let shouldRetry = true
      if (!config.retryTotal) {
        config.retryTotal = count
      }
      if (typeof when === 'function') {
        shouldRetry = when(config.retryTotal - count + 1, info)
      }
      const retryConfig = {
        ...config,
        retry: {
          ...retry,
          count: count - 1,
        },
      }
      if (shouldRetry) {
        return new Promise((resolve, reject) => {
          if (delay) {
            setTimeout(() => {
              http(retryConfig).then(resolve).catch(reject)
            }, delay)
          } else {
            http(retryConfig).then(resolve).catch(reject)
          }
        })
      }
      return new Promise((resolve, reject) => {
        interceptorError(http, { config: retryConfig }).then(resolve).catch(reject)
      })
    }
  }
  if (typeof error === 'function') {
    error(info)
  }
  return Promise.reject(info)
}
