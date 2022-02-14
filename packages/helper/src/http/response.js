import { isFunction } from '../is'

export default function (http) {
  http.interceptors.response.use(
    (res) => interceptorResponse(http, res),
    (err) => interceptorError(http, err)
  )
}

function interceptorResponse(http, res) {
  const { data, config } = res
  const { transformResult, responseDelay } = config
  let result = data
  if (isFunction(transformResult)) {
    result = transformResult(res)
  }
  if (responseDelay > 0) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(result)
      }, responseDelay)
    })
  }
  return result
}

function interceptorError(http, err) {
  const { error, timeoutRetry } = err.config
  const message = err.message
  if (timeoutRetry && err.code === 'ECONNABORTED' && message.includes('timeout')) {
    // 请求超时是否再次重新请求
    err.config.timeoutRetry = timeoutRetry - 1 || 0
    return http(err.config)
  }
  if (isFunction(error)) {
    error(err)
  } else {
    console.error(message)
  }
  return Promise.reject(err)
}
