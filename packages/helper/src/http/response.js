import { abortController } from './util'

export default function (http) {
  http.interceptors.response.use(
    (res) => interceptorResponse(http, res),
    (err) => interceptorError(http, err)
  )
}
function download(blobContent, name) {
  const blob = new Blob([blobContent], { type: 'application/octet-stream;charset=utf-8' })
  const link = document.createElement('a')
  if (name) {
    link.download = name
  }
  link.href = window.URL.createObjectURL(blob)
  link.click()
  window.URL.revokeObjectURL(link.href)
}

async function blobToJson(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const jsonData = JSON.parse(reader.result)
        resolve(jsonData)
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = (event) => {
      reject(new Error('Failed to read Blob data.'))
    }
    reader.readAsText(blob)
  })
}

export function dispositionDownload(res, name) {
  if (name && !name.includes('.')) {
    name = name + '.xlsx'
  }
  if (res.data.type === 'application/json') {
    return blobToJson(res.data)
  } else {
    // 下载文件
    let temp = res.headers['content-disposition']?.split(';')[1].split('=')[1]
    const fileName = temp && decodeURIComponent(temp)
    download(res.data, name || fileName)
    return Promise.resolve(res)
  }
}

async function interceptorResponse(http, res) {
  const { config } = res
  const { transformResult, key, type, params, fileName, original } = config
  if (original) {
    return res
  }
  abortController.remove(key)
  if (type === 'download') {
    const result = await dispositionDownload(res, params?.fileName || fileName)
    if (res.data.type === 'application/json') {
      res.data = result
    } else {
      return result
    }
  }
  if (typeof transformResult === 'function') {
    return transformResult(res)
  }
  return res
}
function interceptorError(http, info) {
  const { config } = info
  if (!config || config.original) {
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
