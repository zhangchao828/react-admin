import { isFunction, isString, isUNN } from '../is'
import { setGlobalConfig, getGlobalConfig } from '../window'

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
  responseDelay: 0,
  headers: null,
  // 是否超时再次请求
  timeoutRetry: false,
  withCredentials: false,
}
export const configName = 'http'
export function setHttpGlobalConfig(config) {
  setGlobalConfig(configName, config)
}
export function optimizeUrl(url) {
  if (isString(url)) {
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
  const globalConfig = getGlobalConfig(configName) || {}
  const scopeConfig = {}
  for (const name in defaultConfig) {
    if (config.hasOwnProperty(name)) {
      const scope = config[name]
      if (isUNN(scope)) {
        delete config[name]
      } else if (name === 'headers') {
        const headers = globalConfig[name]
        const globalHeaders = isFunction(headers) ? headers(config) : headers
        const scopeHeaders = isFunction(scope) ? scope(config) : scope
        const resHeaders = {
          ...globalHeaders,
          ...scopeHeaders,
        }
        Object.keys(resHeaders).forEach((key) => {
          if (isUNN(resHeaders[key])) {
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
