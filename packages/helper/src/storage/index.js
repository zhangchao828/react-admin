import { isString, isPlainObject } from '../is'

const LOCAL_INFO = 'LOCAL_INFO'

function getStorage(name, type) {
  if (!isString(name)) {
    return undefined
  }
  const storage = type === 'local' ? localStorage : sessionStorage
  let data = storage.getItem(name)
  if (data === 'undefined') {
    return undefined
  }
  try {
    return JSON.parse(data)
  } catch (e) {
    return data || null
  }
}
function setStorage(name, value, type) {
  if (isPlainObject(name)) {
    Object.keys(name).forEach((key) => {
      setStorage(key, name[key], type)
    })
  } else if (isString(name)) {
    const storage = type === 'local' ? localStorage : sessionStorage
    try {
      value = isString(value) ? value : JSON.stringify(value)
      storage.setItem(name, value)
    } catch (e) {
      return e
    }
  }
}
export function getLocalStorage(name) {
  return getStorage(name, 'local')
}
export function getSessionStorage(name) {
  return getStorage(name, 'session')
}
export function setLocalStorage(name, value) {
  return setStorage(name, value, 'local')
}
export function setSessionStorage(name, value) {
  return setStorage(name, value, 'session')
}
export function removeSessionStorage(key) {
  sessionStorage.removeItem(key)
}
export function removeLocalStorage(key) {
  localStorage.removeItem(key)
}

export function getLocalInfo(key) {
  const info = getLocalStorage(LOCAL_INFO) || {}
  return key ? info[key] : info
}
export function setLocalInfo(info) {
  if (isPlainObject(info)) {
    const values = getLocalStorage(LOCAL_INFO) || {}
    setLocalStorage(LOCAL_INFO, {
      ...values,
      ...info,
    })
  }
}

export function clearLocalInfo() {
  removeLocalStorage(LOCAL_INFO)
}
export function removeLocalInfo(key) {
  if (Array.isArray(key)) {
    key.forEach((item) => {
      removeLocalInfo(item)
    })
  } else if (typeof key === 'string') {
    const info = getLocalStorage(LOCAL_INFO) || {}
    if (key in info) {
      delete info[key]
    }
    setLocalStorage(LOCAL_INFO, info)
  }
}
