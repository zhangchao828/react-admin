import { isString } from '../is'
/*
设置到window上的全局配置
 */
const configName = 'ADMIN_GLOBAL_CONFIG'
export function setGlobalConfig(name, value) {
  if (!window[configName]) {
    window[configName] = {}
  }
  if (isString(name) && name.trim()) {
    if (value === undefined) {
      removeGlobalConfig(name)
    } else {
      window[configName][name] = value
    }
  }
}
export function getGlobalConfig(name) {
  return name ? window[configName]?.[name] : window[configName] || {}
}

export function removeGlobalConfig(name) {
  if (window[configName]) {
    if (isString(name)) {
      delete window[configName][name]
    }
    if (Array.isArray(name)) {
      name.forEach((item) => {
        removeGlobalConfig(item)
      })
    }
  }
}

export function clearGlobalConfig() {
  window[configName] = {}
}
