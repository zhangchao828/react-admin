import { isPlainObject, omitBy } from 'lodash-es'
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
  withCredentials: false,
  abortTime: 0,
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
    if (url.startsWith('/')) {
      return '/' + newUrl
    }
    return newUrl
  }
  return ''
}
export function getOptimizeConfig(http, config = {}) {
  const globalConfig = http.getConfig() || {}
  const scopeConfig = {}
  for (const name in defaultConfig) {
    // mock只能单独开启，不能全局开启
    if (name === 'mock') {
      const scopeMock = config[name]
      if (!scopeMock) {
        delete globalConfig[name]
      } else {
        const globalMock = globalConfig[name]
        scopeConfig[name] = {
          ...globalMock,
          ...scopeMock,
        }
      }
    } else if (config.hasOwnProperty(name)) {
      const scope = config[name]
      if (scope === null || scope === undefined) {
        delete config[name]
        delete globalConfig[name]
      } else if (name === 'headers') {
        const headers = globalConfig[name]
        const globalHeaders = typeof headers === 'function' ? headers(config) : headers
        const scopeHeaders = typeof scope === 'function' ? scope(config) : scope
        scopeConfig[name] = omitParams({
          ...globalHeaders,
          ...scopeHeaders,
        })
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
export function omitParams(params) {
  if (isPlainObject(params)) {
    return omitBy(params, (val) => [null, undefined, ''].includes(val))
  }
  return params
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
