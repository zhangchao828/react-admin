/**
 * 可以再次单独配置的属性
 * 单独再次配置的属性会覆盖全局属性
 */
export const defaultConfig = {
  transformResult: null,
  baseURL: null,
  error: null,
  mock: false,
  timeout: 20000,
  headers: null,
  withCredentials: true,
  abortTime: 500,
  retry: false,
}
export function optimizeUrl(url) {
  if (typeof url === 'string') {
    const newUrl = url
      .replace(/http(s)?[:]*[\/]*/g, '')
      .split('/')
      .filter(Boolean)
      .join('/')
      .replace(/[\/]{2,}/g, '/')
    if (url.startsWith('https')) {
      return 'https://' + newUrl
    }
    if (url.startsWith('http')) {
      return 'http://' + newUrl
    }
    return newUrl
  }
  return ''
}
export function getOptimizeConfig(http, config = {}) {
  const globalConfig = http.prototype.globalConfig || {}
  const scopeConfig = {}
  for (const name in defaultConfig) {
    if (config.hasOwnProperty(name)) {
      const scope = config[name]
      if (scope === null || scope === undefined) {
        delete config[name]
      } else if (name === 'headers') {
        const headers = globalConfig[name]
        const globalHeaders = typeof headers === 'string' ? headers(config) : headers
        const scopeHeaders = typeof scope === 'string' ? scope(config) : scope
        const resHeaders = {
          ...globalHeaders,
          ...scopeHeaders,
        }
        Object.keys(resHeaders).forEach((key) => {
          if (resHeaders[key] === null || resHeaders[key] === undefined) {
            delete resHeaders[key]
          }
        })
        scopeConfig[name] = resHeaders
      } else {
        scopeConfig[name] = scope
      }
    }
  }
  return {
    ...defaultConfig,
    ...config,
    ...globalConfig,
    ...scopeConfig,
  }
}

class CancelController {
  controller = new Map()
  abort = (key) => {
    if (key === undefined) {
      // 取消所有的请求
      for (let item of this.controller.values()) {
        item.ctrl.abort()
      }
      this.controller.clear()
    } else if (this.controller.has(key)) {
      this.controller.get(key).ctrl.abort()
      this.controller.delete(key)
    }
  }
  remove = (key) => {
    this.controller.delete(key)
  }
  generate = (key, abortTime) => {
    if (!this.controller.has(key)) {
      this.controller.set(key, { time: Date.now(), ctrl: new AbortController() })
    }
    const { time, ctrl } = this.controller.get(key)
    if (abortTime && Date.now() - time < abortTime) {
      // 在间隔abortTime毫秒内发送了相同的请求，且上次请求仍未完成，那就取消上次的请求
      this.abort(key)
      const newCtrl = new AbortController()
      this.controller.set(key, { time: Date.now(), ctrl: newCtrl })
      return newCtrl
    }
    return ctrl
  }
  has = (key) => {
    return this.controller.has(key)
  }
}
export const abortController = new CancelController()
